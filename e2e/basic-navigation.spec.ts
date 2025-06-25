import { test, expect } from '@playwright/test';

test.describe('基本ナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    // Next.js 15のハイドレーション対応のため、少し待機
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  });

  test('ホームページが正常に表示される', async ({ page }) => {
    // ページタイトルを確認
    await expect(page).toHaveTitle(/SESエンジニア管理アプリ/);

    // メインコンテンツが表示されることを確認（hidden属性がないことを確認）
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
    await expect(mainContent).not.toHaveAttribute('hidden');
  });

  test('ナビゲーションメニューが動作する', async ({ page }) => {
    // 営業メニューがクリック可能であることを確認
    const salesLink = page.locator('a').filter({ hasText: '営業' }).first();
    await expect(salesLink).toBeVisible();

    // クリックして遷移
    await salesLink.click();
    await page.waitForLoadState('networkidle');

    // URLが変更されたことを確認
    expect(page.url()).toContain('/sales');
  });

  test('ログイン画面への遷移', async ({ page }) => {
    // ログインボタンまたはリンクを探す
    const loginElement = page
      .locator('button, a')
      .filter({ hasText: /ログイン|サインイン/ })
      .first();

    if (await loginElement.isVisible()) {
      await loginElement.click();
      await page.waitForLoadState('networkidle');

      // ログイン関連のフォーム要素が表示されることを確認
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      await expect(emailInput).toBeVisible();
    } else {
      // ログイン要素が見つからない場合はスキップ
      test.skip();
    }
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // デスクトップサイズ
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // モバイルでもメインコンテンツが表示される
    await expect(mainContent).toBeVisible();
  });
});
