# Database設計・型定義規約

## 基本原則

- **すべてのテーブルに標準的なカラム構成を適用する**
- **Row Level Security（RLS）を必須で設定する**
- **適切なインデックスを設計・実装する**
- **Database関数でビジネスロジックを実装する**
- **マイグレーションファイルを適切に管理する**
- **型定義を自動生成・手動拡張で管理する**

## テーブル設計規約

### 命名規則

```sql
-- テーブル名: snake_case、複数形
CREATE TABLE user_profiles (...);
CREATE TABLE project_assignments (...);
CREATE TABLE skill_categories (...);

-- カラム名: snake_case
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name VARCHAR(255) NOT NULL,
  start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス名: idx_テーブル名_カラム名
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status_created_at ON projects(status, created_at);

-- 制約名: 制約タイプ_テーブル名_カラム名
ALTER TABLE projects ADD CONSTRAINT fk_projects_client_id
  FOREIGN KEY (client_id) REFERENCES clients(id);
ALTER TABLE projects ADD CONSTRAINT chk_projects_budget_positive
  CHECK (budget > 0);
```

### 標準カラム構成

```sql
-- すべてのテーブルに必須のカラム
CREATE TABLE example_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ビジネスデータ
  -- ...

  -- 監査カラム（必須）
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),

  -- 論理削除用（必要に応じて）
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_example_table_updated_at
  BEFORE UPDATE ON example_table
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### データ型選択指針

```sql
-- 文字列データ
VARCHAR(255)    -- 短い文字列（名前、タイトルなど）
TEXT           -- 長い文字列（説明、コメントなど）
CHAR(10)       -- 固定長文字列（コード、IDなど）

-- 数値データ
INTEGER        -- 整数（カウント、順序など）
BIGINT         -- 大きな整数（ID、タイムスタンプなど）
DECIMAL(10,2)  -- 金額（精度が重要）
FLOAT          -- 浮動小数点（計算用）

-- 日付・時間
DATE           -- 日付のみ
TIMESTAMPTZ    -- タイムゾーン付きタイムスタンプ（推奨）
TIMESTAMP      -- タイムゾーンなしタイムスタンプ

-- その他
UUID           -- 主キー、外部キー（推奨）
BOOLEAN        -- フラグ
JSONB          -- 構造化データ（検索可能）
JSON           -- 構造化データ（読み取り専用）

-- 配列型
TEXT[]         -- 文字列配列
INTEGER[]      -- 整数配列
```

## Row Level Security設計

### 基本ポリシー設計

```sql
-- RLSの有効化
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 管理者は全てのデータにアクセス可能
CREATE POLICY "管理者は全プロジェクトにアクセス可能" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 営業担当者は自分が担当するクライアントのプロジェクトにアクセス可能
CREATE POLICY "営業担当者は担当プロジェクトにアクセス可能" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN client_assignments ca ON up.id = ca.user_id
      WHERE up.id = auth.uid()
        AND up.role = 'sales'
        AND ca.client_id = projects.client_id
    )
  );

-- エンジニアは自分がアサインされたプロジェクトにアクセス可能
CREATE POLICY "エンジニアはアサインされたプロジェクトにアクセス可能" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_assignments pa
      JOIN user_profiles up ON pa.user_id = up.id
      WHERE pa.project_id = projects.id
        AND up.id = auth.uid()
        AND up.role = 'engineer'
    )
  );

-- エンジニアは自分のプロフィールのみ更新可能
CREATE POLICY "エンジニアは自分のプロフィールのみ更新可能" ON user_profiles
  FOR UPDATE USING (
    id = auth.uid() AND role = 'engineer'
  )
  WITH CHECK (
    id = auth.uid() AND role = 'engineer'
  );
```

### 役割ベースアクセス制御

```sql
-- 役割別アクセス制御関数
CREATE OR REPLACE FUNCTION has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 複数役割チェック関数
CREATE OR REPLACE FUNCTION has_any_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- リソースベースアクセス制御
CREATE OR REPLACE FUNCTION can_access_project(project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- 管理者は全プロジェクトにアクセス可能
  IF has_role('admin') THEN
    RETURN TRUE;
  END IF;

  -- 営業担当者は担当クライアントのプロジェクトにアクセス可能
  IF has_role('sales') THEN
    RETURN EXISTS (
      SELECT 1 FROM projects p
      JOIN client_assignments ca ON p.client_id = ca.client_id
      WHERE p.id = project_id AND ca.user_id = auth.uid()
    );
  END IF;

  -- エンジニアはアサインされたプロジェクトにアクセス可能
  IF has_role('engineer') THEN
    RETURN EXISTS (
      SELECT 1 FROM project_assignments pa
      WHERE pa.project_id = project_id AND pa.user_id = auth.uid()
    );
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ポリシーでリソースベース関数を使用
CREATE POLICY "リソースベースプロジェクトアクセス" ON projects
  FOR ALL USING (can_access_project(id));
```

## インデックス設計

### 基本インデックス戦略

```sql
-- 主キー（自動作成されるが明示的に記載）
CREATE UNIQUE INDEX pk_projects ON projects(id);

-- 外部キー用インデックス（必須）
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX idx_project_assignments_user_id ON project_assignments(user_id);

-- 検索条件用インデックス
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- 複合インデックス（検索条件の組み合わせ）
CREATE INDEX idx_projects_status_created_at ON projects(status, created_at DESC);
CREATE INDEX idx_projects_client_status ON projects(client_id, status);

-- 部分インデックス（特定条件のみ）
CREATE INDEX idx_projects_active ON projects(created_at DESC)
  WHERE status = 'active';
CREATE INDEX idx_projects_not_deleted ON projects(id)
  WHERE deleted_at IS NULL;

-- 関数ベースインデックス
CREATE INDEX idx_projects_name_lower ON projects(LOWER(name));
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('japanese', name || ' ' || description));

-- JSONB用インデックス
CREATE INDEX idx_user_profiles_skills ON user_profiles USING gin(skills);
CREATE INDEX idx_projects_metadata ON projects USING gin(metadata);
```

### パフォーマンス監視用クエリ

```sql
-- インデックス使用状況の確認
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 未使用インデックスの特定
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE '%_pkey';

-- テーブルサイズとインデックスサイズ
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as total_size,
  pg_size_pretty(pg_relation_size(tablename::regclass)) as table_size,
  pg_size_pretty(pg_indexes_size(tablename::regclass)) as index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

## Database関数・ストアドプロシージャ

### 統計取得関数

```sql
-- プロジェクト統計取得
CREATE OR REPLACE FUNCTION get_project_stats()
RETURNS TABLE (
  total_projects BIGINT,
  active_projects BIGINT,
  completed_projects BIGINT,
  planning_projects BIGINT,
  cancelled_projects BIGINT,
  total_budget DECIMAL,
  average_budget DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_projects,
    COUNT(*) FILTER (WHERE status = 'active') as active_projects,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_projects,
    COUNT(*) FILTER (WHERE status = 'planning') as planning_projects,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_projects,
    SUM(budget) as total_budget,
    AVG(budget) as average_budget
  FROM projects
  WHERE deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- エンジニア稼働率計算
CREATE OR REPLACE FUNCTION calculate_engineer_utilization(
  engineer_id UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  total_days INTEGER,
  assigned_days INTEGER,
  utilization_rate DECIMAL
) AS $$
DECLARE
  total_days_count INTEGER;
  assigned_days_count INTEGER;
BEGIN
  -- 営業日数計算（土日祝日を除く）
  SELECT INTO total_days_count
    COUNT(*)
  FROM generate_series(start_date, end_date, '1 day'::interval) as day
  WHERE EXTRACT(dow FROM day) NOT IN (0, 6); -- 日曜日と土曜日を除く

  -- アサイン日数計算
  SELECT INTO assigned_days_count
    COUNT(DISTINCT assignment_date)
  FROM project_assignments pa
  JOIN generate_series(start_date, end_date, '1 day'::interval) as day ON day >= pa.start_date
  WHERE pa.user_id = engineer_id
    AND (pa.end_date IS NULL OR day <= pa.end_date)
    AND EXTRACT(dow FROM day) NOT IN (0, 6);

  RETURN QUERY
  SELECT
    total_days_count,
    assigned_days_count,
    CASE
      WHEN total_days_count > 0 THEN
        ROUND((assigned_days_count::DECIMAL / total_days_count::DECIMAL) * 100, 2)
      ELSE 0
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### データ整合性チェック関数

```sql
-- プロジェクト整合性チェック
CREATE OR REPLACE FUNCTION validate_project_data()
RETURNS TABLE (
  project_id UUID,
  issue_type TEXT,
  issue_description TEXT
) AS $$
BEGIN
  -- 開始日が終了日より後の問題
  RETURN QUERY
  SELECT
    p.id,
    'date_inconsistency'::TEXT,
    'プロジェクトの開始日が終了日より後になっています'::TEXT
  FROM projects p
  WHERE p.end_date IS NOT NULL
    AND p.start_date > p.end_date;

  -- クライアントが存在しない問題
  RETURN QUERY
  SELECT
    p.id,
    'missing_client'::TEXT,
    'クライアントが存在しません'::TEXT
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  WHERE c.id IS NULL;

  -- 予算が0以下の問題
  RETURN QUERY
  SELECT
    p.id,
    'invalid_budget'::TEXT,
    '予算が0以下に設定されています'::TEXT
  FROM projects p
  WHERE p.budget <= 0;

  -- アサインされたエンジニアが存在しない問題
  RETURN QUERY
  SELECT
    pa.project_id,
    'missing_engineer'::TEXT,
    'アサインされたエンジニアが存在しません'::TEXT
  FROM project_assignments pa
  LEFT JOIN user_profiles up ON pa.user_id = up.id
  WHERE up.id IS NULL OR up.role != 'engineer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- データクリーンアップ関数
CREATE OR REPLACE FUNCTION cleanup_old_data(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- 古い監査ログの削除
  DELETE FROM audit_logs
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- 論理削除されたデータの物理削除（さらに古いもの）
  DELETE FROM projects
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - (days_to_keep * 2 || ' days')::INTERVAL;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## マイグレーション管理

### ファイル構造

```
supabase/
├── migrations/
│   ├── 20240101000000_initial_schema.sql
│   ├── 20240101000001_create_user_profiles.sql
│   ├── 20240101000002_create_clients.sql
│   ├── 20240101000003_create_projects.sql
│   ├── 20240101000004_create_project_assignments.sql
│   ├── 20240101000005_add_rls_policies.sql
│   ├── 20240101000006_create_indexes.sql
│   └── 20240101000007_create_functions.sql
├── seed.sql
└── config.toml
```

### マイグレーション命名規則

```
YYYYMMDDHHMMSS_action_target.sql

例:
20240315143000_create_table_projects.sql
20240315143001_add_column_projects_priority.sql
20240315143002_create_index_projects_status.sql
20240315143003_update_rls_policy_projects.sql
20240315143004_create_function_calculate_utilization.sql
```

### マイグレーションテンプレート

```sql
-- 20240315143000_create_table_projects.sql
-- プロジェクトテーブルの作成

-- Up migration
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID NOT NULL REFERENCES clients(id),
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(12,2) NOT NULL CHECK (budget > 0),
  required_skills TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- 監査カラム
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- インデックス作成
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- RLS有効化
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 更新トリガー
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Down migration (必要に応じて)
-- DROP TABLE IF EXISTS projects CASCADE;
```

## 型定義生成・管理

### Supabase型定義自動生成

```bash
# 型定義生成スクリプト
#!/bin/bash
# generate-types.sh

# Supabase CLIで型定義を生成
npx supabase gen types typescript --project-id your-project-id > types/database.ts

# カスタム型定義を追加
cat types/custom-types.ts >> types/database.ts

echo "型定義が更新されました"
```

### 基本データベース型定義

```typescript
// types/database.ts (自動生成部分)
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          client_id: string;
          status: 'planning' | 'active' | 'completed' | 'cancelled';
          start_date: string;
          end_date: string | null;
          budget: number;
          required_skills: string[];
          metadata: Json;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          client_id: string;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          start_date: string;
          end_date?: string | null;
          budget: number;
          required_skills?: string[];
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          client_id?: string;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          start_date?: string;
          end_date?: string | null;
          budget?: number;
          required_skills?: string[];
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
      };
      // ... 他のテーブル
    };
    Views: {
      // ビュー定義
    };
    Functions: {
      get_project_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_projects: number;
          active_projects: number;
          completed_projects: number;
          planning_projects: number;
          cancelled_projects: number;
          total_budget: number;
          average_budget: number;
        }[];
      };
      calculate_engineer_utilization: {
        Args: {
          engineer_id: string;
          start_date: string;
          end_date: string;
        };
        Returns: {
          total_days: number;
          assigned_days: number;
          utilization_rate: number;
        }[];
      };
    };
  };
}
```

### カスタム型定義拡張

```typescript
// types/custom-types.ts
import { Database } from './database';

// 基本型のエイリアス
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type Client = Database['public']['Tables']['clients']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// 拡張型定義
export interface ProjectWithDetails extends Project {
  client: Pick<Client, 'id' | 'name' | 'company'> | null;
  assignments: {
    user: Pick<UserProfile, 'id' | 'name' | 'email'>;
    role: string;
    start_date: string;
    end_date: string | null;
  }[];
  skills_required: {
    skill_name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
}

export interface EngineerWithUtilization extends UserProfile {
  current_projects: Project[];
  utilization_rate: number;
  skills: {
    skill_name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    years_experience: number;
  }[];
}

// フォーム用型定義
export interface ProjectFormData {
  name: string;
  description: string;
  clientId: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
  requiredSkills: string[];
  priority: 'low' | 'medium' | 'high';
}

// API レスポンス用型定義
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 検索・フィルタ用型定義
export interface ProjectFilters {
  status?: Project['status'];
  clientId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  budgetMin?: number;
  budgetMax?: number;
  requiredSkills?: string[];
  search?: string;
}

export interface EngineerFilters {
  role?: UserProfile['role'];
  skills?: string[];
  availabilityFrom?: string;
  availabilityTo?: string;
  experienceYearsMin?: number;
  search?: string;
}

// 統計・レポート用型定義
export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  planningProjects: number;
  cancelledProjects: number;
  totalBudget: number;
  averageBudget: number;
  utilizationRate: number;
}

export interface EngineerUtilization {
  engineerId: string;
  engineerName: string;
  totalDays: number;
  assignedDays: number;
  utilizationRate: number;
  currentProjects: Project[];
}

// 通知・イベント用型定義
export interface NotificationEvent {
  id: string;
  type: 'project_created' | 'project_updated' | 'assignment_created' | 'assignment_ended';
  title: string;
  message: string;
  userId: string;
  relatedEntityId: string;
  relatedEntityType: 'project' | 'client' | 'user';
  read: boolean;
  createdAt: string;
}

// リアルタイム用型定義
export interface RealtimePayload<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old?: T;
  schema: string;
  table: string;
}

export interface PresenceState {
  userId: string;
  userName: string;
  userRole: string;
  onlineAt: string;
  lastSeen?: string;
}
```

## パフォーマンス最適化

### クエリ最適化指針

```sql
-- 効率的なJOIN
-- 悪い例: N+1問題
SELECT * FROM projects;
-- 各プロジェクトに対して個別にクライアント情報を取得

-- 良い例: 一度のクエリで関連データを取得
SELECT
  p.*,
  c.name as client_name,
  c.company as client_company
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
WHERE p.status = 'active';

-- 効率的なページネーション
-- 悪い例: OFFSET使用（大きなOFFSETで性能劣化）
SELECT * FROM projects
ORDER BY created_at DESC
LIMIT 10 OFFSET 10000;

-- 良い例: カーソルベースページネーション
SELECT * FROM projects
WHERE created_at < '2024-01-01T00:00:00Z'
ORDER BY created_at DESC
LIMIT 10;

-- 効率的な検索
-- フルテキスト検索用インデックス
CREATE INDEX idx_projects_search ON projects
USING gin(to_tsvector('japanese', name || ' ' || COALESCE(description, '')));

-- 検索クエリ
SELECT *, ts_rank(to_tsvector('japanese', name || ' ' || COALESCE(description, '')), query) as rank
FROM projects, plainto_tsquery('japanese', 'キーワード') query
WHERE to_tsvector('japanese', name || ' ' || COALESCE(description, '')) @@ query
ORDER BY rank DESC;
```

### 統計情報更新

```sql
-- 統計情報の手動更新
ANALYZE projects;
ANALYZE clients;
ANALYZE user_profiles;

-- 自動統計更新の設定確認
SHOW autovacuum;
SHOW track_counts;

-- テーブル統計情報の確認
SELECT
  schemaname,
  tablename,
  n_tup_ins,
  n_tup_upd,
  n_tup_del,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;
```

### データベース監視

```sql
-- 実行中のクエリ監視
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
  AND state = 'active';

-- ロック状況の確認
SELECT
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement,
  blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- データベース接続数監視
SELECT
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active_connections,
  count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;
```
