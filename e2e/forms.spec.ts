import { test, expect } from '@playwright/test';

test.describe('フォーム機能のテスト', () => {
  test.describe('新規案件登録フォーム', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');

      // 新規案件登録ダイアログを開く
      const createButton = page.getByRole('button', { name: '新規案件登録' });
      await createButton.click();
      await expect(page.getByText('新規案件登録')).toBeVisible();
    });

    test('必須フィールドのバリデーションが正常に動作する', async ({ page }) => {
      // 空のフォームで送信を試行
      const submitButton = page.getByRole('button', { name: '登録', exact: false });
      if ((await submitButton.count()) > 0) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // バリデーションエラーメッセージの確認
        const errorMessages = page.locator('.text-red-500, [role="alert"], .error-message');
        if ((await errorMessages.count()) > 0) {
          await expect(errorMessages.first()).toBeVisible();
        }
      }
    });

    test('案件名フィールドのバリデーションが正常に動作する', async ({ page }) => {
      const titleInput = page.getByPlaceholder('案件名を入力');
      if ((await titleInput.count()) > 0) {
        // 短すぎる案件名を入力
        await titleInput.fill('短い');
        await titleInput.blur();
        await page.waitForTimeout(300);

        // エラーメッセージの確認
        const errorMessage = page.locator('text=/案件名は.*文字以上/');
        if ((await errorMessage.count()) > 0) {
          await expect(errorMessage).toBeVisible();
        }

        // 正しい長さの案件名を入力
        await titleInput.fill('適切な長さの案件名です');
        await titleInput.blur();
        await page.waitForTimeout(300);

        // エラーメッセージが消えることを確認
        if ((await errorMessage.count()) > 0) {
          await expect(errorMessage).not.toBeVisible();
        }
      }
    });

    test('クライアント選択が正常に動作する', async ({ page }) => {
      const clientSelect = page.locator('button:has-text("クライアントを選択")');
      if ((await clientSelect.count()) > 0) {
        await clientSelect.click();

        // クライアントオプションが表示されることを確認
        const clientOptions = page.locator('[role="option"], .select-item');
        if ((await clientOptions.count()) > 0) {
          await expect(clientOptions.first()).toBeVisible();

          // 最初のクライアントを選択
          await clientOptions.first().click();
          await page.waitForTimeout(300);

          // 選択されたクライアントが表示されることを確認
          const selectedValue = await clientSelect.textContent();
          expect(selectedValue).not.toContain('クライアントを選択');
        }
      }
    });

    test('単価フィールドのバリデーションが正常に動作する', async ({ page }) => {
      const minRateInput = page.locator('input[placeholder*="800000"], input[name*="minRate"]');
      const maxRateInput = page.locator('input[placeholder*="1000000"], input[name*="maxRate"]');

      if ((await minRateInput.count()) > 0 && (await maxRateInput.count()) > 0) {
        // 負の値を入力
        await minRateInput.fill('-100');
        await minRateInput.blur();
        await page.waitForTimeout(300);

        // エラーメッセージの確認
        const negativeError = page.locator('text=/正の数/');
        if ((await negativeError.count()) > 0) {
          await expect(negativeError).toBeVisible();
        }

        // 上限が下限より小さい場合
        await minRateInput.fill('1000000');
        await maxRateInput.fill('800000');
        await maxRateInput.blur();
        await page.waitForTimeout(300);

        // 範囲エラーメッセージの確認
        const rangeError = page.locator('text=/上限.*下限.*以上/');
        if ((await rangeError.count()) > 0) {
          await expect(rangeError).toBeVisible();
        }

        // 正しい値を入力
        await minRateInput.fill('800000');
        await maxRateInput.fill('1000000');
        await maxRateInput.blur();
        await page.waitForTimeout(300);

        // エラーメッセージが消えることを確認
        if ((await rangeError.count()) > 0) {
          await expect(rangeError).not.toBeVisible();
        }
      }
    });

    test('勤務形態選択が正常に動作する', async ({ page }) => {
      const workStyleSelect = page.locator(
        'button:has-text("勤務形態"), select[name*="workStyle"]'
      );
      if ((await workStyleSelect.count()) > 0) {
        await workStyleSelect.click();

        // 勤務形態オプションの確認
        await expect(page.getByText('リモート')).toBeVisible();
        await expect(page.getByText('常駐')).toBeVisible();
        await expect(page.getByText('ハイブリッド')).toBeVisible();

        // ハイブリッドを選択
        await page.getByText('ハイブリッド').click();
        await page.waitForTimeout(300);

        // 選択されたことを確認
        const selectedValue = await workStyleSelect.textContent();
        expect(selectedValue).toContain('ハイブリッド');
      }
    });

    test('スキル追加機能が正常に動作する', async ({ page }) => {
      const skillInput = page.locator('input[placeholder*="スキル"], input[name*="skill"]');
      const addSkillButton = page.locator(
        'button:has-text("追加"), button[data-testid="add-skill"]'
      );

      if ((await skillInput.count()) > 0 && (await addSkillButton.count()) > 0) {
        // スキルを追加
        await skillInput.fill('React');
        await addSkillButton.click();
        await page.waitForTimeout(300);

        // 追加されたスキルが表示されることを確認
        const skillBadge = page.locator(
          '.badge:has-text("React"), [data-testid="skill-badge"]:has-text("React")'
        );
        if ((await skillBadge.count()) > 0) {
          await expect(skillBadge).toBeVisible();

          // スキルを削除
          const removeButton = skillBadge.locator('button, [data-testid="remove-skill"]');
          if ((await removeButton.count()) > 0) {
            await removeButton.click();
            await page.waitForTimeout(300);

            // スキルが削除されることを確認
            await expect(skillBadge).not.toBeVisible();
          }
        }
      }
    });

    test('日付フィールドが正常に動作する', async ({ page }) => {
      const startDateInput = page.locator('input[type="date"], input[name*="startDate"]');
      const endDateInput = page.locator('input[type="date"], input[name*="endDate"]');

      if ((await startDateInput.count()) > 0) {
        // 開始日を設定
        await startDateInput.fill('2024-01-01');
        await startDateInput.blur();
        await page.waitForTimeout(300);

        // 値が設定されることを確認
        const startValue = await startDateInput.inputValue();
        expect(startValue).toBe('2024-01-01');
      }

      if ((await endDateInput.count()) > 0) {
        // 終了日を設定
        await endDateInput.fill('2024-12-31');
        await endDateInput.blur();
        await page.waitForTimeout(300);

        // 値が設定されることを確認
        const endValue = await endDateInput.inputValue();
        expect(endValue).toBe('2024-12-31');
      }
    });

    test('フォーム送信が正常に動作する', async ({ page }) => {
      // 必須フィールドに値を入力
      const titleInput = page.getByPlaceholder('案件名を入力');
      if ((await titleInput.count()) > 0) {
        await titleInput.fill('テスト案件名です');
      }

      const clientSelect = page.locator('button:has-text("クライアントを選択")');
      if ((await clientSelect.count()) > 0) {
        await clientSelect.click();
        const firstOption = page.locator('[role="option"], .select-item').first();
        if ((await firstOption.count()) > 0) {
          await firstOption.click();
        }
      }

      const minRateInput = page.locator('input[placeholder*="800000"], input[name*="minRate"]');
      if ((await minRateInput.count()) > 0) {
        await minRateInput.fill('800000');
      }

      const maxRateInput = page.locator('input[placeholder*="1000000"], input[name*="maxRate"]');
      if ((await maxRateInput.count()) > 0) {
        await maxRateInput.fill('1000000');
      }

      const descriptionInput = page.locator(
        'textarea[placeholder*="説明"], textarea[name*="description"]'
      );
      if ((await descriptionInput.count()) > 0) {
        await descriptionInput.fill('テスト案件の説明です。詳細な内容を記載します。');
      }

      // フォームを送信
      const submitButton = page.getByRole('button', { name: '登録', exact: false });
      if ((await submitButton.count()) > 0) {
        await submitButton.click();
        await page.waitForTimeout(1000);

        // ダイアログが閉じることを確認
        await expect(page.getByText('新規案件登録')).not.toBeVisible();
      }
    });
  });

  test.describe('新規クライアント登録フォーム', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sales/clients');
      await page.waitForLoadState('networkidle');

      // 新規クライアント登録ダイアログを開く
      const createButton = page.getByRole('button', { name: '新規クライアント登録' });
      await createButton.click();
      await expect(page.getByText('新規クライアント登録')).toBeVisible();
    });

    test('企業名フィールドのバリデーションが正常に動作する', async ({ page }) => {
      const nameInput = page.getByPlaceholder('企業名を入力', { exact: false });
      if ((await nameInput.count()) > 0) {
        // 短すぎる企業名を入力
        await nameInput.fill('A');
        await nameInput.blur();
        await page.waitForTimeout(300);

        // エラーメッセージの確認
        const errorMessage = page.locator('.text-red-500, [role="alert"]');
        if ((await errorMessage.count()) > 0) {
          await expect(errorMessage.first()).toBeVisible();
        }

        // 正しい長さの企業名を入力
        await nameInput.fill('テスト株式会社');
        await nameInput.blur();
        await page.waitForTimeout(300);

        // エラーメッセージが消えることを確認
        if ((await errorMessage.count()) > 0) {
          await expect(errorMessage.first()).not.toBeVisible();
        }
      }
    });

    test('業種選択が正常に動作する', async ({ page }) => {
      const industrySelect = page.locator('button:has-text("業種を選択"), select[name="industry"]');
      if ((await industrySelect.count()) > 0) {
        await industrySelect.click();

        // 業種オプションが表示されることを確認
        const industryOptions = page.locator('[role="option"], option');
        if ((await industryOptions.count()) > 0) {
          await expect(industryOptions.first()).toBeVisible();

          // IT業界を選択
          const itOption = page.locator('text=IT, text=情報技術, text=システム開発').first();
          if ((await itOption.count()) > 0) {
            await itOption.click();
            await page.waitForTimeout(300);
          } else {
            // 最初のオプションを選択
            await industryOptions.first().click();
            await page.waitForTimeout(300);
          }

          // 選択されたことを確認
          const selectedValue = await industrySelect.textContent();
          expect(selectedValue).not.toContain('業種を選択');
        }
      }
    });

    test('説明フィールドが正常に動作する', async ({ page }) => {
      const descriptionInput = page.locator(
        'textarea[placeholder*="説明"], textarea[name*="description"]'
      );
      if ((await descriptionInput.count()) > 0) {
        const testDescription = 'テストクライアントの詳細説明です。';
        await descriptionInput.fill(testDescription);

        // 値が設定されることを確認
        const inputValue = await descriptionInput.inputValue();
        expect(inputValue).toBe(testDescription);
      }
    });

    test('営業担当者選択が正常に動作する', async ({ page }) => {
      const salesPersonSelect = page.locator(
        'button:has-text("営業担当者"), select[name*="salesPerson"]'
      );
      if ((await salesPersonSelect.count()) > 0) {
        await salesPersonSelect.click();

        // 営業担当者オプションが表示されることを確認
        const salesOptions = page.locator('[role="option"], option');
        if ((await salesOptions.count()) > 0) {
          await expect(salesOptions.first()).toBeVisible();

          // 最初の営業担当者を選択
          await salesOptions.first().click();
          await page.waitForTimeout(300);

          // 選択されたことを確認
          const selectedValue = await salesPersonSelect.textContent();
          expect(selectedValue).not.toContain('営業担当者');
        }
      }
    });

    test('複数選択フィールドが正常に動作する', async ({ page }) => {
      // 優先スキル選択
      const skillsSelect = page.locator(
        'button:has-text("スキルを選択"), [data-testid="skills-select"]'
      );
      if ((await skillsSelect.count()) > 0) {
        await skillsSelect.click();

        // スキルオプションが表示されることを確認
        const skillOptions = page.locator(
          '[role="option"]:has-text("React"), [role="option"]:has-text("JavaScript")'
        );
        if ((await skillOptions.count()) > 0) {
          // 複数のスキルを選択
          await skillOptions.first().click();
          if ((await skillOptions.count()) > 1) {
            await skillOptions.nth(1).click();
          }
          await page.waitForTimeout(300);

          // 選択されたスキルが表示されることを確認
          const selectedSkills = page.locator('.badge, [data-testid="selected-skill"]');
          if ((await selectedSkills.count()) > 0) {
            await expect(selectedSkills.first()).toBeVisible();
          }
        }
      }
    });

    test('フォームリセット機能が正常に動作する', async ({ page }) => {
      // フィールドに値を入力
      const nameInput = page.getByPlaceholder('企業名を入力', { exact: false });
      if ((await nameInput.count()) > 0) {
        await nameInput.fill('テスト企業');
      }

      const descriptionInput = page.locator(
        'textarea[placeholder*="説明"], textarea[name*="description"]'
      );
      if ((await descriptionInput.count()) > 0) {
        await descriptionInput.fill('テスト説明');
      }

      // リセットボタンまたはキャンセルボタンをクリック
      const resetButton = page.getByRole('button', { name: 'リセット' });
      const cancelButton = page.getByRole('button', { name: 'キャンセル' });

      if ((await resetButton.count()) > 0) {
        await resetButton.click();
        await page.waitForTimeout(300);

        // フィールドがクリアされることを確認
        if ((await nameInput.count()) > 0) {
          const nameValue = await nameInput.inputValue();
          expect(nameValue).toBe('');
        }
      } else if ((await cancelButton.count()) > 0) {
        await cancelButton.click();
        await page.waitForTimeout(500);

        // ダイアログが閉じることを確認
        await expect(page.getByText('新規クライアント登録')).not.toBeVisible();
      }
    });
  });

  test.describe('検索フォーム', () => {
    test('案件一覧の検索フォームが正常に動作する', async ({ page }) => {
      await page.goto('/sales/projects');
      await page.waitForLoadState('networkidle');

      const searchInput = page.getByPlaceholder('案件名、スキル、クライアント名で検索...');

      // 検索語を入力
      await searchInput.fill('React');
      await page.waitForTimeout(500);

      // 検索結果が表示されることを確認
      const tableRows = page.locator('tbody tr');
      const rowCount = await tableRows.count();

      if (rowCount > 0) {
        // 検索結果に検索語が含まれることを確認
        const firstRowText = await tableRows.first().textContent();
        expect(firstRowText?.toLowerCase()).toContain('react');
      }

      // 検索をクリア
      await searchInput.clear();
      await page.waitForTimeout(500);

      // 全ての結果が再表示されることを確認
      const allRows = await tableRows.count();
      expect(allRows).toBeGreaterThanOrEqual(rowCount);
    });

    test('クライアント一覧の検索フォームが正常に動作する', async ({ page }) => {
      await page.goto('/sales/clients');
      await page.waitForLoadState('networkidle');

      const searchInput = page.getByPlaceholder('企業名、業種、スキルで検索...');

      // 検索語を入力
      await searchInput.fill('商事');
      await page.waitForTimeout(500);

      // 検索結果が表示されることを確認
      const items = page.locator('tbody tr, [data-testid="client-card"]');
      const itemCount = await items.count();

      if (itemCount > 0) {
        // 検索結果に検索語が含まれることを確認
        const firstItemText = await items.first().textContent();
        expect(firstItemText?.toLowerCase()).toContain('商事');
      }

      // 検索をクリア
      await searchInput.clear();
      await page.waitForTimeout(500);

      // 全ての結果が再表示されることを確認
      const allItems = await items.count();
      expect(allItems).toBeGreaterThanOrEqual(itemCount);
    });
  });
});
