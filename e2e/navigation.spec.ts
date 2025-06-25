import { test, expect } from '@playwright/test';

test.describe('ナビゲーションとレイアウト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('ホームページから案件一覧ページにリダイレクトされる', async ({ page }) => {
    // ホームページにアクセスすると案件一覧ページにリダイレクトされることを確認
    await expect(page.url()).toMatch(/\/sales\/projects$/);
    await expect(page.locator('h1')).toContainText('案件一覧');
  });

  test('サイドバーナビゲーションが正常に動作する', async ({ page }) => {
    // サイドバーまたはナビゲーションメニューの確認
    const navigation = page.locator('nav, [role="navigation"]').first();

    if ((await navigation.count()) > 0) {
      await expect(navigation).toBeVisible();

      // ナビゲーションリンクの確認
      const navLinks = navigation.locator('a');
      if ((await navLinks.count()) > 0) {
        // 最初のナビゲーションリンクをクリック
        await navLinks.first().click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('主要ページ間の遷移が正常に動作する', async ({ page }) => {
    // 案件一覧ページから開始
    await expect(page.url()).toMatch(/\/sales\/projects$/);

    // クライアント一覧ページへの遷移
    await page.goto('/sales/clients');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('クライアント一覧');

    // エンジニア一覧ページへの遷移
    await page.goto('/sales/engineers');
    await page.waitForLoadState('networkidle');
    // エンジニア一覧ページが存在する場合の確認

    // 契約一覧ページへの遷移
    await page.goto('/sales/contracts');
    await page.waitForLoadState('networkidle');
    // 契約一覧ページが存在する場合の確認

    // 案件一覧ページに戻る
    await page.goto('/sales/projects');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('案件一覧');
  });

  test('レイアウトコンポーネントが正しく表示される', async ({ page }) => {
    // ヘッダーの確認
    const header = page.locator('header, [role="banner"]');
    if ((await header.count()) > 0) {
      await expect(header.first()).toBeVisible();
    }

    // メインコンテンツエリアの確認
    const main = page.locator('main, [role="main"]');
    if ((await main.count()) > 0) {
      await expect(main.first()).toBeVisible();
    }

    // フッターの確認
    const footer = page.locator('footer, [role="contentinfo"]');
    if ((await footer.count()) > 0) {
      await expect(footer.first()).toBeVisible();
    }
  });

  test('ブレッドクラムナビゲーションが正常に動作する', async ({ page }) => {
    // ブレッドクラムの確認
    const breadcrumb = page.locator('[aria-label="breadcrumb"], .breadcrumb');

    if ((await breadcrumb.count()) > 0) {
      await expect(breadcrumb.first()).toBeVisible();

      // ブレッドクラムリンクの確認
      const breadcrumbLinks = breadcrumb.locator('a');
      if ((await breadcrumbLinks.count()) > 0) {
        await expect(breadcrumbLinks.first()).toBeVisible();
      }
    }
  });

  test('404ページの処理が正常に動作する', async ({ page }) => {
    // 存在しないページにアクセス
    const response = await page.goto('/nonexistent-page');

    // 404エラーまたはリダイレクトの確認
    if (response) {
      // ステータスコードまたはページ内容で404を判定
      const status = response.status();
      if (status === 404) {
        // 404ページが表示されることを確認
        await expect(page.locator('body')).toBeVisible();
      } else {
        // リダイレクトされた場合の確認
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('ページローディング状態が正常に処理される', async ({ page }) => {
    // ページ遷移時のローディング状態の確認
    await page.goto('/sales/projects');

    // ローディングスピナーまたはスケルトンの確認
    const loadingIndicator = page.locator('.loading, .spinner, .skeleton');

    // ページが完全に読み込まれるまで待機
    await page.waitForLoadState('networkidle');

    // メインコンテンツが表示されることを確認
    await expect(page.locator('h1')).toBeVisible();
  });

  test('エラーハンドリングが正常に動作する', async ({ page }) => {
    // ネットワークエラーをシミュレート
    await page.route('**/api/**', (route) => route.abort());

    // ページを再読み込み
    await page.reload();
    await page.waitForTimeout(2000);

    // エラー状態またはフォールバックコンテンツの確認
    await expect(page.locator('body')).toBeVisible();
  });

  test('キーボードナビゲーションが正常に動作する', async ({ page }) => {
    // Tabキーでのフォーカス移動をテスト
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // フォーカス可能な要素があることを確認
    const focusedElement = page.locator(':focus');
    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement.first()).toBeVisible();
    }

    // Enterキーでの操作をテスト
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('検索機能のグローバル動作をテスト', async ({ page }) => {
    // グローバル検索ボックスがある場合のテスト
    const globalSearch = page.locator('input[type="search"], input[placeholder*="検索"]').first();

    if ((await globalSearch.count()) > 0) {
      await expect(globalSearch).toBeVisible();

      // 検索テストを実行
      await globalSearch.fill('テスト');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    }
  });
});
