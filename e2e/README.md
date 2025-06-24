# E2Eテスト (Playwright)

このディレクトリには、Playwrightを使用したEnd-to-End（E2E）テストが含まれています。

## テストファイル

### 基本テスト

- `basic.spec.ts` - 基本的なページアクセスとナビゲーションのテスト（8テスト）
- `navigation.spec.ts` - ナビゲーションとレイアウトのテスト（4テスト）

### 高度な機能テスト

- `projects-advanced.spec.ts` - 案件一覧ページの高度なテスト（11テスト）
- `clients-advanced.spec.ts` - クライアント一覧ページの高度なテスト（12テスト）

### フォーム機能テスト

- `forms.spec.ts` - フォーム機能の包括的なテスト（18テスト）
  - 新規案件登録フォーム（9テスト）
  - 新規クライアント登録フォーム（7テスト）
  - 検索フォーム（2テスト）

### UIコンポーネントテスト

- `ui-components.spec.ts` - UIコンポーネントの詳細テスト（22テスト）
  - ボタンコンポーネント（3テスト）
  - 入力コンポーネント（2テスト）
  - セレクトコンポーネント（1テスト）
  - テーブルコンポーネント（3テスト）
  - バッジコンポーネント（2テスト）
  - カードコンポーネント（1テスト）
  - ダイアログコンポーネント（2テスト）
  - アイコンコンポーネント（1テスト）
  - レスポンシブ表示（3テスト）

### レガシーテスト

- `projects.spec.ts` - 案件一覧ページの基本テスト（8テスト）
- `clients.spec.ts` - クライアント一覧ページの基本テスト（8テスト）

**総テスト数: 75テスト**

## テストの実行方法

### 基本的な実行

```bash
# 全てのE2Eテストを実行（ヘッドレスモード）
npm run e2e

# 基本テストのみ実行
npm run e2e:basic

# 高度なテストのみ実行
npm run e2e:advanced

# フォームテストのみ実行
npm run e2e:forms

# UIコンポーネントテストのみ実行
npm run e2e:ui

# 全てのテストを実行
npm run e2e:all

# ブラウザを表示してテストを実行
npm run e2e:headed

# Playwright Test UIを使用してテストを実行
npm run e2e:ui

# デバッグモードでテストを実行
npm run e2e:debug

# テストレポートを表示
npm run e2e:report
```

### 特定のテストファイルを実行

```bash
# 基本テストのみ
npx playwright test basic.spec.ts

# 案件一覧の高度なテストのみ
npx playwright test projects-advanced.spec.ts

# クライアント一覧の高度なテストのみ
npx playwright test clients-advanced.spec.ts

# フォーム機能テストのみ
npx playwright test forms.spec.ts

# UIコンポーネントテストのみ
npx playwright test ui-components.spec.ts

# 特定のテストスイートのみ
npx playwright test --grep "ボタンコンポーネント"
```

### 特定のブラウザでテストを実行

```bash
# Chromiumのみ
npx playwright test --project=chromium

# Firefoxのみ
npx playwright test --project=firefox

# Webkitのみ
npx playwright test --project=webkit

# 全ブラウザで実行
npx playwright test --project=chromium --project=firefox --project=webkit
```

## テスト設定

### playwright.config.ts

- **testDir**: `./e2e` - テストディレクトリ
- **baseURL**: `http://localhost:3000` - アプリケーションのベースURL
- **timeout**: 30秒 - テストタイムアウト
- **retries**: CI環境で2回、ローカルで0回
- **workers**: CI環境で1、ローカルで並列実行

### ブラウザ設定

- **Chromium**: デスクトップChrome
- **Firefox**: デスクトップFirefox
- **Webkit**: デスクトップSafari

## テストカバレッジ

### ページカバレッジ

- ✅ ホームページ（`/`）
- ✅ 案件一覧ページ（`/sales/projects`）
- ✅ クライアント一覧ページ（`/sales/clients`）
- ✅ 404ページ

### 機能カバレッジ

- ✅ ページナビゲーション
- ✅ 検索機能
- ✅ フィルタリング機能
- ✅ ソート機能
- ✅ ページネーション
- ✅ ダイアログ操作
- ✅ フォーム入力・バリデーション
- ✅ ボタン操作
- ✅ キーボードナビゲーション
- ✅ レスポンシブデザイン

### UIコンポーネントカバレッジ

- ✅ ボタン（プライマリ、ゴースト、アイコン）
- ✅ 入力フィールド
- ✅ セレクトボックス
- ✅ テーブル
- ✅ バッジ
- ✅ カード
- ✅ ダイアログ
- ✅ アイコン
- ✅ レスポンシブレイアウト

## テスト実行環境

### 前提条件

1. アプリケーションが `http://localhost:3000` で起動していること
2. Playwrightブラウザがインストールされていること

### 環境セットアップ

```bash
# 依存関係のインストール
npm install

# Playwrightブラウザのインストール
npx playwright install

# アプリケーションの起動
npm run dev
```

### CI/CD環境での実行

```bash
# CI環境でのテスト実行
npm run e2e:ci

# ヘッドレスモードでの実行
npm run e2e
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. ブラウザが見つからないエラー

```bash
npx playwright install
```

#### 2. アプリケーションが起動していない

```bash
npm run dev
```

#### 3. テストがタイムアウトする

- ネットワークの状態を確認
- `playwright.config.ts`のタイムアウト設定を調整

#### 4. 特定のテストが失敗する

```bash
# デバッグモードで実行
npx playwright test --debug [テストファイル名]

# ヘッドモードで実行
npx playwright test --headed [テストファイル名]
```

#### 5. テストレポートが表示されない

```bash
npm run e2e:report
```

## テスト戦略

### テストの分類

1. **スモークテスト**: 基本的なページアクセス
2. **機能テスト**: 主要機能の動作確認
3. **UIテスト**: コンポーネントの表示・操作確認
4. **統合テスト**: 複数機能の連携確認

### テストの優先度

1. **高**: 基本的なページアクセス、主要機能
2. **中**: フォーム操作、フィルタリング
3. **低**: UIコンポーネントの詳細、レスポンシブ

### パフォーマンス考慮

- テストの並列実行
- 必要最小限の待機時間
- 効率的なセレクター使用
- 適切なタイムアウト設定

## 参考資料

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
