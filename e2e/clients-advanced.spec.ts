import { test, expect } from '@playwright/test';

test.describe('クライアント一覧ページ - 高度なテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sales/clients');
    await page.waitForLoadState('networkidle');
  });

  test('ページ構造とレイアウトが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('クライアント一覧');

    // 新規クライアント登録ボタンの確認
    const createButton = page.getByRole('button', { name: '新規クライアント登録' });
    await expect(createButton).toBeVisible();

    // 検索ボックスの確認
    const searchInput = page.getByPlaceholder('企業名、業種、スキルで検索...');
    await expect(searchInput).toBeVisible();

    // ステータスフィルターの確認
    const statusFilter = page.locator('button:has-text("ステータス")').first();
    if ((await statusFilter.count()) > 0) {
      await expect(statusFilter).toBeVisible();
    }

    // テーブルまたはカードレイアウトの確認
    const contentArea = page.locator('table, [data-testid="client-list"], .grid');
    await expect(contentArea.first()).toBeVisible();
  });

  test('検索機能が正常に動作する', async ({ page }) => {
    const searchInput = page.getByPlaceholder('企業名、業種、スキルで検索...');

    // 検索前の表示項目数を記録
    const initialItems = await page.locator('tbody tr, [data-testid="client-card"]').count();

    if (initialItems > 0) {
      // 検索実行（一般的な業種で検索）
      await searchInput.fill('商事');
      await page.waitForTimeout(500);

      // 検索結果の確認
      const filteredItems = await page.locator('tbody tr, [data-testid="client-card"]').count();

      if (filteredItems > 0) {
        // 検索結果に「商事」が含まれることを確認
        const firstItemText = await page
          .locator('tbody tr, [data-testid="client-card"]')
          .first()
          .textContent();
        expect(firstItemText?.toLowerCase()).toContain('商事');
      } else {
        // 検索結果がない場合のメッセージ確認
        await expect(page.getByText('検索条件に一致するクライアントがありません')).toBeVisible();
      }

      // 検索クリア
      await searchInput.clear();
      await page.waitForTimeout(500);

      // 元の項目数に戻ることを確認
      const restoredItems = await page.locator('tbody tr, [data-testid="client-card"]').count();
      expect(restoredItems).toBe(initialItems);
    }
  });

  test('ステータスフィルターが正常に動作する', async ({ page }) => {
    // ステータスフィルターを開く
    const statusTrigger = page.locator('button:has-text("ステータス")').first();
    if ((await statusTrigger.count()) > 0) {
      await statusTrigger.click();

      // フィルターオプションの確認
      await expect(page.getByText('全てのステータス')).toBeVisible();
      await expect(page.getByText('取引中')).toBeVisible();
      await expect(page.getByText('商談中')).toBeVisible();
      await expect(page.getByText('取引停止')).toBeVisible();

      // 「取引中」でフィルター
      await page.getByText('取引中').click();
      await page.waitForTimeout(500);

      // フィルター結果の確認
      const visibleItems = page.locator('tbody tr, [data-testid="client-card"]');
      const itemCount = await visibleItems.count();

      if (itemCount > 0) {
        // 表示された項目のステータスが「取引中」であることを確認
        const statusBadges = page.locator(
          'tbody tr .bg-green-100, [data-testid="client-card"]:has-text("取引中")'
        );
        const statusCount = await statusBadges.count();
        expect(statusCount).toBeGreaterThan(0);
      }
    }
  });

  test('ソート機能が正常に動作する', async ({ page }) => {
    // 企業名でソート
    const nameSortButton = page.getByRole('button', { name: /企業名|クライアント名/ });
    if ((await nameSortButton.count()) > 0) {
      await nameSortButton.click();
      await page.waitForTimeout(500);

      // ソート結果の確認（最初の2行の企業名を比較）
      const items = page.locator('tbody tr, [data-testid="client-card"]');
      const itemCount = await items.count();

      if (itemCount >= 2) {
        const firstItemName = await items.first().textContent();
        const secondItemName = await items.nth(1).textContent();

        if (firstItemName && secondItemName) {
          // アルファベット順にソートされていることを確認
          expect(firstItemName.localeCompare(secondItemName)).toBeLessThanOrEqual(0);
        }

        // 再度クリックして降順ソート
        await nameSortButton.click();
        await page.waitForTimeout(500);

        // 降順ソートの確認
        const newFirstItemName = await items.first().textContent();
        const newSecondItemName = await items.nth(1).textContent();

        if (newFirstItemName && newSecondItemName) {
          expect(newFirstItemName.localeCompare(newSecondItemName)).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  test('ページネーションが正常に動作する', async ({ page }) => {
    // ページネーションコントロールの確認
    const pagination = page.locator(
      '[data-testid="pagination"], .flex.items-center.justify-between'
    );

    if ((await pagination.count()) > 0) {
      await expect(pagination.first()).toBeVisible();

      // 次のページボタンの確認
      const nextButton = page.getByRole('button', { name: /次へ|Next/ });
      if ((await nextButton.count()) > 0 && (await nextButton.isEnabled())) {
        // 現在のページの最初の項目を記録
        const firstPageFirstItem = await page
          .locator('tbody tr, [data-testid="client-card"]')
          .first()
          .textContent();

        // 次のページに移動
        await nextButton.click();
        await page.waitForTimeout(500);

        // 異なる項目が表示されることを確認
        const secondPageFirstItem = await page
          .locator('tbody tr, [data-testid="client-card"]')
          .first()
          .textContent();
        expect(secondPageFirstItem).not.toBe(firstPageFirstItem);

        // 前のページに戻る
        const prevButton = page.getByRole('button', { name: /前へ|Previous/ });
        if ((await prevButton.count()) > 0 && (await prevButton.isEnabled())) {
          await prevButton.click();
          await page.waitForTimeout(500);

          // 元の項目が表示されることを確認
          const backToFirstPageItem = await page
            .locator('tbody tr, [data-testid="client-card"]')
            .first()
            .textContent();
          expect(backToFirstPageItem).toBe(firstPageFirstItem);
        }
      }
    }
  });

  test('クライアント詳細ページへの遷移が正常に動作する', async ({ page }) => {
    const items = page.locator('tbody tr, [data-testid="client-card"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      // 最初の項目をクリック
      await items.first().click();
      await page.waitForTimeout(1000);

      // URLが変更されることを確認
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/sales\/clients\/[^\/]+$/);
    }
  });

  test('新規クライアント登録ダイアログが正常に開く', async ({ page }) => {
    const createButton = page.getByRole('button', { name: '新規クライアント登録' });
    await createButton.click();

    // ダイアログが開くことを確認
    await expect(page.getByText('新規クライアント登録')).toBeVisible();

    // フォームフィールドの確認
    const nameInput = page.getByPlaceholder('企業名を入力', { exact: false });
    if ((await nameInput.count()) > 0) {
      await expect(nameInput.first()).toBeVisible();
    }

    // 業種選択の確認
    const industrySelect = page.locator('button:has-text("業種を選択"), select[name="industry"]');
    if ((await industrySelect.count()) > 0) {
      await expect(industrySelect.first()).toBeVisible();
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
    await expect(page.getByText('新規クライアント登録')).not.toBeVisible();
  });

  test('クライアント情報の表示が正しい', async ({ page }) => {
    const items = page.locator('tbody tr, [data-testid="client-card"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      const firstItem = items.first();

      // クライアント名が表示されることを確認
      const clientName = firstItem.locator('td:first-child, [data-testid="client-name"]');
      if ((await clientName.count()) > 0) {
        await expect(clientName.first()).toBeVisible();
        const nameText = await clientName.first().textContent();
        expect(nameText).toBeTruthy();
        expect(nameText?.length).toBeGreaterThan(0);
      }

      // ステータスバッジが表示されることを確認
      const statusBadge = firstItem.locator('.badge, [data-testid="status-badge"]');
      if ((await statusBadge.count()) > 0) {
        await expect(statusBadge.first()).toBeVisible();
      }

      // 業種情報が表示されることを確認
      const industryInfo = firstItem.locator('td:has-text("業種"), [data-testid="industry"]');
      if ((await industryInfo.count()) > 0) {
        await expect(industryInfo.first()).toBeVisible();
      }
    }
  });

  test('データが存在しない場合の表示が正しい', async ({ page }) => {
    // 存在しない検索語で検索
    const searchInput = page.getByPlaceholder('企業名、業種、スキルで検索...');
    await searchInput.fill('存在しない企業名xyz123');
    await page.waitForTimeout(500);

    // 「該当なし」メッセージの確認
    const noResultsMessage = page.getByText('検索条件に一致するクライアントがありません', {
      exact: false,
    });
    if ((await noResultsMessage.count()) > 0) {
      await expect(noResultsMessage).toBeVisible();
    }

    // 新規クライアント登録ボタンが表示されることを確認
    const createButtonInEmpty = page.getByRole('button', { name: '新規クライアントを登録する' });
    if ((await createButtonInEmpty.count()) > 0) {
      await expect(createButtonInEmpty).toBeVisible();
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

    // 検索ボックスがモバイルでも表示されることを確認
    await expect(page.getByPlaceholder('企業名、業種、スキルで検索...')).toBeVisible();

    // 新規登録ボタンがモバイルでも表示されることを確認
    await expect(page.getByRole('button', { name: '新規クライアント登録' })).toBeVisible();
  });

  test('アクションボタンが正常に動作する', async ({ page }) => {
    const items = page.locator('tbody tr, [data-testid="client-card"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      const firstItem = items.first();

      // 詳細ボタンまたは編集ボタンの確認
      const actionButtons = firstItem.locator(
        'button:has([class*="lucide"]), button[data-testid*="action"]'
      );
      if ((await actionButtons.count()) > 0) {
        await expect(actionButtons.first()).toBeVisible();

        // ボタンをクリック
        await actionButtons.first().click();
        await page.waitForTimeout(500);
      }

      // メールアイコンまたは電話アイコンの確認
      const contactIcons = firstItem.locator(
        '[data-testid="mail-icon"], [data-testid="phone-icon"], .lucide-mail, .lucide-phone'
      );
      if ((await contactIcons.count()) > 0) {
        await expect(contactIcons.first()).toBeVisible();
      }
    }
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
    const createButton = page.getByRole('button', { name: '新規クライアント登録' });
    await createButton.focus();
    await page.keyboard.press('Enter');

    // ダイアログが開くことを確認
    await expect(page.getByText('新規クライアント登録')).toBeVisible();

    // Escキーでダイアログが閉じることを確認
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(page.getByText('新規クライアント登録')).not.toBeVisible();
  });
});
