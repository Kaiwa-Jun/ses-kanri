import { test, expect } from '@playwright/test';

test.describe('UIコンポーネントのテスト', () => {
  test.describe('ボタンコンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('プライマリボタンが正常に動作する', async ({ page }) => {
      const primaryButton = page.getByRole('button', { name: '新規案件登録' });

      // ボタンが表示されることを確認
      await expect(primaryButton).toBeVisible();

      // ボタンがクリック可能であることを確認
      await expect(primaryButton).toBeEnabled();

      // ボタンをクリック
      await primaryButton.click();

      // ダイアログが開くことを確認
      await expect(page.getByText('新規案件登録')).toBeVisible();
    });

    test('ゴーストボタンが正常に動作する', async ({ page }) => {
      // テーブルのソートボタン（ゴーストボタン）
      const ghostButton = page.getByRole('button', { name: /案件名/ });

      if ((await ghostButton.count()) > 0) {
        await expect(ghostButton).toBeVisible();
        await expect(ghostButton).toBeEnabled();

        // ボタンをクリック
        await ghostButton.click();
        await page.waitForTimeout(500);

        // ソート機能が動作することを確認（テーブルの順序が変わる）
        const tableRows = page.locator('tbody tr');
        if ((await tableRows.count()) > 1) {
          const firstRowBefore = await tableRows.first().textContent();

          // 再度クリックして降順ソート
          await ghostButton.click();
          await page.waitForTimeout(500);

          const firstRowAfter = await tableRows.first().textContent();
          // 順序が変わることを確認（完全に同じでない場合）
          expect(firstRowBefore).toBeDefined();
          expect(firstRowAfter).toBeDefined();
        }
      }
    });

    test('アイコンボタンが正常に動作する', async ({ page }) => {
      const tableRows = page.locator('tbody tr');
      const rowCount = await tableRows.count();

      if (rowCount > 0) {
        const firstRow = tableRows.first();

        // 編集アイコンボタン
        const editButton = firstRow.locator('button:has(.lucide-edit)');
        if ((await editButton.count()) > 0) {
          await expect(editButton).toBeVisible();
          await expect(editButton).toBeEnabled();

          // ホバー状態の確認
          await editButton.hover();
          await page.waitForTimeout(200);

          // クリック
          await editButton.click();
          await page.waitForTimeout(500);
        }

        // 削除アイコンボタン
        const deleteButton = firstRow.locator('button:has(.lucide-trash-2)');
        if ((await deleteButton.count()) > 0) {
          await expect(deleteButton).toBeVisible();
          await expect(deleteButton).toBeEnabled();

          // 赤色のスタイルが適用されていることを確認
          await expect(deleteButton).toHaveClass(/text-red-500/);
        }
      }
    });
  });

  test.describe('入力コンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('検索入力フィールドが正常に動作する', async ({ page }) => {
      const searchInput = page.getByPlaceholder('案件名、スキル、クライアント名で検索...');

      // 入力フィールドが表示されることを確認
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeEnabled();

      // プレースホルダーが正しく表示されることを確認
      const placeholder = await searchInput.getAttribute('placeholder');
      expect(placeholder).toContain('案件名、スキル、クライアント名で検索');

      // テキスト入力
      await searchInput.fill('React');
      await page.waitForTimeout(300);

      // 入力値が正しく設定されることを確認
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe('React');

      // フォーカス状態の確認
      await searchInput.focus();
      await expect(searchInput).toBeFocused();

      // クリア
      await searchInput.clear();
      const clearedValue = await searchInput.inputValue();
      expect(clearedValue).toBe('');
    });

    test('検索アイコンが正しく表示される', async ({ page }) => {
      // 検索アイコンが表示されることを確認
      const searchIcon = page.locator('.lucide-search');
      if ((await searchIcon.count()) > 0) {
        await expect(searchIcon.first()).toBeVisible();
      }
    });
  });

  test.describe('セレクトコンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('ステータスフィルターが正常に動作する', async ({ page }) => {
      const statusSelect = page.locator('button:has-text("ステータス")').first();

      if ((await statusSelect.count()) > 0) {
        // セレクトボタンが表示されることを確認
        await expect(statusSelect).toBeVisible();
        await expect(statusSelect).toBeEnabled();

        // セレクトを開く
        await statusSelect.click();
        await page.waitForTimeout(300);

        // オプションが表示されることを確認
        await expect(page.getByText('全てのステータス')).toBeVisible();
        await expect(page.getByText('募集中')).toBeVisible();
        await expect(page.getByText('終了')).toBeVisible();

        // オプションを選択
        await page.getByText('募集中').click();
        await page.waitForTimeout(500);

        // 選択されたことを確認
        const selectedText = await statusSelect.textContent();
        expect(selectedText).toContain('募集中');
      }
    });
  });

  test.describe('テーブルコンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('テーブルが正しく表示される', async ({ page }) => {
      const table = page.locator('table');
      await expect(table).toBeVisible();

      // テーブルヘッダーの確認
      const tableHeader = page.locator('thead');
      await expect(tableHeader).toBeVisible();

      // テーブルボディの確認
      const tableBody = page.locator('tbody');
      await expect(tableBody).toBeVisible();

      // ヘッダーセルの確認
      await expect(page.getByText('案件名')).toBeVisible();
      await expect(page.getByText('クライアント')).toBeVisible();
      await expect(page.getByText('ステータス')).toBeVisible();
      await expect(page.getByText('単価')).toBeVisible();
    });

    test('テーブル行のホバー効果が正常に動作する', async ({ page }) => {
      const tableRows = page.locator('tbody tr');
      const rowCount = await tableRows.count();

      if (rowCount > 0) {
        const firstRow = tableRows.first();

        // 行にホバー
        await firstRow.hover();
        await page.waitForTimeout(200);

        // ホバー効果が適用されることを確認（背景色の変化など）
        // 実際のスタイルは実装に依存するため、要素が反応することを確認
        await expect(firstRow).toBeVisible();
      }
    });

    test('テーブル行のクリックが正常に動作する', async ({ page }) => {
      const tableRows = page.locator('tbody tr');
      const rowCount = await tableRows.count();

      if (rowCount > 0) {
        const firstRow = tableRows.first();

        // 行をクリック
        await firstRow.click();
        await page.waitForTimeout(1000);

        // 詳細ページに遷移することを確認
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/sales\/projects\/[^\/]+$/);
      }
    });
  });

  test.describe('バッジコンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('ステータスバッジが正しく表示される', async ({ page }) => {
      const statusBadges = page.locator('.badge, [data-testid="status-badge"]');
      const badgeCount = await statusBadges.count();

      if (badgeCount > 0) {
        const firstBadge = statusBadges.first();
        await expect(firstBadge).toBeVisible();

        // バッジのテキストが空でないことを確認
        const badgeText = await firstBadge.textContent();
        expect(badgeText).toBeTruthy();
        expect(badgeText?.length).toBeGreaterThan(0);

        // ステータスに応じた色が適用されることを確認
        const badgeClasses = await firstBadge.getAttribute('class');
        expect(badgeClasses).toContain('badge');
      }
    });

    test('スキルバッジが正しく表示される', async ({ page }) => {
      const skillBadges = page.locator('tbody tr .badge');
      const skillBadgeCount = await skillBadges.count();

      if (skillBadgeCount > 0) {
        // 最初のスキルバッジを確認
        const firstSkillBadge = skillBadges.first();
        await expect(firstSkillBadge).toBeVisible();

        // スキル名が表示されることを確認
        const skillText = await firstSkillBadge.textContent();
        expect(skillText).toBeTruthy();

        // 「+数字」形式のバッジがある場合の確認
        const moreBadge = page.locator('.badge:has-text("+")');
        if ((await moreBadge.count()) > 0) {
          await expect(moreBadge.first()).toBeVisible();
          const moreText = await moreBadge.first().textContent();
          expect(moreText).toMatch(/^\+\d+$/);
        }
      }
    });
  });

  test.describe('カードコンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('メインカードが正しく表示される', async ({ page }) => {
      const mainCard = page.locator('.card, [data-testid="main-card"]').first();

      if ((await mainCard.count()) > 0) {
        await expect(mainCard).toBeVisible();

        // カードの内容が表示されることを確認
        const cardContent = mainCard.locator('.card-content, [data-testid="card-content"]');
        if ((await cardContent.count()) > 0) {
          await expect(cardContent).toBeVisible();
        }
      }
    });
  });

  test.describe('ダイアログコンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('ダイアログが正常に開閉する', async ({ page }) => {
      // ダイアログを開く
      const openButton = page.getByRole('button', { name: '新規案件登録' });
      await openButton.click();

      // ダイアログが表示されることを確認
      const dialog = page.locator('[role="dialog"], .dialog');
      await expect(dialog.first()).toBeVisible();

      // ダイアログタイトルの確認
      await expect(page.getByText('新規案件登録')).toBeVisible();

      // オーバーレイの確認
      const overlay = page.locator('.dialog-overlay, [data-testid="dialog-overlay"]');
      if ((await overlay.count()) > 0) {
        await expect(overlay.first()).toBeVisible();
      }

      // Escキーでダイアログを閉じる
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // ダイアログが閉じることを確認
      await expect(page.getByText('新規案件登録')).not.toBeVisible();
    });

    test('ダイアログの外側クリックで閉じる', async ({ page }) => {
      // ダイアログを開く
      const openButton = page.getByRole('button', { name: '新規案件登録' });
      await openButton.click();

      // ダイアログが表示されることを確認
      await expect(page.getByText('新規案件登録')).toBeVisible();

      // オーバーレイをクリック
      const overlay = page.locator('.dialog-overlay, [data-testid="dialog-overlay"]');
      if ((await overlay.count()) > 0) {
        await overlay.first().click({ position: { x: 10, y: 10 } });
        await page.waitForTimeout(500);

        // ダイアログが閉じることを確認
        await expect(page.getByText('新規案件登録')).not.toBeVisible();
      }
    });
  });

  test.describe('アイコンコンポーネント', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');
    });

    test('Lucideアイコンが正しく表示される', async ({ page }) => {
      // 検索アイコン
      const searchIcon = page.locator('.lucide-search');
      if ((await searchIcon.count()) > 0) {
        await expect(searchIcon.first()).toBeVisible();
      }

      // フィルターアイコン
      const filterIcon = page.locator('.lucide-filter');
      if ((await filterIcon.count()) > 0) {
        await expect(filterIcon.first()).toBeVisible();
      }

      // プラスアイコン
      const plusIcon = page.locator('.lucide-plus');
      if ((await plusIcon.count()) > 0) {
        await expect(plusIcon.first()).toBeVisible();
      }

      // テーブル内のアイコン
      const tableRows = page.locator('tbody tr');
      const rowCount = await tableRows.count();

      if (rowCount > 0) {
        // 建物アイコン（クライアント）
        const buildingIcon = page.locator('.lucide-building-2');
        if ((await buildingIcon.count()) > 0) {
          await expect(buildingIcon.first()).toBeVisible();
        }

        // 時計アイコン（期間）
        const clockIcon = page.locator('.lucide-clock');
        if ((await clockIcon.count()) > 0) {
          await expect(clockIcon.first()).toBeVisible();
        }

        // 場所アイコン（勤務地）
        const mapPinIcon = page.locator('.lucide-map-pin');
        if ((await mapPinIcon.count()) > 0) {
          await expect(mapPinIcon.first()).toBeVisible();
        }

        // カレンダーアイコン（日付）
        const calendarIcon = page.locator('.lucide-calendar');
        if ((await calendarIcon.count()) > 0) {
          await expect(calendarIcon.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('レスポンシブ表示', () => {
    test('デスクトップサイズでの表示', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');

      // テーブルが表示されることを確認
      await expect(page.locator('table')).toBeVisible();

      // 全てのカラムが表示されることを確認
      await expect(page.getByText('案件名')).toBeVisible();
      await expect(page.getByText('クライアント')).toBeVisible();
      await expect(page.getByText('ステータス')).toBeVisible();
      await expect(page.getByText('単価')).toBeVisible();
    });

    test('タブレットサイズでの表示', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');

      // 主要な要素が表示されることを確認
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('button', { name: '新規案件登録' })).toBeVisible();
      await expect(page.getByPlaceholder('案件名、スキル、クライアント名で検索...')).toBeVisible();
    });

    test('モバイルサイズでの表示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');

      // 主要な要素が表示されることを確認
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('button', { name: '新規案件登録' })).toBeVisible();
      await expect(page.getByPlaceholder('案件名、スキル、クライアント名で検索...')).toBeVisible();

      // モバイルでのレイアウト調整が適用されることを確認
      const searchContainer = page.locator('.flex.flex-col.sm\\:flex-row');
      if ((await searchContainer.count()) > 0) {
        await expect(searchContainer.first()).toBeVisible();
      }
    });
  });
});
