# Next.js API Routes実装規約

## 基本原則

- **すべてのAPI Routesに明示的な型定義を付ける**
- **統一されたエラーハンドリングパターンを使用する**
- **認証・認可チェックを必須とする**
- **リクエスト・レスポンスのバリデーションを実装する**
- **適切なHTTPステータスコードを返す**

## API Routes基本構造

### 型定義パターン

```typescript
// types/api.ts - API共通型定義
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 各エンドポイント固有の型
export interface CreateProjectRequest {
  name: string;
  description: string;
  clientId: string;
  startDate: string;
  endDate?: string;
  budget: number;
  requiredSkills: string[];
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  clientId: string;
  status: 'active' | 'planning' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget: number;
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
}
```

### API Routes実装パターン

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { ApiResponse, CreateProjectRequest, ProjectResponse } from '@/types/api';
import { validateRequest } from '@/lib/validation';
import { authenticateUser } from '@/lib/auth';
import { createProjectSchema } from '@/lib/schemas';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/projects
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ProjectResponse[]>>> {
  try {
    // 1. 認証チェック
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    // 2. クエリパラメータの取得と検証
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'active' | 'completed' | null;

    // 3. データベースクエリ
    let query = supabase
      .from('projects')
      .select('*')
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Internal server error', timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    // 4. レスポンス返却
    return NextResponse.json({
      data: data as ProjectResponse[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

// POST /api/projects
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ProjectResponse>>> {
  try {
    // 1. 認証チェック
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    // 2. リクエストボディの取得と検証
    const body = await request.json();
    const validationResult = validateRequest(body, createProjectSchema);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const projectData: CreateProjectRequest = validationResult.data;

    // 3. 権限チェック（例：営業担当者のみプロジェクト作成可能）
    if (user.role !== 'sales' && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    // 4. データベース操作
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: projectData.name,
        description: projectData.description,
        client_id: projectData.clientId,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        budget: projectData.budget,
        required_skills: projectData.requiredSkills,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create project', timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    // 5. レスポンス返却
    return NextResponse.json(
      {
        data: data as ProjectResponse,
        message: 'Project created successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
```

### 動的ルート実装

```typescript
// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/projects/[id]
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<ProjectResponse>>> {
  try {
    const { id } = params;

    // UUID形式の検証
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    // 認証チェック
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    // データ取得
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Project not found', timestamp: new Date().toISOString() },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      data: data as ProjectResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<ProjectResponse>>> {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = validateRequest(body, updateProjectSchema);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 更新実行
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...validationResult.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Project not found', timestamp: new Date().toISOString() },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      data: data as ProjectResponse,
      message: 'Project updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const user = await authenticateUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'sales')) {
      return NextResponse.json(
        { error: 'Forbidden', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: null,
      message: 'Project deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
```

## エラーハンドリング

### 統一エラーレスポンス

```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export function createErrorResponse(
  error: ApiError | Error,
  fallbackStatus: number = 500
): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: ErrorCodes.INTERNAL_ERROR,
      timestamp: new Date().toISOString(),
    },
    { status: fallbackStatus }
  );
}
```

## 認証・認可

### 認証ミドルウェア

```typescript
// lib/auth.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'sales' | 'engineer';
}

export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }

    // ユーザー情報の取得
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      role: profile?.role || 'engineer',
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function requireRole(allowedRoles: string[]) {
  return (user: AuthenticatedUser): boolean => {
    return allowedRoles.includes(user.role);
  };
}
```

## バリデーション

### リクエストバリデーション

```typescript
// lib/validation.ts
import { z } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export function validateRequest<T>(data: unknown, schema: z.ZodSchema<T>): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { success: false, errors };
    }
    throw error;
  }
}

// lib/schemas.ts
export const createProjectSchema = z.object({
  name: z.string().min(1, 'プロジェクト名は必須です').max(100),
  description: z.string().min(10, '説明は10字以上入力してください').max(500),
  clientId: z.string().uuid('正しいクライアントIDを入力してください'),
  startDate: z.string().datetime('正しい日付形式を入力してください'),
  endDate: z.string().datetime().optional(),
  budget: z.number().min(1, '予算は1円以上である必要があります'),
  requiredSkills: z.array(z.string()).min(1, '最低1つのスキルを選択してください'),
});

export const updateProjectSchema = createProjectSchema.partial();
```

## ユーティリティ関数

```typescript
// lib/utils.ts
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function formatApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}
```

## テスト実装

### API Routes単体テスト

```typescript
// __tests__/api/projects.test.ts
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/projects/route';

describe('/api/projects', () => {
  describe('GET', () => {
    it('should return projects list', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects', {
        headers: { Authorization: 'Bearer valid-token' },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toBeInstanceOf(Array);
      expect(data.timestamp).toBeDefined();
    });

    it('should return 401 for unauthorized request', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects');

      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe('POST', () => {
    it('should create project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        clientId: 'valid-uuid',
        startDate: '2024-01-01T00:00:00Z',
        budget: 1000000,
        requiredSkills: ['JavaScript', 'React'],
      };

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.name).toBe(projectData.name);
    });
  });
});
```

## パフォーマンス最適化

### クエリ最適化

```typescript
// 効率的なクエリ設計
export async function getProjectsWithDetails(): Promise<ProjectResponse[]> {
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
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

// ページネーション最適化
export async function getPaginatedProjects(
  page: number,
  limit: number,
  filters?: ProjectFilters
): Promise<PaginatedResponse<ProjectResponse>> {
  let query = supabase.from('projects').select('*, clients(name)', { count: 'exact' });

  // フィルタリング
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  // ページネーション
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return {
    data: data as ProjectResponse[],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}
```

## セキュリティ

### セキュリティヘッダー

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // セキュリティヘッダーの設定
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 入力値サニタイゼーション

```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '').substring(0, 1000); // 最大長制限
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value as T[keyof T];
    }
  }

  return sanitized;
}
```
