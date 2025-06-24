# 開発プロセス・手順

## 基本方針

- **AI支援開発に最適化された手順**
- **テスト駆動開発（TDD）の徹底**
- **段階的な実装とレビュー**
- **型安全性の確保**
- **コミット単位での完了**

## 開発フェーズ

### Phase 1: タスク内容の提供

**担当**: 開発者（人間）
**目的**: backlogのタスク内容をAIに明確に伝える

#### 実施内容

- [ ] backlogのタスク詳細を提供
- [ ] 関連する既存コードの場所を指定
- [ ] 期待する動作・結果を明記
- [ ] 制約条件・注意事項を共有

#### 提供すべき情報

```markdown
## タスク概要

- タスクID: [backlog ID]
- タイトル: [タスクタイトル]
- 優先度: [High/Medium/Low]

## 要件詳細

- 機能要件: [具体的な機能説明]
- 非機能要件: [パフォーマンス、セキュリティ等]
- UI/UX要件: [画面仕様、操作フロー]

## 制約・注意事項

- 技術制約: [使用技術、ライブラリ制限]
- ビジネス制約: [期限、予算等]
- 既存システムへの影響: [互換性、移行等]

## 受け入れ条件

- [ ] 条件1
- [ ] 条件2
- [ ] 条件3
```

---

### Phase 2: タスク内容の整理・分析

**担当**: AI
**目的**: タスクを構造化し、実装範囲を明確化する

#### 実施内容

- [ ] 要件の構造化・分解
- [ ] 影響範囲の特定
- [ ] 必要な型定義の洗い出し
- [ ] 依存関係の分析
- [ ] リスク要因の特定

#### 成果物

```typescript
// タスク分析結果の例
interface TaskAnalysis {
  taskId: string;
  title: string;
  requirements: {
    functional: string[];
    nonFunctional: string[];
    ui: string[];
  };
  impactAnalysis: {
    affectedFiles: string[];
    newFiles: string[];
    dependencies: string[];
  };
  typeDefinitions: {
    interfaces: string[];
    types: string[];
    enums: string[];
  };
  risks: {
    technical: string[];
    business: string[];
    timeline: string[];
  };
}
```

---

### Phase 3: 実装設計・手順策定

**担当**: AI
**目的**: 具体的な実装手順とアーキテクチャを設計する

#### 実施内容

- [ ] アーキテクチャ設計
- [ ] ファイル構成の決定
- [ ] 実装順序の決定
- [ ] テストケースの設計
- [ ] マイルストーンの設定

#### 成果物

```markdown
## 実装設計

### アーキテクチャ

- コンポーネント構成
- データフロー
- 状態管理方式

### ファイル構成
```

src/
├── components/
│ ├── [新規コンポーネント]/
├── hooks/
│ ├── [新規カスタムフック].ts
├── lib/
│ ├── api/
│ │ ├── [新規API].ts
├── types/
│ ├── [新規型定義].ts
└── **tests**/
├── [テストファイル群]

```

### 実装順序
1. 型定義の作成
2. APIクライアントの実装
3. カスタムフックの実装
4. コンポーネントの実装
5. 統合テストの実装

### テスト設計
- ユニットテスト: [対象関数・コンポーネント]
- 統合テスト: [APIとの連携テスト]
- E2Eテスト: [ユーザーシナリオ]
```

---

### Phase 4: テスト駆動開発（TDD）による実装

**担当**: AI
**目的**: テストファーストで安全な実装を進める

#### 実施内容

- [ ] **Red**: 失敗するテストを先に作成
- [ ] **Green**: テストが通る最小限のコードを実装
- [ ] **Refactor**: コードの改善・最適化
- [ ] 型定義の実装
- [ ] 段階的な機能実装

#### TDDサイクル

```typescript
// 1. Red: 失敗するテストを作成
describe('UserService', () => {
  it('should create user successfully', async () => {
    const userData = createMockUser();
    const result = await userService.createUser(userData);

    expect(result.success).toBe(true);
    expect(result.data.id).toBeDefined();
  });
});

// 2. Green: テストが通る最小限の実装
export class UserService {
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    // 最小限の実装
    return {
      success: true,
      data: { ...userData, id: 'temp-id' } as User,
    };
  }
}

// 3. Refactor: 実際のロジックを実装
export class UserService {
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
```

#### 実装チェックリスト

- [ ] 型定義が完了している
- [ ] 関数の引数・戻り値に型が付いている
- [ ] Propsインターフェースが定義されている
- [ ] APIレスポンス型が定義されている
- [ ] エラーハンドリングが実装されている
- [ ] バリデーションが実装されている

---

### Phase 5: 実装完了後のテスト実行・検証

**担当**: AI
**目的**: 実装が正しく動作することを確認する

#### 実施内容

- [ ] ユニットテストの実行
- [ ] 統合テストの実行
- [ ] 型チェックの実行
- [ ] リンターチェックの実行
- [ ] ビルドエラーの確認
- [ ] 手動テストシナリオの実行

#### テスト実行コマンド

```bash
# 型チェック
npm run type-check

# リンターチェック
npm run lint

# ユニットテスト
npm run test

# テストカバレッジ
npm run test:coverage

# E2Eテスト
npm run test:e2e

# ビルドチェック
npm run build
```

#### 検証チェックリスト

- [ ] すべてのテストが通る
- [ ] 型エラーがない
- [ ] リンターエラーがない
- [ ] ビルドエラーがない
- [ ] テストカバレッジが基準を満たしている
- [ ] 手動テストが成功している

---

### Phase 6: コード品質チェック・最適化

**担当**: AI
**目的**: コード品質を確保し、最適化を行う

#### 実施内容

- [ ] コードレビュー（自動）
- [ ] パフォーマンス最適化
- [ ] アクセシビリティチェック
- [ ] セキュリティチェック
- [ ] ドキュメントの更新

#### 品質チェック項目

```typescript
// ✅ 型安全性チェック
interface QualityChecklist {
  typeDefinitions: {
    allFunctionsTyped: boolean;
    propsInterfacesDefined: boolean;
    apiResponsesTyped: boolean;
    noAnyTypes: boolean;
  };
  codeQuality: {
    noUnusedVariables: boolean;
    noUnusedImports: boolean;
    consistentNaming: boolean;
    properErrorHandling: boolean;
  };
  performance: {
    memoizationUsed: boolean;
    lazyLoadingImplemented: boolean;
    bundleSizeOptimal: boolean;
  };
  accessibility: {
    semanticHtml: boolean;
    ariaLabels: boolean;
    keyboardNavigation: boolean;
  };
}
```

---

### Phase 7: コミット準備・実行

**担当**: AI
**目的**: 適切なコミットメッセージでコードをコミットする

#### 実施内容

- [ ] 変更ファイルの確認
- [ ] コミットメッセージの作成
- [ ] コミットの実行
- [ ] **pushは禁止**（手動で行う）

#### コミットメッセージ規約

```bash
# 形式: <type>(<scope>): <subject>
#
# type: feat, fix, docs, style, refactor, test, chore
# scope: 影響範囲（component, api, hook等）
# subject: 変更内容の簡潔な説明

# 例
feat(user): ユーザー作成機能を追加

- ユーザー作成フォームコンポーネントを実装
- バリデーション機能を追加
- APIクライアントを実装
- ユニットテスト・E2Eテストを追加

Closes #123
```

#### コミット前チェックリスト

- [ ] すべてのテストが通る
- [ ] 型エラーがない
- [ ] リンターエラーがない
- [ ] 不要なファイルが含まれていない
- [ ] コミットメッセージが適切
- [ ] 関連するissueが記載されている

---

### Phase 8: 完了報告・ドキュメント更新

**担当**: AI
**目的**: 実装完了を報告し、必要なドキュメントを更新する

#### 実施内容

- [ ] 実装完了の報告
- [ ] 変更内容のサマリー作成
- [ ] 今後の課題・改善点の整理
- [ ] 関連ドキュメントの更新提案

#### 完了報告テンプレート

```markdown
## 実装完了報告

### タスク情報

- タスクID: [ID]
- タイトル: [タイトル]
- 実装期間: [開始日] - [完了日]

### 実装内容

- 新規作成ファイル: [ファイル数]個
- 修正ファイル: [ファイル数]個
- 追加テスト: [テスト数]個
- コード行数: +[追加行数] -[削除行数]

### テスト結果

- ユニットテスト: ✅ [通過数]/[総数]
- E2Eテスト: ✅ [通過数]/[総数]
- カバレッジ: [カバレッジ率]%

### 今後の課題

- [ ] 課題1
- [ ] 課題2

### 注意事項

- [運用時の注意点]
- [他の開発者への引き継ぎ事項]
```

## エラー・問題発生時の対応

### Phase中断・やり直し基準

- 要件の大幅な変更が発生した場合
- 技術的な制約が判明した場合
- テストが大量に失敗する場合
- 設計に根本的な問題がある場合

### 問題発生時の対応フロー

1. 問題の特定・分析
2. 影響範囲の確認
3. 解決策の検討
4. 必要に応じてPhaseの巻き戻し
5. 修正後の再実行

## 品質基準

### 各Phaseの完了基準

- **Phase 1-2**: 要件が明確に定義されている
- **Phase 3**: 実装設計が具体的で実行可能
- **Phase 4**: すべてのテストが通る
- **Phase 5**: 品質基準を満たしている
- **Phase 6**: コード品質が基準以上
- **Phase 7**: 適切にコミットされている
- **Phase 8**: 完了報告が適切に作成されている

### 最低品質基準

- テストカバレッジ: 80%以上
- 型安全性: any型の使用禁止
- リンターエラー: 0件
- ビルドエラー: 0件
- E2Eテスト: 主要シナリオ100%通過
