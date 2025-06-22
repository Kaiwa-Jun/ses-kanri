'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  X,
  Code,
  Database,
  Server,
  Wrench,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  User,
  Award,
  Briefcase,
  Settings,
} from 'lucide-react';

const clientSchema = z.object({
  name: z.string().min(1, '企業名を入力してください'),
  industry: z.string().min(1, '業界を選択してください'),
  description: z.string().min(10, '企業概要は10文字以上で入力してください'),
  salesPerson: z.string().min(1, '担当営業を選択してください'),
  memo: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: ClientFormValues & {
      preferredSkills: string[];
      domains: string[];
      certifications: string[];
      phases: string[];
      positions: string[];
      pastProjects: string[];
      preferredEngineers: string[];
    }
  ) => void;
}

// 業界選択肢
const industries = [
  'IT',
  'SIer',
  '商社',
  '金融',
  '医療',
  '製造業',
  '小売・流通',
  '不動産',
  '教育',
  '公共・自治体',
  'コンサルティング',
  'その他',
];

// 営業担当者選択肢（部署情報付き）
const salesPersons = [
  { name: '鈴木健太', department: '第1営業部' },
  { name: '田中美咲', department: '第1営業部' },
  { name: '高橋誠', department: '第1営業部' },
  { name: '佐藤一郎', department: '第2営業部' },
  { name: '山田花子', department: '第2営業部' },
];

// 案件選択肢（クライアント名付き）
const projectOptions = [
  { id: 'project1', name: '大手ECサイトリニューアル案件', client: '〇〇商事株式会社' },
  { id: 'project2', name: '金融システム保守運用', client: '◇◇銀行' },
  { id: 'project3', name: 'スマートファクトリー構築', client: '△△製造株式会社' },
  { id: 'project4', name: '医療系アプリケーション開発', client: '□□メディカル株式会社' },
];

// エンジニア選択肢（スキル情報付き）
const engineerOptions = [
  { id: 'engineer1', name: '山田太郎', skills: 'React, TypeScript, Node.js' },
  { id: 'engineer2', name: '佐藤花子', skills: 'Java, Spring Boot, Oracle' },
  { id: 'engineer3', name: '鈴木一郎', skills: 'Python, TensorFlow, Docker' },
  { id: 'engineer4', name: '田中美咲', skills: 'Swift, Kotlin, Flutter' },
];

// スキル候補データ（エンジニア追加モーダルと同じ）
const skillOptions = {
  language: {
    name: 'プログラミング言語',
    icon: <Code className="h-4 w-4" />,
    skills: [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C#',
      'PHP',
      'Ruby',
      'Go',
      'Rust',
      'Swift',
      'Kotlin',
      'Dart',
      'C++',
      'C',
      'Scala',
      'R',
    ],
  },
  framework: {
    name: 'フレームワーク',
    icon: <Package className="h-4 w-4" />,
    skills: [
      'React',
      'Vue.js',
      'Angular',
      'Next.js',
      'Nuxt.js',
      'Svelte',
      'Express',
      'Fastify',
      'Django',
      'Flask',
      'FastAPI',
      'Spring Boot',
      'ASP.NET',
      '.NET Core',
      'Laravel',
      'Ruby on Rails',
    ],
  },
  database: {
    name: 'データベース',
    icon: <Database className="h-4 w-4" />,
    skills: [
      'MySQL',
      'PostgreSQL',
      'Oracle',
      'SQL Server',
      'MongoDB',
      'Redis',
      'Elasticsearch',
      'DynamoDB',
      'Cassandra',
      'Neo4j',
    ],
  },
  infrastructure: {
    name: 'インフラ',
    icon: <Server className="h-4 w-4" />,
    skills: [
      'AWS',
      'GCP',
      'Azure',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Ansible',
      'Jenkins',
      'GitLab CI',
      'GitHub Actions',
      'CircleCI',
    ],
  },
  tool: {
    name: 'ツール',
    icon: <Wrench className="h-4 w-4" />,
    skills: [
      'Git',
      'GitHub',
      'GitLab',
      'Jira',
      'Confluence',
      'Slack',
      'Teams',
      'Figma',
      'Postman',
      'VS Code',
    ],
  },
  other: {
    name: 'その他',
    icon: <Package className="h-4 w-4" />,
    skills: [
      'GraphQL',
      'REST API',
      'gRPC',
      'WebSocket',
      'OAuth',
      'JWT',
      'Microservices',
      'Serverless',
      'Machine Learning',
      'Blockchain',
    ],
  },
};

// 工程選択肢
const phases = ['要件定義', '基本設計', '詳細設計', '実装', 'テスト', '運用・保守'];

// ポジション選択肢
const positions = [
  'PM',
  'PL',
  'アーキテクト',
  'リードエンジニア',
  'シニアエンジニア',
  'エンジニア',
  'ジュニアエンジニア',
];

// ドメイン領域
const domains = [
  'Webアプリケーション',
  'モバイルアプリ',
  'インフラ・クラウド',
  'データ分析・AI',
  'ゲーム開発',
  'IoT・組み込み',
  'ブロックチェーン',
  'セキュリティ',
];

// 資格選択肢
const certifications = [
  '基本情報技術者',
  '応用情報技術者',
  '情報処理安全確保支援士',
  'AWS認定ソリューションアーキテクト',
  'AWS認定デベロッパー',
  'AWS認定SysOpsアドミニストレーター',
  'Google Cloud Professional',
  'Microsoft Azure認定',
  'Oracle認定Javaプログラマー',
  'CISSP',
  'CISA',
  'PMP',
  'その他',
];

export function CreateClientDialog({ open, onOpenChange, onSubmit }: CreateClientDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, { category: string; experienceYears: number }>
  >({});
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedPhases, setSelectedPhases] = useState<Record<string, { experienceYears: number }>>(
    {}
  );
  const [selectedPositions, setSelectedPositions] = useState<
    Record<string, { experienceYears: number }>
  >({});
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>([]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      industry: '',
      description: '',
      salesPerson: '',
      memo: '',
    },
  });

  const steps = [
    {
      id: 1,
      title: '基本情報・担当者',
      icon: <Building2 className="h-4 w-4" />,
      description: '企業情報と担当営業',
    },
    {
      id: 2,
      title: '条件・エンジニア情報',
      icon: <Award className="h-4 w-4" />,
      description: '求められるスキル・資格・工程・ポジション',
    },
  ];

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: ClientFormValues) => {
    onSubmit({
      ...data,
      preferredSkills: Object.keys(selectedSkills),
      domains: selectedDomains,
      certifications: selectedCertifications,
      phases: Object.keys(selectedPhases),
      positions: Object.keys(selectedPositions),
      pastProjects: selectedProjects,
      preferredEngineers: selectedEngineers,
    });

    // フォームをリセット
    form.reset();
    setSelectedSkills({});
    setSelectedDomains([]);
    setSelectedCertifications([]);
    setSelectedPhases({});
    setSelectedPositions({});
    setSelectedProjects([]);
    setSelectedEngineers([]);
    setCurrentStep(1);
  };

  const toggleSkill = (skillName: string) => {
    const category =
      Object.entries(skillOptions).find(([_, categoryData]) =>
        categoryData.skills.includes(skillName)
      )?.[0] || 'other';

    if (selectedSkills[skillName]) {
      const newSkills = { ...selectedSkills };
      delete newSkills[skillName];
      setSelectedSkills(newSkills);
    } else {
      setSelectedSkills({
        ...selectedSkills,
        [skillName]: { category, experienceYears: 1 },
      });
    }
  };

  const updateSkillExperience = (skillName: string, years: number) => {
    if (selectedSkills[skillName]) {
      setSelectedSkills({
        ...selectedSkills,
        [skillName]: { ...selectedSkills[skillName], experienceYears: years },
      });
    }
  };

  const removeSkill = (skillName: string) => {
    const newSkills = { ...selectedSkills };
    delete newSkills[skillName];
    setSelectedSkills(newSkills);
  };

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const toggleCertification = (certification: string) => {
    if (selectedCertifications.includes(certification)) {
      setSelectedCertifications(selectedCertifications.filter((c) => c !== certification));
    } else {
      setSelectedCertifications([...selectedCertifications, certification]);
    }
  };

  const togglePhase = (phase: string) => {
    if (selectedPhases[phase]) {
      const newPhases = { ...selectedPhases };
      delete newPhases[phase];
      setSelectedPhases(newPhases);
    } else {
      setSelectedPhases({
        ...selectedPhases,
        [phase]: { experienceYears: 1 },
      });
    }
  };

  const updatePhaseExperience = (phase: string, years: number) => {
    if (selectedPhases[phase]) {
      setSelectedPhases({
        ...selectedPhases,
        [phase]: { experienceYears: years },
      });
    }
  };

  const removePhase = (phase: string) => {
    const newPhases = { ...selectedPhases };
    delete newPhases[phase];
    setSelectedPhases(newPhases);
  };

  const togglePosition = (position: string) => {
    if (selectedPositions[position]) {
      const newPositions = { ...selectedPositions };
      delete newPositions[position];
      setSelectedPositions(newPositions);
    } else {
      setSelectedPositions({
        ...selectedPositions,
        [position]: { experienceYears: 1 },
      });
    }
  };

  const updatePositionExperience = (position: string, years: number) => {
    if (selectedPositions[position]) {
      setSelectedPositions({
        ...selectedPositions,
        [position]: { experienceYears: years },
      });
    }
  };

  const removePosition = (position: string) => {
    const newPositions = { ...selectedPositions };
    delete newPositions[position];
    setSelectedPositions(newPositions);
  };

  const toggleProject = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((p) => p !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  const toggleEngineer = (engineerId: string) => {
    if (selectedEngineers.includes(engineerId)) {
      setSelectedEngineers(selectedEngineers.filter((e) => e !== engineerId));
    } else {
      setSelectedEngineers([...selectedEngineers, engineerId]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                基本情報
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>企業名</FormLabel>
                      <FormControl>
                        <Input placeholder="○○株式会社" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>業界</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="業界を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>企業概要</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="企業の概要や特徴を入力してください"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 担当者情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                担当者
              </h3>

              <FormField
                control={form.control}
                name="salesPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>担当営業</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="担当営業を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {salesPersons.map((person) => (
                          <SelectItem key={person.name} value={person.name}>
                            <div className="flex flex-col">
                              <span className="font-medium">{person.name}</span>
                              <span className="text-sm text-muted-foreground">
                                （{person.department}）
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 条件・エンジニア情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                条件・エンジニア情報
              </h3>

              {/* 過去の案件（複数選択可） */}
              <div className="space-y-3">
                <FormLabel>過去の案件（複数選択可）</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedProjects.length > 0
                        ? `${selectedProjects.length}件選択済み`
                        : '案件を選択してください'}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-auto p-4 space-y-3">
                      {projectOptions.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-start space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                          onClick={() => toggleProject(project.id)}
                        >
                          <Checkbox
                            id={project.id}
                            checked={selectedProjects.includes(project.id)}
                            onCheckedChange={() => toggleProject(project.id)}
                          />
                          <div className="flex flex-col">
                            <label
                              htmlFor={project.id}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {project.name}
                            </label>
                            <span className="text-sm text-muted-foreground mt-1">
                              {project.client}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* 選択済み案件 */}
                {selectedProjects.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">選択済み案件</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProjects.map((projectId) => {
                        const project = projectOptions.find((p) => p.id === projectId);
                        return project ? (
                          <Badge key={projectId} variant="secondary" className="gap-1">
                            {project.name}
                            <button
                              type="button"
                              onClick={() => toggleProject(projectId)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  このクライアントで過去に実施した案件を選択してください
                </div>
              </div>

              {/* 好評だったエンジニア（複数選択可） */}
              <div className="space-y-3">
                <FormLabel>好評だったエンジニア（複数選択可）</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedEngineers.length > 0
                        ? `${selectedEngineers.length}名選択済み`
                        : 'エンジニアを選択してください'}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-auto p-4 space-y-3">
                      {engineerOptions.map((engineer) => (
                        <div
                          key={engineer.id}
                          className="flex items-start space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                          onClick={() => toggleEngineer(engineer.id)}
                        >
                          <Checkbox
                            id={engineer.id}
                            checked={selectedEngineers.includes(engineer.id)}
                            onCheckedChange={() => toggleEngineer(engineer.id)}
                          />
                          <div className="flex flex-col">
                            <label
                              htmlFor={engineer.id}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {engineer.name}
                            </label>
                            <span className="text-sm text-muted-foreground mt-1">
                              {engineer.skills}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* 選択済みエンジニア */}
                {selectedEngineers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">選択済みエンジニア</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEngineers.map((engineerId) => {
                        const engineer = engineerOptions.find((e) => e.id === engineerId);
                        return engineer ? (
                          <Badge key={engineerId} variant="secondary" className="gap-1">
                            {engineer.name}
                            <button
                              type="button"
                              onClick={() => toggleEngineer(engineerId)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  このクライアントから高評価を得たエンジニアを選択してください
                </div>
              </div>
            </div>

            <Separator />

            {/* 営業メモ */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">営業メモ</h3>

              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>営業メモ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="クライアントとの商談内容や特記事項を入力してください"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* 資格 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5" />
                資格
              </h3>

              {/* 選択済み資格 */}
              {selectedCertifications.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">選択済み資格</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCertifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="gap-1">
                        {cert}
                        <button
                          type="button"
                          onClick={() => toggleCertification(cert)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 資格選択 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">資格選択</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {certifications.map((certification) => (
                    <div key={certification} className="flex items-center space-x-2">
                      <Checkbox
                        id={certification}
                        checked={selectedCertifications.includes(certification)}
                        onCheckedChange={() => toggleCertification(certification)}
                      />
                      <label
                        htmlFor={certification}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {certification}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* スキル選択 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">スキル選択</h3>

              {/* 選択済みスキル */}
              {Object.keys(selectedSkills).length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">選択済みスキル</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedSkills).map(([skillName, skillData]) => (
                      <div
                        key={skillName}
                        className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                      >
                        <Badge variant="secondary" className="flex-shrink-0">
                          {skillName}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">経験年数:</span>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={skillData.experienceYears}
                            onChange={(e) =>
                              updateSkillExperience(skillName, parseFloat(e.target.value) || 1)
                            }
                            className="w-20 h-8"
                          />
                          <span className="text-sm text-muted-foreground">年</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skillName)}
                          className="ml-auto h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* スキルカテゴリ別選択 */}
              <div className="space-y-4">
                {Object.entries(skillOptions).map(([categoryKey, categoryData]) => (
                  <div key={categoryKey} className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      {categoryData.icon}
                      {categoryData.name}
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {categoryData.skills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={!!selectedSkills[skill]}
                            onCheckedChange={() => toggleSkill(skill)}
                          />
                          <label
                            htmlFor={skill}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* ドメイン領域 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                ドメイン領域
              </h3>

              {/* 選択済みドメイン */}
              {selectedDomains.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">選択済みドメイン領域</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDomains.map((domain) => (
                      <Badge key={domain} variant="secondary" className="gap-1">
                        {domain}
                        <button
                          type="button"
                          onClick={() => toggleDomain(domain)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* ドメイン選択 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {domains.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Checkbox
                      id={domain}
                      checked={selectedDomains.includes(domain)}
                      onCheckedChange={() => toggleDomain(domain)}
                    />
                    <label
                      htmlFor={domain}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {domain}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* 工程・ポジション */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                工程・ポジション
              </h3>

              {/* 選択済み工程・ポジション */}
              {(Object.keys(selectedPhases).length > 0 ||
                Object.keys(selectedPositions).length > 0) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">選択済み工程・ポジション</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedPhases).map(([phase, data]) => (
                      <div
                        key={phase}
                        className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                      >
                        <Badge variant="secondary" className="flex-shrink-0">
                          {phase}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">経験年数:</span>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={data.experienceYears}
                            onChange={(e) =>
                              updatePhaseExperience(phase, parseFloat(e.target.value) || 1)
                            }
                            className="w-20 h-8"
                          />
                          <span className="text-sm text-muted-foreground">年</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhase(phase)}
                          className="ml-auto h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {Object.entries(selectedPositions).map(([position, data]) => (
                      <div
                        key={position}
                        className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                      >
                        <Badge variant="secondary" className="flex-shrink-0">
                          {position}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">経験年数:</span>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={data.experienceYears}
                            onChange={(e) =>
                              updatePositionExperience(position, parseFloat(e.target.value) || 1)
                            }
                            className="w-20 h-8"
                          />
                          <span className="text-sm text-muted-foreground">年</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePosition(position)}
                          className="ml-auto h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 参加工程 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">参加工程</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {phases.map((phase) => (
                    <div key={phase} className="flex items-center space-x-2">
                      <Checkbox
                        id={phase}
                        checked={!!selectedPhases[phase]}
                        onCheckedChange={() => togglePhase(phase)}
                      />
                      <label
                        htmlFor={phase}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {phase}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ポジション経験 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">ポジション経験</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {positions.map((position) => (
                    <div key={position} className="flex items-center space-x-2">
                      <Checkbox
                        id={position}
                        checked={!!selectedPositions[position]}
                        onCheckedChange={() => togglePosition(position)}
                      />
                      <label
                        htmlFor={position}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {position}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規クライアント登録</DialogTitle>
        </DialogHeader>

        {/* プログレスバー */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-muted-foreground/25 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderStepContent()}

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  キャンセル
                </Button>
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    戻る
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {currentStep < steps.length ? (
                  <Button type="button" onClick={handleNext}>
                    次へ
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="submit">登録する</Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
