# SES管理システム開発規約

## 概要

このディレクトリには、SES（システムエンジニアリングサービス）管理システムの開発における包括的な規約とガイドラインが含まれています。

## 技術スタック

- **フロントエンド**: Next.js + TypeScript + Tailwind CSS + shadcn/ui
- **バックエンド**: Next.js API Routes + Supabase
- **開発支援**: MCP（Model Context Protocol）Supabaseサーバー
- **テスト**: Jest + React Testing Library + Playwright

## ディレクトリ構造

```
.cursor/rules/
├── coding-rules/           # コーディング規約
│   ├── backend/           # バックエンド固有の規約
│   │   ├── api-routes.md         # Next.js API Routes実装規約
│   │   ├── supabase-client.md    # Supabaseクライアント実装規約
│   │   ├── database-design.md    # Database設計・型定義規約
│   │   └── security.md           # バックエンドセキュリティ規約
│   ├── frontend/          # フロントエンド固有の規約
│   │   ├── implementation.md     # フロントエンド実装規約
│   │   └── form-implementation.md # フォーム実装詳細規約
│   └── shared/           # 共通規約
│       └── quality-standards.md  # 品質基準・型安全性規約
├── operations/           # 運用・プロセス規約
│   └── development-mcp-usage.md  # MCP開発支援使用規約
└── domain-knowledge/     # ドメイン固有知識
    ├── ses-domain-types.md       # SES管理ドメイン型定義
    └── test-guidelines.md        # テストガイドライン
```

## 規約の分類

### バックエンド規約 (`coding-rules/backend/`)

サーバーサイド開発に関する規約群：

1. **API Routes実装規約** (`api-routes.md`)

   - Next.js API Routesの統一実装パターン
   - 認証・認可ミドルウェア
   - エラーハンドリング
   - バリデーション

2. **Supabaseクライアント実装規約** (`supabase-client.md`)

   - 環境別クライアント設定
   - 認証状態管理
   - サービス層実装
   - リアルタイム機能

3. **Database設計・型定義規約** (`database-design.md`)

   - テーブル設計規約
   - Row Level Security設計
   - インデックス設計
   - マイグレーション管理

4. **バックエンドセキュリティ規約** (`security.md`)
   - 認証・認可システム
   - 入力値検証・サニタイゼーション
   - 暗号化・データ保護
   - 監査ログシステム

### フロントエンド規約 (`coding-rules/frontend/`)

クライアントサイド開発に関する規約群：

1. **フロントエンド実装規約** (`implementation.md`)

   - TypeScript型定義
   - React Hook Form + Zod実装
   - shadcn/uiコンポーネント活用
   - カスタムhooks

2. **フォーム実装詳細規約** (`form-implementation.md`)
   - Zodスキーマ設計
   - フォームコンポーネント実装
   - バリデーション
   - エラーハンドリング

### 共通規約 (`coding-rules/shared/`)

フロントエンドとバックエンド共通の規約：

1. **品質基準・型安全性規約** (`quality-standards.md`)
   - TypeScript設定
   - エラーハンドリング
   - コード品質
   - パフォーマンス
   - セキュリティ
   - テスト

### 運用規約 (`operations/`)

開発プロセスと運用に関する規約：

1. **MCP開発支援使用規約** (`development-mcp-usage.md`)
   - MCP使用場面の明確化
   - 開発環境管理
   - マイグレーション管理
   - テストデータ管理

### ドメイン知識 (`domain-knowledge/`)

SES管理システム固有の知識：

1. **SES管理ドメイン型定義** (`ses-domain-types.md`)

   - エンティティ型定義
   - ビジネスロジック型
   - API型定義

2. **テストガイドライン** (`test-guidelines.md`)
   - テスト戦略
   - 単体テスト
   - 統合テスト
   - E2Eテスト

## 規約の特徴

### 1. 型安全性の徹底

- すべての関数、API、データベース操作に明示的型定義
- TypeScript strictモードの活用
- Zodによる実行時バリデーション

### 2. セキュリティファースト

- 認証・認可必須
- 入力値検証・サニタイゼーション
- 監査ログ記録
- セキュリティ監視

### 3. MCP統合開発

- 開発支援ツールとしてのMCP活用
- 本番環境は従来のSupabase実装
- 開発効率の向上

### 4. 保守性・拡張性

- サービス層パターン
- 統一エラーハンドリング
- 包括的テスト戦略
- 明確な責任分離

### 5. AI最適化

- AIが一貫性を持って開発できる構造化されたプロセス
- 明確な実装パターン
- 詳細なコード例

## 使用方法

### 新機能開発時

1. **要件確認**: `domain-knowledge/` でドメイン知識を確認
2. **設計**: 該当する規約ファイルで実装パターンを確認
3. **実装**: 規約に従ってコーディング
4. **テスト**: `test-guidelines.md` に従ってテスト実装
5. **レビュー**: `quality-standards.md` のチェックリストで確認

### バックエンド開発時

1. `coding-rules/backend/` の該当規約を参照
2. `coding-rules/shared/quality-standards.md` で品質基準を確認
3. `operations/development-mcp-usage.md` でMCP活用方法を確認

### フロントエンド開発時

1. `coding-rules/frontend/` の該当規約を参照
2. `coding-rules/shared/quality-standards.md` で品質基準を確認
3. フォーム実装時は `form-implementation.md` を詳細参照

## 規約の更新

規約は開発チームの学習と経験に基づいて継続的に更新されます：

- 新しいベストプラクティスの発見
- パフォーマンス改善の知見
- セキュリティ要件の変更
- 技術スタックの更新

## 注意事項

- すべての規約は **必須** です
- 規約に従わない実装は原則として受け入れられません
- 規約の変更は開発チーム全体での合意が必要です
- 疑問や改善提案は積極的に共有してください

## 関連リソース

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Supabase 公式ドキュメント](https://supabase.com/docs)
- [shadcn/ui 公式ドキュメント](https://ui.shadcn.com/)
- [React Hook Form 公式ドキュメント](https://react-hook-form.com/)
- [Zod 公式ドキュメント](https://zod.dev/)
