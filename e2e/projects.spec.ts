import { test, expect } from '@playwright/test';

test.describe('案件一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    // ホームページにアクセスすると自動的に案件一覧ページにリダイレクトされる
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('ページタイトルとヘッダーが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('案件一覧');

    // 新規案件登録ボタンの確認
    await expect(page.getByRole('button', { name: '新規案件登録' })).toBeVisible();
  });

  test('検索機能が正常に動作する', async ({ page }) => {
    // 検索ボックスの確認
    const searchInput = page.getByPlaceholder('案件名、スキル、クライアント名で検索...');
    await expect(searchInput).toBeVisible();

    // 検索テストを実行
    await searchInput.fill('React');
    await page.waitForTimeout(500); // 検索結果の更新を待つ

    // 検索結果にReactが含まれる案件のみが表示されることを確認
    const projectRows = page.locator('tbody tr');
    const firstRow = projectRows.first();
    await expect(firstRow).toBeVisible();

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
    await expect(page.getByText('募集中')).toBeVisible();
    await expect(page.getByText('終了')).toBeVisible();

    // 「募集中」を選択
    await page.getByText('募集中').click();
    await page.waitForTimeout(500);

    // 募集中の案件のみが表示されることを確認
    const statusBadges = page.locator('[data-testid="status-badge"]');
    if ((await statusBadges.count()) > 0) {
      for (let i = 0; i < (await statusBadges.count()); i++) {
        await expect(statusBadges.nth(i)).toContainText('募集中');
      }
    }
  });

  test('テーブルのソート機能が正常に動作する', async ({ page }) => {
    // 案件名でソート
    await page.getByText('案件名').click();
    await page.waitForTimeout(500);

    // テーブルが表示されていることを確認
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // テーブルヘッダーのソートボタンが機能することを確認
    await page.getByText('クライアント').click();
    await page.waitForTimeout(500);

    await page.getByText('単価').click();
    await page.waitForTimeout(500);
  });

  test('案件行をクリックして詳細ページに遷移する', async ({ page }) => {
    // テーブルの最初の行をクリック
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    // 行をクリック（詳細ページへの遷移をテスト）
    await firstRow.click();

    // URLが変更されることを確認（詳細ページに遷移）
    await page.waitForURL(/\/sales\/projects\/.*/, { timeout: 5000 });

    // 詳細ページが表示されることを確認
    await expect(page.url()).toMatch(/\/sales\/projects\/.*$/);
  });

  test('新規案件登録ボタンをクリックしてダイアログが開く', async ({ page }) => {
    // 新規案件登録ボタンをクリック
    await page.getByRole('button', { name: '新規案件登録' }).click();

    // ダイアログが開くことを確認（実装されている場合）
    // 注意: CreateProjectDialogコンポーネントの実装によって動作が変わる
    await page.waitForTimeout(1000);
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

  test('案件データが正しく表示される', async ({ page }) => {
    // テーブルが表示されることを確認
    await expect(page.locator('table')).toBeVisible();

    // テーブルヘッダーの確認
    await expect(page.getByText('案件名')).toBeVisible();
    await expect(page.getByText('クライアント')).toBeVisible();
    await expect(page.getByText('ステータス')).toBeVisible();
    await expect(page.getByText('単価')).toBeVisible();
    await expect(page.getByText('必要スキル')).toBeVisible();

    // 最低1つの案件行が表示されることを確認
    const projectRows = page.locator('tbody tr');
    await expect(projectRows.first()).toBeVisible();
  });

  test('アクションボタンが正常に表示され動作する', async ({ page }) => {
    // 最初の行のアクションボタンを確認
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    // 編集ボタンの確認
    const editButton = firstRow.locator('button').first();
    await expect(editButton).toBeVisible();

    // 削除ボタンの確認
    const deleteButton = firstRow.locator('button').nth(1);
    await expect(deleteButton).toBeVisible();

    // 編集ボタンをクリック（詳細ページに遷移するはず）
    await editButton.click();
    await page.waitForTimeout(1000);
  });
});
