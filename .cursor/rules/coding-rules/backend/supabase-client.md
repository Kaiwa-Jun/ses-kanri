# Supabaseクライアント実装規約

## 基本原則

- **環境別クライアント設定を明確に分離する**
- **認証状態管理を適切に実装する**
- **サービス層パターンを使用してビジネスロジックを分離する**
- **リアルタイム機能を効率的に実装する**
- **ファイルストレージのセキュリティを確保する**
- **エラーハンドリングを統一する**

## 環境別クライアント設定

### フロントエンド用クライアント

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

export const supabase = createClientComponentClient<Database>();

// React Hook での使用例
export function useSupabaseClient() {
  return supabase;
}
```

### サーバーサイド用クライアント

```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

// Server Components用
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

// API Routes用（Service Role Key使用）
export function createServiceSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// API Routes用（ユーザーコンテキスト付き）
export async function createAuthenticatedSupabaseClient(token: string) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error('Invalid authentication token');
  }

  return { supabase, user };
}
```

### 環境変数設定

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 認証状態管理

### 認証ヘルパー関数

```typescript
// lib/auth/helpers.ts
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export interface AuthenticatedUser extends User {
  profile?: UserProfile;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // プロフィール情報の取得
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      ...user,
      profile: profile || undefined,
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

export function onAuthStateChange(callback: (user: AuthenticatedUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}
```

### 認証コンテキスト

```typescript
// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthenticatedUser, getCurrentUser, onAuthStateChange } from '@/lib/auth/helpers';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    // 初期ユーザー取得
    refreshUser().finally(() => setLoading(false));

    // 認証状態変更の監視
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## サービス層実装

### ベースサービスクラス

```typescript
// lib/services/base.ts
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error: string | null;
}

export abstract class BaseService {
  protected handleError(error: PostgrestError | Error): string {
    console.error('Service error:', error);

    if ('code' in error) {
      // PostgrestError
      switch (error.code) {
        case 'PGRST116':
          return 'リソースが見つかりません';
        case '23505':
          return 'データが既に存在します';
        case '23503':
          return '関連するデータが存在しません';
        default:
          return error.message || 'データベースエラーが発生しました';
      }
    }

    return error.message || '予期しないエラーが発生しました';
  }

  protected async executePaginatedQuery<T>(
    queryBuilder: any,
    options: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    try {
      const { page, limit } = options;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await queryBuilder
        .range(from, to)
        .select('*', { count: 'exact' });

      if (error) {
        return {
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          error: this.handleError(error),
        };
      }

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        error: null,
      };
    } catch (error) {
      return {
        data: [],
        pagination: { page: options.page, limit: options.limit, total: 0, totalPages: 0 },
        error: this.handleError(error as Error),
      };
    }
  }
}
```

### プロジェクトサービス

```typescript
// lib/services/projects.ts
import { BaseService, ServiceResult, PaginatedResult, PaginationOptions } from './base';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export interface ProjectWithDetails extends Project {
  client: {
    name: string;
    company: string;
  } | null;
  assignments: {
    user: {
      name: string;
      email: string;
    };
  }[];
}

export interface ProjectFilters {
  status?: 'active' | 'planning' | 'completed' | 'cancelled';
  clientId?: string;
  search?: string;
}

export class ProjectService extends BaseService {
  async getProjects(
    options: PaginationOptions,
    filters?: ProjectFilters
  ): Promise<PaginatedResult<ProjectWithDetails>> {
    let query = supabase.from('projects').select(`
        *,
        client:clients(name, company),
        assignments:project_assignments(
          user:users(name, email)
        )
      `);

    // フィルタリング
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    query = query.order('created_at', { ascending: false });

    return this.executePaginatedQuery<ProjectWithDetails>(query, options);
  }

  async getProject(id: string): Promise<ServiceResult<ProjectWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(
          `
          *,
          client:clients(name, company),
          assignments:project_assignments(
            user:users(name, email)
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data: data as ProjectWithDetails, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }

  async createProject(projectData: ProjectInsert): Promise<ServiceResult<Project>> {
    try {
      const { data, error } = await supabase.from('projects').insert(projectData).select().single();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }

  async updateProject(id: string, updates: ProjectUpdate): Promise<ServiceResult<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }

  async deleteProject(id: string): Promise<ServiceResult<null>> {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }

  async getProjectStats(): Promise<
    ServiceResult<{
      total: number;
      active: number;
      completed: number;
      planning: number;
    }>
  > {
    try {
      const { data, error } = await supabase.rpc('get_project_stats');

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }
}

// シングルトンインスタンス
export const projectService = new ProjectService();
```

### クライアントサービス

```typescript
// lib/services/clients.ts
import { BaseService, ServiceResult, PaginatedResult, PaginationOptions } from './base';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export interface ClientWithProjects extends Client {
  projects: {
    id: string;
    name: string;
    status: string;
  }[];
}

export class ClientService extends BaseService {
  async getClients(options: PaginationOptions): Promise<PaginatedResult<ClientWithProjects>> {
    const query = supabase
      .from('clients')
      .select(
        `
        *,
        projects(id, name, status)
      `
      )
      .order('created_at', { ascending: false });

    return this.executePaginatedQuery<ClientWithProjects>(query, options);
  }

  async getClient(id: string): Promise<ServiceResult<ClientWithProjects>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(
          `
          *,
          projects(id, name, status)
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data: data as ClientWithProjects, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }

  async createClient(clientData: ClientInsert): Promise<ServiceResult<Client>> {
    try {
      const { data, error } = await supabase.from('clients').insert(clientData).select().single();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }

  async updateClient(id: string, updates: ClientUpdate): Promise<ServiceResult<Client>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }

  async deleteClient(id: string): Promise<ServiceResult<null>> {
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error as Error) };
    }
  }
}

export const clientService = new ClientService();
```

## リアルタイム機能

### リアルタイムフック

```typescript
// hooks/useRealtime.ts
import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export function useRealtimeSubscription<T>(table: string, filter?: string, initialData?: T[]) {
  const [data, setData] = useState<T[]>(initialData || []);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channelName = filter ? `${table}:${filter}` : table;
    const realtimeChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter,
        },
        (payload) => {
          console.log('Realtime update:', payload);

          switch (payload.eventType) {
            case 'INSERT':
              setData((current) => [...current, payload.new as T]);
              break;
            case 'UPDATE':
              setData((current) =>
                current.map((item) =>
                  (item as any).id === payload.new.id ? (payload.new as T) : item
                )
              );
              break;
            case 'DELETE':
              setData((current) => current.filter((item) => (item as any).id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    setChannel(realtimeChannel);

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [table, filter]);

  return { data, setData, channel };
}

// プロジェクト用リアルタイムフック
export function useRealtimeProjects() {
  return useRealtimeSubscription('projects');
}

// 特定ユーザーの通知用リアルタイムフック
export function useRealtimeNotifications(userId: string) {
  return useRealtimeSubscription('notifications', `user_id=eq.${userId}`);
}
```

### プレゼンス機能

```typescript
// hooks/usePresence.ts
import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PresenceState {
  user_id: string;
  user_name: string;
  online_at: string;
}

export function usePresence(roomId: string) {
  const { user } = useAuth();
  const [presenceState, setPresenceState] = useState<Record<string, PresenceState>>({});
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase
      .channel(`presence:${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setPresenceState(state as Record<string, PresenceState>);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            user_name: user.profile?.name || user.email,
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [roomId, user]);

  const onlineUsers = Object.values(presenceState).flat();

  return { onlineUsers, channel };
}
```

## ファイルストレージ

### ファイルアップロード

```typescript
// lib/storage/files.ts
import { supabase } from '@/lib/supabase/client';

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export interface FileUploadOptions {
  bucket: string;
  folder?: string;
  maxSize?: number; // bytes
  allowedTypes?: string[];
}

export async function uploadFile(
  file: File,
  fileName: string,
  options: FileUploadOptions
): Promise<UploadResult> {
  try {
    // ファイルサイズチェック
    if (options.maxSize && file.size > options.maxSize) {
      return {
        url: null,
        error: `ファイルサイズが上限（${options.maxSize / 1024 / 1024}MB）を超えています`,
      };
    }

    // ファイルタイプチェック
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        url: null,
        error: `許可されていないファイルタイプです: ${file.type}`,
      };
    }

    // ファイルパスの生成
    const timestamp = new Date().getTime();
    const filePath = options.folder
      ? `${options.folder}/${timestamp}_${fileName}`
      : `${timestamp}_${fileName}`;

    // アップロード実行
    const { data, error } = await supabase.storage.from(options.bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      return { url: null, error: error.message };
    }

    // 公開URLの取得
    const {
      data: { publicUrl },
    } = supabase.storage.from(options.bucket).getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

export async function downloadFile(
  bucket: string,
  filePath: string
): Promise<{
  data: Blob | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(filePath);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

// ファイルアップロード用フック
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, fileName: string, options: FileUploadOptions) => {
    setUploading(true);
    try {
      const result = await uploadFile(file, fileName, options);
      return result;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
```

## カスタムフック

### データフェッチフック

```typescript
// hooks/useSupabaseData.ts
import { useEffect, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

export interface UseSupabaseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSupabaseData<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  deps: any[] = []
): UseSupabaseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await queryFn();

      if (result.error) {
        setError(result.error.message);
        setData(null);
      } else {
        setData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

// 使用例
export function useProject(id: string) {
  return useSupabaseData(() => supabase.from('projects').select('*').eq('id', id).single(), [id]);
}

export function useProjects() {
  return useSupabaseData(
    () => supabase.from('projects').select('*').order('created_at', { ascending: false }),
    []
  );
}
```

## エラーハンドリング

### Supabaseエラー処理

```typescript
// lib/errors/supabase.ts
import { PostgrestError, AuthError, StorageError } from '@supabase/supabase-js';

export class SupabaseError extends Error {
  constructor(
    public originalError: PostgrestError | AuthError | StorageError,
    public type: 'database' | 'auth' | 'storage'
  ) {
    super(originalError.message);
    this.name = 'SupabaseError';
  }
}

export function handleSupabaseError(error: PostgrestError | AuthError | StorageError): string {
  console.error('Supabase error:', error);

  // PostgrestError (データベースエラー)
  if ('code' in error && 'details' in error) {
    switch (error.code) {
      case 'PGRST116':
        return 'データが見つかりません';
      case '23505':
        return 'データが既に存在します';
      case '23503':
        return '関連するデータが存在しません';
      case '23514':
        return '入力データが制約に違反しています';
      case '42501':
        return 'この操作を実行する権限がありません';
      default:
        return error.message || 'データベースエラーが発生しました';
    }
  }

  // AuthError
  if ('status' in error) {
    switch (error.status) {
      case 400:
        return '認証情報が正しくありません';
      case 401:
        return 'ログインが必要です';
      case 403:
        return 'アクセスが拒否されました';
      case 422:
        return '入力データが正しくありません';
      default:
        return error.message || '認証エラーが発生しました';
    }
  }

  return error.message || '予期しないエラーが発生しました';
}

export function isSupabaseError(error: any): error is PostgrestError | AuthError | StorageError {
  return (
    error &&
    (('code' in error && 'details' in error) || // PostgrestError
      'status' in error || // AuthError
      'statusCode' in error) // StorageError
  );
}
```

## テスト実装

### サービス層テスト

```typescript
// __tests__/services/projects.test.ts
import { ProjectService } from '@/lib/services/projects';
import { supabase } from '@/lib/supabase/client';

// Supabaseクライアントのモック
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

describe('ProjectService', () => {
  let projectService: ProjectService;

  beforeEach(() => {
    projectService = new ProjectService();
    jest.clearAllMocks();
  });

  describe('getProjects', () => {
    it('should return paginated projects', async () => {
      const mockData = [
        { id: '1', name: 'Project 1', status: 'active' },
        { id: '2', name: 'Project 2', status: 'completed' },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
          count: 2,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await projectService.getProjects({ page: 1, limit: 10 }, { status: 'active' });

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockData);
      expect(result.pagination.total).toBe(2);
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' },
          count: 0,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await projectService.getProjects({ page: 1, limit: 10 });

      expect(result.error).toBe('リソースが見つかりません');
      expect(result.data).toEqual([]);
    });
  });

  describe('createProject', () => {
    it('should create project successfully', async () => {
      const projectData = {
        name: 'New Project',
        description: 'Project description',
        client_id: 'client-id',
      };

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'new-id', ...projectData },
          error: null,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await projectService.createProject(projectData);

      expect(result.error).toBeNull();
      expect(result.data).toMatchObject(projectData);
      expect(mockQuery.insert).toHaveBeenCalledWith(projectData);
    });
  });
});
```

### リアルタイム機能テスト

```typescript
// __tests__/hooks/useRealtime.test.ts
import { renderHook, act } from '@testing-library/react';
import { useRealtimeSubscription } from '@/hooks/useRealtime';
import { supabase } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');

describe('useRealtimeSubscription', () => {
  const mockChannel = {
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
  };

  beforeEach(() => {
    (supabase.channel as jest.Mock).mockReturnValue(mockChannel);
    (supabase.removeChannel as jest.Mock).mockResolvedValue(undefined);
  });

  it('should subscribe to realtime updates', () => {
    const { result } = renderHook(() => useRealtimeSubscription('projects', undefined, []));

    expect(supabase.channel).toHaveBeenCalledWith('projects');
    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      expect.objectContaining({
        event: '*',
        schema: 'public',
        table: 'projects',
      }),
      expect.any(Function)
    );
    expect(mockChannel.subscribe).toHaveBeenCalled();
  });

  it('should handle INSERT events', () => {
    const initialData = [{ id: '1', name: 'Project 1' }];
    const { result } = renderHook(() =>
      useRealtimeSubscription('projects', undefined, initialData)
    );

    // INSERT イベントをシミュレート
    const insertCallback = mockChannel.on.mock.calls[0][2];
    act(() => {
      insertCallback({
        eventType: 'INSERT',
        new: { id: '2', name: 'Project 2' },
      });
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[1]).toEqual({ id: '2', name: 'Project 2' });
  });
});
```
