'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Save,
  Star,
} from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

// フォームのスキーマ定義
const basicInfoSchema = z.object({
  name: z.string().min(1, '氏名を入力してください'),
  birthDate: z.string().min(1, '生年月日を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  phone: z.string().min(1, '電話番号を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

const prSchema = z.object({
  introduction: z.string().min(1, '自己PRを入力してください'),
  availableFrom: z.string().min(1, '稼働開始可能日を入力してください'),
  workStyle: z.string().min(1, '希望勤務形態を選択してください'),
  preferredArea: z.string().min(1, '希望勤務地を選択してください'),
});

const projectSchema = z.object({
  projectName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  teamSize: z.coerce.number(),
  description: z.string(),
  responsibilities: z.string(),
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    infrastructure: z.array(z.string()),
  }),
});

const appealSchema = z.object({
  appealPoints: z.string().min(1, 'アピールポイントを入力してください'),
  workPreferences: z.string().min(1, '希望する働き方を入力してください'),
});

// スキルオプションの定義
const skillOptions = {
  frontend: ['React', 'Vue.js', 'Angular', 'TypeScript', 'Next.js', 'Nuxt.js'],
  backend: ['Node.js', 'Python', 'Java', 'Ruby', 'Go', 'PHP'],
  infrastructure: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
};

// プロジェクトの型定義
interface Project {
  id?: string;
  projectName: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  description: string;
  responsibilities: string;
  skills: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
}

export default function ResumePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<{
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  }>({
    frontend: [],
    backend: [],
    infrastructure: [],
  });

  // 各ステップのフォーム
  const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
  });

  const prForm = useForm<z.infer<typeof prSchema>>({
    resolver: zodResolver(prSchema),
  });

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
  });

  const appealForm = useForm<z.infer<typeof appealSchema>>({
    resolver: zodResolver(appealSchema),
  });

  // プロジェクトの追加・編集
  const handleProjectSubmit = (data: z.infer<typeof projectSchema>) => {
    const projectWithId: Project = {
      ...data,
      id: editingProjectIndex !== null ? projects[editingProjectIndex].id : Date.now().toString(),
      skills: selectedSkills,
    };

    if (editingProjectIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editingProjectIndex] = projectWithId;
      setProjects(updatedProjects);
      setEditingProjectIndex(null);
    } else {
      setProjects([...projects, projectWithId]);
    }
    projectForm.reset();
    setSelectedSkills({ frontend: [], backend: [], infrastructure: [] });
  };

  // プロジェクトの編集開始
  const startEditingProject = (index: number) => {
    const project = projects[index];
    projectForm.reset(project);
    setSelectedSkills(project.skills);
    setEditingProjectIndex(index);
  };

  // プロジェクトの削除
  const deleteProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // スキルの選択状態を切り替え
  const toggleSkill = (category: keyof typeof selectedSkills, skill: string) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [category]: prev[category].includes(skill)
        ? prev[category].filter((s) => s !== skill)
        : [...prev[category], skill],
    }));
  };

  // 進捗計算関数
  const calculateProgress = (step: number) => {
    return step * 20;
  };

  // Step 1: 基本情報
  const renderStep1 = () => (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Step 1: 基本情報</h2>
      <p className="text-sm text-muted-foreground mb-6">基本的な個人情報を入力してください</p>
      <Form {...basicInfoForm}>
        <form className="space-y-4">
          <FormField
            control={basicInfoForm.control}
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

          <FormField
            control={basicInfoForm.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>生年月日</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={basicInfoForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>住所</FormLabel>
                <FormControl>
                  <Input placeholder="東京都渋谷区..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={basicInfoForm.control}
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

          <FormField
            control={basicInfoForm.control}
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

          <Button type="button" className="w-full" onClick={() => setCurrentStep(2)}>
            次へ
          </Button>
        </form>
      </Form>
    </div>
  );

  // Step 2: 自己PR・希望条件
  const renderStep2 = () => (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Step 2: 自己PR・希望条件</h2>
      <p className="text-sm text-muted-foreground mb-6">希望条件を入力してください</p>
      <Form {...prForm}>
        <form className="space-y-4">
          <FormField
            control={prForm.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自己紹介・自己PR</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="自己PRを入力してください"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={prForm.control}
            name="availableFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>稼働希望開始日</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={prForm.control}
            name="workStyle"
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
                    <SelectItem value="onsite">常駐</SelectItem>
                    <SelectItem value="remote">リモート</SelectItem>
                    <SelectItem value="hybrid">ハイブリッド</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={prForm.control}
            name="preferredArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>希望勤務地</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="エリアを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tokyo">東京都</SelectItem>
                    <SelectItem value="kanagawa">神奈川県</SelectItem>
                    <SelectItem value="chiba">千葉県</SelectItem>
                    <SelectItem value="saitama">埼玉県</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
              戻る
            </Button>
            <Button type="button" onClick={() => setCurrentStep(3)}>
              次へ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

  // Step 3: 職務経歴
  const renderStep3 = () => (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Step 3: 職務経歴</h2>
      <p className="text-sm text-muted-foreground mb-6">これまでの職務経歴を入力してください</p>

      <Form {...projectForm}>
        <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4">
          <FormField
            control={projectForm.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>プロジェクト名</FormLabel>
                <FormControl>
                  <Input placeholder="ECサイトリニューアル" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={projectForm.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始日</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={projectForm.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>終了日</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={projectForm.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>チーム人数</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={projectForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>業務概要</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="プロジェクトの概要を入力"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={projectForm.control}
            name="responsibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>担当業務</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="担当した業務内容を入力"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>使用技術</FormLabel>
            {Object.entries(skillOptions).map(([category, skills]) => (
              <div key={category}>
                <p className="text-sm font-medium mb-2">
                  {category === 'frontend'
                    ? 'フロントエンド'
                    : category === 'backend'
                      ? 'バックエンド'
                      : 'インフラ'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={
                        selectedSkills[category as keyof typeof selectedSkills].includes(skill)
                          ? 'default'
                          : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleSkill(category as keyof typeof selectedSkills, skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">
            {editingProjectIndex !== null ? 'プロジェクトを更新' : 'プロジェクトを追加'}
          </Button>
        </form>
      </Form>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">登録済みプロジェクト</h3>
        {projects.map((project, index) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.projectName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {project.startDate} 〜 {project.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEditingProject(index)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProject(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">業務概要</p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">担当業務</p>
                  <p className="text-sm text-muted-foreground">{project.responsibilities}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">使用技術</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(project.skills).map(([category, techs]) =>
                      (techs as string[]).map((tech: string) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between gap-4 mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          戻る
        </Button>
        <Button onClick={() => setCurrentStep(4)}>次へ</Button>
      </div>
    </div>
  );

  // Step 4: 自己PR
  const renderStep4 = () => (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Step 4: 自己PR</h2>
      <p className="text-sm text-muted-foreground mb-6">
        アピールポイントと希望する働き方を入力してください
      </p>
      <Form {...appealForm}>
        <form className="space-y-4">
          <FormField
            control={appealForm.control}
            name="appealPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>アピールポイント</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="あなたの強みや特徴をアピールしてください"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={appealForm.control}
            name="workPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>希望する働き方</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="希望する働き方や条件について記入してください"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              戻る
            </Button>
            <Button onClick={() => setCurrentStep(5)}>次へ</Button>
          </div>
        </form>
      </Form>
    </div>
  );

  // Step 5: 確認
  const renderStep5 = () => (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Step 5: 確認</h2>
      <p className="text-sm text-muted-foreground mb-6">入力した内容を確認してください</p>
      <div className="space-y-8">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">氏名</p>
              <p className="text-sm text-muted-foreground">山田 太郎</p>
            </div>
            <div>
              <p className="text-sm font-medium">生年月日</p>
              <p className="text-sm text-muted-foreground">1990-01-01</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">住所</p>
              <p className="text-sm text-muted-foreground">東京都渋谷区...</p>
            </div>
            <div>
              <p className="text-sm font-medium">電話番号</p>
              <p className="text-sm text-muted-foreground">090-1234-5678</p>
            </div>
            <div>
              <p className="text-sm font-medium">メールアドレス</p>
              <p className="text-sm text-muted-foreground">example@email.com</p>
            </div>
          </CardContent>
        </Card>

        {/* 自己PR・希望条件 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">自己PR・希望条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">自己紹介・自己PR</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                自己PRの内容がここに表示されます
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">稼働希望開始日</p>
                <p className="text-sm text-muted-foreground">2024-04-01</p>
              </div>
              <div>
                <p className="text-sm font-medium">希望勤務形態</p>
                <p className="text-sm text-muted-foreground">リモート</p>
              </div>
              <div>
                <p className="text-sm font-medium">希望勤務地</p>
                <p className="text-sm text-muted-foreground">東京都</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 職務経歴 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">職務経歴</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, index) => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{project.projectName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.startDate} 〜 {project.endDate}
                  </p>
                </div>

                <p className="text-sm">
                  <span className="font-medium">チーム人数:</span> {project.teamSize}名
                </p>

                <div>
                  <p className="text-sm font-medium">使用技術:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(project.skills).map(([category, techs]) =>
                      (techs as string[]).map((tech: string) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <p className="text-sm">{project.description}</p>

                <div>
                  <p className="text-sm font-medium">担当業務:</p>
                  <p className="text-sm text-muted-foreground">{project.responsibilities}</p>
                </div>

                {index < projects.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 自己PR */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">自己PR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">アピールポイント</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                アピールポイントの内容がここに表示されます
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">希望する働き方</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                希望する働き方の内容がここに表示されます
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={() => setCurrentStep(4)}>
            戻る
          </Button>
          <Button>職務経歴書を作成</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">職務経歴書作成</h1>
        <div className="space-y-2">
          <Progress value={calculateProgress(currentStep)} className="h-2" />
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <Button
                key={step}
                variant={currentStep === step ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep(step)}
              >
                Step {step}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}
    </div>
  );
}
