# テスト実装ガイドライン

## テスト戦略

### テストピラミッド

```
     E2E Tests (Playwright)
    ────────────────────────
   Integration Tests (Jest)
  ──────────────────────────
 Unit Tests (Jest + RTL)
────────────────────────────
```

### テスト種別と責任範囲

- **ユニットテスト（Jest + React Testing Library）**: コンポーネント、関数、フック単体のテスト
- **統合テスト（Jest + MSW）**: API連携を含むコンポーネント間のテスト
- **E2Eテスト（Playwright）**: ユーザーシナリオに基づく画面操作テスト

## Jest + React Testing Library（ユニットテスト）

### 必須設定

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

```typescript
// jest.setup.js
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './src/mocks/handlers';

// MSWサーバーセットアップ
export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### テストファイル命名規則

```
プロジェクトルート/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── __tests__/
│   │       ├── button.test.tsx
│   │       ├── badge.test.tsx
│   │       └── card.test.tsx
│   └── layout/
│       ├── Header.tsx
│       └── __tests__/
│           └── Header.test.tsx
├── hooks/
│   ├── use-toast.ts
│   ├── useUsers.ts
│   └── __tests__/
│       ├── use-toast.test.ts
│       └── useUsers.test.ts
└── lib/
    ├── utils.ts
    ├── api/
    │   ├── users.ts
    │   └── __tests__/
    │       └── users.test.ts
    └── __tests__/
        └── utils.test.ts
```

**重要**: 各ディレクトリ内に`__tests__`フォルダを配置することで、関連するファイルとテストファイルを近くに配置し、保守性を向上させます。

### コンポーネントテストのベストプラクティス

```typescript
// ✅ 良いテスト例
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  const defaultProps = {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'engineer' as const,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<UserCard {...defaultProps} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('engineer')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserCard {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /編集/i }));

    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultProps.user);
  });

  it('shows confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserCard {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /削除/i }));

    expect(screen.getByText(/削除してもよろしいですか/)).toBeInTheDocument();
  });
});
```

### カスタムフックテスト

```typescript
// hooks/__tests__/use-toast.test.ts
import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '../use-toast';

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('初期状態では空のtoasts配列を返す', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it('toastを追加できる', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'テストタイトル',
        description: 'テスト説明',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('テストタイトル');
    expect(result.current.toasts[0].description).toBe('テスト説明');
    expect(result.current.toasts[0].open).toBe(true);
  });

  it('toastを手動で削除できる', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'テストtoast' });
    });

    expect(result.current.toasts).toHaveLength(1);
    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });
});

describe('reducer', () => {
  const initialState = { toasts: [] };

  it('ADD_TOASTアクションでtoastを追加する', () => {
    const toast = {
      id: '1',
      title: 'テスト',
      open: true,
    };

    const newState = reducer(initialState, {
      type: 'ADD_TOAST',
      toast,
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0]).toEqual(toast);
  });

  it('DISMISS_TOASTアクションでtoastを非表示にする', () => {
    const initialStateWithToast = {
      toasts: [
        {
          id: '1',
          title: 'テスト',
          open: true,
        },
      ],
    };

    const newState = reducer(initialStateWithToast, {
      type: 'DISMISS_TOAST',
      toastId: '1',
    });

    expect(newState.toasts[0].open).toBe(false);
  });
});

// hooks/__tests__/useUsers.test.ts (API連携フックの例)
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '../useUsers';

describe('useUsers', () => {
  it('fetches users successfully', async () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('handles error state', async () => {
    // MSWでエラーレスポンスを設定
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server Error' }));
      })
    );

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.users).toEqual([]);
  });
});
```

### MSWを使用したAPIモック

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'engineer',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'sales',
          },
        ],
        status: 'success',
      })
    );
  }),

  rest.post('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: '3',
          name: 'New User',
          email: 'new@example.com',
          role: 'engineer',
        },
        status: 'success',
      })
    );
  }),

  rest.delete('/api/users/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'User deleted successfully',
        status: 'success',
      })
    );
  }),
];
```

## Playwright（E2Eテスト）

### 基本設定

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Object Modelパターン

```typescript
// e2e/pages/UserManagementPage.ts
import { Page, Locator } from '@playwright/test';

export class UserManagementPage {
  readonly page: Page;
  readonly createUserButton: Locator;
  readonly userCards: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createUserButton = page.locator('[data-testid="create-user-button"]');
    this.userCards = page.locator('[data-testid="user-card"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/users');
  }

  async createUser(userData: { name: string; email: string; role: string }): Promise<void> {
    await this.createUserButton.click();

    const dialog = this.page.locator('[data-testid="user-dialog"]');
    await dialog.locator('[data-testid="name-input"]').fill(userData.name);
    await dialog.locator('[data-testid="email-input"]').fill(userData.email);
    await dialog.locator('[data-testid="role-select"]').selectOption(userData.role);
    await dialog.locator('[data-testid="submit-button"]').click();
  }

  async searchUsers(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async getUserCard(name: string): Promise<Locator> {
    return this.userCards.filter({ hasText: name });
  }

  async deleteUser(name: string): Promise<void> {
    const userCard = await this.getUserCard(name);
    await userCard.locator('[data-testid="delete-button"]').click();
    await this.page.locator('[data-testid="confirm-delete"]').click();
  }
}
```

### E2Eテストのベストプラクティス

```typescript
// e2e/user-management.spec.ts
import { test, expect } from '@playwright/test';
import { UserManagementPage } from './pages/UserManagementPage';

test.describe('User Management', () => {
  let userPage: UserManagementPage;

  test.beforeEach(async ({ page }) => {
    userPage = new UserManagementPage(page);
    await userPage.goto();
  });

  test('should create a new user', async ({ page }) => {
    const userData = {
      name: 'E2E Test User',
      email: 'e2e@example.com',
      role: 'engineer',
    };

    await userPage.createUser(userData);

    // 成功メッセージの確認
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();

    // ユーザーカードが表示されることを確認
    const userCard = await userPage.getUserCard(userData.name);
    await expect(userCard).toBeVisible();
    await expect(userCard).toContainText(userData.email);
  });

  test('should search users', async ({ page }) => {
    await userPage.searchUsers('engineer');

    // 検索結果の確認
    const userCards = userPage.userCards;
    await expect(userCards).toHaveCount(2);

    // 各カードにengineerが含まれることを確認
    const cards = await userCards.all();
    for (const card of cards) {
      await expect(card).toContainText('engineer');
    }
  });

  test('should delete user', async ({ page }) => {
    const userName = 'Test User';

    await userPage.deleteUser(userName);

    // 削除成功メッセージの確認
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('削除されました');

    // ユーザーカードが消えていることを確認
    const userCard = await userPage.getUserCard(userName);
    await expect(userCard).not.toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    await userPage.createUserButton.click();

    const dialog = page.locator('[data-testid="user-dialog"]');

    // 空の状態で送信
    await dialog.locator('[data-testid="submit-button"]').click();

    // バリデーションエラーの確認
    await expect(dialog.locator('[data-testid="name-error"]')).toContainText('名前は必須です');
    await expect(dialog.locator('[data-testid="email-error"]')).toContainText(
      'メールアドレスは必須です'
    );
  });
});
```

### APIテスト（Playwright）

```typescript
// e2e/api/users.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test('should perform CRUD operations', async ({ request }) => {
    // Create
    const newUser = {
      name: 'API Test User',
      email: 'api@example.com',
      role: 'engineer',
      skills: ['typescript', 'react'],
      experienceYears: 3,
      isActive: true,
    };

    const createResponse = await request.post('/api/users', {
      data: newUser,
    });
    expect(createResponse.ok()).toBeTruthy();

    const createdUser = await createResponse.json();
    const userId = createdUser.data.id;

    // Read
    const getResponse = await request.get(`/api/users/${userId}`);
    expect(getResponse.ok()).toBeTruthy();

    const userData = await getResponse.json();
    expect(userData.data.name).toBe(newUser.name);
    expect(userData.data.email).toBe(newUser.email);

    // Update
    const updateData = { name: 'Updated API Test User' };
    const updateResponse = await request.put(`/api/users/${userId}`, {
      data: updateData,
    });
    expect(updateResponse.ok()).toBeTruthy();

    // Verify update
    const updatedResponse = await request.get(`/api/users/${userId}`);
    const updatedUser = await updatedResponse.json();
    expect(updatedUser.data.name).toBe(updateData.name);

    // Delete
    const deleteResponse = await request.delete(`/api/users/${userId}`);
    expect(deleteResponse.ok()).toBeTruthy();

    // Verify deletion
    const deletedResponse = await request.get(`/api/users/${userId}`);
    expect(deletedResponse.status()).toBe(404);
  });

  test('should handle validation errors', async ({ request }) => {
    const invalidUser = {
      name: '', // 空の名前
      email: 'invalid-email', // 無効なメール
      role: 'invalid-role', // 無効な役割
    };

    const response = await request.post('/api/users', {
      data: invalidUser,
    });

    expect(response.status()).toBe(400);

    const errorData = await response.json();
    expect(errorData.errors).toBeDefined();
    expect(errorData.errors.name).toContain('名前は必須です');
    expect(errorData.errors.email).toContain('有効なメールアドレスを入力してください');
  });
});
```

## テスト実行・CI/CD統合

### NPMスクリプト

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2 --bail=1",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test && npm run test:e2e",
    "pre-push": "npm run lint && npm run type-check && npm run format:check && npm run test:ci"
  }
}
```

**スクリプト説明**:

- `test:ci`: CI環境向けの最適化されたテスト実行（カバレッジ付き、並列実行制限、初回失敗で停止）
- `pre-push`: Git push前の品質チェック（Lint、型チェック、フォーマットチェック、テスト実行）

### GitHub Actions統合

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm run test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## テスト運用ガイドライン

### Pre-pushフックの運用方針

現在の設定では、`git push`時に以下のチェックが自動実行されます：

1. **Lintチェック** (`npm run lint`)
2. **TypeScript型チェック** (`npm run type-check`)
3. **フォーマットチェック** (`npm run format:check`)
4. **ユニットテスト** (`npm run test:ci`)
5. **基本E2Eテスト** (`npm run e2e:basic`) - 約16秒

#### E2Eテストの柔軟な制御

```bash
# 通常のpush（全チェック実行）
git push

# E2Eテストをスキップしたい場合
SKIP_E2E=true git push

# 手動で全テスト実行
npm run pre-push:full
```

### 今後の調整指針

#### 📈 プロジェクト成長に応じた段階的調整

**フェーズ1: 現在（開発初期）**

- ✅ 基本E2EテストをPre-pushに含める（16秒程度）
- ✅ スキップオプションで柔軟性を確保
- ✅ 重要な機能の回帰防止を優先

**フェーズ2: チーム拡大時**

- E2Eテスト実行時間が1分を超えたらスキップをデフォルトに変更
- 重要な機能（認証、決済など）のみをPre-pushに残す
- CI/CDで包括的なテストを実行

**フェーズ3: 大規模運用時**

- テスト分類を細分化（smoke, regression, full）
- 並列実行による高速化
- テスト結果のキャッシュ活用

#### 🔄 継続的改善のチェックポイント

**月次レビュー項目**:

- [ ] Pre-push実行時間の測定（目標: 2分以内）
- [ ] テスト失敗率の分析
- [ ] 開発者フィードバックの収集
- [ ] カバレッジ目標の見直し

**調整トリガー**:

- Pre-push時間が3分を超える → E2Eテストのスキップ化検討
- テスト失敗率が20%を超える → テストの安定性改善
- 開発者からスキップ要求が頻発 → 設定見直し

#### 🎯 品質と効率のバランス調整

**品質重視の場合**:

```bash
# .husky/pre-push（厳格版）
npm run lint && npm run type-check && npm run format:check && npm run test:ci && npm run e2e
```

**効率重視の場合**:

```bash
# .husky/pre-push（高速版）
npm run lint && npm run type-check && npm run test:ci
# E2EテストはCI/CDのみで実行
```

#### 📊 メトリクス監視

定期的に以下を監視し、設定を調整：

1. **実行時間メトリクス**

   - Pre-push平均実行時間
   - E2Eテスト実行時間の推移
   - 開発者の待機時間

2. **品質メトリクス**

   - テストカバレッジ率
   - 本番環境でのバグ発生率
   - 回帰バグの検出率

3. **開発効率メトリクス**
   - 1日あたりのpush回数
   - テストスキップ使用頻度
   - 開発者満足度

#### 🛠️ 設定変更の手順

**E2Eテストをデフォルトでスキップに変更する場合**:

```bash
# .husky/pre-push を以下に変更
if [ "$RUN_E2E" = "true" ]; then
  echo "🌐 基本E2Eテスト実行..."
  npm run e2e:basic
else
  echo "⏭️  E2Eテストをスキップしました（RUN_E2E=true で実行可能）"
fi
```

**重要な機能のみのE2Eテストに限定する場合**:

```bash
# package.json に追加
"e2e:critical": "playwright test --grep='@critical'"

# .husky/pre-push で使用
npm run e2e:critical
```

### チーム運用のベストプラクティス

1. **設定変更は必ずチーム合意を取る**
2. **変更前後のメトリクスを比較測定**
3. **段階的な導入（1週間トライアル → 本格運用）**
4. **定期的な振り返りとフィードバック収集**

---

**💡 重要**: この運用ガイドラインは生きた文書です。プロジェクトの成長とチームの状況に応じて継続的に更新してください。
