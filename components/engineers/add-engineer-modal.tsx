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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Award,
  Briefcase,
  Settings,
} from 'lucide-react';

const engineerSchema = z.object({
  name: z.string().min(1, '氏名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().min(1, '電話番号を入力してください'),
  totalExperience: z.coerce.number().min(0, '経験年数を入力してください'),
  availability: z.enum(['available', 'unavailable']),
  availableFrom: z.string().optional(),
  preferredWorkStyle: z.enum(['remote', 'onsite', 'hybrid']),
  preferredRate: z.coerce.number().min(0, '希望単価を入力してください'),
  imageUrl: z.string().optional(),
});

type EngineerFormValues = z.infer<typeof engineerSchema>;

interface AddEngineerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: EngineerFormValues & {
      skills: Array<{ name: string; category: string; experienceYears: number }>;
      resumeFiles: File[];
    }
  ) => void;
}

// スキル候補データ
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

export function AddEngineerModal({ open, onOpenChange, onSubmit }: AddEngineerModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, { category: string; experienceYears: number }>
  >({});
  const [selectedPhases, setSelectedPhases] = useState<Record<string, { experienceYears: number }>>(
    {}
  );
  const [selectedPositions, setSelectedPositions] = useState<
    Record<string, { experienceYears: number }>
  >({});
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<EngineerFormValues>({
    resolver: zodResolver(engineerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      totalExperience: 0,
      availability: 'available',
      availableFrom: '',
      preferredWorkStyle: 'remote',
      preferredRate: 0,
      imageUrl: '',
    },
  });

  const steps = [
    {
      id: 1,
      title: '基本情報・経験',
      icon: <User className="h-4 w-4" />,
      description: '氏名、連絡先、経験年数など',
    },
    {
      id: 2,
      title: 'スキル・資格',
      icon: <Award className="h-4 w-4" />,
      description: '技術スキル、工程・ポジション経験',
    },
    {
      id: 3,
      title: '職務経歴書・スキルシート',
      icon: <FileText className="h-4 w-4" />,
      description: 'ファイルアップロード',
    },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: EngineerFormValues) => {
    const skillsArray = Object.entries(selectedSkills).map(([name, skillData]) => ({
      name,
      category: skillData.category,
      experienceYears: skillData.experienceYears,
    }));

    onSubmit({
      ...data,
      skills: skillsArray,
      resumeFiles: uploadedFiles,
    });

    // フォームをリセット
    form.reset();
    setSelectedSkills({});
    setSelectedPhases({});
    setSelectedPositions({});
    setSelectedDomains([]);
    setSelectedCertifications([]);
    setUploadedFiles([]);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (file.type.includes('word')) return <FileText className="h-4 w-4 text-blue-500" />;
    if (file.type.includes('excel') || file.type.includes('sheet'))
      return <FileText className="h-4 w-4 text-green-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">基本情報</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名</FormLabel>
                      <FormControl>
                        <Input placeholder="山田 太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メールアドレス</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>電話番号</FormLabel>
                        <FormControl>
                          <Input placeholder="090-1234-5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>経験年数</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>希望単価（万円）</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>稼働状況</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="稼働状況を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">空き</SelectItem>
                            <SelectItem value="unavailable">稼働中</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredWorkStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>希望勤務形態</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="勤務形態を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="remote">リモート</SelectItem>
                            <SelectItem value="onsite">常駐</SelectItem>
                            <SelectItem value="hybrid">ハイブリッド</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="availableFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>稼働開始可能日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

      case 3:
        return (
          <div className="space-y-6">
            {/* 職務経歴書アップロード */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="h-5 w-5" />
                職務経歴書アップロード
              </h3>

              {/* ドラッグ&ドロップエリア */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  ファイルをドラッグ&ドロップ または クリックで選択
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  対応形式: Word (.doc, .docx), Excel (.xls, .xlsx), PDF (.pdf), テキスト (.txt)
                  <br />
                  最大ファイルサイズ: 10MB
                </p>
                <input
                  type="file"
                  multiple
                  accept=".doc,.docx,.xls,.xlsx,.pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  ファイルを選択
                </Button>
              </div>

              {/* アップロード済みファイル一覧 */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">アップロード済みファイル</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* スキルシートアップロード */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="h-5 w-5" />
                スキルシートアップロード
              </h3>

              {/* ドラッグ&ドロップエリア */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  ファイルをドラッグ&ドロップ または クリックで選択
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  対応形式: Word (.doc, .docx), Excel (.xls, .xlsx), PDF (.pdf), テキスト (.txt)
                  <br />
                  最大ファイルサイズ: 10MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  ファイルを選択
                </Button>
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>エンジニアを追加 - {steps[currentStep - 1].title}</DialogTitle>
            <div className="text-sm text-muted-foreground">
              {currentStep} / {steps.length}
            </div>
          </div>
        </DialogHeader>

        {/* ステップナビゲーション */}
        <div className="space-y-4">
          <Progress value={(currentStep / steps.length) * 100} className="w-full" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm ${
                  step.id === currentStep
                    ? 'text-primary font-medium'
                    : step.id < currentStep
                      ? 'text-green-600'
                      : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.id === currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : step.id < currentStep
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-muted-foreground/25'
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.icon}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderStepContent()}

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  キャンセル
                </Button>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    戻る
                  </Button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext} className="gap-2">
                    次へ
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    追加
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
