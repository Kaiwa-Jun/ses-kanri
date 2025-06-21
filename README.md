# SESエンジニア管理アプリケーション

[![CI](https://github.com/[YOUR_GITHUB_USERNAME]/ses-kanri/actions/workflows/ci.yml/badge.svg)](https://github.com/[YOUR_GITHUB_USERNAME]/ses-kanri/actions/workflows/ci.yml)
[![Lint](https://github.com/[YOUR_GITHUB_USERNAME]/ses-kanri/actions/workflows/lint.yml/badge.svg)](https://github.com/[YOUR_GITHUB_USERNAME]/ses-kanri/actions/workflows/lint.yml)

SES企業向けの営業担当者とエンジニアの業務を効率化するための業務支援ツールです。

## 機能概要

### 営業担当者向け機能

#### 1. ダッシュボード (/sales/dashboard)

- エンジニア総数、案件総数などの重要指標の表示
- 案件状況の円グラフ表示
- エンジニア稼働状況の円グラフ表示
- 月別案件推移のグラフ表示
- スキル需要ランキングの表示

#### 2. 案件管理 (/sales/projects)

- 案件一覧の表示と検索
- 新規案件の登録
- 案件詳細の表示・編集
- マッチするエンジニアの表示とアサイン機能

#### 3. エンジニア管理 (/sales/engineers)

- エンジニア一覧の表示と検索
- エンジニー詳細情報の表示
- スキルシートの表示・出力
- 案件履歴の確認

#### 4. 契約管理 (/sales/contracts)

- 契約書一覧の表示と検索
- 新規契約書の作成
- 契約書の詳細表示・編集
- 契約書のステータス管理

#### 5. マイページ (/sales/mypage)

- 担当案件の確認
- 契約確認タスクの管理
- スケジュール管理

### エンジニア向け機能

#### 1. ダッシュボード (/engineer/dashboard)

- 現在の案件情報の表示
- 稼働状況の確認
- ToDo管理
- プロフィール情報の表示

#### 2. 稼働報告 (/engineer/reports)

- 日次稼働報告の入力
- 月次レポートの作成
- 稼働実績の確認
- 承認状況の確認

#### 3. スキル情報 (/engineer/skills)

- スキル一覧の表示・編集
- スキルレベルの管理
- 経験年数の管理
- スキル分析の表示

#### 4. 案件履歴 (/engineer/history)

- 参加案件の一覧表示
- 案件詳細の確認
- 新規案件の追加

#### 5. 職務経歴書 (/engineer/resume)

- 職務経歴書の作成
- 基本情報の入力
- スキル情報の入力
- 案件履歴の入力

#### 6. 通知 (/engineer/notifications)

- 重要な通知の確認
- 稼働報告リマインダー
- タスク期限の通知

## 技術スタック

- フレームワーク: Next.js
- UIライブラリ: React
- スタイリング: Tailwind CSS
- UIコンポーネント: shadcn/ui
- グラフ表示: Recharts
- アイコン: Lucide React
- アニメーション: Framer Motion

## Docker環境での実行

### 開発環境

開発環境でDockerを使用してアプリケーションを起動する場合：

```bash
# Dockerコンテナの起動
docker-compose up -d

# ログの確認
docker-compose logs -f

# コンテナの停止
docker-compose down
```

開発環境では、ホットリロードが有効になっており、ソースコードの変更が自動的に反映されます。

### 本番環境

本番環境用の最適化されたDockerイメージを使用する場合：

```bash
# 本番環境用のコンテナの起動
docker-compose -f docker-compose.prod.yml up -d

# ログの確認
docker-compose -f docker-compose.prod.yml logs -f

# コンテナの停止
docker-compose -f docker-compose.prod.yml down
```

### Dockerコマンド一覧

```bash
# イメージのビルド
docker-compose build

# コンテナの起動（バックグラウンド）
docker-compose up -d

# コンテナの起動（フォアグラウンド）
docker-compose up

# 実行中のコンテナ確認
docker-compose ps

# コンテナの停止
docker-compose stop

# コンテナの停止と削除
docker-compose down

# コンテナとボリュームの削除
docker-compose down -v

# ログの確認
docker-compose logs

# 特定のサービスのログ確認
docker-compose logs app

# リアルタイムログの確認
docker-compose logs -f

# コンテナ内でコマンド実行
docker-compose exec app sh

# イメージの再ビルド
docker-compose build --no-cache
```

### 注意事項

- 開発環境では `node_modules` と `.next` ディレクトリがボリュームとして除外されているため、パッケージの追加・更新時はコンテナの再ビルドが必要です
- 本番環境では、Next.jsのスタンドアロンモードを使用して最適化されたイメージを作成しています
- ポート3000がデフォルトで使用されます。必要に応じて `docker-compose.yml` で変更してください

## GitHub Actions CI/CD

このプロジェクトでは、GitHub Actionsを使用した継続的インテグレーション（CI）が設定されています。

### ワークフロー

#### 1. CI（`.github/workflows/ci.yml`）

mainブランチとdevelopブランチへのプッシュ・プルリクエスト時に実行されます。

- **Lint and Type Check**: ESLintとTypeScriptの型チェックを実行
- **Build**: Next.jsアプリケーションのビルド
- **Docker Build**: 開発用・本番用のDockerイメージのビルド
- **Test Docker**: Dockerコンテナの起動テスト

#### 2. Lint（`.github/workflows/lint.yml`）

プルリクエスト時に実行される軽量なLint専用ワークフロー。

- ESLintの実行
- TypeScriptの型チェック
- PRへの結果コメント投稿

#### 3. Dependency Review（`.github/workflows/dependency-review.yml`）

プルリクエスト時に依存関係のセキュリティチェックを実行。

### ローカルでのLint実行

```bash
# ESLintの実行
npm run lint

# TypeScriptの型チェック
npx tsc --noEmit
```

### CI/CDの設定

1. GitHubリポジトリの設定で、ブランチ保護ルールを設定することを推奨します
2. 必要に応じて、環境変数をGitHub Secretsに設定してください
3. READMEのバッジのURLを実際のGitHubユーザー名に更新してください

## Git Hooks

ローカル開発環境でのコード品質を保つため、Huskyを使用してGit hooksを設定しています。

### 自動実行されるチェック

- **pre-commit**: コミット時にステージングされたファイルに対してLintとフォーマットを実行
- **pre-push**: プッシュ前にLint、型チェック、フォーマットチェックを実行

### 利用可能なコマンド

```bash
# Lintエラーを修正
npm run lint:fix

# コードフォーマット
npm run format

# フォーマットチェック
npm run format:check

# TypeScript型チェック
npm run type-check

# すべてのチェック + ビルド
npm run validate
```
