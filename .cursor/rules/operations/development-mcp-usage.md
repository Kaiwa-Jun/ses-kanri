# MCP開発支援使用規約

## 基本原則

- **MCPは開発支援ツールとして使用する**
- **本番システムの処理には従来のSupabaseクライアントを使用**
- **開発環境の構築・管理にMCPを活用**
- **テストデータの作成・管理を効率化**
- **型定義の自動生成・更新を実現**

## MCP使用場面

### 開発時のMCP使用パターン

```typescript
// ✅ MCP使用場面
const mcpUsageScenarios = {
  // 開発環境の構築
  environmentSetup: {
    tools: ['mcp_supabase_create_project', 'mcp_supabase_create_branch'],
    purpose: '開発環境の初期構築',
  },

  // データベーススキーマの管理
  schemaManagement: {
    tools: ['mcp_supabase_apply_migration', 'mcp_supabase_list_migrations'],
    purpose: 'テーブル作成、マイグレーション実行',
  },

  // テストデータの投入
  testDataSeeding: {
    tools: ['mcp_supabase_execute_sql'],
    purpose: 'テストデータの作成・更新',
  },

  // 型定義の生成
  typeGeneration: {
    tools: ['mcp_supabase_generate_typescript_types'],
    purpose: 'Database型定義の自動生成',
  },

  // 開発環境の管理
  environmentManagement: {
    tools: ['mcp_supabase_list_branches', 'mcp_supabase_merge_branch'],
    purpose: 'ブランチ管理、環境切り替え',
  },
};

// ❌ MCP使用禁止場面
const prohibitedMcpUsage = {
  // 本番データの操作
  productionOperations: '本番環境でのデータ操作は従来のSupabaseクライアントを使用',

  // リアルタイム処理
  realtimeProcessing: 'リアルタイム機能は従来のクライアントライブラリを使用',

  // ユーザー向け機能
  userFacingFeatures: 'ユーザーが直接使用する機能は従来の実装を使用',
};
```

## 開発環境管理

### プロジェクト・ブランチ管理

```typescript
// 開発環境の作成手順
interface DevelopmentEnvironmentSetup {
  // 1. 新規プロジェクト作成（初回のみ）
  createProject: {
    tool: 'mcp_supabase_create_project';
    parameters: {
      name: string;
      organization_id: string;
      region?: string;
    };
    example: {
      name: 'ses-kanri-dev';
      organization_id: 'your-org-id';
      region: 'ap-northeast-1';
    };
  };

  // 2. 開発ブランチ作成
  createBranch: {
    tool: 'mcp_supabase_create_branch';
    parameters: {
      project_id: string;
      name: string;
    };
    example: {
      project_id: 'main-project-id';
      name: 'feature/user-management';
    };
  };

  // 3. ブランチ一覧確認
  listBranches: {
    tool: 'mcp_supabase_list_branches';
    parameters: {
      project_id: string;
    };
  };
}

// ブランチ命名規則
const branchNamingConvention = {
  feature: 'feature/機能名', // 新機能開発
  bugfix: 'bugfix/修正内容', // バグ修正
  hotfix: 'hotfix/緊急修正内容', // 緊急修正
  experiment: 'experiment/実験内容', // 実験的機能

  examples: [
    'feature/project-management',
    'feature/user-authentication',
    'bugfix/project-list-pagination',
    'hotfix/security-vulnerability',
    'experiment/ai-recommendation',
  ],
};
```

### マイグレーション管理

```typescript
// マイグレーション実行パターン
interface MigrationManagement {
  // 1. マイグレーション一覧確認
  listMigrations: {
    tool: 'mcp_supabase_list_migrations';
    purpose: '現在適用されているマイグレーションの確認';
  };

  // 2. 新しいマイグレーション適用
  applyMigration: {
    tool: 'mcp_supabase_apply_migration';
    parameters: {
      project_id: string;
      name: string;
      query: string;
    };
    example: {
      project_id: 'branch-project-id';
      name: 'create_user_profiles_table';
      query: `
        CREATE TABLE user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'sales', 'engineer')),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
        CREATE INDEX idx_user_profiles_role ON user_profiles(role);
      `;
    };
  };
}

// マイグレーション命名規則
const migrationNamingConvention = {
  create: 'create_テーブル名_table',
  alter: 'alter_テーブル名_カラム名',
  add: 'add_カラム名_to_テーブル名',
  drop: 'drop_カラム名_from_テーブル名',
  index: 'add_index_テーブル名_カラム名',

  examples: [
    'create_projects_table',
    'add_status_to_projects',
    'alter_projects_budget_type',
    'add_index_projects_client_id',
    'create_project_assignments_table',
  ],
};
```

## テストデータ管理

### テストデータ作成パターン

```typescript
// テストデータ作成の標準パターン
interface TestDataPatterns {
  // 1. 基本マスターデータ
  masterData: {
    users: string;
    clients: string;
    skills: string;
  };

  // 2. 関連データ
  relationalData: {
    projects: string;
    assignments: string;
    contracts: string;
  };

  // 3. 大量データ（パフォーマンステスト用）
  bulkData: {
    projects: string;
    timeRecords: string;
  };
}

// 基本マスターデータのSQL例
const masterDataSQL = {
  users: `
    -- 管理者ユーザー
    INSERT INTO user_profiles (user_id, name, email, role, department) VALUES
    ('00000000-0000-0000-0000-000000000001', '田中 太郎', 'admin@ses-kanri.com', 'admin', '管理部'),
    ('00000000-0000-0000-0000-000000000002', '佐藤 花子', 'sales@ses-kanri.com', 'sales', '営業部'),
    ('00000000-0000-0000-0000-000000000003', '鈴木 一郎', 'engineer@ses-kanri.com', 'engineer', '開発部');
  `,

  clients: `
    -- クライアント企業
    INSERT INTO clients (id, name, company, email, industry) VALUES
    ('10000000-0000-0000-0000-000000000001', '山田 次郎', 'ABC株式会社', 'yamada@abc.com', 'IT'),
    ('10000000-0000-0000-0000-000000000002', '高橋 三郎', 'XYZ商事', 'takahashi@xyz.com', '商社'),
    ('10000000-0000-0000-0000-000000000003', '渡辺 四郎', 'DEF銀行', 'watanabe@def.com', '金融');
  `,

  skills: `
    -- スキルマスター
    INSERT INTO skills (name, category, level) VALUES
    ('JavaScript', 'プログラミング言語', 'intermediate'),
    ('TypeScript', 'プログラミング言語', 'intermediate'),
    ('React', 'フレームワーク', 'intermediate'),
    ('Next.js', 'フレームワーク', 'advanced'),
    ('Node.js', 'ランタイム', 'intermediate'),
    ('PostgreSQL', 'データベース', 'intermediate'),
    ('AWS', 'クラウド', 'basic'),
    ('Docker', 'インフラ', 'basic');
  `,

  projects: `
    -- サンプルプロジェクト
    INSERT INTO projects (id, name, description, client_id, created_by, start_date, end_date, budget, status, required_skills) VALUES
    (
      '20000000-0000-0000-0000-000000000001',
      'ECサイト構築プロジェクト',
      'Next.js + Supabaseを使用したECサイトの構築',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
      '2024-01-01',
      '2024-03-31',
      5000000,
      'active',
      ARRAY['JavaScript', 'TypeScript', 'React', 'Next.js']
    ),
    (
      '20000000-0000-0000-0000-000000000002',
      '在庫管理システム改修',
      '既存システムのReact化とパフォーマンス改善',
      '10000000-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000002',
      '2024-02-01',
      '2024-05-31',
      3000000,
      'planning',
      ARRAY['React', 'Node.js', 'PostgreSQL']
    );
  `,

  assignments: `
    -- プロジェクト割り当て
    INSERT INTO project_assignments (project_id, user_id, role, start_date, end_date, hourly_rate) VALUES
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'フロントエンドエンジニア', '2024-01-01', '2024-03-31', 8000),
    ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'フルスタックエンジニア', '2024-02-01', '2024-05-31', 9000);
  `,
};

// 大量データ生成（パフォーマンステスト用）
const bulkDataSQL = {
  projects: `
    -- 大量プロジェクトデータ生成
    INSERT INTO projects (name, description, client_id, created_by, start_date, budget, status)
    SELECT 
      'テストプロジェクト_' || generate_series,
      'パフォーマンステスト用のプロジェクト_' || generate_series,
      (ARRAY['10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003'])[floor(random() * 3 + 1)],
      '00000000-0000-0000-0000-000000000002',
      CURRENT_DATE + (generate_series || ' days')::interval,
      floor(random() * 5000000 + 1000000),
      (ARRAY['planning', 'active', 'completed'])[floor(random() * 3 + 1)]
    FROM generate_series(1, 1000);
  `,
};
```

### テストデータ管理手順

```typescript
// テストデータ投入手順
interface TestDataManagementProcess {
  // 1. 既存データのクリア
  clearData: {
    tool: 'mcp_supabase_execute_sql';
    query: `
      -- 外部キー制約のため、順序に注意
      DELETE FROM project_assignments;
      DELETE FROM projects;
      DELETE FROM clients;
      DELETE FROM user_profiles WHERE user_id != auth.uid();
      DELETE FROM skills;
    `;
  };

  // 2. マスターデータの投入
  seedMasterData: {
    tool: 'mcp_supabase_execute_sql';
    queries: [masterDataSQL.users, masterDataSQL.clients, masterDataSQL.skills];
  };

  // 3. 関連データの投入
  seedRelationalData: {
    tool: 'mcp_supabase_execute_sql';
    queries: [masterDataSQL.projects, masterDataSQL.assignments];
  };

  // 4. データ投入確認
  verifyData: {
    tool: 'mcp_supabase_execute_sql';
    query: `
      SELECT 
        'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
      UNION ALL
      SELECT 'clients', COUNT(*) FROM clients
      UNION ALL
      SELECT 'projects', COUNT(*) FROM projects
      UNION ALL
      SELECT 'project_assignments', COUNT(*) FROM project_assignments;
    `;
  };
}

// テストシナリオ別データセット
const testScenarios = {
  // 基本機能テスト
  basic: {
    description: '基本的なCRUD操作のテスト',
    dataSize: 'small',
    users: 5,
    clients: 3,
    projects: 10,
  },

  // パフォーマンステスト
  performance: {
    description: 'パフォーマンステスト用の大量データ',
    dataSize: 'large',
    users: 100,
    clients: 50,
    projects: 1000,
  },

  // セキュリティテスト
  security: {
    description: 'セキュリティテスト用の特殊データ',
    dataSize: 'medium',
    specialCases: ['SQLインジェクション攻撃パターン', 'XSS攻撃パターン', '権限昇格テストパターン'],
  },
};
```

## 型定義管理

### 型定義生成・更新

```typescript
// 型定義生成の手順
interface TypeDefinitionManagement {
  // 1. 型定義生成
  generateTypes: {
    tool: 'mcp_supabase_generate_typescript_types';
    parameters: {
      project_id: string;
    };
    outputPath: 'types/database.ts';
  };

  // 2. 生成された型定義の確認
  verifyTypes: {
    checks: ['テーブル定義の完整性', '型の正確性', 'エクスポートの確認'];
  };

  // 3. カスタム型定義の追加
  extendTypes: {
    filePath: 'types/custom.ts';
    purpose: 'アプリケーション固有の型拡張';
  };
}

// 型定義更新のタイミング
const typeUpdateTriggers = {
  // データベーススキーマ変更時
  schemaChange: {
    trigger: 'マイグレーション実行後',
    action: '型定義の再生成',
    verification: 'TypeScriptコンパイルエラーの確認',
  },

  // 新機能開発開始時
  featureDevelopment: {
    trigger: '新機能ブランチ作成時',
    action: '最新の型定義を取得',
    verification: '開発環境での型チェック',
  },

  // 定期更新
  scheduled: {
    trigger: '週次定期更新',
    action: '型定義の同期確認',
    verification: 'CI/CDでの型チェック',
  },
};

// 型定義ファイル構成
const typeFileStructure = {
  'types/database.ts': 'Supabaseから自動生成される型定義',
  'types/custom.ts': 'アプリケーション固有の型定義',
  'types/api.ts': 'API関連の型定義',
  'types/forms.ts': 'フォーム関連の型定義',
  'types/index.ts': '型定義のエクスポート集約',
};
```

### 型定義品質チェック

```typescript
// 型定義の品質チェック項目
interface TypeQualityChecks {
  // 1. 型の完整性チェック
  completenessCheck: {
    items: [
      'すべてのテーブルが型定義に含まれている',
      'すべてのカラムが正しい型で定義されている',
      '外部キー関係が適切に表現されている',
    ];
  };

  // 2. 型安全性チェック
  safetyCheck: {
    items: [
      'any型が使用されていない',
      'null/undefinedの扱いが明確',
      'Enum型が適切に定義されている',
    ];
  };

  // 3. 一貫性チェック
  consistencyCheck: {
    items: [
      '命名規則が統一されている',
      'コメントが適切に付与されている',
      '関連型が適切にグループ化されている',
    ];
  };
}

// 型定義の自動検証スクリプト
const typeValidationScript = `
// package.jsonのscripts
{
  "type-check": "tsc --noEmit",
  "type-generate": "supabase gen types typescript --project-id=PROJECT_ID > types/database.ts",
  "type-validate": "npm run type-generate && npm run type-check",
  "type-update": "npm run type-validate && git add types/ && git commit -m 'Update type definitions'"
}
`;
```

## 開発フロー統合

### 開発開始時の手順

```typescript
// 新機能開発開始時のMCP使用フロー
interface DevelopmentStartupFlow {
  // Phase 1: 環境準備
  environmentSetup: {
    steps: [
      {
        action: '開発ブランチ作成';
        tool: 'mcp_supabase_create_branch';
        parameters: {
          project_id: 'main-project-id';
          name: 'feature/new-feature';
        };
      },
      {
        action: '型定義生成';
        tool: 'mcp_supabase_generate_typescript_types';
        parameters: {
          project_id: 'branch-project-id';
        };
      },
    ];
  };

  // Phase 2: データベース設定
  databaseSetup: {
    steps: [
      {
        action: 'マイグレーション適用';
        tool: 'mcp_supabase_apply_migration';
        description: '新機能に必要なテーブル・カラムの追加';
      },
      {
        action: 'テストデータ投入';
        tool: 'mcp_supabase_execute_sql';
        description: '開発・テスト用のサンプルデータ作成';
      },
    ];
  };

  // Phase 3: 開発環境確認
  environmentVerification: {
    steps: [
      {
        action: 'データベース接続確認';
        verification: 'アプリケーションからのDB接続テスト';
      },
      {
        action: '型定義動作確認';
        verification: 'TypeScriptコンパイルエラーがないことを確認';
      },
    ];
  };
}
```

### 開発完了時の手順

```typescript
// 開発完了時のMCP使用フロー
interface DevelopmentCompletionFlow {
  // Phase 1: 環境整理
  environmentCleanup: {
    steps: [
      {
        action: 'テストデータの整理';
        tool: 'mcp_supabase_execute_sql';
        description: '不要なテストデータの削除';
      },
      {
        action: 'マイグレーションの確認';
        tool: 'mcp_supabase_list_migrations';
        description: '適用されたマイグレーションの整理';
      },
    ];
  };

  // Phase 2: 本番準備
  productionPreparation: {
    steps: [
      {
        action: 'ブランチマージ';
        tool: 'mcp_supabase_merge_branch';
        description: '開発ブランチを本番にマージ';
      },
      {
        action: '型定義更新';
        tool: 'mcp_supabase_generate_typescript_types';
        description: '本番環境の型定義を更新';
      },
    ];
  };

  // Phase 3: 環境削除
  environmentDeletion: {
    steps: [
      {
        action: '開発ブランチ削除';
        tool: 'mcp_supabase_delete_branch';
        description: '不要になった開発ブランチの削除';
      },
    ];
  };
}
```

## トラブルシューティング

### よくある問題と対処法

```typescript
// MCP使用時のトラブルシューティング
interface McpTroubleshooting {
  // 1. ブランチ作成エラー
  branchCreationError: {
    symptoms: ['ブランチ作成が失敗する', 'コスト確認エラー'];
    solutions: [
      'mcp_supabase_get_costでコスト確認',
      'mcp_supabase_confirm_costで承認',
      '組織の課金設定確認',
    ];
  };

  // 2. マイグレーション実行エラー
  migrationError: {
    symptoms: ['SQL実行エラー', '制約違反エラー'];
    solutions: [
      'SQLシンタックスの確認',
      '外部キー制約の確認',
      '既存データとの整合性確認',
      'mcp_supabase_list_migrationsで現状確認',
    ];
  };

  // 3. 型定義生成エラー
  typeGenerationError: {
    symptoms: ['型定義が生成されない', '不正な型が生成される'];
    solutions: [
      'プロジェクトIDの確認',
      'データベーススキーマの確認',
      '権限設定の確認',
      '手動での型定義修正',
    ];
  };

  // 4. テストデータ投入エラー
  testDataError: {
    symptoms: ['データ投入が失敗する', '制約エラー'];
    solutions: [
      'データの順序確認（外部キー制約）',
      'UUIDの重複確認',
      'データ型の確認',
      '既存データのクリア',
    ];
  };
}

// エラー対処の基本フロー
const errorHandlingFlow = {
  // 1. エラー情報の収集
  collectErrorInfo: [
    'エラーメッセージの記録',
    '実行したMCPツールとパラメータ',
    'プロジェクトIDとブランチ情報',
    '実行時の環境情報',
  ],

  // 2. 基本的な確認事項
  basicChecks: ['インターネット接続', 'Supabaseプロジェクトのステータス', '権限設定', '課金状況'],

  // 3. 段階的な対処
  stepByStepSolution: [
    '最小限の操作で再現確認',
    'ドキュメントとの照合',
    '類似ケースの調査',
    '必要に応じてサポートへの問い合わせ',
  ],
};
```

## ベストプラクティス

### MCP使用のベストプラクティス

```typescript
// MCP使用時のベストプラクティス
const mcpBestPractices = {
  // 1. 環境管理
  environmentManagement: [
    '開発ブランチは機能単位で作成',
    'ブランチ名は命名規則に従う',
    '不要になったブランチは速やかに削除',
    '本番環境への影響を常に考慮',
  ],

  // 2. データ管理
  dataManagement: [
    'テストデータは標準化されたセットを使用',
    '個人情報を含むデータは避ける',
    'データサイズは必要最小限に',
    'データの依存関係を明確にする',
  ],

  // 3. マイグレーション管理
  migrationManagement: [
    'マイグレーションは小さな単位で実行',
    'ロールバック可能な設計を心がける',
    'マイグレーション名は内容を表す命名',
    '本番適用前に十分なテスト',
  ],

  // 4. 型定義管理
  typeManagement: [
    '型定義は定期的に更新',
    'カスタム型定義は別ファイルで管理',
    '型の変更は影響範囲を確認',
    'TypeScriptの厳格設定を活用',
  ],

  // 5. セキュリティ
  security: [
    '開発環境でも機密情報は適切に管理',
    'テストデータに実データを使用しない',
    '権限は最小限に設定',
    'アクセスログを定期的に確認',
  ],
};

// 効率的な開発のためのTips
const developmentTips = {
  // 1. 作業の自動化
  automation: [
    'よく使用するMCP操作はスクリプト化',
    'テストデータ投入の自動化',
    '型定義更新の自動化',
    'CI/CDとの連携',
  ],

  // 2. チーム連携
  teamCollaboration: [
    'ブランチ作成・削除の共有',
    'マイグレーションの調整',
    'テストデータの標準化',
    'トラブル事例の共有',
  ],

  // 3. 品質管理
  qualityControl: [
    '型定義の定期チェック',
    'データ整合性の確認',
    'パフォーマンスの監視',
    'セキュリティの確認',
  ],
};
```
