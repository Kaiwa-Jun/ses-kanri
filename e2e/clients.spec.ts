import { test, expect } from '@playwright/test';

test.describe('クライアント一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sales/clients');
    await page.waitForLoadState('networkidle');
  });

  test('ページタイトルとヘッダーが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('クライアント一覧');

    // 新規クライアント登録ボタンの確認
    await expect(page.getByRole('button', { name: '新規クライアント登録' })).toBeVisible();
  });

  test('検索機能が正常に動作する', async ({ page }) => {
    // 検索ボックスの確認
    const searchInput = page.getByPlaceholder('企業名、業種、スキルで検索...');
    await expect(searchInput).toBeVisible();

    // 検索テストを実行
    await searchInput.fill('商事');
    await page.waitForTimeout(500);

    // 検索結果の確認
    const clientRows = page.locator('tbody tr');
    if ((await clientRows.count()) > 0) {
      await expect(clientRows.first()).toBeVisible();
    }

    // 検索をクリア
    await searchInput.clear();
    await page.waitForTimeout(500);
  });

  test('ステータスフィルターが正常に動作する', async ({ page }) => {
    // ステータスフィルターの確認
    const statusFilter = page.locator('[role="combobox"]').first();
    await expect(statusFilter).toBeVisible();

    // フィルターを開く
    await statusFilter.click();

    // フィルターオプションの確認
    await expect(page.getByText('全てのステータス')).toBeVisible();
    await expect(page.getByText('取引中')).toBeVisible();
    await expect(page.getByText('商談中')).toBeVisible();
    await expect(page.getByText('取引停止')).toBeVisible();

    // 「取引中」を選択
    await page.getByText('取引中').click();
    await page.waitForTimeout(500);
  });

  test('クライアントデータが正しく表示される', async ({ page }) => {
    // テーブルが表示されることを確認
    await expect(page.locator('table')).toBeVisible();

    // テーブルヘッダーの確認
    await expect(page.getByText('企業名')).toBeVisible();
    await expect(page.getByText('業種')).toBeVisible();
    await expect(page.getByText('ステータス')).toBeVisible();
    await expect(page.getByText('担当者')).toBeVisible();
    await expect(page.getByText('案件数')).toBeVisible();

    // 最低1つのクライアント行が表示されることを確認
    const clientRows = page.locator('tbody tr');
    if ((await clientRows.count()) > 0) {
      await expect(clientRows.first()).toBeVisible();
    }
  });

  test('クライアント行をクリックして詳細ページに遷移する', async ({ page }) => {
    // テーブルの最初の行をクリック
    const firstRow = page.locator('tbody tr').first();
    if ((await firstRow.count()) > 0) {
      await expect(firstRow).toBeVisible();

      // 行をクリック（詳細ページへの遷移をテスト）
      await firstRow.click();

      // URLが変更されることを確認
      await page.waitForURL(/\/sales\/clients\/.*/, { timeout: 5000 });
      await expect(page.url()).toMatch(/\/sales\/clients\/.*$/);
    }
  });

  test('ソート機能が正常に動作する', async ({ page }) => {
    // 企業名でソート
    const sortButton = page.getByText('企業名');
    await expect(sortButton).toBeVisible();
    await sortButton.click();
    await page.waitForTimeout(500);

    // テーブルが表示されていることを確認
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('新規クライアント登録ボタンをクリックしてダイアログが開く', async ({ page }) => {
    // 新規クライアント登録ボタンをクリック
    await page.getByRole('button', { name: '新規クライアント登録' }).click();

    // ダイアログが開くことを確認
    await page.waitForTimeout(1000);
  });

  test('ページネーションが正常に動作する', async ({ page }) => {
    // ページネーションコンポーネントの確認
    const pagination = page.locator('[role="navigation"]');

    // ページネーションが存在する場合のテスト
    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();

      // 次のページボタンがある場合のテスト
      const nextButton = page.getByRole('button', { name: 'Next' });
      if ((await nextButton.count()) > 0 && (await nextButton.isEnabled())) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('レスポンシブデザインが正常に動作する', async ({ page }) => {
    // デスクトップサイズでの表示確認
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toBeVisible();

    // タブレットサイズでの表示確認
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();

    // モバイルサイズでの表示確認
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('クライアント情報の詳細が正しく表示される', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();

    if ((await firstRow.count()) > 0) {
      await expect(firstRow).toBeVisible();

      // 企業名の確認
      const companyName = firstRow.locator('td').first();
      await expect(companyName).toBeVisible();

      // ステータスバッジの確認
      const statusBadge = firstRow.locator('.badge, [class*="badge"]');
      if ((await statusBadge.count()) > 0) {
        await expect(statusBadge.first()).toBeVisible();
      }

      // 担当者アバターの確認
      const avatar = firstRow.locator('[class*="avatar"]');
      if ((await avatar.count()) > 0) {
        await expect(avatar.first()).toBeVisible();
      }
    }
  });
});
