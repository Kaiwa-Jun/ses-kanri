# 品質基準・型安全性規約

## 基本原則

- **型安全性を最優先とする**
- **実行時エラーを防ぐための厳密な型定義**
- **コードの可読性と保守性を重視**
- **一貫性のあるコーディングスタイル**
- **包括的なテスト戦略**
- **継続的な品質改善**

## TypeScript設定

### 厳密な型チェック

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "skipLibCheck": false,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 型定義の品質基準

```typescript
// ❌ 悪い例：型定義が不十分
interface User {
  id: string;
  name: string;
  email: string;
  role: string; // 具体的でない
  createdAt: string; // 型が曖昧
}

// ✅ 良い例：厳密な型定義
interface User {
  readonly id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'engineer'; // リテラル型で制限
  createdAt: Date; // 適切な型
  updatedAt: Date;
  isActive: boolean;
}

// ❌ 悪い例：any型の使用
function processData(data: any): any {
  return data.someProperty;
}

// ✅ 良い例：ジェネリクスで型安全性を保つ
function processData<T extends { someProperty: unknown }>(data: T): T['someProperty'] {
  return data.someProperty;
}

// ❌ 悪い例：optional chainなしのアクセス
function getUserName(user: User): string {
  return user.profile.displayName;
}

// ✅ 良い例：null安全性を考慮
interface UserProfile {
  displayName: string;
  avatar?: string;
}

interface UserWithProfile extends User {
  profile?: UserProfile;
}

function getUserName(user: UserWithProfile): string {
  return user.profile?.displayName ?? user.name;
}
```

## エラーハンドリング

### 統一されたエラー型定義

```typescript
// types/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '認証が必要です') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'アクセス権限がありません') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'リソース') {
    super(`${resource}が見つかりません`, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
  }
}

// Result型パターン
export type Result<T, E = AppError> = { success: true; data: T } | { success: false; error: E };

export function createSuccess<T>(data: T): Result<T> {
  return { success: true, data };
}

export function createError<E extends AppError>(error: E): Result<never, E> {
  return { success: false, error };
}
```

### エラーハンドリングパターン

```typescript
// utils/error-handler.ts
import { AppError, Result, createSuccess, createError } from '@/types/errors';

// 非同期処理のエラーハンドリング
export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return createSuccess(data);
  } catch (error) {
    if (error instanceof AppError) {
      return createError(error);
    }

    const appError = new AppError(
      error instanceof Error ? error.message : '予期しないエラーが発生しました',
      'UNKNOWN_ERROR'
    );
    return createError(appError);
  }
}

// API呼び出しのエラーハンドリング
export async function apiCall<T>(url: string, options?: RequestInit): Promise<Result<T>> {
  return safeAsync(async () => {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData.message || `HTTP ${response.status}`,
        errorData.code || 'HTTP_ERROR',
        response.status,
        errorData
      );
    }

    return response.json();
  });
}

// 使用例
async function getUser(id: string): Promise<Result<User>> {
  const result = await apiCall<User>(`/api/users/${id}`);

  if (!result.success) {
    console.error('ユーザー取得エラー:', result.error);
    return result;
  }

  return createSuccess(result.data);
}
```

## バリデーション

### 入力値検証

```typescript
// utils/validation.ts
import { z } from 'zod';
import { ValidationError } from '@/types/errors';

// 基本バリデーション関数
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    throw new ValidationError('入力値が無効です', { errors });
  }

  return result.data;
}

// 非同期バリデーション
export async function validateInputAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<Result<T>> {
  return safeAsync(async () => {
    return validateInput(schema, data);
  });
}

// 複数フィールドの相関バリデーション
export const projectSchema = z
  .object({
    name: z.string().min(1, 'プロジェクト名は必須です'),
    startDate: z.date(),
    endDate: z.date().optional(),
    budget: z.number().positive('予算は正の数で入力してください'),
  })
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    message: '終了日は開始日より後の日付を選択してください',
    path: ['endDate'],
  });
```

## コード品質

### 命名規約

```typescript
// ✅ 良い例：明確で一貫性のある命名
interface UserProfile {
  readonly id: string;
  displayName: string;
  avatarUrl?: string;
  lastLoginAt: Date;
  isEmailVerified: boolean;
}

class UserService {
  async getUserById(id: string): Promise<User | null> {
    // 実装
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    // 実装
  }

  async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<User> {
    // 実装
  }
}

// 定数は UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ❌ 悪い例：曖昧な命名
interface Data {
  id: string;
  name: string;
  flag: boolean; // 何のフラグか不明
  dt: Date; // 略語
}

function process(data: any): any {
  // 何を処理するのか不明
}
```

### 関数設計

```typescript
// ✅ 良い例：単一責任の原則
function calculateTotalPrice(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ❌ 悪い例：複数の責任を持つ関数
function processOrder(order: any): any {
  // 価格計算
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // メール送信
  sendEmail(order.customerEmail, `注文確認: ${total}円`);

  // データベース保存
  database.save(order);

  // 在庫更新
  updateInventory(order.items);

  return { success: true, total };
}
```

### 型ガード

```typescript
// types/guards.ts
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function hasProperty<T extends PropertyKey>(
  obj: object,
  prop: T
): obj is Record<T, unknown> {
  return prop in obj;
}

// 使用例
function processUserData(data: unknown): User | null {
  if (!isObject(data)) {
    return null;
  }

  if (!hasProperty(data, 'id') || !isString(data.id)) {
    return null;
  }

  if (!hasProperty(data, 'name') || !isString(data.name)) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    // その他のプロパティ
  } as User;
}
```

## パフォーマンス

### メモ化とキャッシュ

```typescript
// utils/memoization.ts
import { useMemo, useCallback } from 'react';

// 計算結果のメモ化
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(calculation, dependencies);
}

// 関数のメモ化
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  return useCallback(callback, dependencies);
}

// シンプルなメモ化関数
export function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const cache = new Map<string, Return>();

  return (...args: Args): Return => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// 使用例
const expensiveCalculation = memoize((a: number, b: number): number => {
  console.log('計算実行中...');
  return a * b * Math.random();
});
```

### 遅延読み込み

```typescript
// components/LazyComponent.tsx
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// コンポーネントの遅延読み込み
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function LazyLoadedComponent() {
  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <HeavyComponent />
    </Suspense>
  );
}

function ComponentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}

// データの遅延読み込み
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  shouldLoad: boolean
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldLoad) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '読み込みエラー');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [shouldLoad, fetchFn]);

  return { data, loading, error };
}
```

## セキュリティ

### XSS対策

```typescript
// utils/sanitization.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: [],
    FORBID_SCRIPT: true
  });
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// React コンポーネントでの安全な表示
interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitizedHtml = sanitizeHtml(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
```

### CSRF対策

```typescript
// utils/csrf.ts
export function generateCSRFToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) {
    return false;
  }

  // タイミング攻撃を防ぐための定数時間比較
  if (token.length !== expectedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }

  return result === 0;
}
```

## テスト

### 単体テスト

```typescript
// __tests__/utils/validation.test.ts
import { describe, it, expect } from '@jest/globals';
import { validateInput, projectSchema } from '@/utils/validation';
import { ValidationError } from '@/types/errors';

describe('validateInput', () => {
  it('有効なデータを正しく検証する', () => {
    const validData = {
      name: 'テストプロジェクト',
      startDate: new Date('2024-01-01'),
      budget: 1000000,
    };

    const result = validateInput(projectSchema, validData);
    expect(result).toEqual(validData);
  });

  it('無効なデータでValidationErrorを投げる', () => {
    const invalidData = {
      name: '', // 空文字は無効
      startDate: new Date('2024-01-01'),
      budget: -1000, // 負の値は無効
    };

    expect(() => validateInput(projectSchema, invalidData)).toThrow(ValidationError);
  });

  it('終了日が開始日より前の場合エラーを投げる', () => {
    const invalidData = {
      name: 'テストプロジェクト',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2023-12-31'), // 開始日より前
      budget: 1000000,
    };

    expect(() => validateInput(projectSchema, invalidData)).toThrow(ValidationError);
  });
});
```

### 統合テスト

```typescript
// __tests__/api/projects.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/projects';
import { cleanupTestData, createTestUser } from '@/test-utils/setup';

describe('/api/projects', () => {
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  it('GET /api/projects - プロジェクト一覧を取得', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: `Bearer ${testUser.token}`,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('POST /api/projects - 新規プロジェクト作成', async () => {
    const projectData = {
      name: 'テストプロジェクト',
      description: 'テスト用のプロジェクトです',
      clientId: 'test-client-id',
      startDate: '2024-01-01',
      budget: 1000000,
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: `Bearer ${testUser.token}`,
        'content-type': 'application/json',
      },
      body: projectData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);

    const data = JSON.parse(res._getData());
    expect(data.data).toMatchObject({
      name: projectData.name,
      description: projectData.description,
      budget: projectData.budget,
    });
  });
});
```

## コードレビュー

### チェックリスト

```typescript
// .cursor/rules/code-review-checklist.md

## コードレビューチェックリスト

### 型安全性
- [ ] すべての関数に適切な型注釈がある
- [ ] any型の使用を避けている
- [ ] null/undefined の安全な処理ができている
- [ ] 型ガードを適切に使用している

### エラーハンドリング
- [ ] 例外処理が適切に実装されている
- [ ] エラーメッセージが分かりやすい
- [ ] ログ出力が適切に行われている
- [ ] ユーザーフレンドリーなエラー表示

### パフォーマンス
- [ ] 不要な再レンダリングを避けている
- [ ] 重い計算をメモ化している
- [ ] 適切な遅延読み込みを実装している
- [ ] メモリリークの可能性がない

### セキュリティ
- [ ] 入力値の検証・サニタイゼーションを実装
- [ ] XSS対策が適切
- [ ] 認証・認可チェックが適切
- [ ] 機密情報の適切な処理

### テスト
- [ ] 単体テストが網羅的
- [ ] エッジケースをテストしている
- [ ] モックが適切に使用されている
- [ ] テストが保守しやすい構造

### 可読性・保守性
- [ ] 命名が適切で分かりやすい
- [ ] 関数が単一責任を持つ
- [ ] コメントが適切に記述されている
- [ ] 一貫性のあるコーディングスタイル
```

## 継続的改善

### 品質メトリクス

```typescript
// scripts/quality-metrics.ts
import { execSync } from 'child_process';
import fs from 'fs';

interface QualityMetrics {
  testCoverage: number;
  typeScriptErrors: number;
  eslintWarnings: number;
  eslintErrors: number;
  codeComplexity: number;
  duplicatedLines: number;
}

export function generateQualityReport(): QualityMetrics {
  // テストカバレッジ
  const coverageResult = execSync('npm run test:coverage --silent', { encoding: 'utf8' });
  const testCoverage = extractCoveragePercentage(coverageResult);

  // TypeScript エラー
  const tscResult = execSync('npx tsc --noEmit --skipLibCheck', { encoding: 'utf8' });
  const typeScriptErrors = countTypeScriptErrors(tscResult);

  // ESLint 警告・エラー
  const eslintResult = execSync('npx eslint . --format json', { encoding: 'utf8' });
  const { eslintWarnings, eslintErrors } = countEslintIssues(eslintResult);

  // コード複雑度（仮想的な実装）
  const codeComplexity = calculateCodeComplexity();

  // 重複行数（仮想的な実装）
  const duplicatedLines = calculateDuplicatedLines();

  return {
    testCoverage,
    typeScriptErrors,
    eslintWarnings,
    eslintErrors,
    codeComplexity,
    duplicatedLines,
  };
}

function extractCoveragePercentage(output: string): number {
  const match = output.match(/All files\s+\|\s+(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

function countTypeScriptErrors(output: string): number {
  const lines = output.split('\n');
  return lines.filter((line) => line.includes('error TS')).length;
}

function countEslintIssues(output: string): { eslintWarnings: number; eslintErrors: number } {
  const results = JSON.parse(output);
  let warnings = 0;
  let errors = 0;

  results.forEach((file: any) => {
    warnings += file.warningCount;
    errors += file.errorCount;
  });

  return { eslintWarnings: warnings, eslintErrors: errors };
}

function calculateCodeComplexity(): number {
  // 実際の実装では complexity-report などのツールを使用
  return 0;
}

function calculateDuplicatedLines(): number {
  // 実際の実装では jscpd などのツールを使用
  return 0;
}

// 品質レポートの生成
if (require.main === module) {
  const metrics = generateQualityReport();

  console.log('品質メトリクス:');
  console.log(`テストカバレッジ: ${metrics.testCoverage}%`);
  console.log(`TypeScript エラー: ${metrics.typeScriptErrors}`);
  console.log(`ESLint 警告: ${metrics.eslintWarnings}`);
  console.log(`ESLint エラー: ${metrics.eslintErrors}`);
  console.log(`コード複雑度: ${metrics.codeComplexity}`);
  console.log(`重複行数: ${metrics.duplicatedLines}`);

  // 品質基準のチェック
  const qualityThresholds = {
    testCoverage: 80,
    typeScriptErrors: 0,
    eslintErrors: 0,
    eslintWarnings: 10,
    codeComplexity: 10,
    duplicatedLines: 100,
  };

  const failed = Object.entries(qualityThresholds).filter(([key, threshold]) => {
    const value = metrics[key as keyof QualityMetrics];
    return key === 'testCoverage' ? value < threshold : value > threshold;
  });

  if (failed.length > 0) {
    console.error('品質基準を満たしていない項目:');
    failed.forEach(([key, threshold]) => {
      const value = metrics[key as keyof QualityMetrics];
      console.error(`- ${key}: ${value} (基準: ${threshold})`);
    });
    process.exit(1);
  } else {
    console.log('✅ すべての品質基準を満たしています');
  }
}
```
