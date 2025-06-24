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
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
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
src/
├── components/
│   ├── UserCard.tsx
│   └── __tests__/
│       └── UserCard.test.tsx
├── hooks/
│   ├── useUsers.ts
│   └── __tests__/
│       └── useUsers.test.ts
└── lib/
    ├── api/
    │   ├── users.ts
    │   └── __tests__/
    │       └── users.test.ts
```

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
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

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
      - run: npm run test:coverage

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
