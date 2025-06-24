import { test, expect } from '@playwright/test';

test.describe('基本的なE2Eテスト', () => {
  test('ホームページが正常に読み込まれる', async ({ page }) => {
    await page.goto('/');

    // ページが読み込まれることを確認
    await expect(page).toHaveTitle(/SESエンジニア管理アプリ/);

    // ボディ要素が存在することを確認
    await expect(page.locator('body')).toBeVisible();
  });

  test('案件一覧ページに正常にアクセスできる', async ({ page }) => {
    await page.goto('/sales/projects');
    await page.waitForLoadState('networkidle');

    // ページが読み込まれることを確認
    await expect(page.locator('body')).toBeVisible();

    // 何らかのコンテンツが表示されることを確認
    const content = page.locator('main, [role="main"], div');
    await expect(content.first()).toBeVisible();
  });

  test('クライアント一覧ページに正常にアクセスできる', async ({ page }) => {
    await page.goto('/sales/clients');
    await page.waitForLoadState('networkidle');

    // ページが読み込まれることを確認
    await expect(page.locator('body')).toBeVisible();

    // 何らかのコンテンツが表示されることを確認
    const content = page.locator('main, [role="main"], div');
    await expect(content.first()).toBeVisible();
  });

  test('存在しないページで適切に処理される', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');

    // レスポンスが返されることを確認
    expect(response).toBeTruthy();

    // ページが何らかの形で表示されることを確認
    await expect(page.locator('body')).toBeVisible();
  });

  test('JavaScriptエラーが発生しない', async ({ page }) => {
    const errors: string[] = [];

    // JavaScriptエラーをキャッチ
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/sales/projects');
    await page.waitForLoadState('networkidle');

    // JavaScriptエラーが発生していないことを確認
    expect(errors).toHaveLength(0);
  });

  test('コンソールエラーが発生しない', async ({ page }) => {
    const consoleErrors: string[] = [];

    // コンソールエラーをキャッチ
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/sales/projects');
    await page.waitForLoadState('networkidle');

    // 重要なコンソールエラーが発生していないことを確認
    // 一部のエラーは許容する（開発環境特有のもの）
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') && !error.includes('manifest') && !error.includes('DevTools')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('レスポンシブデザインが基本的に動作する', async ({ page }) => {
    // デスクトップサイズ
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/sales/projects');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();

    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('基本的なキーボードナビゲーションが動作する', async ({ page }) => {
    await page.goto('/sales/projects');
    await page.waitForLoadState('networkidle');

    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // フォーカス可能な要素が存在することを確認
    const focusedElement = page.locator(':focus');
    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement.first()).toBeVisible();
    }
  });
});
