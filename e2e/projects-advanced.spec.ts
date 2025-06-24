import { test, expect } from '@playwright/test';

test.describe('案件一覧ページ - 高度なテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sales/projects');
    await page.waitForLoadState('networkidle');
  });

  test('ページ構造とレイアウトが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('案件一覧');

    // 新規案件登録ボタンの確認
    const createButton = page.getByRole('button', { name: '新規案件登録' });
    await expect(createButton).toBeVisible();

    // 検索ボックスの確認
    const searchInput = page.getByPlaceholder('案件名、スキル、クライアント名で検索...');
    await expect(searchInput).toBeVisible();

    // ステータスフィルターの確認
    const statusFilter = page
      .locator('[data-testid="status-filter"], .flex.items-center.gap-2:has-text("ステータス")')
      .first();
    if ((await statusFilter.count()) > 0) {
      await expect(statusFilter).toBeVisible();
    }

    // テーブルヘッダーの確認
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText('案件名')).toBeVisible();
    await expect(page.getByText('クライアント')).toBeVisible();
    await expect(page.getByText('ステータス')).toBeVisible();
  });

  test('検索機能が正常に動作する', async ({ page }) => {
    const searchInput = page.getByPlaceholder('案件名、スキル、クライアント名で検索...');

    // 検索前のテーブル行数を記録
    const initialRows = await page.locator('tbody tr').count();

    if (initialRows > 0) {
      // 検索実行
      await searchInput.fill('React');
      await page.waitForTimeout(500);

      // 検索結果の確認
      const filteredRows = await page.locator('tbody tr').count();

      // 検索結果が表示されているか、「該当なし」メッセージが表示されているかを確認
      if (filteredRows > 0) {
        // 検索結果に「React」が含まれることを確認
        const firstRowText = await page.locator('tbody tr').first().textContent();
        expect(firstRowText?.toLowerCase()).toContain('react');
      } else {
        // 検索結果がない場合のメッセージ確認
        await expect(page.getByText('検索条件に一致する案件がありません')).toBeVisible();
      }

      // 検索クリア
      await searchInput.clear();
      await page.waitForTimeout(500);

      // 元の行数に戻ることを確認
      const restoredRows = await page.locator('tbody tr').count();
      expect(restoredRows).toBe(initialRows);
    }
  });

  test('ステータスフィルターが正常に動作する', async ({ page }) => {
    // ステータスフィルターを開く
    const statusTrigger = page.locator('button:has-text("ステータス")').first();
    if ((await statusTrigger.count()) > 0) {
      await statusTrigger.click();

      // フィルターオプションの確認
      await expect(page.getByText('全てのステータス')).toBeVisible();
      await expect(page.getByText('募集中')).toBeVisible();
      await expect(page.getByText('終了')).toBeVisible();

      // 「募集中」でフィルター
      await page.getByText('募集中').click();
      await page.waitForTimeout(500);

      // フィルター結果の確認
      const visibleRows = page.locator('tbody tr');
      const rowCount = await visibleRows.count();

      if (rowCount > 0) {
        // 表示された行のステータスが「募集中」であることを確認
        const statusBadges = page.locator('tbody tr .bg-green-100, tbody tr:has-text("募集中")');
        const statusCount = await statusBadges.count();
        expect(statusCount).toBeGreaterThan(0);
      }
    }
  });

  test('テーブルソート機能が正常に動作する', async ({ page }) => {
    // 案件名でソート
    const titleSortButton = page.getByRole('button', { name: /案件名/ });
    if ((await titleSortButton.count()) > 0) {
      await titleSortButton.click();
      await page.waitForTimeout(500);

      // ソート結果の確認（最初の2行のタイトルを比較）
      const firstRowTitle = await page
        .locator('tbody tr')
        .first()
        .locator('td')
        .first()
        .textContent();
      const secondRowTitle = await page
        .locator('tbody tr')
        .nth(1)
        .locator('td')
        .first()
        .textContent();

      if (firstRowTitle && secondRowTitle) {
        // アルファベット順にソートされていることを確認
        expect(firstRowTitle.localeCompare(secondRowTitle)).toBeLessThanOrEqual(0);
      }

      // 再度クリックして降順ソート
      await titleSortButton.click();
      await page.waitForTimeout(500);

      // 降順ソートの確認
      const newFirstRowTitle = await page
        .locator('tbody tr')
        .first()
        .locator('td')
        .first()
        .textContent();
      const newSecondRowTitle = await page
        .locator('tbody tr')
        .nth(1)
        .locator('td')
        .first()
        .textContent();

      if (newFirstRowTitle && newSecondRowTitle) {
        expect(newFirstRowTitle.localeCompare(newSecondRowTitle)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('案件詳細ページへの遷移が正常に動作する', async ({ page }) => {
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 最初の行をクリック
      await tableRows.first().click();
      await page.waitForTimeout(1000);

      // URLが変更されることを確認
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/sales\/projects\/[^\/]+$/);
    }
  });

  test('新規案件登録ダイアログが正常に開く', async ({ page }) => {
    const createButton = page.getByRole('button', { name: '新規案件登録' });
    await createButton.click();

    // ダイアログが開くことを確認
    await expect(page.getByText('新規案件登録')).toBeVisible();

    // フォームフィールドの確認
    await expect(page.getByPlaceholder('案件名を入力')).toBeVisible();

    // クライアント選択の確認
    const clientSelect = page.locator('button:has-text("クライアントを選択")');
    if ((await clientSelect.count()) > 0) {
      await expect(clientSelect).toBeVisible();
    }

    // ダイアログを閉じる
    const closeButton = page
      .locator('button[aria-label="Close"], button:has-text("キャンセル")')
      .first();
    if ((await closeButton.count()) > 0) {
      await closeButton.click();
    } else {
      // Escキーでダイアログを閉じる
      await page.keyboard.press('Escape');
    }

    await page.waitForTimeout(500);

    // ダイアログが閉じることを確認
    await expect(page.getByText('新規案件登録')).not.toBeVisible();
  });

  test('アクションボタンが正常に動作する', async ({ page }) => {
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      const firstRow = tableRows.first();

      // 編集ボタンの確認
      const editButton = firstRow
        .locator('button:has([data-testid="edit-icon"]), button:has(.lucide-edit)')
        .first();
      if ((await editButton.count()) > 0) {
        await expect(editButton).toBeVisible();

        // 編集ボタンをクリック（イベントの伝播を停止するため）
        await editButton.click();
        await page.waitForTimeout(500);
      }

      // 削除ボタンの確認
      const deleteButton = firstRow
        .locator('button:has([data-testid="delete-icon"]), button:has(.lucide-trash-2)')
        .first();
      if ((await deleteButton.count()) > 0) {
        await expect(deleteButton).toBeVisible();
        // 削除ボタンは赤色であることを確認
        await expect(deleteButton).toHaveClass(/text-red-500/);
      }
    }
  });

  test('データが存在しない場合の表示が正しい', async ({ page }) => {
    // 存在しない検索語で検索
    const searchInput = page.getByPlaceholder('案件名、スキル、クライアント名で検索...');
    await searchInput.fill('存在しない案件名xyz123');
    await page.waitForTimeout(500);

    // 「該当なし」メッセージの確認
    await expect(page.getByText('検索条件に一致する案件がありません')).toBeVisible();

    // 新規案件登録ボタンが表示されることを確認
    const createButtonInEmpty = page.getByRole('button', { name: '新規案件を登録する' });
    if ((await createButtonInEmpty.count()) > 0) {
      await expect(createButtonInEmpty).toBeVisible();
    }
  });

  test('レスポンシブデザインが正常に動作する', async ({ page }) => {
    // デスクトップサイズでの表示確認
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // タブレットサイズでの表示確認
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();

    // モバイルサイズでの表示確認
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();

    // 検索ボックスがモバイルでも表示されることを確認
    await expect(page.getByPlaceholder('案件名、スキル、クライアント名で検索...')).toBeVisible();
  });

  test('キーボードナビゲーションが正常に動作する', async ({ page }) => {
    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // フォーカスされた要素が表示されることを確認
    const focusedElement = page.locator(':focus');
    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement).toBeVisible();
    }

    // Enterキーでボタンが押せることを確認
    const createButton = page.getByRole('button', { name: '新規案件登録' });
    await createButton.focus();
    await page.keyboard.press('Enter');

    // ダイアログが開くことを確認
    await expect(page.getByText('新規案件登録')).toBeVisible();

    // Escキーでダイアログが閉じることを確認
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(page.getByText('新規案件登録')).not.toBeVisible();
  });
});
