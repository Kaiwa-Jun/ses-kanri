# データモデル・システム設計

## 主要エンティティ

### TypeScript型定義

```typescript
// 加盟店（テナント）の型定義
interface Tenant {
  id: string;
  name: string;
  email: string;
  status: TenantStatus;
  serviceStartDate?: string;
  lastLoginAt?: string;
  lastDataRegisteredAt?: string;
  createdAt: string;
  updatedAt: string;
}

type TenantStatus = 'pending' | 'active' | 'suspended';

// 営業チームの型定義
interface SalesTeam {
  id: string;
  tenantId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// 営業担当者の型定義
interface Sales {
  id: string;
  tenantId: string;
  salesTeamId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: SalesStatus;
  createdAt: string;
  updatedAt: string;
}

type SalesStatus = 'provisional' | 'invited' | 'registered' | 'withdrawn';

// 業界マスタの型定義
interface Industry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// クライアント企業の型定義
interface Client {
  id: string;
  tenantId: string;
  salesId: string;
  industryId: string;
  companyName: string;
  description?: string;
  salesMemo?: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

type ClientStatus = 'active' | 'suspended' | 'terminated';

// クライアント担当者の型定義
interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  department?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// プロジェクト・案件の型定義
interface Project {
  id: string;
  clientId: string;
  tenantId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  budgetMin?: number;
  budgetMax?: number;
  duration?: string;
  workStyle?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

type ProjectStatus = 'recruiting' | 'in_progress' | 'completed' | 'suspended';

// スキルマスタの型定義
interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  createdAt: string;
  updatedAt: string;
}

type SkillCategory =
  | 'programming_language'
  | 'framework'
  | 'database'
  | 'tool'
  | 'domain_knowledge'
  | 'process_position';

// クライアント要求スキルの型定義
interface ClientRequiredSkill {
  id: string;
  clientId: string;
  skillId: string;
  experienceYears?: number;
  createdAt: string;
  updatedAt: string;
}

// 案件要求スキルの型定義
interface ProjectRequiredSkill {
  id: string;
  projectId: string;
  skillId: string;
  experienceYears?: number;
  createdAt: string;
  updatedAt: string;
}

// エンジニアの型定義
interface Engineer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  experienceYears?: number;
  monthlyRate?: number;
  workStyle?: string;
  availableFrom?: string;
  resumeFilePath?: string;
  skillSheetFilePath?: string;
  createdAt: string;
  updatedAt: string;
}

// エンジニアスキルの型定義
interface EngineerSkill {
  id: string;
  engineerId: string;
  skillId: string;
  experienceYears?: number;
  createdAt: string;
  updatedAt: string;
}

// 案件アサインの型定義
interface ProjectAssignment {
  id: string;
  projectId: string;
  engineerId: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
}

type AssignmentStatus = 'candidate' | 'under_review' | 'assigned' | 'rejected';

// クライアント好評エンジニアの型定義
interface ClientPreferredEngineer {
  id: string;
  clientId: string;
  engineerId: string;
  createdAt: string;
  updatedAt: string;
}

// 契約の型定義
interface Contract {
  id: string;
  tenantId: string;
  clientId: string;
  projectId: string;
  engineerId: string;
  salesId: string;
  contractId?: string;
  status: ContractStatus;
  startDate?: string;
  endDate?: string;
  contractType?: ContractType;
  closingDay?: ClosingDay;
  paymentMonthOffset?: number;
  paymentDay?: PaymentDay;
  workStyle?: string;
  workLocation?: string;
  workHours?: string;
  workDaysPerWeek?: number;
  monthlyRate?: number;
  overtimeRate?: number;
  minWorkingHoursPerMonth?: number;
  maxWorkingHoursPerMonth?: number;
  overtimeRules?: string;
  contractFee?: number;
  contractFilePath?: string;
  notes?: string;
  lastUpdatedDate?: string;
  renewalStatus?: RenewalStatus;
  renewalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

type ContractStatus = 'active' | 'renewal_scheduled' | 'expired' | 'terminated';
type ContractType = 'ses' | 'contract' | 'dispatch';
type ClosingDay = 'day_15' | 'day_20' | 'month_end';
type PaymentDay = 'day_15' | 'day_20' | 'month_end';
type RenewalStatus = 'pending' | 'confirmed' | 'rejected';

// 売上目標の型定義
interface SalesTarget {
  id: string;
  tenantId: string;
  salesTeamId: string;
  targetPeriod: TargetPeriod;
  periodStart: string;
  periodEnd: string;
  targetAmount: number;
  profitTargetAmount?: number;
  averageProjectPrice?: number;
  expectedContractRate?: number;
  status: TargetStatus;
  createdAt: string;
  updatedAt: string;
}

type TargetPeriod = 'monthly' | 'quarterly' | 'yearly';
type TargetStatus = 'setting' | 'active' | 'completed';

// 個人売上目標の型定義
interface IndividualSalesTarget {
  id: string;
  salesTargetId: string;
  salesId: string;
  targetAmount: number;
  createdAt: string;
  updatedAt: string;
}

// 売上実績の型定義
interface SalesResult {
  id: string;
  tenantId: string;
  salesTeamId: string;
  salesId: string;
  recordedDate: string;
  salesAmount: number;
  costAmount: number;
  profitAmount: number;
  createdAt: string;
  updatedAt: string;
}

// エンジニア担当管理の型定義
interface EngineerAssignment {
  id: string;
  engineerId: string;
  salesId: string;
  createdAt: string;
  updatedAt: string;
}

// 案件担当管理の型定義
interface ProjectSalesAssignment {
  id: string;
  projectId: string;
  salesId: string;
  createdAt: string;
  updatedAt: string;
}

// 企業担当管理の型定義
interface ClientSalesAssignment {
  id: string;
  clientId: string;
  salesId: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// 通知の型定義
interface Notification {
  id: string;
  tenantId: string;
  contractId?: string;
  notificationType: NotificationType;
  title: string;
  description?: string;
  priority: NotificationPriority;
  status?: NotificationStatus;
  dueDate?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

type NotificationType = 'contract_renewal' | 'contract_expiry' | 'sales_result' | 'other';
type NotificationPriority = 'high' | 'medium' | 'low';
type NotificationStatus = 'not_started' | 'in_progress' | 'completed';

// アクションアイテムの型定義
interface ActionItem {
  id: string;
  notificationId: string;
  contractId: string;
  assignedSalesId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: ActionItemStatus;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

type ActionItemStatus = 'incomplete' | 'completed';
```

## 拡張型定義（フロントエンド用）

```typescript
// マッチング結果の型定義（計算結果）
interface MatchingResult {
  engineerId: string;
  engineer: Engineer;
  matchScore: number; // 0-100のマッチング度
  matchDetails: {
    skillMatch: number;
    experienceMatch: number;
    availabilityMatch: number;
    preferenceMatch: number;
  };
  notes?: string;
}

// ダッシュボード用の型定義
interface DashboardData {
  summary: {
    totalProjects: number;
    activeProjects: number;
    availableEngineers: number;
    totalClients: number;
    monthlyRevenue: number;
    monthlyProfit: number;
  };
  recentNotifications: Notification[];
  upcomingDeadlines: {
    contractRenewals: Contract[];
    projectEndDates: Project[];
  };
  topPerformingEngineers: {
    engineerId: string;
    name: string;
    averageRating: number;
    completedProjects: number;
  }[];
  clientActivity: {
    clientId: string;
    clientName: string;
    lastContact: string;
    nextAppointment?: string;
  }[];
}

// 詳細表示用の結合型
interface EngineerDetail extends Engineer {
  skills: (EngineerSkill & { skill: Skill })[];
  assignments: (ProjectAssignment & { project: Project })[];
  contracts: Contract[];
  salesAssignments: (EngineerAssignment & { sales: Sales })[];
}

interface ProjectDetail extends Project {
  client: Client;
  requiredSkills: (ProjectRequiredSkill & { skill: Skill })[];
  assignments: (ProjectAssignment & { engineer: Engineer })[];
  contracts: Contract[];
  salesAssignments: (ProjectSalesAssignment & { sales: Sales })[];
}

interface ClientDetail extends Client {
  industry: Industry;
  contacts: ClientContact[];
  projects: Project[];
  requiredSkills: (ClientRequiredSkill & { skill: Skill })[];
  preferredEngineers: (ClientPreferredEngineer & { engineer: Engineer })[];
  salesAssignments: (ClientSalesAssignment & { sales: Sales })[];
}

interface ContractDetail extends Contract {
  client: Client;
  project: Project;
  engineer: Engineer;
  sales: Sales;
  notifications: Notification[];
  actionItems: ActionItem[];
}
```

## API レスポンス型定義

```typescript
// 共通APIレスポンス型
interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  timestamp: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 検索・フィルタリング用の型
interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProjectSearchParams extends SearchParams {
  status?: ProjectStatus[];
  clientId?: string;
  skillIds?: string[];
  startDateFrom?: string;
  startDateTo?: string;
  salesId?: string;
  budgetMin?: number;
  budgetMax?: number;
}

interface EngineerSearchParams extends SearchParams {
  skills?: string[];
  experienceYears?: {
    min?: number;
    max?: number;
  };
  availability?: boolean;
  monthlyRateRange?: {
    min?: number;
    max?: number;
  };
  workStyle?: string[];
}

interface ClientSearchParams extends SearchParams {
  industryId?: string;
  status?: ClientStatus[];
  salesId?: string;
  hasActiveProjects?: boolean;
}

interface ContractSearchParams extends SearchParams {
  status?: ContractStatus[];
  renewalStatus?: RenewalStatus[];
  clientId?: string;
  engineerId?: string;
  salesId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

interface NotificationSearchParams extends SearchParams {
  type?: NotificationType[];
  priority?: NotificationPriority[];
  status?: NotificationStatus[];
  isRead?: boolean;
  dueDateBefore?: string;
}

// マッチング検索用の型
interface MatchingSearchParams {
  projectId: string;
  minMatchScore?: number;
  maxResults?: number;
  includeUnavailable?: boolean;
}

// エクスポート用の型
interface ResumeExportData {
  engineer: Engineer;
  skills: (EngineerSkill & { skill: Skill })[];
  projectHistory: (ProjectAssignment & { project: Project; client: Client })[];
  generatedAt: string;
}

interface SkillSheetExportData {
  engineer: Pick<Engineer, 'id' | 'name' | 'experienceYears'>;
  skillsByCategory: {
    [category in SkillCategory]: (EngineerSkill & { skill: Skill })[];
  };
  generatedAt: string;
}

interface SalesReportData {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalSales: number;
    totalCost: number;
    totalProfit: number;
    contractCount: number;
  };
  salesByTeam: {
    teamId: string;
    teamName: string;
    sales: number;
    cost: number;
    profit: number;
  }[];
  salesBySales: {
    salesId: string;
    salesName: string;
    sales: number;
    cost: number;
    profit: number;
  }[];
  generatedAt: string;
}
```

## データ関係性・制約

### エンティティ関係（主要なもの）

- **Tenant** - **SalesTeam**: 1対多（1つの加盟店は複数の営業チームを持つ）
- **Tenant** - **Sales**: 1対多（1つの加盟店は複数の営業担当者を持つ）
- **Tenant** - **Client**: 1対多（1つの加盟店は複数のクライアントを持つ）
- **Tenant** - **Project**: 1対多（1つの加盟店は複数の案件を持つ）
- **Tenant** - **Engineer**: 1対多（1つの加盟店は複数のエンジニアを持つ）
- **Tenant** - **Contract**: 1対多（1つの加盟店は複数の契約を持つ）

- **SalesTeam** - **Sales**: 1対多（1つの営業チームは複数の営業担当者を持つ）
- **Sales** - **Client**: 1対多（1つの営業担当者は複数のクライアントを担当）
- **Sales** - **Contract**: 1対多（1つの営業担当者は複数の契約を担当）

- **Industry** - **Client**: 1対多（1つの業界は複数のクライアントを持つ）
- **Client** - **Project**: 1対多（1つのクライアントは複数の案件を持つ）
- **Client** - **ClientContact**: 1対多（1つのクライアントは複数の担当者を持つ）
- **Client** - **Contract**: 1対多（1つのクライアントは複数の契約を持つ）

- **Project** - **Contract**: 1対多（1つの案件は複数の契約を持つ）
- **Engineer** - **Contract**: 1対多（1つのエンジニアは複数の契約を持つ）
- **Contract** - **Notification**: 1対多（1つの契約は複数の通知を持つ）
- **Notification** - **ActionItem**: 1対多（1つの通知は複数のアクションアイテムを持つ）

### ビジネスルール制約

- 案件ステータスは「募集中」「進行中」「完了」「中断」
- 契約期間は3ヶ月更新が基本
- 営業1人あたり最大10件の案件を同時管理
- マッチング度は0-100の数値で表現
- 通知の期限日数はフロントエンド側で算出

### データ整合性

- 削除時は論理削除を推奨（isActiveフラグ等）
- 関連データの整合性を保つためのカスケード制約
- 日付フィールドはISO 8601形式で統一
- 金額フィールドは円単位で整数管理（万円単位の場合は明記）

## 外部システム連携

### 将来的な連携予定

- **会計システム**: 売上・収益データの自動連携
- **勤怠管理システム**: エンジニアの稼働時間データ連携
- **メール・通知システム**: 通知の自動送信
- **レポート・分析ツール**: BIツールとのデータ連携

### エクスポート機能

- **履歴書・スキルシート**: PDF形式での出力
- **案件レポート**: Excel形式での詳細データ出力
- **売上レポート**: 月次・四半期レポートの自動生成
- **通知サマリー**: 日次・週次の通知メール送信
