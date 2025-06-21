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
      'MATLAB',
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
      'Spring Framework',
      'ASP.NET',
      '.NET Core',
      'Laravel',
      'Symfony',
      'Ruby on Rails',
      'Gin',
      'Echo',
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
      'InfluxDB',
      'SQLite',
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
      'Nginx',
      'Apache',
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
      'Adobe XD',
      'Sketch',
      'Postman',
      'Insomnia',
      'VS Code',
      'IntelliJ',
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
      'SAML',
      'Microservices',
      'Serverless',
      'Machine Learning',
      'AI',
      'Blockchain',
    ],
  },
};

export function AddEngineerModal({ open, onOpenChange, onSubmit }: AddEngineerModalProps) {
  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, { name: string; experienceYears: number }>
  >({});
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
      preferredWorkStyle: 'remote',
      preferredRate: 0,
    },
  });

  const handleSubmit = (data: EngineerFormValues) => {
    const skills = Object.entries(selectedSkills).map(([skillName, skillData]) => {
      // スキルがどのカテゴリに属するかを特定
      const category =
        Object.entries(skillOptions).find(([_, categoryData]) =>
          categoryData.skills.includes(skillName)
        )?.[0] || 'other';

      return {
        name: skillName,
        category,
        experienceYears: skillData.experienceYears,
      };
    });

    onSubmit({ ...data, skills, resumeFiles: uploadedFiles });
    form.reset();
    setSelectedSkills({});
    setUploadedFiles([]);
    onOpenChange(false);
  };

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      if (prev[skillName]) {
        const { [skillName]: removed, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [skillName]: { name: skillName, experienceYears: 1 },
        };
      }
    });
  };

  const updateSkillExperience = (skillName: string, years: number) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skillName]: { ...prev[skillName], experienceYears: years },
    }));
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const { [skillName]: removed, ...rest } = prev;
      return rest;
    });
  };

  // ファイルアップロード関連の関数
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/pdf', // .pdf
        'text/plain', // .txt
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      return <FileText className="h-4 w-4 text-green-500" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>エンジニアを追加</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="font-medium">基本情報</h3>

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

            <Separator />

            {/* 職務経歴書アップロード */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                職務経歴書アップロード
              </h3>

              {/* ドラッグ&ドロップエリア */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">
                  ファイルをドラッグ&ドロップ または クリックして選択
                </p>
                <p className="text-xs text-muted-foreground mb-4">
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
                <div className="space-y-2">
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

              {/* 注意事項 */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">職務経歴書について</p>
                  <ul className="text-xs space-y-1">
                    <li>• 複数のファイルをアップロード可能です</li>
                    <li>• アップロードされたファイルは安全に保管されます</li>
                    <li>• 後からファイルの追加・削除が可能です</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* スキル選択 */}
            <div className="space-y-4">
              <h3 className="font-medium">スキル選択</h3>

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              <Button type="submit">追加</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
