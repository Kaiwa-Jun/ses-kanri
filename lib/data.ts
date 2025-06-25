// 案件データ
export type Project = {
  id: string;
  title: string;
  client: string;
  skills: string[];
  minRate: number; // 単価下限（円）
  maxRate: number; // 単価上限（円）
  period: string;
  workStyle: 'remote' | 'onsite' | 'hybrid';
  status: 'open' | 'closed';
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  createdAt: string;
};

// エンジニアデータ
export type Engineer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: Skill[];
  projects: EngineerProject[];
  availability: 'available' | 'unavailable';
  availableFrom?: string;
  preferredWorkStyle: 'remote' | 'onsite' | 'hybrid';
  preferredRate: number; // 希望単価（万円）
  totalExperience: number; // 経験年数
  imageUrl?: string;
};

// スキルデータ（レベルは内部的に保持するが表示しない）
export type Skill = {
  name: string;
  category: 'language' | 'framework' | 'database' | 'infrastructure' | 'tool' | 'other';
  level: 1 | 2 | 3 | 4 | 5; // 内部的に保持
  experienceYears: number;
};

// 案件履歴
export type EngineerProject = {
  id: string;
  name: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  skills: string[];
  responsibilities: string;
};

// 勤怠データ
export type WorkReport = {
  id: string;
  engineerId: string;
  projectId: string;
  date: string;
  workingHours: number;
  overtimeHours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
};

// チームデータ
export type Team = {
  id: string;
  name: string;
};

// クライアントデータ
export type Client = {
  id: string;
  name: string;
  industry: string;
  status: 'active' | 'negotiating' | 'inactive';
  contacts: {
    name: string;
    position: string;
    email: string;
    phone: string;
    imageUrl: string;
  }[];
  activeProjects: number;
  totalProjects: number;
  lastContact: string;
  nextContact: string;
  preferredSkills: string[];
  rating: number;
};

// 契約データ
export type Contract = {
  id: string;
  title: string;
  project: string;
  engineer: string;
  status: string;
  dueDate: string;
  type: string;
  hasNotification: boolean;
  notificationPriority: string;
  actionStatus: string;
  actionItems: {
    id: string;
    task: string;
    completed: boolean;
    dueDate: string;
    assignee: string;
  }[];
  clientName?: string;
  startDate?: string;
  endDate?: string;
  contractFile?: string;
  contractType?: string;
  paymentTerms?: string;
  workStyle?: string;
  workLocation?: string;
  workingHours?: string;
  workingDays?: string;
  rate?: number;
  workload?: number;
  minHours?: number;
  maxHours?: number;
  overtimeRule?: string;
  salesPerson?: {
    name: string;
    email: string;
    phone: string;
  };
  clientContact?: {
    name: string;
    email: string;
    phone: string;
    department: string;
  };
  renewalDate?: string;
  renewalStatus?: string;
  renewalConditions?: string;
  notes?: string;
};

// モックチームデータ
export const mockTeams: Team[] = [
  { id: 't1', name: '第一営業部' },
  { id: 't2', name: '第二営業部' },
  { id: 't3', name: '第三営業部' },
];

// モッククライアントデータ
export const mockClients: Client[] = [
  {
    id: 'c1',
    name: '〇〇商事株式会社',
    industry: '商社',
    status: 'active',
    contacts: [
      {
        name: '佐藤部長',
        position: 'IT推進部 部長',
        email: 'sato@example.com',
        phone: '03-1234-5678',
        imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      },
    ],
    activeProjects: 2,
    totalProjects: 5,
    lastContact: '2024-03-15',
    nextContact: '2024-03-25',
    preferredSkills: ['React', 'TypeScript', 'AWS'],
    rating: 4.8,
  },
  {
    id: 'c2',
    name: '△△システムズ株式会社',
    industry: 'SIer',
    status: 'active',
    contacts: [
      {
        name: '田中課長',
        position: '開発部 課長',
        email: 'tanaka@example.com',
        phone: '03-2345-6789',
        imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      },
    ],
    activeProjects: 1,
    totalProjects: 3,
    lastContact: '2024-03-10',
    nextContact: '2024-03-20',
    preferredSkills: ['Java', 'Spring', 'Oracle'],
    rating: 4.5,
  },
  {
    id: 'c3',
    name: '□□メディカル株式会社',
    industry: '医療',
    status: 'negotiating',
    contacts: [
      {
        name: '鈴木部長',
        position: '情報システム部 部長',
        email: 'suzuki@example.com',
        phone: '03-3456-7890',
        imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      },
    ],
    activeProjects: 0,
    totalProjects: 1,
    lastContact: '2024-03-05',
    nextContact: '2024-03-18',
    preferredSkills: ['Python', 'TensorFlow', 'Docker'],
    rating: 4.2,
  },
  {
    id: 'c4',
    name: '◇◇フィナンシャル株式会社',
    industry: '金融',
    status: 'active',
    contacts: [
      {
        name: '高橋取締役',
        position: 'システム部 取締役',
        email: 'takahashi@example.com',
        phone: '03-4567-8901',
        imageUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
      },
    ],
    activeProjects: 3,
    totalProjects: 8,
    lastContact: '2024-03-20',
    nextContact: '2024-03-30',
    preferredSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
    rating: 4.9,
  },
  {
    id: 'c5',
    name: '☆☆テクノロジー株式会社',
    industry: 'IT',
    status: 'inactive',
    contacts: [
      {
        name: '伊藤部長',
        position: '開発部 部長',
        email: 'ito@example.com',
        phone: '03-5678-9012',
        imageUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      },
    ],
    activeProjects: 0,
    totalProjects: 2,
    lastContact: '2024-02-28',
    nextContact: '2024-04-15',
    preferredSkills: ['Vue.js', 'Node.js', 'MongoDB'],
    rating: 3.8,
  },
  {
    id: 'c6',
    name: '◎◎ソリューションズ株式会社',
    industry: 'SIer',
    status: 'active',
    contacts: [
      {
        name: '中村課長',
        position: 'システム開発部 課長',
        email: 'nakamura@example.com',
        phone: '03-6789-0123',
        imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      },
    ],
    activeProjects: 1,
    totalProjects: 4,
    lastContact: '2024-03-18',
    nextContact: '2024-03-28',
    preferredSkills: ['PHP', 'Laravel', 'MySQL'],
    rating: 4.3,
  },
  {
    id: 'c7',
    name: '▲▲デジタル株式会社',
    industry: 'IT',
    status: 'negotiating',
    contacts: [
      {
        name: '小林取締役',
        position: 'CTO',
        email: 'kobayashi@example.com',
        phone: '03-7890-1234',
        imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      },
    ],
    activeProjects: 0,
    totalProjects: 1,
    lastContact: '2024-03-12',
    nextContact: '2024-03-22',
    preferredSkills: ['AI', 'Machine Learning', 'Python'],
    rating: 4.6,
  },
  {
    id: 'c8',
    name: '●●ファイナンス株式会社',
    industry: '金融',
    status: 'active',
    contacts: [
      {
        name: '松本部長',
        position: 'IT企画部 部長',
        email: 'matsumoto@example.com',
        phone: '03-8901-2345',
        imageUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      },
    ],
    activeProjects: 2,
    totalProjects: 6,
    lastContact: '2024-03-22',
    nextContact: '2024-04-02',
    preferredSkills: ['Kotlin', 'Swift', 'React Native'],
    rating: 4.7,
  },
  {
    id: 'c9',
    name: '■■エンタープライズ株式会社',
    industry: '製造業',
    status: 'active',
    contacts: [
      {
        name: '森田課長',
        position: '情報システム課 課長',
        email: 'morita@example.com',
        phone: '03-9012-3456',
        imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      },
    ],
    activeProjects: 1,
    totalProjects: 3,
    lastContact: '2024-03-14',
    nextContact: '2024-03-26',
    preferredSkills: ['C#', '.NET', 'SQL Server'],
    rating: 4.1,
  },
  {
    id: 'c10',
    name: '★★インダストリー株式会社',
    industry: '製造業',
    status: 'negotiating',
    contacts: [
      {
        name: '清水部長',
        position: 'DX推進部 部長',
        email: 'shimizu@example.com',
        phone: '03-0123-4567',
        imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      },
    ],
    activeProjects: 0,
    totalProjects: 0,
    lastContact: '2024-03-08',
    nextContact: '2024-03-19',
    preferredSkills: ['IoT', 'Edge Computing', 'Azure'],
    rating: 4.0,
  },
  {
    id: 'c11',
    name: '◯◯ヘルスケア株式会社',
    industry: '医療',
    status: 'active',
    contacts: [
      {
        name: '加藤部長',
        position: '医療情報部 部長',
        email: 'kato@example.com',
        phone: '03-1111-2222',
        imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      },
    ],
    activeProjects: 1,
    totalProjects: 2,
    lastContact: '2024-03-16',
    nextContact: '2024-03-27',
    preferredSkills: ['FHIR', 'HL7', 'Python'],
    rating: 4.4,
  },
  {
    id: 'c12',
    name: '◇◇ロジスティクス株式会社',
    industry: '物流',
    status: 'active',
    contacts: [
      {
        name: '石井課長',
        position: 'システム課 課長',
        email: 'ishii@example.com',
        phone: '03-2222-3333',
        imageUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
      },
    ],
    activeProjects: 2,
    totalProjects: 5,
    lastContact: '2024-03-21',
    nextContact: '2024-04-01',
    preferredSkills: ['Go', 'Kubernetes', 'GCP'],
    rating: 4.5,
  },
  {
    id: 'c13',
    name: '△△リテール株式会社',
    industry: '小売・流通',
    status: 'inactive',
    contacts: [
      {
        name: '橋本部長',
        position: 'EC事業部 部長',
        email: 'hashimoto@example.com',
        phone: '03-3333-4444',
        imageUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      },
    ],
    activeProjects: 0,
    totalProjects: 1,
    lastContact: '2024-02-25',
    nextContact: '2024-04-10',
    preferredSkills: ['Shopify', 'JavaScript', 'CSS'],
    rating: 3.5,
  },
  {
    id: 'c14',
    name: '▼▼メディア株式会社',
    industry: 'メディア',
    status: 'negotiating',
    contacts: [
      {
        name: '村上取締役',
        position: '技術担当取締役',
        email: 'murakami@example.com',
        phone: '03-4444-5555',
        imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      },
    ],
    activeProjects: 0,
    totalProjects: 0,
    lastContact: '2024-03-11',
    nextContact: '2024-03-21',
    preferredSkills: ['Next.js', 'GraphQL', 'Prisma'],
    rating: 4.2,
  },
  {
    id: 'c15',
    name: '◆◆コンサルティング株式会社',
    industry: 'コンサルティング',
    status: 'active',
    contacts: [
      {
        name: '渡辺パートナー',
        position: 'ITコンサルティング パートナー',
        email: 'watanabe@example.com',
        phone: '03-5555-6666',
        imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      },
    ],
    activeProjects: 3,
    totalProjects: 7,
    lastContact: '2024-03-23',
    nextContact: '2024-04-03',
    preferredSkills: ['Salesforce', 'Power Platform', 'Tableau'],
    rating: 4.8,
  },
];

// モック契約データ（完全版）
export const mockContracts: Contract[] = [
  {
    id: 'c1',
    title: '〇〇商事株式会社 業務委託契約',
    project: '大手ECサイトリニューアル案件',
    engineer: '山田太郎',
    status: 'active',
    dueDate: '2025-06-30',
    type: 'renewal',
    hasNotification: true,
    notificationPriority: 'high',
    actionStatus: 'pending',
    actionItems: [
      {
        id: 'a1',
        task: 'クライアントに契約更新意向を確認',
        completed: false,
        dueDate: '2025-06-20',
        assignee: '営業担当A',
      },
      {
        id: 'a2',
        task: 'エンジニアの継続意向を確認',
        completed: false,
        dueDate: '2025-06-22',
        assignee: '営業担当A',
      },
      {
        id: 'a3',
        task: '契約書の準備・作成',
        completed: false,
        dueDate: '2025-06-25',
        assignee: '法務部',
      },
      {
        id: 'a4',
        task: '契約書の締結',
        completed: false,
        dueDate: '2025-06-29',
        assignee: '営業担当A',
      },
    ],
    clientName: '〇〇商事株式会社',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    contractFile: 'contract_20240401.pdf',
    contractType: '準委任',
    paymentTerms: '月末締め翌月末払い',
    workStyle: 'hybrid',
    workLocation: '東京都渋谷区〇〇町1-1-1',
    workingHours: '10:00～19:00（フレックス可）',
    workingDays: '週5日',
    rate: 850000,
    workload: 160,
    minHours: 140,
    maxHours: 180,
    overtimeRule: '1時間単位で精算（基準単価の1.25倍）',
    salesPerson: {
      name: '鈴木健太',
      email: 'suzuki@example.com',
      phone: '090-8765-4321',
    },
    clientContact: {
      name: '佐藤部長',
      email: 'sato@client.com',
      phone: '03-1234-5678',
      department: 'IT推進部',
    },
    renewalDate: '2024-08-31',
    renewalStatus: '未確認',
    renewalConditions: '単価改定（現行+5万円）を検討',
    notes:
      '・リモートワークは週3日まで可能\n・交通費は実費支給（上限あり）\n・プロジェクト状況により延長の可能性あり',
  },
  {
    id: 'c2',
    title: '△△システムズ株式会社 契約終了',
    project: '金融システム保守運用',
    engineer: '佐藤花子',
    status: 'expiring',
    dueDate: '2025-06-30',
    type: 'termination',
    hasNotification: true,
    notificationPriority: 'high',
    actionStatus: 'in_progress',
    actionItems: [
      {
        id: 'b1',
        task: '引き継ぎ資料の作成依頼',
        completed: true,
        dueDate: '2025-06-18',
        assignee: '佐藤花子',
      },
      {
        id: 'b2',
        task: '後任エンジニアの選定',
        completed: false,
        dueDate: '2025-06-25',
        assignee: '営業担当B',
      },
      {
        id: 'b3',
        task: '引き継ぎスケジュールの調整',
        completed: false,
        dueDate: '2025-06-28',
        assignee: '営業担当B',
      },
    ],
    clientName: '△△システムズ株式会社',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    contractFile: 'contract_20240301.pdf',
    contractType: '請負',
    paymentTerms: '月末締め翌月末払い',
    workStyle: 'remote',
    workLocation: 'リモートワーク',
    workingHours: '9:00～18:00（フレックス可）',
    workingDays: '週5日',
    rate: 920000,
    workload: 160,
    minHours: 140,
    maxHours: 180,
    overtimeRule: '1時間単位で精算（基準単価の1.25倍）',
    salesPerson: {
      name: '鈴木健太',
      email: 'suzuki@example.com',
      phone: '090-8765-4321',
    },
    clientContact: {
      name: '高橋課長',
      email: 'takahashi@client.com',
      phone: '03-2345-6789',
      department: '開発部',
    },
    renewalDate: '2024-07-31',
    renewalStatus: '未確認',
    renewalConditions: '継続予定',
    notes: '・全面リモートワーク\n・月次報告会は対面で実施',
  },
  {
    id: 'c3',
    title: '◇◇フィナンシャル株式会社 契約更新',
    project: '決済システム連携開発',
    engineer: '伊藤健太',
    status: 'active',
    dueDate: '2025-07-31',
    type: 'renewal',
    hasNotification: true,
    notificationPriority: 'medium',
    actionStatus: 'pending',
    actionItems: [
      {
        id: 'c1',
        task: '契約条件の見直し',
        completed: false,
        dueDate: '2025-07-10',
        assignee: '営業担当C',
      },
      {
        id: 'c2',
        task: '単価改定の検討',
        completed: false,
        dueDate: '2025-07-15',
        assignee: '営業担当C',
      },
      {
        id: 'c3',
        task: '契約書の更新',
        completed: false,
        dueDate: '2025-07-25',
        assignee: '法務部',
      },
    ],
  },
  {
    id: 'c4',
    title: '□□メディカル株式会社 業務委託契約',
    project: '医療系アプリケーション開発',
    engineer: '鈴木一郎',
    status: 'active',
    dueDate: '2025-12-31',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
  },
  {
    id: 'c5',
    title: '☆☆テクノロジー株式会社 業務委託契約',
    project: 'Webアプリケーション開発',
    engineer: '高橋誠',
    status: 'active',
    dueDate: '2026-03-31',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
  },
  {
    id: 'c6',
    title: '◆◆コンサルティング株式会社 業務委託契約',
    project: 'システム設計支援',
    engineer: '中村美咲',
    status: 'active',
    dueDate: '2025-09-30',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '◆◆コンサルティング株式会社',
    startDate: '2024-06-01',
    endDate: '2025-09-30',
    contractType: '準委任',
    rate: 780000,
    salesPerson: {
      name: '田中和子',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
    },
  },
  {
    id: 'c7',
    title: '◎◎ソリューションズ株式会社 業務委託契約',
    project: 'クラウド移行プロジェクト',
    engineer: '渡辺雄一',
    status: 'active',
    dueDate: '2025-08-31',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '◎◎ソリューションズ株式会社',
    startDate: '2024-05-01',
    endDate: '2025-08-31',
    contractType: '請負',
    rate: 950000,
    salesPerson: {
      name: '佐藤健太',
      email: 'sato@example.com',
      phone: '090-9876-5432',
    },
  },
  {
    id: 'c8',
    title: '▲▲デジタル株式会社 業務委託契約',
    project: 'AIシステム開発',
    engineer: '小林真一',
    status: 'active',
    dueDate: '2025-10-31',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '▲▲デジタル株式会社',
    startDate: '2024-07-01',
    endDate: '2025-10-31',
    contractType: '準委任',
    rate: 1100000,
    salesPerson: {
      name: '鈴木健太',
      email: 'suzuki@example.com',
      phone: '090-8765-4321',
    },
  },
  {
    id: 'c9',
    title: '●●ファイナンス株式会社 業務委託契約',
    project: 'フィンテックアプリ開発',
    engineer: '松本香織',
    status: 'active',
    dueDate: '2025-11-30',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '●●ファイナンス株式会社',
    startDate: '2024-08-01',
    endDate: '2025-11-30',
    contractType: '準委任',
    rate: 880000,
    salesPerson: {
      name: '田中和子',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
    },
  },
  {
    id: 'c10',
    title: '■■エンタープライズ株式会社 業務委託契約',
    project: 'ERPシステム導入',
    engineer: '森田大輔',
    status: 'active',
    dueDate: '2026-01-31',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '■■エンタープライズ株式会社',
    startDate: '2024-09-01',
    endDate: '2026-01-31',
    contractType: '請負',
    rate: 990000,
    salesPerson: {
      name: '佐藤健太',
      email: 'sato@example.com',
      phone: '090-9876-5432',
    },
  },
  {
    id: 'c11',
    title: '★★インダストリー株式会社 業務委託契約',
    project: 'IoTプラットフォーム開発',
    engineer: '清水美和',
    status: 'active',
    dueDate: '2025-12-31',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '★★インダストリー株式会社',
    startDate: '2024-10-01',
    endDate: '2025-12-31',
    contractType: '準委任',
    rate: 820000,
    salesPerson: {
      name: '田中和子',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
    },
  },
  {
    id: 'c12',
    title: '◯◯ヘルスケア株式会社 業務委託契約',
    project: '医療データ分析システム',
    engineer: '加藤信夫',
    status: 'expiring',
    dueDate: '2025-07-15',
    type: 'renewal',
    hasNotification: true,
    notificationPriority: 'medium',
    actionStatus: 'pending',
    actionItems: [
      {
        id: 'd1',
        task: '契約更新の検討',
        completed: false,
        dueDate: '2025-07-01',
        assignee: '営業担当D',
      },
    ],
    clientName: '◯◯ヘルスケア株式会社',
    startDate: '2024-01-15',
    endDate: '2025-07-15',
    contractType: '準委任',
    rate: 750000,
    salesPerson: {
      name: '鈴木健太',
      email: 'suzuki@example.com',
      phone: '090-8765-4321',
    },
  },
  {
    id: 'c13',
    title: '◇◇ロジスティクス株式会社 業務委託契約',
    project: '物流管理システム',
    engineer: '石井良太',
    status: 'active',
    dueDate: '2026-02-28',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '◇◇ロジスティクス株式会社',
    startDate: '2024-11-01',
    endDate: '2026-02-28',
    contractType: '請負',
    rate: 860000,
    salesPerson: {
      name: '佐藤健太',
      email: 'sato@example.com',
      phone: '090-9876-5432',
    },
  },
  {
    id: 'c14',
    title: '△△リテール株式会社 業務委託契約',
    project: 'ECサイト構築',
    engineer: '橋本智子',
    status: 'active',
    dueDate: '2025-09-15',
    type: 'ongoing',
    hasNotification: false,
    notificationPriority: 'low',
    actionStatus: 'completed',
    actionItems: [],
    clientName: '△△リテール株式会社',
    startDate: '2024-12-01',
    endDate: '2025-09-15',
    contractType: '準委任',
    rate: 720000,
    salesPerson: {
      name: '田中和子',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
    },
  },
  {
    id: 'c15',
    title: '▼▼メディア株式会社 業務委託契約',
    project: 'コンテンツ管理システム',
    engineer: '村上直樹',
    status: 'draft',
    dueDate: '2025-08-01',
    type: 'new',
    hasNotification: true,
    notificationPriority: 'low',
    actionStatus: 'pending',
    actionItems: [
      {
        id: 'e1',
        task: '契約書の最終確認',
        completed: false,
        dueDate: '2025-06-15',
        assignee: '法務部',
      },
    ],
    clientName: '▼▼メディア株式会社',
    startDate: '2025-06-01',
    endDate: '2025-08-01',
    contractType: '準委任',
    rate: 680000,
    salesPerson: {
      name: '鈴木健太',
      email: 'suzuki@example.com',
      phone: '090-8765-4321',
    },
  },
];

// モックプロジェクトデータ
export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: '大手ECサイトリニューアル案件',
    client: '〇〇商事株式会社',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    minRate: 800000,
    maxRate: 1000000,
    period: '6ヶ月',
    workStyle: 'remote',
    status: 'open',
    description:
      '大手ECサイトのフロントエンド刷新プロジェクト。最新技術スタックを用いたリニューアル案件です。',
    startDate: '2023-07-01',
    endDate: '2023-12-31',
    location: '東京都渋谷区',
    createdAt: '2023-05-15',
  },
  {
    id: 'p2',
    title: '金融システム保守運用',
    client: '◇◇フィナンシャル株式会社',
    skills: ['Java', 'Spring Boot', 'Oracle', 'AWS'],
    minRate: 750000,
    maxRate: 900000,
    period: '12ヶ月',
    workStyle: 'hybrid',
    status: 'open',
    description: '既存金融システムの保守運用および機能追加案件。',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    location: '東京都千代田区',
    createdAt: '2023-02-10',
  },
  {
    id: 'p3',
    title: 'スマートファクトリー構築支援',
    client: '☆☆テクノロジー株式会社',
    skills: ['Python', 'IoT', 'Docker', 'Kubernetes', 'TensorFlow'],
    minRate: 850000,
    maxRate: 1000000,
    period: '9ヶ月',
    workStyle: 'onsite',
    status: 'open',
    description:
      '製造業向けIoTプラットフォームの構築案件。AI/ML技術を活用した予知保全システムの開発。',
    startDate: '2023-08-01',
    endDate: '2024-04-30',
    location: '愛知県名古屋市',
    createdAt: '2023-06-05',
  },
  {
    id: 'p4',
    title: '医療系アプリケーション開発',
    client: '□□メディカル株式会社',
    skills: ['Swift', 'Kotlin', 'Firebase', 'Flutter'],
    minRate: 800000,
    maxRate: 900000,
    period: '5ヶ月',
    workStyle: 'remote',
    status: 'open',
    description: '医療従事者向けモバイルアプリケーションの開発案件。クロスプラットフォーム対応。',
    startDate: '2023-09-01',
    endDate: '2024-01-31',
    createdAt: '2023-07-20',
  },
  {
    id: 'p5',
    title: '決済システム連携開発',
    client: '△△システムズ株式会社',
    skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'AWS'],
    minRate: 700000,
    maxRate: 800000,
    period: '4ヶ月',
    workStyle: 'hybrid',
    status: 'closed',
    description: '新規決済サービス立ち上げに伴うバックエンド開発案件。',
    startDate: '2023-03-01',
    endDate: '2023-06-30',
    location: '東京都港区',
    createdAt: '2023-01-15',
  },
];

// モックエンジニアデータ
export const mockEngineers: Engineer[] = [
  {
    id: 'e1',
    name: '山田太郎',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    skills: [
      { name: 'JavaScript', category: 'language', level: 5, experienceYears: 7 },
      { name: 'TypeScript', category: 'language', level: 5, experienceYears: 4 },
      { name: 'Python', category: 'language', level: 4, experienceYears: 3 },
      { name: 'Java', category: 'language', level: 3, experienceYears: 2 },
      { name: 'React', category: 'framework', level: 5, experienceYears: 5 },
      { name: 'Next.js', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'Vue.js', category: 'framework', level: 4, experienceYears: 2 },
      { name: 'Express', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'Node.js', category: 'framework', level: 4, experienceYears: 6 },
      { name: 'PostgreSQL', category: 'database', level: 4, experienceYears: 5 },
      { name: 'MongoDB', category: 'database', level: 3, experienceYears: 3 },
      { name: 'Redis', category: 'database', level: 3, experienceYears: 2 },
      { name: 'AWS', category: 'infrastructure', level: 3, experienceYears: 4 },
      { name: 'Docker', category: 'infrastructure', level: 4, experienceYears: 3 },
      { name: 'Kubernetes', category: 'infrastructure', level: 2, experienceYears: 1 },
      { name: 'Git', category: 'tool', level: 5, experienceYears: 7 },
      { name: 'Figma', category: 'tool', level: 3, experienceYears: 2 },
    ],
    projects: [
      {
        id: 'ep1',
        name: '大手ECサイトリニューアル',
        role: 'フロントエンドリード',
        description: 'React/TypeScriptを用いたECサイトのフロントエンド開発',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
        responsibilities: 'アーキテクチャ設計\nパフォーマンス最適化\nコンポーネント設計',
      },
      {
        id: 'ep2',
        name: 'FinTechアプリ開発',
        role: 'フルスタックエンジニア',
        description: '個人向け資産管理アプリケーションの開発',
        startDate: '2022-03-01',
        endDate: '2022-12-31',
        skills: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
        responsibilities: 'バックエンド開発\nAPIの設計と実装\nフロントエンド連携',
      },
      {
        id: 'ep3',
        name: '社内業務システム構築',
        role: 'フロントエンドエンジニア',
        description: 'Vue.jsを使った社内向け業務管理システムの開発',
        startDate: '2021-06-01',
        endDate: '2022-02-28',
        skills: ['Vue.js', 'Vuex', 'TypeScript', 'Laravel'],
        responsibilities: 'UI/UX設計\nコンポーネント開発\nAPI連携',
      },
    ],
    availability: 'available',
    availableFrom: '2023-08-01',
    preferredWorkStyle: 'remote',
    preferredRate: 80,
    totalExperience: 7,
    imageUrl:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e2',
    name: '佐藤花子',
    email: 'sato@example.com',
    phone: '090-8765-4321',
    skills: [
      { name: 'Java', category: 'language', level: 5, experienceYears: 8 },
      { name: 'Kotlin', category: 'language', level: 4, experienceYears: 3 },
      { name: 'Scala', category: 'language', level: 3, experienceYears: 2 },
      { name: 'Spring Boot', category: 'framework', level: 5, experienceYears: 6 },
      { name: 'Spring Framework', category: 'framework', level: 5, experienceYears: 7 },
      { name: 'MyBatis', category: 'framework', level: 4, experienceYears: 5 },
      { name: 'Oracle', category: 'database', level: 4, experienceYears: 7 },
      { name: 'PostgreSQL', category: 'database', level: 4, experienceYears: 4 },
      { name: 'MySQL', category: 'database', level: 4, experienceYears: 6 },
      { name: 'AWS', category: 'infrastructure', level: 4, experienceYears: 5 },
      { name: 'Docker', category: 'infrastructure', level: 4, experienceYears: 4 },
      { name: 'Jenkins', category: 'infrastructure', level: 3, experienceYears: 3 },
      { name: 'Maven', category: 'tool', level: 4, experienceYears: 6 },
      { name: 'Gradle', category: 'tool', level: 4, experienceYears: 4 },
    ],
    projects: [
      {
        id: 'ep3',
        name: '銀行勘定系システム開発',
        role: 'バックエンドエンジニア',
        description: '大手銀行の基幹システム開発',
        startDate: '2021-04-01',
        endDate: '2023-03-31',
        skills: ['Java', 'Spring', 'Oracle', 'JUnit'],
        responsibilities: 'API実装\nユニットテスト\n性能チューニング',
      },
      {
        id: 'ep4',
        name: '保険システム刷新',
        role: 'システムアーキテクト',
        description: 'レガシーシステムのマイクロサービス化',
        startDate: '2020-01-01',
        endDate: '2021-03-31',
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
        responsibilities: 'アーキテクチャ設計\nマイクロサービス分割\nCI/CD構築',
      },
      {
        id: 'ep5',
        name: 'ECサイト基盤構築',
        role: 'バックエンドリード',
        description: '高負荷対応のECサイトバックエンド開発',
        startDate: '2019-06-01',
        endDate: '2019-12-31',
        skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
        responsibilities: 'パフォーマンス最適化\nキャッシュ戦略\nチームマネジメント',
      },
    ],
    availability: 'unavailable',
    availableFrom: '2023-10-01',
    preferredWorkStyle: 'hybrid',
    preferredRate: 75,
    totalExperience: 8,
    imageUrl:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e3',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    phone: '090-2345-6789',
    skills: [
      { name: 'Python', category: 'language', level: 5, experienceYears: 6 },
      { name: 'R', category: 'language', level: 4, experienceYears: 3 },
      { name: 'SQL', category: 'language', level: 4, experienceYears: 5 },
      { name: 'Django', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'FastAPI', category: 'framework', level: 4, experienceYears: 2 },
      { name: 'TensorFlow', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'PyTorch', category: 'framework', level: 3, experienceYears: 2 },
      { name: 'scikit-learn', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'PostgreSQL', category: 'database', level: 4, experienceYears: 4 },
      { name: 'MongoDB', category: 'database', level: 3, experienceYears: 2 },
      { name: 'Docker', category: 'infrastructure', level: 4, experienceYears: 4 },
      { name: 'Kubernetes', category: 'infrastructure', level: 3, experienceYears: 2 },
      { name: 'GCP', category: 'infrastructure', level: 3, experienceYears: 3 },
      { name: 'Jupyter', category: 'tool', level: 5, experienceYears: 5 },
      { name: 'MLflow', category: 'tool', level: 3, experienceYears: 2 },
    ],
    projects: [
      {
        id: 'ep4',
        name: '画像認識AIシステム構築',
        role: 'MLエンジニア',
        description: '製造業向け不良品検知システムの開発',
        startDate: '2022-06-01',
        endDate: '2023-08-31',
        skills: ['Python', 'TensorFlow', 'OpenCV', 'Docker'],
        responsibilities: 'AIモデル開発\n画像処理アルゴリズム\nシステム統合',
      },
      {
        id: 'ep6',
        name: '需要予測システム開発',
        role: 'データサイエンティスト',
        description: '小売業向け需要予測AIシステムの構築',
        startDate: '2021-09-01',
        endDate: '2022-05-31',
        skills: ['Python', 'scikit-learn', 'PostgreSQL', 'FastAPI'],
        responsibilities: 'データ分析\n予測モデル構築\nAPI開発',
      },
      {
        id: 'ep7',
        name: 'レコメンドエンジン開発',
        role: 'MLエンジニア',
        description: 'ECサイト向けレコメンドシステムの開発',
        startDate: '2020-11-01',
        endDate: '2021-08-31',
        skills: ['Python', 'TensorFlow', 'MongoDB', 'GCP'],
        responsibilities: '協調フィルタリング\nディープラーニング\nA/Bテスト',
      },
    ],
    availability: 'unavailable',
    availableFrom: '2023-12-01',
    preferredWorkStyle: 'remote',
    preferredRate: 85,
    totalExperience: 6,
    imageUrl:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e4',
    name: '田中美咲',
    email: 'tanaka@example.com',
    phone: '090-3456-7890',
    skills: [
      { name: 'Swift', category: 'language', level: 5, experienceYears: 5 },
      { name: 'Kotlin', category: 'language', level: 4, experienceYears: 3 },
      { name: 'Dart', category: 'language', level: 4, experienceYears: 2 },
      { name: 'Objective-C', category: 'language', level: 3, experienceYears: 3 },
      { name: 'Flutter', category: 'framework', level: 4, experienceYears: 2 },
      { name: 'React Native', category: 'framework', level: 3, experienceYears: 2 },
      { name: 'UIKit', category: 'framework', level: 5, experienceYears: 5 },
      { name: 'SwiftUI', category: 'framework', level: 4, experienceYears: 2 },
      { name: 'Core Data', category: 'database', level: 4, experienceYears: 4 },
      { name: 'SQLite', category: 'database', level: 4, experienceYears: 4 },
      { name: 'Firebase', category: 'infrastructure', level: 4, experienceYears: 4 },
      { name: 'AWS', category: 'infrastructure', level: 3, experienceYears: 2 },
      { name: 'Xcode', category: 'tool', level: 5, experienceYears: 5 },
      { name: 'Android Studio', category: 'tool', level: 4, experienceYears: 3 },
    ],
    projects: [
      {
        id: 'ep5',
        name: 'フードデリバリーアプリ開発',
        role: 'モバイルアプリ開発者',
        description: 'iOS/Androidアプリの設計・開発',
        startDate: '2022-10-01',
        endDate: '2023-03-31',
        skills: ['Swift', 'Kotlin', 'Firebase', 'REST API'],
        responsibilities: 'UIデザイン実装\nバックエンド連携\nテスト自動化',
      },
      {
        id: 'ep8',
        name: 'ヘルスケアアプリ開発',
        role: 'iOSエンジニア',
        description: '健康管理アプリのiOS版開発',
        startDate: '2021-12-01',
        endDate: '2022-09-30',
        skills: ['Swift', 'SwiftUI', 'Core Data', 'HealthKit'],
        responsibilities: 'UI/UX実装\nデータ永続化\nヘルスケア連携',
      },
      {
        id: 'ep9',
        name: '教育系アプリ開発',
        role: 'クロスプラットフォーム開発者',
        description: 'Flutter を使った学習アプリの開発',
        startDate: '2021-03-01',
        endDate: '2021-11-30',
        skills: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
        responsibilities: 'クロスプラットフォーム開発\n状態管理\nオフライン対応',
      },
    ],
    availability: 'available',
    availableFrom: '2023-09-01',
    preferredWorkStyle: 'remote',
    preferredRate: 82,
    totalExperience: 5,
    imageUrl:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e5',
    name: '伊藤健太',
    email: 'ito@example.com',
    phone: '090-4567-8901',
    skills: [
      { name: 'C#', category: 'language', level: 5, experienceYears: 9 },
      { name: 'VB.NET', category: 'language', level: 4, experienceYears: 6 },
      { name: 'PowerShell', category: 'language', level: 4, experienceYears: 5 },
      { name: 'TypeScript', category: 'language', level: 3, experienceYears: 2 },
      { name: '.NET Core', category: 'framework', level: 5, experienceYears: 5 },
      { name: '.NET Framework', category: 'framework', level: 5, experienceYears: 8 },
      { name: 'ASP.NET', category: 'framework', level: 5, experienceYears: 7 },
      { name: 'Entity Framework', category: 'framework', level: 4, experienceYears: 6 },
      { name: 'Blazor', category: 'framework', level: 3, experienceYears: 2 },
      { name: 'SQL Server', category: 'database', level: 4, experienceYears: 7 },
      { name: 'Oracle', category: 'database', level: 3, experienceYears: 4 },
      { name: 'Azure', category: 'infrastructure', level: 4, experienceYears: 6 },
      { name: 'IIS', category: 'infrastructure', level: 4, experienceYears: 7 },
      { name: 'Visual Studio', category: 'tool', level: 5, experienceYears: 9 },
      { name: 'Azure DevOps', category: 'tool', level: 4, experienceYears: 4 },
    ],
    projects: [
      {
        id: 'ep6',
        name: '業務システム刷新プロジェクト',
        role: 'システムアーキテクト',
        description: 'レガシーシステムのマイクロサービス化',
        startDate: '2022-01-01',
        endDate: '2023-12-31',
        skills: ['C#', '.NET Core', 'SQL Server', 'Azure', 'Docker'],
        responsibilities: 'アーキテクチャ設計\nマイクロサービス化\nCI/CD構築',
      },
      {
        id: 'ep10',
        name: 'ERPシステム開発',
        role: 'テックリード',
        description: '中堅企業向けERPシステムの開発',
        startDate: '2020-06-01',
        endDate: '2021-12-31',
        skills: ['C#', 'ASP.NET', 'SQL Server', 'Azure'],
        responsibilities: '技術選定\nチームリード\nコードレビュー',
      },
      {
        id: 'ep11',
        name: 'Webアプリケーション開発',
        role: 'フルスタックエンジニア',
        description: '社内向け業務管理システムの開発',
        startDate: '2019-09-01',
        endDate: '2020-05-31',
        skills: ['C#', 'ASP.NET MVC', 'Entity Framework', 'SQL Server'],
        responsibilities: 'フロントエンド開発\nバックエンド開発\nDB設計',
      },
    ],
    availability: 'available',
    availableFrom: '2023-11-01',
    preferredWorkStyle: 'onsite',
    preferredRate: 90,
    totalExperience: 9,
    imageUrl:
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e6',
    name: '高橋健太',
    email: 'takahashi@example.com',
    phone: '090-6789-0123',
    skills: [
      { name: 'Go', category: 'language', level: 5, experienceYears: 4 },
      { name: 'Rust', category: 'language', level: 4, experienceYears: 2 },
      { name: 'JavaScript', category: 'language', level: 4, experienceYears: 6 },
      { name: 'TypeScript', category: 'language', level: 4, experienceYears: 4 },
      { name: 'Gin', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'Echo', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'React', category: 'framework', level: 4, experienceYears: 5 },
      { name: 'PostgreSQL', category: 'database', level: 4, experienceYears: 5 },
      { name: 'Redis', category: 'database', level: 4, experienceYears: 4 },
      { name: 'Docker', category: 'infrastructure', level: 5, experienceYears: 5 },
      { name: 'Kubernetes', category: 'infrastructure', level: 4, experienceYears: 3 },
      { name: 'AWS', category: 'infrastructure', level: 4, experienceYears: 4 },
      { name: 'Terraform', category: 'tool', level: 4, experienceYears: 3 },
    ],
    projects: [
      {
        id: 'ep12',
        name: 'マイクロサービス基盤構築',
        role: 'バックエンドエンジニア',
        description: 'Go言語を使ったマイクロサービスアーキテクチャの構築',
        startDate: '2022-08-01',
        endDate: '2023-07-31',
        skills: ['Go', 'Docker', 'Kubernetes', 'PostgreSQL'],
        responsibilities: 'API設計・実装\nコンテナ化\nCI/CD構築',
      },
    ],
    availability: 'available',
    availableFrom: '2023-09-15',
    preferredWorkStyle: 'hybrid',
    preferredRate: 88,
    totalExperience: 6,
    imageUrl:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e7',
    name: '中村由美',
    email: 'nakamura@example.com',
    phone: '090-7890-1234',
    skills: [
      { name: 'PHP', category: 'language', level: 5, experienceYears: 8 },
      { name: 'JavaScript', category: 'language', level: 4, experienceYears: 7 },
      { name: 'TypeScript', category: 'language', level: 3, experienceYears: 3 },
      { name: 'Laravel', category: 'framework', level: 5, experienceYears: 6 },
      { name: 'Symfony', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'Vue.js', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'MySQL', category: 'database', level: 5, experienceYears: 8 },
      { name: 'PostgreSQL', category: 'database', level: 3, experienceYears: 3 },
      { name: 'AWS', category: 'infrastructure', level: 3, experienceYears: 4 },
      { name: 'Docker', category: 'infrastructure', level: 3, experienceYears: 3 },
    ],
    projects: [
      {
        id: 'ep13',
        name: 'CMS開発プロジェクト',
        role: 'フルスタックエンジニア',
        description: 'Laravel + Vue.jsを使ったCMSの開発',
        startDate: '2022-01-01',
        endDate: '2023-06-30',
        skills: ['PHP', 'Laravel', 'Vue.js', 'MySQL'],
        responsibilities: 'バックエンド設計\nフロントエンド実装\nDB設計',
      },
    ],
    availability: 'unavailable',
    availableFrom: '2023-11-01',
    preferredWorkStyle: 'remote',
    preferredRate: 72,
    totalExperience: 8,
    imageUrl:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e8',
    name: '小林誠',
    email: 'kobayashi@example.com',
    phone: '090-8901-2345',
    skills: [
      { name: 'Ruby', category: 'language', level: 5, experienceYears: 7 },
      { name: 'JavaScript', category: 'language', level: 4, experienceYears: 5 },
      { name: 'TypeScript', category: 'language', level: 3, experienceYears: 2 },
      { name: 'Ruby on Rails', category: 'framework', level: 5, experienceYears: 7 },
      { name: 'React', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'PostgreSQL', category: 'database', level: 4, experienceYears: 6 },
      { name: 'Redis', category: 'database', level: 4, experienceYears: 5 },
      { name: 'AWS', category: 'infrastructure', level: 4, experienceYears: 5 },
      { name: 'Docker', category: 'infrastructure', level: 4, experienceYears: 4 },
      { name: 'Heroku', category: 'infrastructure', level: 4, experienceYears: 6 },
    ],
    projects: [
      {
        id: 'ep14',
        name: 'SaaS製品開発',
        role: 'バックエンドエンジニア',
        description: 'Ruby on Railsを使ったSaaS製品の開発',
        startDate: '2021-10-01',
        endDate: '2023-03-31',
        skills: ['Ruby', 'Ruby on Rails', 'PostgreSQL', 'AWS'],
        responsibilities: 'API設計・実装\nパフォーマンス最適化\nセキュリティ対応',
      },
    ],
    availability: 'available',
    availableFrom: '2023-08-15',
    preferredWorkStyle: 'remote',
    preferredRate: 78,
    totalExperience: 7,
    imageUrl:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e9',
    name: '森田あかり',
    email: 'morita@example.com',
    phone: '090-9012-3456',
    skills: [
      { name: 'Flutter', category: 'framework', level: 5, experienceYears: 4 },
      { name: 'Dart', category: 'language', level: 5, experienceYears: 4 },
      { name: 'Swift', category: 'language', level: 4, experienceYears: 3 },
      { name: 'Kotlin', category: 'language', level: 4, experienceYears: 3 },
      { name: 'React Native', category: 'framework', level: 3, experienceYears: 2 },
      { name: 'Firebase', category: 'infrastructure', level: 4, experienceYears: 4 },
      { name: 'SQLite', category: 'database', level: 4, experienceYears: 4 },
      { name: 'Git', category: 'tool', level: 5, experienceYears: 5 },
    ],
    projects: [
      {
        id: 'ep15',
        name: 'モバイルアプリ開発',
        role: 'モバイルアプリエンジニア',
        description: 'Flutterを使ったクロスプラットフォームアプリの開発',
        startDate: '2022-04-01',
        endDate: '2023-08-31',
        skills: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
        responsibilities: 'UI実装\n状態管理\nネイティブ連携',
      },
    ],
    availability: 'available',
    availableFrom: '2023-09-01',
    preferredWorkStyle: 'hybrid',
    preferredRate: 75,
    totalExperience: 5,
    imageUrl:
      'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e10',
    name: '渡辺大輔',
    email: 'watanabe@example.com',
    phone: '090-0123-4567',
    skills: [
      { name: 'Angular', category: 'framework', level: 5, experienceYears: 6 },
      { name: 'TypeScript', category: 'language', level: 5, experienceYears: 6 },
      { name: 'JavaScript', category: 'language', level: 5, experienceYears: 8 },
      { name: 'RxJS', category: 'framework', level: 4, experienceYears: 5 },
      { name: 'NgRx', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'Node.js', category: 'framework', level: 4, experienceYears: 5 },
      { name: 'Express', category: 'framework', level: 4, experienceYears: 5 },
      { name: 'MongoDB', category: 'database', level: 4, experienceYears: 5 },
      { name: 'PostgreSQL', category: 'database', level: 3, experienceYears: 3 },
      { name: 'AWS', category: 'infrastructure', level: 3, experienceYears: 4 },
    ],
    projects: [
      {
        id: 'ep16',
        name: '企業向けダッシュボード開発',
        role: 'フロントエンドエンジニア',
        description: 'Angularを使った企業向けダッシュボードの開発',
        startDate: '2021-07-01',
        endDate: '2023-05-31',
        skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
        responsibilities: 'UI/UX実装\n状態管理\nパフォーマンス最適化',
      },
    ],
    availability: 'available',
    availableFrom: '2023-10-15',
    preferredWorkStyle: 'onsite',
    preferredRate: 82,
    totalExperience: 8,
    imageUrl:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e11',
    name: '加藤真一',
    email: 'kato@example.com',
    phone: '090-1111-2222',
    skills: [
      { name: 'Scala', category: 'language', level: 5, experienceYears: 6 },
      { name: 'Java', category: 'language', level: 4, experienceYears: 8 },
      { name: 'Akka', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'Play Framework', category: 'framework', level: 4, experienceYears: 5 },
      { name: 'Apache Kafka', category: 'infrastructure', level: 4, experienceYears: 3 },
      { name: 'Elasticsearch', category: 'database', level: 4, experienceYears: 4 },
      { name: 'Docker', category: 'infrastructure', level: 4, experienceYears: 5 },
    ],
    projects: [
      {
        id: 'ep17',
        name: 'リアルタイム分析基盤構築',
        role: 'バックエンドエンジニア',
        description: 'Scalaを使ったリアルタイムデータ処理基盤の構築',
        startDate: '2022-03-01',
        endDate: '2023-08-31',
        skills: ['Scala', 'Akka', 'Kafka', 'Elasticsearch'],
        responsibilities: 'ストリーミング処理\nマイクロサービス設計\nパフォーマンス最適化',
      },
    ],
    availability: 'unavailable',
    availableFrom: '2024-01-15',
    preferredWorkStyle: 'hybrid',
    preferredRate: 95,
    totalExperience: 10,
    imageUrl:
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e12',
    name: '西村由香',
    email: 'nishimura@example.com',
    phone: '090-2222-3333',
    skills: [
      { name: 'Vue.js', category: 'framework', level: 5, experienceYears: 5 },
      { name: 'Nuxt.js', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'JavaScript', category: 'language', level: 5, experienceYears: 7 },
      { name: 'TypeScript', category: 'language', level: 4, experienceYears: 4 },
      { name: 'Vuetify', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'Firebase', category: 'infrastructure', level: 3, experienceYears: 2 },
    ],
    projects: [
      {
        id: 'ep18',
        name: 'コーポレートサイト構築',
        role: 'フロントエンドエンジニア',
        description: 'Vue.js + Nuxt.jsを使ったコーポレートサイトの構築',
        startDate: '2022-09-01',
        endDate: '2023-02-28',
        skills: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Vuetify'],
        responsibilities: 'UI/UX実装\nSEO対応\nパフォーマンス最適化',
      },
    ],
    availability: 'available',
    availableFrom: '2023-09-01',
    preferredWorkStyle: 'remote',
    preferredRate: 68,
    totalExperience: 6,
    imageUrl:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e13',
    name: '松本健二',
    email: 'matsumoto@example.com',
    phone: '090-3333-4444',
    skills: [
      { name: 'Rust', category: 'language', level: 4, experienceYears: 3 },
      { name: 'C++', category: 'language', level: 5, experienceYears: 12 },
      { name: 'WebAssembly', category: 'other', level: 4, experienceYears: 2 },
      { name: 'Linux', category: 'infrastructure', level: 5, experienceYears: 10 },
      { name: 'Docker', category: 'infrastructure', level: 4, experienceYears: 6 },
      { name: 'Kubernetes', category: 'infrastructure', level: 3, experienceYears: 3 },
    ],
    projects: [
      {
        id: 'ep19',
        name: '高性能計算エンジン開発',
        role: 'システムエンジニア',
        description: 'Rustを使った高性能計算エンジンの開発',
        startDate: '2021-11-01',
        endDate: '2023-06-30',
        skills: ['Rust', 'C++', 'WebAssembly', 'Linux'],
        responsibilities: 'アルゴリズム実装\nパフォーマンス最適化\nシステム設計',
      },
    ],
    availability: 'unavailable',
    availableFrom: '2023-12-01',
    preferredWorkStyle: 'onsite',
    preferredRate: 110,
    totalExperience: 15,
    imageUrl:
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e14',
    name: '橋本さくら',
    email: 'hashimoto@example.com',
    phone: '090-4444-5555',
    skills: [
      { name: 'React', category: 'framework', level: 5, experienceYears: 4 },
      { name: 'Next.js', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'GraphQL', category: 'other', level: 4, experienceYears: 3 },
      { name: 'Apollo Client', category: 'framework', level: 4, experienceYears: 2 },
      { name: 'Styled Components', category: 'framework', level: 4, experienceYears: 3 },
      { name: 'Jest', category: 'tool', level: 4, experienceYears: 4 },
    ],
    projects: [
      {
        id: 'ep20',
        name: 'SPA開発プロジェクト',
        role: 'フロントエンドエンジニア',
        description: 'React + GraphQLを使ったSPAの開発',
        startDate: '2022-05-01',
        endDate: '2023-10-31',
        skills: ['React', 'GraphQL', 'Apollo Client', 'Next.js'],
        responsibilities: 'コンポーネント設計\nGraphQL実装\nテスト自動化',
      },
    ],
    availability: 'available',
    availableFrom: '2023-11-15',
    preferredWorkStyle: 'hybrid',
    preferredRate: 76,
    totalExperience: 5,
    imageUrl:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e15',
    name: '石井拓也',
    email: 'ishii@example.com',
    phone: '090-5555-6666',
    skills: [
      { name: 'Terraform', category: 'tool', level: 5, experienceYears: 4 },
      { name: 'AWS', category: 'infrastructure', level: 5, experienceYears: 6 },
      { name: 'Ansible', category: 'tool', level: 4, experienceYears: 3 },
      { name: 'Jenkins', category: 'tool', level: 4, experienceYears: 5 },
      { name: 'Python', category: 'language', level: 4, experienceYears: 5 },
      { name: 'Bash', category: 'language', level: 5, experienceYears: 8 },
    ],
    projects: [
      {
        id: 'ep21',
        name: 'クラウドインフラ構築',
        role: 'インフラエンジニア',
        description: 'TerraformとAWSを使ったクラウドインフラの構築',
        startDate: '2021-08-01',
        endDate: '2023-07-31',
        skills: ['Terraform', 'AWS', 'Ansible', 'Python'],
        responsibilities: 'インフラ設計\nIaC実装\nCI/CD構築',
      },
    ],
    availability: 'unavailable',
    availableFrom: '2024-02-01',
    preferredWorkStyle: 'remote',
    preferredRate: 88,
    totalExperience: 9,
    imageUrl:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e16',
    name: '岡田美穂',
    email: 'okada@example.com',
    phone: '090-6666-7777',
    skills: [
      { name: 'Unity', category: 'framework', level: 5, experienceYears: 6 },
      { name: 'C#', category: 'language', level: 5, experienceYears: 7 },
      { name: 'Blender', category: 'tool', level: 3, experienceYears: 2 },
      { name: 'Maya', category: 'tool', level: 3, experienceYears: 3 },
      { name: 'AR/VR', category: 'other', level: 4, experienceYears: 4 },
    ],
    projects: [
      {
        id: 'ep22',
        name: 'VRゲーム開発',
        role: 'ゲームエンジニア',
        description: 'UnityとC#を使ったVRゲームの開発',
        startDate: '2022-01-01',
        endDate: '2023-09-30',
        skills: ['Unity', 'C#', 'AR/VR', 'Blender'],
        responsibilities: 'ゲームロジック実装\nVR最適化\n3Dモデル統合',
      },
    ],
    availability: 'available',
    availableFrom: '2023-10-01',
    preferredWorkStyle: 'onsite',
    preferredRate: 85,
    totalExperience: 8,
    imageUrl:
      'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e17',
    name: '村田慎一',
    email: 'murata@example.com',
    phone: '090-7777-8888',
    skills: [
      { name: 'Solidity', category: 'language', level: 4, experienceYears: 2 },
      { name: 'Web3.js', category: 'framework', level: 4, experienceYears: 2 },
      { name: 'Ethereum', category: 'other', level: 4, experienceYears: 3 },
      { name: 'Node.js', category: 'framework', level: 4, experienceYears: 5 },
      { name: 'React', category: 'framework', level: 4, experienceYears: 4 },
      { name: 'TypeScript', category: 'language', level: 4, experienceYears: 4 },
    ],
    projects: [
      {
        id: 'ep23',
        name: 'DeFiプラットフォーム開発',
        role: 'ブロックチェーンエンジニア',
        description: 'SolidityとWeb3.jsを使ったDeFiプラットフォームの開発',
        startDate: '2022-06-01',
        endDate: '2023-12-31',
        skills: ['Solidity', 'Web3.js', 'Ethereum', 'React'],
        responsibilities: 'スマートコントラクト開発\nDApp実装\nセキュリティ監査',
      },
    ],
    availability: 'unavailable',
    availableFrom: '2024-01-01',
    preferredWorkStyle: 'remote',
    preferredRate: 120,
    totalExperience: 6,
    imageUrl:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'e18',
    name: '清水香織',
    email: 'shimizu@example.com',
    phone: '090-8888-9999',
    skills: [
      { name: 'Figma', category: 'tool', level: 5, experienceYears: 4 },
      { name: 'Adobe XD', category: 'tool', level: 4, experienceYears: 3 },
      { name: 'Sketch', category: 'tool', level: 4, experienceYears: 5 },
      { name: 'HTML', category: 'language', level: 5, experienceYears: 8 },
      { name: 'CSS', category: 'language', level: 5, experienceYears: 8 },
      { name: 'JavaScript', category: 'language', level: 3, experienceYears: 3 },
    ],
    projects: [
      {
        id: 'ep24',
        name: 'UIデザインシステム構築',
        role: 'UI/UXデザイナー',
        description: 'Figmaを使ったデザインシステムの構築',
        startDate: '2022-04-01',
        endDate: '2023-08-31',
        skills: ['Figma', 'Adobe XD', 'HTML', 'CSS'],
        responsibilities: 'デザインシステム設計\nプロトタイプ作成\nフロントエンド連携',
      },
    ],
    availability: 'available',
    availableFrom: '2023-09-15',
    preferredWorkStyle: 'hybrid',
    preferredRate: 65,
    totalExperience: 7,
    imageUrl:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// モック勤怠データ
export const mockWorkReports: WorkReport[] = [
  {
    id: 'wr1',
    engineerId: 'e1',
    projectId: 'p1',
    date: '2023-07-05',
    workingHours: 8,
    overtimeHours: 1,
    description: 'フロントエンド実装、コンポーネント設計',
    status: 'approved',
  },
  {
    id: 'wr2',
    engineerId: 'e1',
    projectId: 'p1',
    date: '2023-07-06',
    workingHours: 8,
    overtimeHours: 0,
    description: 'API連携、データフェッチング実装',
    status: 'approved',
  },
  {
    id: 'wr3',
    engineerId: 'e2',
    projectId: 'p2',
    date: '2023-07-05',
    workingHours: 7.5,
    overtimeHours: 0,
    description: 'バグ修正、テスト実施',
    status: 'approved',
  },
  {
    id: 'wr4',
    engineerId: 'e3',
    projectId: 'p3',
    date: '2023-07-05',
    workingHours: 8,
    overtimeHours: 2,
    description: 'AIモデル実装、データ前処理',
    status: 'submitted',
  },
  {
    id: 'wr5',
    engineerId: 'e1',
    projectId: 'p1',
    date: '2023-07-07',
    workingHours: 8,
    overtimeHours: 1.5,
    description: 'レスポンシブデザイン実装、スタイル調整',
    status: 'draft',
  },
];

// プロジェクトとエンジニアのマッチングスコア計算（モックデータ）
export const getMatchingScore = (projectId: string, engineerId: string): number => {
  // 実際の実装では、スキルの一致度や希望条件などを元に計算する
  // ここではモック用にランダムな値を返す
  const scores: Record<string, Record<string, number>> = {
    p1: {
      e1: 92,
      e2: 45,
      e3: 67,
      e4: 78,
      e5: 52,
      e6: 83,
      e7: 61,
      e8: 74,
      e9: 56,
      e10: 69,
      e11: 73,
      e12: 86,
      e13: 58,
      e14: 91,
      e15: 64,
      e16: 47,
      e17: 79,
      e18: 68,
    },
    p2: {
      e1: 58,
      e2: 89,
      e3: 42,
      e4: 35,
      e5: 71,
      e6: 65,
      e7: 77,
      e8: 54,
      e9: 48,
      e10: 82,
      e11: 66,
      e12: 72,
      e13: 59,
      e14: 81,
      e15: 87,
      e16: 53,
      e17: 44,
      e18: 76,
    },
    p3: {
      e1: 63,
      e2: 51,
      e3: 94,
      e4: 38,
      e5: 60,
      e6: 72,
      e7: 46,
      e8: 59,
      e9: 41,
      e10: 76,
      e11: 84,
      e12: 57,
      e13: 78,
      e14: 65,
      e15: 73,
      e16: 49,
      e17: 62,
      e18: 55,
    },
    p4: {
      e1: 70,
      e2: 43,
      e3: 56,
      e4: 91,
      e5: 49,
      e6: 64,
      e7: 58,
      e8: 67,
      e9: 85,
      e10: 53,
      e11: 74,
      e12: 88,
      e13: 61,
      e14: 79,
      e15: 66,
      e16: 92,
      e17: 54,
      e18: 71,
    },
    p5: {
      e1: 75,
      e2: 81,
      e3: 53,
      e4: 66,
      e5: 85,
      e6: 79,
      e7: 87,
      e8: 71,
      e9: 62,
      e10: 88,
      e11: 69,
      e12: 83,
      e13: 56,
      e14: 90,
      e15: 77,
      e16: 64,
      e17: 95,
      e18: 82,
    },
  };

  return scores[projectId]?.[engineerId] || Math.floor(Math.random() * 50) + 50;
};

// プロジェクトに最適なエンジニアを取得
export const getMatchingEngineers = (
  projectId: string
): { engineer: Engineer; score: number }[] => {
  return mockEngineers
    .map((engineer) => ({
      engineer,
      score: getMatchingScore(projectId, engineer.id),
    }))
    .sort((a, b) => b.score - a.score);
};
