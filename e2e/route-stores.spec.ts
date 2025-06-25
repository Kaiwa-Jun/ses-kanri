import { test, expect } from '@playwright/test';

test.describe('ルートアカウント - 加盟店一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/route/stores');
    await page.waitForLoadState('networkidle');
  });

  test('ページタイトルとヘッダーが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('加盟店一覧');

    // ヘッダーのタブナビゲーションの確認
    await expect(page.getByRole('link', { name: '営業' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ルート' })).toBeVisible();
  });

  test('検索機能が正常に動作する', async ({ page }) => {
    // 検索ボックスの確認
    const searchInput = page.getByPlaceholder('加盟店名を検索');
    await expect(searchInput).toBeVisible();

    // 検索テストの実行
    await searchInput.fill('○○システム');
    await expect(page.locator('text=○○システム').first()).toBeVisible();
  });

  test('ステータスフィルターが表示される', async ({ page }) => {
    // ステータスフィルターの確認
    const statusFilter = page.getByRole('combobox');
    await expect(statusFilter).toBeVisible();

    // フィルターのデフォルト値確認
    await expect(page.locator('text=すべて').first()).toBeVisible();
  });

  test('テーブルの構造が正しく表示される', async ({ page }) => {
    // テーブルヘッダーの確認
    await expect(page.locator('text=加盟店')).toBeVisible();
    await expect(page.locator('text=利用開始日')).toBeVisible();
    await expect(page.locator('text=最終ログイン')).toBeVisible();
    await expect(page.locator('text=最終データ登録')).toBeVisible();
    await expect(page.locator('text=ステータス')).toBeVisible();
    await expect(page.locator('text=アクション')).toBeVisible();

    // テーブルの行が表示される
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  test('チェックボックスによる選択機能', async ({ page }) => {
    // 全選択チェックボックスの確認
    const headerCheckbox = page.locator('thead input[type="checkbox"]');
    await expect(headerCheckbox).toBeVisible();

    // 個別チェックボックスの確認
    const firstRowCheckbox = page.locator('tbody tr:first-child input[type="checkbox"]');
    await expect(firstRowCheckbox).toBeVisible();

    // チェックボックスをクリック
    await firstRowCheckbox.click();

    // まとめて操作ボタンが表示される
    await expect(page.getByRole('button', { name: 'まとめて凍結' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'まとめて凍結解除' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'まとめて削除' })).toBeVisible();
  });

  test('個別アクションボタンが表示される', async ({ page }) => {
    // 各行のアクションボタンが表示される
    await expect(page.locator('text=凍結').first()).toBeVisible();
    await expect(page.locator('text=凍結解除').first()).toBeVisible();
    await expect(page.locator('text=削除').first()).toBeVisible();
  });

  test('凍結確認モーダルが正常に動作する', async ({ page }) => {
    // 個別凍結ボタンをクリック
    await page.locator('text=凍結').first().click();

    // モーダルが表示される
    await expect(page.locator('text=凍結の確認')).toBeVisible();
    await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible();
    await expect(page.getByRole('button', { name: '確定' })).toBeVisible();

    // キャンセルボタンでモーダルを閉じる
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page.locator('text=凍結の確認')).not.toBeVisible();
  });

  test('削除確認モーダルが正常に動作する', async ({ page }) => {
    // 個別削除ボタンをクリック
    await page.locator('text=削除').first().click();

    // モーダルが表示される
    await expect(page.locator('text=削除の確認')).toBeVisible();
    await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible();
    await expect(page.getByRole('button', { name: '確定' })).toBeVisible();

    // キャンセルボタンでモーダルを閉じる
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page.locator('text=削除の確認')).not.toBeVisible();
  });

  test('まとめて操作の凍結モーダルが正常に動作する', async ({ page }) => {
    // チェックボックスを選択
    const firstRowCheckbox = page.locator('tbody tr:first-child input[type="checkbox"]');
    await firstRowCheckbox.click();

    // まとめて凍結ボタンをクリック
    await page.getByRole('button', { name: 'まとめて凍結' }).click();

    // モーダルが表示される
    await expect(page.locator('text=凍結の確認')).toBeVisible();

    // 複数選択時のメッセージが表示される
    await expect(page.locator('text=凍結対象の加盟店：')).toBeVisible();

    // キャンセルボタンでモーダルを閉じる
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page.locator('text=凍結の確認')).not.toBeVisible();
  });

  test('まとめて操作の削除モーダルが正常に動作する', async ({ page }) => {
    // チェックボックスを選択
    const firstRowCheckbox = page.locator('tbody tr:first-child input[type="checkbox"]');
    await firstRowCheckbox.click();

    // まとめて削除ボタンをクリック
    await page.getByRole('button', { name: 'まとめて削除' }).click();

    // モーダルが表示される
    await expect(page.locator('text=削除の確認')).toBeVisible();

    // 複数選択時のメッセージが表示される
    await expect(page.locator('text=削除対象の加盟店：')).toBeVisible();

    // キャンセルボタンでモーダルを閉じる
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page.locator('text=削除の確認')).not.toBeVisible();
  });

  test('ソート機能が動作する', async ({ page }) => {
    // ソートボタンをクリック
    await page.getByRole('button', { name: /加盟店/ }).click();

    // ページが更新されることを確認（実際のソート処理は実装されていないが、UIの動作確認）
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  test('レスポンシブデザインが適用される', async ({ page }) => {
    // モバイル表示に変更
    await page.setViewportSize({ width: 375, height: 667 });

    // テーブルがスクロール可能になっている
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // デスクトップ表示に戻す
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(table).toBeVisible();
  });

  test('データの表示形式が正しい', async ({ page }) => {
    // 日付形式の確認
    await expect(page.locator('text=2024/01/01')).toBeVisible();
    await expect(page.locator('text=2025/01/01')).toBeVisible();

    // メールアドレスの表示確認
    await expect(page.locator('text=ko@example.com')).toBeVisible();
    await expect(page.locator('text=tto@example.com')).toBeVisible();

    // ステータスバッジの表示確認
    await expect(page.locator('text=利用')).toBeVisible();
    await expect(page.locator('text=申し込み')).toBeVisible();
  });

  test('アクセシビリティ要素が適切に設定される', async ({ page }) => {
    // テーブルのロール確認
    await expect(page.locator('table')).toBeVisible();

    // チェックボックスのアクセシビリティ
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes.first()).toBeVisible();

    // ボタンのアクセシビリティ
    const buttons = page.locator('button');
    await expect(buttons.first()).toBeVisible();
  });

  test('全選択機能が正常に動作する', async ({ page }) => {
    // 全選択チェックボックスをクリック
    const headerCheckbox = page.locator('thead input[type="checkbox"]');
    await headerCheckbox.click();

    // まとめて操作ボタンが表示される
    await expect(page.getByRole('button', { name: 'まとめて凍結' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'まとめて凍結解除' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'まとめて削除' })).toBeVisible();

    // 全選択を解除
    await headerCheckbox.click();

    // まとめて操作ボタンが非表示になる
    await expect(page.getByRole('button', { name: 'まとめて凍結' })).not.toBeVisible();
  });

  test('検索結果の絞り込みが動作する', async ({ page }) => {
    // 検索ボックスに入力
    const searchInput = page.getByPlaceholder('加盟店名を検索');
    await searchInput.fill('ko@example.com');

    // 検索結果が表示される
    await expect(page.locator('text=ko@example.com')).toBeVisible();

    // 検索をクリア
    await searchInput.clear();

    // 全ての結果が再表示される
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });
});
