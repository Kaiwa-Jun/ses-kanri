# ルール選択ガイド

このファイルは実装指示の際に参照する唯一のルールファイルです。
実装内容に応じて、以下の該当するルールファイルを自動的に参照してください。

## フロントエンド実装

### Reactコンポーネント・UI実装の場合

**参照ルール:**

- `@.cursor/rules/coding-rules/frontend-implementation.md` - フロントエンド実装ルール
- `@.cursor/rules/domain-knowledge/ux-design.md` - UI設計・ユーザーペルソナ
- `@.cursor/rules/domain-knowledge/data-models.md` - データ型定義

### フォーム実装の場合

**参照ルール:**

- `@.cursor/rules/coding-rules/form-implementation.md` - フォーム実装ルール
- `@.cursor/rules/domain-knowledge/ux-design.md` - UI設計・ユーザーペルソナ
- `@.cursor/rules/domain-knowledge/data-models.md` - データ型定義

## バックエンド実装

### API・ルート実装の場合

**参照ルール:**

- `@.cursor/rules/coding-rules/backend-api-routes.md` - API実装ルール
- `@.cursor/rules/domain-knowledge/data-models.md` - データ型定義
- `@.cursor/rules/domain-knowledge/business-domain.md` - ビジネスロジック要件

### Supabaseクライアント・データベース操作の場合

**参照ルール:**

- `@.cursor/rules/coding-rules/backend-supabase-client.md` - Supabaseクライアント実装ルール
- `@.cursor/rules/domain-knowledge/database-design.md` - データベース設計
- `@.cursor/rules/domain-knowledge/data-models.md` - データ型定義

### データベース設計・マイグレーションの場合

**参照ルール:**

- `@.cursor/rules/coding-rules/backend-database-design.md` - データベース設計ルール
- `@.cursor/rules/domain-knowledge/database-design.md` - データベース設計
- `@.cursor/rules/coding-rules/backend-security.md` - セキュリティ要件

## 品質管理・開発プロセス

### コード品質・テスト実装の場合

**参照ルール:**

- `@.cursor/rules/coding-rules/quality-standards.md` - 品質基準
- `@.cursor/rules/operations/testing-guidelines.md` - テストガイドライン
- `@.cursor/rules/operations/development-process.md` - 開発プロセス

### セキュリティ要件が関わる場合

**参照ルール:**

- `@.cursor/rules/coding-rules/backend-security.md` - セキュリティ実装ルール
- `@.cursor/rules/domain-knowledge/business-domain.md` - ビジネス要件
- `@.cursor/rules/coding-rules/quality-standards.md` - 品質基準

## 開発・運用プロセス

### 開発プロセス・ブランチ戦略の場合

**参照ルール:**

- `@.cursor/rules/operations/development-process.md` - 開発プロセス
- `@.cursor/rules/operations/development-mcp-usage.md` - MCP使用方法

### テスト実装・テスト戦略の場合

**参照ルール:**

- `@.cursor/rules/operations/testing-guidelines.md` - テストガイドライン
- `@.cursor/rules/coding-rules/quality-standards.md` - 品質基準

## 使用方法

実装指示の際は、以下のように単一のメンションで指示してください：

```
@.cursor/rules/rule-selector.md を参照して、エンジニア管理画面のReactコンポーネントを作成してください
```

```
@.cursor/rules/rule-selector.md を参照して、エンジニア検索APIを実装してください
```

```
@.cursor/rules/rule-selector.md を参照して、契約管理のデータベースマイグレーションを作成してください
```

このファイルに基づいて、実装内容に応じた適切なルールファイルを自動的に参照し、それらのルールに従って実装を進めてください。
