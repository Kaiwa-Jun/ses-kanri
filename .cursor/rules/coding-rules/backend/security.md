# バックエンドセキュリティ規約

## 基本原則

- **認証・認可を全APIエンドポイントで必須とする**
- **入力値検証・サニタイゼーションを徹底する**
- **機密情報の適切な暗号化・保護を実装する**
- **セキュリティヘッダーを適切に設定する**
- **監査ログを必須で記録する**
- **セキュリティ脆弱性の継続的監視を実装する**

## 認証・認可

### Supabase Auth統合

```typescript
// lib/auth/supabase-auth.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { Database } from '@/types/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'sales' | 'engineer';
  permissions: string[];
}

export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const supabase = createServerSupabaseClient();

    // トークン検証
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.warn('Invalid token:', error?.message);
      return null;
    }

    // ユーザープロフィール取得
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, permissions')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.warn('User profile not found:', profileError?.message);
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role,
      permissions: profile.permissions || [],
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getCurrentUserFromCookies(): Promise<AuthenticatedUser | null> {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, permissions')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role,
      permissions: profile.permissions || [],
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
```

### 権限チェック

```typescript
// lib/auth/permissions.ts
export const PERMISSIONS = {
  // プロジェクト管理
  PROJECT_CREATE: 'project:create',
  PROJECT_READ: 'project:read',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',

  // クライアント管理
  CLIENT_CREATE: 'client:create',
  CLIENT_READ: 'client:read',
  CLIENT_UPDATE: 'client:update',
  CLIENT_DELETE: 'client:delete',

  // ユーザー管理
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // レポート
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',

  // システム管理
  SYSTEM_ADMIN: 'system:admin',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function hasPermission(user: AuthenticatedUser, permission: Permission): boolean {
  // 管理者は全権限を持つ
  if (user.role === 'admin') {
    return true;
  }

  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: AuthenticatedUser, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

export function hasAllPermissions(user: AuthenticatedUser, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}

export function hasRole(user: AuthenticatedUser, role: string): boolean {
  return user.role === role;
}

export function hasAnyRole(user: AuthenticatedUser, roles: string[]): boolean {
  return roles.includes(user.role);
}

// リソースベースアクセス制御
export async function canAccessProject(
  user: AuthenticatedUser,
  projectId: string
): Promise<boolean> {
  // 管理者は全プロジェクトにアクセス可能
  if (user.role === 'admin') {
    return true;
  }

  const supabase = createServerSupabaseClient();

  // 営業担当者は担当クライアントのプロジェクトにアクセス可能
  if (user.role === 'sales') {
    const { data } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', projectId)
      .single();

    if (!data) return false;

    const { data: assignment } = await supabase
      .from('client_assignments')
      .select('id')
      .eq('client_id', data.client_id)
      .eq('user_id', user.id)
      .single();

    return !!assignment;
  }

  // エンジニアはアサインされたプロジェクトにアクセス可能
  if (user.role === 'engineer') {
    const { data } = await supabase
      .from('project_assignments')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  }

  return false;
}
```

### API認証ミドルウェア

```typescript
// lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, AuthenticatedUser } from '@/lib/auth/supabase-auth';
import { hasPermission, hasRole, Permission } from '@/lib/auth/permissions';
import { ApiResponse } from '@/types/api';

export function requireAuth() {
  return async (
    request: NextRequest,
    handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

export function requirePermission(permission: Permission) {
  return async (
    request: NextRequest,
    user: AuthenticatedUser,
    handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    if (!hasPermission(user, permission)) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    return handler(request, user);
  };
}

export function requireRole(allowedRoles: string[]) {
  return async (
    request: NextRequest,
    user: AuthenticatedUser,
    handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Access denied',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    return handler(request, user);
  };
}

// 使用例
export async function GET(request: NextRequest): Promise<NextResponse> {
  return requireAuth()(request, async (request, user) => {
    return requirePermission(PERMISSIONS.PROJECT_READ)(request, user, async (request, user) => {
      // ビジネスロジック
      return NextResponse.json({ data: 'success' });
    });
  });
}
```

## JWT トークン管理

### トークン生成・検証

```typescript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
  jti: string; // JWT ID for revocation
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateAccessToken(user: AuthenticatedUser): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    jti: generateJTI(),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'ses-kanri',
    audience: 'ses-kanri-api',
  });
}

export function generateRefreshToken(userId: string): string {
  const payload: Omit<RefreshTokenPayload, 'iat' | 'exp'> = {
    sub: userId,
    jti: generateJTI(),
  };

  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'ses-kanri',
    audience: 'ses-kanri-refresh',
  });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'ses-kanri',
      audience: 'ses-kanri-api',
    }) as JWTPayload;

    return payload;
  } catch (error) {
    console.warn('Invalid access token:', error);
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET, {
      issuer: 'ses-kanri',
      audience: 'ses-kanri-refresh',
    }) as RefreshTokenPayload;

    return payload;
  } catch (error) {
    console.warn('Invalid refresh token:', error);
    return null;
  }
}

function generateJTI(): string {
  return createHash('sha256').update(randomBytes(32)).digest('hex').substring(0, 16);
}

// トークン無効化管理
const revokedTokens = new Set<string>();

export function revokeToken(jti: string): void {
  revokedTokens.add(jti);
}

export function isTokenRevoked(jti: string): boolean {
  return revokedTokens.has(jti);
}

// Redis使用版（本番環境推奨）
export async function revokeTokenRedis(jti: string): Promise<void> {
  // Redis実装
  // await redis.set(`revoked:${jti}`, '1', 'EX', 86400 * 7); // 7日間保持
}

export async function isTokenRevokedRedis(jti: string): Promise<boolean> {
  // Redis実装
  // const result = await redis.get(`revoked:${jti}`);
  // return result === '1';
  return false;
}
```

## 入力値検証・サニタイゼーション

### SQL インジェクション対策

```typescript
// lib/security/sql-injection.ts
import { z } from 'zod';

// 危険なSQL文字列パターン
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /(;|\-\-|\/\*|\*\/)/,
  /(\b(OR|AND)\b.*=.*)/i,
  /(\'(''|[^'])*')/,
  /(\b(XP_|SP_)\w+)/i,
];

export function detectSQLInjection(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

export function sanitizeSQLInput(input: string): string {
  if (detectSQLInjection(input)) {
    throw new Error('Potential SQL injection detected');
  }

  // 基本的なサニタイゼーション
  return input
    .replace(/[<>]/g, '') // HTMLタグ除去
    .replace(/['"]/g, '') // クォート除去
    .trim()
    .substring(0, 1000); // 最大長制限
}

// Zodスキーマでの検証
export const sqlSafeStringSchema = z
  .string()
  .max(1000)
  .refine((value) => !detectSQLInjection(value), { message: 'Invalid characters detected' });

export const sqlSafeOptionalStringSchema = sqlSafeStringSchema.optional();
```

### XSS対策

```typescript
// lib/security/xss-protection.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: [],
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'\/]/g, (char) => map[char]);
}

export function sanitizeUserInput(input: string): string {
  return escapeHtml(input.trim().substring(0, 1000));
}

// JSONデータのサニタイゼーション
export function sanitizeJsonObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeUserInput(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeJsonObject(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}
```

### ファイルアップロードセキュリティ

```typescript
// lib/security/file-upload.ts
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedName?: string;
}

export interface FileUploadConfig {
  maxSize: number; // bytes
  allowedTypes: string[];
  allowedExtensions: string[];
  scanForMalware?: boolean;
}

// ファイルタイプのマジックナンバー
const MAGIC_NUMBERS: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'application/zip': [0x50, 0x4b, 0x03, 0x04],
  'text/plain': [], // テキストファイルは特別扱い
};

export function validateFile(file: File, config: FileUploadConfig): FileValidationResult {
  const errors: string[] = [];

  // ファイルサイズチェック
  if (file.size > config.maxSize) {
    errors.push(`File size exceeds limit (${config.maxSize / 1024 / 1024}MB)`);
  }

  // ファイルタイプチェック
  if (!config.allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed: ${file.type}`);
  }

  // 拡張子チェック
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !config.allowedExtensions.includes(extension)) {
    errors.push(`File extension not allowed: ${extension}`);
  }

  // ファイル名のサニタイゼーション
  const sanitizedName = sanitizeFileName(file.name);

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedName,
  };
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // 安全な文字のみ許可
    .replace(/_{2,}/g, '_') // 連続するアンダースコアを1つに
    .substring(0, 255); // 最大長制限
}

export async function validateFileContent(
  fileBuffer: ArrayBuffer,
  expectedType: string
): Promise<boolean> {
  const magicNumbers = MAGIC_NUMBERS[expectedType];
  if (!magicNumbers || magicNumbers.length === 0) {
    return true; // テキストファイルなど、マジックナンバーがない場合
  }

  const header = new Uint8Array(fileBuffer.slice(0, magicNumbers.length));
  return magicNumbers.every((byte, index) => header[index] === byte);
}

// ウイルススキャン（外部サービス連携）
export async function scanFileForMalware(fileBuffer: ArrayBuffer): Promise<boolean> {
  // 実際の実装では ClamAV や VirusTotal API を使用
  // ここではダミー実装

  // 既知の危険なパターンをチェック
  const dangerousPatterns = [
    'eval(',
    'exec(',
    '<script',
    'javascript:',
    'vbscript:',
    'data:text/html',
  ];

  const content = new TextDecoder().decode(fileBuffer);
  return !dangerousPatterns.some((pattern) =>
    content.toLowerCase().includes(pattern.toLowerCase())
  );
}

// ファイルハッシュ計算（重複チェック用）
export function calculateFileHash(fileBuffer: ArrayBuffer): string {
  const hash = createHash('sha256');
  hash.update(Buffer.from(fileBuffer));
  return hash.digest('hex');
}
```

## データ保護・暗号化

### 機密情報暗号化

```typescript
// lib/security/encryption.ts
import { createCipher, createDecipher, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

export async function encrypt(text: string, password?: string): Promise<string> {
  try {
    const key = password
      ? ((await scryptAsync(password, 'salt', 32)) as Buffer)
      : Buffer.from(ENCRYPTION_KEY, 'hex');

    const iv = randomBytes(16);
    const cipher = createCipher(ALGORITHM, key);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedData: string, password?: string): Promise<string> {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    const key = password
      ? ((await scryptAsync(password, 'salt', 32)) as Buffer)
      : Buffer.from(ENCRYPTION_KEY, 'hex');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = createDecipher(ALGORITHM, key);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// ハッシュ化（パスワード用）
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [salt, hash] = hashedPassword.split(':');
    const hashBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return hash === hashBuffer.toString('hex');
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// 機密データ管理
export class SecureDataManager {
  private static instance: SecureDataManager;
  private encryptedData: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): SecureDataManager {
    if (!SecureDataManager.instance) {
      SecureDataManager.instance = new SecureDataManager();
    }
    return SecureDataManager.instance;
  }

  async storeSecureData(key: string, data: string): Promise<void> {
    const encryptedData = await encrypt(data);
    this.encryptedData.set(key, encryptedData);
  }

  async retrieveSecureData(key: string): Promise<string | null> {
    const encryptedData = this.encryptedData.get(key);
    if (!encryptedData) {
      return null;
    }

    try {
      return await decrypt(encryptedData);
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  clearSecureData(key: string): void {
    this.encryptedData.delete(key);
  }

  clearAllSecureData(): void {
    this.encryptedData.clear();
  }
}
```

## セキュリティヘッダー

### Next.js セキュリティ設定

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },

  // CSP設定
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/',
        has: [
          {
            type: 'header',
            key: 'content-security-policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://*.supabase.co;
              font-src 'self';
              connect-src 'self' https://*.supabase.co wss://*.supabase.co;
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `
              .replace(/\s+/g, ' ')
              .trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### セキュリティミドルウェア

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

  // APIリクエストの場合
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // CORS設定
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');

    // プリフライトリクエストの処理
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }

    // レート制限チェック
    const rateLimitResult = checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// レート制限実装
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15分
  const maxRequests = 100; // 15分間に100リクエスト

  const current = rateLimitMap.get(ip);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: maxRequests - current.count };
}
```

## 監査ログシステム

### 監査ログ実装

```typescript
// lib/security/audit-logger.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AuthenticatedUser } from '@/lib/auth/supabase-auth';

export interface AuditLogEntry {
  id?: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  success: boolean;
  error_message?: string;
}

export class AuditLogger {
  private static instance: AuditLogger;
  private supabase = createServerSupabaseClient();

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const logEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      };

      const { error } = await this.supabase.from('audit_logs').insert(logEntry);

      if (error) {
        console.error('Failed to write audit log:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  async logUserAction(
    user: AuthenticatedUser,
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    request?: Request
  ): Promise<void> {
    await this.log({
      user_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details || {},
      ip_address:
        request?.headers.get('x-real-ip') || request?.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request?.headers.get('user-agent') || 'unknown',
      success: true,
    });
  }

  async logError(
    user: AuthenticatedUser | null,
    action: string,
    resourceType: string,
    error: Error,
    request?: Request
  ): Promise<void> {
    await this.log({
      user_id: user?.id || 'anonymous',
      action,
      resource_type: resourceType,
      details: { error: error.message, stack: error.stack },
      ip_address:
        request?.headers.get('x-real-ip') || request?.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request?.headers.get('user-agent') || 'unknown',
      success: false,
      error_message: error.message,
    });
  }

  async logSecurityEvent(
    eventType:
      | 'login_attempt'
      | 'login_success'
      | 'login_failure'
      | 'permission_denied'
      | 'suspicious_activity',
    details: Record<string, any>,
    request?: Request
  ): Promise<void> {
    await this.log({
      user_id: details.user_id || 'anonymous',
      action: eventType,
      resource_type: 'security',
      details,
      ip_address:
        request?.headers.get('x-real-ip') || request?.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request?.headers.get('user-agent') || 'unknown',
      success: eventType.includes('success'),
    });
  }
}

// 使用例のヘルパー関数
export function withAuditLog<T>(
  action: string,
  resourceType: string,
  handler: (logger: AuditLogger) => Promise<T>
) {
  return async (user: AuthenticatedUser, request?: Request): Promise<T> => {
    const logger = AuditLogger.getInstance();

    try {
      const result = await handler(logger);

      await logger.logUserAction(user, action, resourceType, undefined, { success: true }, request);

      return result;
    } catch (error) {
      await logger.logError(user, action, resourceType, error as Error, request);
      throw error;
    }
  };
}
```

## セキュリティ監視

### セキュリティ監視システム

```typescript
// lib/security/security-monitor.ts
import { AuditLogger } from './audit-logger';

export interface SecurityAlert {
  type: 'brute_force' | 'suspicious_activity' | 'privilege_escalation' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  timestamp: string;
}

export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private auditLogger = AuditLogger.getInstance();
  private alerts: SecurityAlert[] = [];

  // ブルートフォース攻撃検出
  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  private constructor() {}

  public static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  async checkBruteForceAttack(ip: string, success: boolean): Promise<void> {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15分
    const maxAttempts = 5;

    const current = this.loginAttempts.get(ip);

    if (success) {
      // 成功時はカウントリセット
      this.loginAttempts.delete(ip);
      return;
    }

    if (!current || now - current.lastAttempt > windowMs) {
      this.loginAttempts.set(ip, { count: 1, lastAttempt: now });
      return;
    }

    current.count++;
    current.lastAttempt = now;

    if (current.count >= maxAttempts) {
      await this.createAlert({
        type: 'brute_force',
        severity: 'high',
        message: `Brute force attack detected from IP: ${ip}`,
        details: { ip, attempts: current.count, timeWindow: '15 minutes' },
        timestamp: new Date().toISOString(),
      });

      await this.auditLogger.logSecurityEvent('suspicious_activity', {
        type: 'brute_force',
        ip,
        attempts: current.count,
      });
    }
  }

  async checkSuspiciousActivity(
    userId: string,
    action: string,
    details: Record<string, any>
  ): Promise<void> {
    const suspiciousPatterns = [
      // 大量のデータアクセス
      { pattern: /bulk_export|mass_download/, severity: 'medium' as const },
      // 権限昇格の試み
      { pattern: /admin|escalate|privilege/, severity: 'high' as const },
      // 異常な時間帯のアクセス
      { pattern: /after_hours/, severity: 'low' as const },
    ];

    const actionString = JSON.stringify({ action, ...details });

    for (const { pattern, severity } of suspiciousPatterns) {
      if (pattern.test(actionString)) {
        await this.createAlert({
          type: 'suspicious_activity',
          severity,
          message: `Suspicious activity detected for user: ${userId}`,
          details: { userId, action, ...details },
          timestamp: new Date().toISOString(),
        });

        await this.auditLogger.logSecurityEvent('suspicious_activity', {
          userId,
          action,
          pattern: pattern.source,
          ...details,
        });
      }
    }
  }

  async checkUnauthorizedAccess(
    userId: string,
    resourceType: string,
    resourceId: string,
    requiredPermission: string
  ): Promise<void> {
    await this.createAlert({
      type: 'privilege_escalation',
      severity: 'high',
      message: `Unauthorized access attempt by user: ${userId}`,
      details: {
        userId,
        resourceType,
        resourceId,
        requiredPermission,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });

    await this.auditLogger.logSecurityEvent('permission_denied', {
      userId,
      resourceType,
      resourceId,
      requiredPermission,
    });
  }

  private async createAlert(alert: SecurityAlert): Promise<void> {
    this.alerts.push(alert);

    // 重要度に応じた通知
    if (alert.severity === 'critical' || alert.severity === 'high') {
      await this.sendImmediateNotification(alert);
    }

    // アラートの永続化
    await this.persistAlert(alert);
  }

  private async sendImmediateNotification(alert: SecurityAlert): Promise<void> {
    // 実際の実装では Slack、メール、SMS などに通知
    console.error('SECURITY ALERT:', alert);

    // 管理者への通知
    // await notificationService.sendSecurityAlert(alert);
  }

  private async persistAlert(alert: SecurityAlert): Promise<void> {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from('security_alerts').insert(alert);
    } catch (error) {
      console.error('Failed to persist security alert:', error);
    }
  }

  public getAlerts(severity?: SecurityAlert['severity']): SecurityAlert[] {
    if (severity) {
      return this.alerts.filter((alert) => alert.severity === severity);
    }
    return [...this.alerts];
  }

  public clearAlerts(): void {
    this.alerts = [];
  }
}

// 使用例のミドルウェア
export function withSecurityMonitoring<T>(handler: () => Promise<T>) {
  return async (userId: string, action: string, details: Record<string, any>): Promise<T> => {
    const monitor = SecurityMonitor.getInstance();

    try {
      const result = await handler();

      // 成功時も監視
      await monitor.checkSuspiciousActivity(userId, action, details);

      return result;
    } catch (error) {
      // エラー時の監視
      await monitor.checkSuspiciousActivity(userId, `${action}_failed`, {
        ...details,
        error: (error as Error).message,
      });

      throw error;
    }
  };
}
```
