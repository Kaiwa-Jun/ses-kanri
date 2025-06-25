# フォーム実装詳細規約

## 基本原則

- **React Hook Form + Zod の組み合わせを必須とする**
- **shadcn/ui Form コンポーネントを基盤とする**
- **型安全なバリデーションを実装する**
- **ユーザビリティを重視したエラー表示**
- **アクセシビリティを考慮したフォーム設計**

## Zodスキーマ設計

### 基本スキーマパターン

```typescript
// lib/schemas/base.ts
import { z } from 'zod';

// 共通バリデーション関数
export const requiredString = (message: string) => z.string().min(1, message);

export const optionalString = () => z.string().optional();

export const email = () => z.string().email('正しいメールアドレスを入力してください');

export const phoneNumber = () =>
  z
    .string()
    .regex(/^[0-9-+().\s]+$/, '正しい電話番号を入力してください')
    .min(10, '電話番号は10桁以上で入力してください');

export const positiveNumber = (message: string) => z.number().positive(message);

export const dateInFuture = () =>
  z.date().refine((date) => date > new Date(), { message: '未来の日付を選択してください' });

export const password = () =>
  z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, 'パスワードには大文字を含めてください')
    .regex(/[a-z]/, 'パスワードには小文字を含めてください')
    .regex(/[0-9]/, 'パスワードには数字を含めてください');
```

### エンティティ別スキーマ

```typescript
// lib/schemas/client.ts
import { z } from 'zod';
import { requiredString, email, phoneNumber, optionalString } from './base';

export const clientSchema = z.object({
  name: requiredString('クライアント名は必須です').max(
    100,
    'クライアント名は100文字以内で入力してください'
  ),

  company: requiredString('会社名は必須です').max(200, '会社名は200文字以内で入力してください'),

  email: email(),

  phone: phoneNumber(),

  address: optionalString().refine((val) => !val || val.length <= 500, {
    message: '住所は500文字以内で入力してください',
  }),

  industry: z.enum(
    ['manufacturing', 'finance', 'healthcare', 'education', 'retail', 'technology', 'other'],
    {
      errorMap: () => ({ message: '業界を選択してください' }),
    }
  ),

  contractType: z.enum(['ses', 'contract', 'dispatch'], {
    errorMap: () => ({ message: '契約形態を選択してください' }),
  }),

  notes: optionalString(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

// 更新用スキーマ（部分的更新対応）
export const updateClientSchema = clientSchema.partial();
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
```

```typescript
// lib/schemas/engineer.ts
import { z } from 'zod';
import { requiredString, email, phoneNumber, optionalString, dateInFuture } from './base';

export const skillLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);

export const skillSchema = z.object({
  name: requiredString('スキル名は必須です'),
  level: skillLevelSchema,
  yearsOfExperience: z
    .number()
    .min(0, '経験年数は0年以上で入力してください')
    .max(50, '経験年数は50年以下で入力してください'),
});

export const engineerSchema = z.object({
  name: requiredString('氏名は必須です').max(50, '氏名は50文字以内で入力してください'),

  email: email(),

  phone: phoneNumber(),

  birthDate: z
    .date({
      required_error: '生年月日は必須です',
      invalid_type_error: '正しい日付を入力してください',
    })
    .refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 18 && age <= 70;
      },
      { message: '18歳以上70歳以下の方のみ登録可能です' }
    ),

  joinDate: z.date({
    required_error: '入社日は必須です',
  }),

  skills: z
    .array(skillSchema)
    .min(1, '最低1つのスキルを登録してください')
    .max(20, 'スキルは最大20個まで登録できます'),

  hourlyRate: z
    .number()
    .min(1000, '時給は1000円以上で設定してください')
    .max(10000, '時給は10000円以下で設定してください'),

  availableFrom: dateInFuture(),

  certifications: z.array(z.string()).default([]),

  portfolio: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),

  notes: optionalString(),
});

export type EngineerFormData = z.infer<typeof engineerSchema>;
```

## フォームコンポーネント実装

### 基本フォームコンポーネント

```typescript
// components/forms/ClientForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '@/lib/schemas/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const industryOptions = [
  { value: 'manufacturing', label: '製造業' },
  { value: 'finance', label: '金融業' },
  { value: 'healthcare', label: '医療・ヘルスケア' },
  { value: 'education', label: '教育' },
  { value: 'retail', label: '小売業' },
  { value: 'technology', label: 'IT・テクノロジー' },
  { value: 'other', label: 'その他' }
];

const contractTypeOptions = [
  { value: 'ses', label: 'SES' },
  { value: 'contract', label: '請負' },
  { value: 'dispatch', label: '派遣' }
];

export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}: ClientFormProps) {
  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      industry: 'other',
      contractType: 'ses',
      notes: '',
      ...initialData
    }
  });

  const handleSubmit = async (data: ClientFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: `クライアントを${mode === 'create' ? '作成' : '更新'}しました`,
        description: 'クライアント情報が正常に保存されました。'
      });
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: error instanceof Error ? error.message : '予期しないエラーが発生しました。',
        variant: 'destructive'
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>担当者名 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="山田 太郎"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  クライアント企業の担当者名を入力してください
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>会社名 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="株式会社サンプル"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@company.com"
                    {...field}
                  />
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
                <FormLabel>電話番号 *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="03-1234-5678"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>住所</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="東京都渋谷区..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>業界 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="業界を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約形態 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="契約形態を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contractTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="その他の情報があれば入力してください"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                特記事項や注意点などを記載してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? '作成' : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 複雑なフォーム（配列フィールド含む）

```typescript
// components/forms/EngineerForm.tsx
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { engineerSchema, EngineerFormData, skillLevelSchema } from '@/lib/schemas/engineer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface EngineerFormProps {
  initialData?: Partial<EngineerFormData>;
  onSubmit: (data: EngineerFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const skillLevelOptions = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
  { value: 'expert', label: 'エキスパート' }
];

const commonSkills = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Java', 'C#', 'PHP', 'Ruby',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'
];

export function EngineerForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: EngineerFormProps) {
  const { toast } = useToast();

  const form = useForm<EngineerFormData>({
    resolver: zodResolver(engineerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthDate: new Date(),
      joinDate: new Date(),
      skills: [{ name: '', level: 'beginner', yearsOfExperience: 0 }],
      hourlyRate: 3000,
      availableFrom: new Date(),
      certifications: [],
      portfolio: '',
      notes: '',
      ...initialData
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills'
  });

  const handleSubmit = async (data: EngineerFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: 'エンジニア情報を保存しました',
        description: 'エンジニア情報が正常に保存されました。'
      });
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: error instanceof Error ? error.message : '予期しないエラーが発生しました。',
        variant: 'destructive'
      });
    }
  };

  const addSkill = (skillName?: string) => {
    append({
      name: skillName || '',
      level: 'beginner',
      yearsOfExperience: 0
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>氏名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="山田 太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス *</FormLabel>
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
                    <FormLabel>電話番号 *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="090-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>生年月日 *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="生年月日を選択してください"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>入社日 *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="入社日を選択してください"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* スキル情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              スキル情報
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill()}
              >
                <Plus className="h-4 w-4 mr-2" />
                スキル追加
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* よく使われるスキルのクイック追加 */}
            <div>
              <FormLabel>よく使われるスキル</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addSkill(skill)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* スキル一覧 */}
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>スキル名</FormLabel>
                      <FormControl>
                        <Input placeholder="JavaScript" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`skills.${index}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>レベル</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`skills.${index}.yearsOfExperience`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>経験年数</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 契約情報 */}
        <Card>
          <CardHeader>
            <CardTitle>契約情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>時給 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1000"
                        max="10000"
                        placeholder="3000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>円/時間</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>稼働開始可能日 *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="稼働開始可能日を選択してください"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ポートフォリオURL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://portfolio.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    GitHubやポートフォリオサイトのURLを入力してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="その他の情報があれば入力してください"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## カスタムフォームコンポーネント

### 条件付きフィールド表示

```typescript
// components/forms/ConditionalField.tsx
import { useWatch, Control } from 'react-hook-form';

interface ConditionalFieldProps {
  control: Control<any>;
  watchField: string;
  condition: (value: any) => boolean;
  children: React.ReactNode;
}

export function ConditionalField({
  control,
  watchField,
  condition,
  children
}: ConditionalFieldProps) {
  const watchedValue = useWatch({
    control,
    name: watchField
  });

  if (!condition(watchedValue)) {
    return null;
  }

  return <>{children}</>;
}

// 使用例
<ConditionalField
  control={form.control}
  watchField="contractType"
  condition={(value) => value === 'ses'}
>
  <FormField
    control={form.control}
    name="sesSpecificField"
    render={({ field }) => (
      <FormItem>
        <FormLabel>SES固有フィールド</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</ConditionalField>
```

### ファイルアップロードフィールド

```typescript
// components/forms/FileUploadField.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, File } from 'lucide-react';

interface FileUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number; // MB
  label: string;
  description?: string;
}

export function FileUploadField({
  value,
  onChange,
  accept = 'image/*,.pdf,.doc,.docx',
  maxSize = 5,
  label,
  description
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: 'ファイルサイズエラー',
        description: `ファイルサイズは${maxSize}MB以下にしてください。`,
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // ファイルアップロード処理（実装は環境に応じて）
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const { url } = await response.json();
      onChange(url);

      toast({
        title: 'アップロード完了',
        description: 'ファイルが正常にアップロードされました。'
      });
    } catch (error) {
      toast({
        title: 'アップロードエラー',
        description: error instanceof Error ? error.message : 'アップロードに失敗しました。',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className="flex items-center space-x-2 p-3 border rounded-md">
          <File className="h-4 w-4" />
          <span className="flex-1 text-sm">{value.split('/').pop()}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
          />

          {uploading && (
            <Progress value={progress} className="w-full" />
          )}
        </div>
      )}

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
```

## フォームバリデーション

### カスタムバリデーション関数

```typescript
// lib/validation/custom-validators.ts
import { z } from 'zod';

// 日本の郵便番号バリデーション
export const japanesePostalCode = () =>
  z.string().regex(/^\d{3}-\d{4}$/, '郵便番号は000-0000の形式で入力してください');

// 日本の電話番号バリデーション
export const japanesePhoneNumber = () =>
  z.string().regex(/^(0\d{1,4}-\d{1,4}-\d{4}|0\d{9,10})$/, '正しい電話番号を入力してください');

// カタカナバリデーション
export const katakana = (message: string) => z.string().regex(/^[ァ-ヶー\s]*$/, message);

// ひらがなバリデーション
export const hiragana = (message: string) => z.string().regex(/^[ひらがな\s]*$/, message);

// 営業日チェック（土日祝日を除く）
export const businessDay = () =>
  z.date().refine(
    (date) => {
      const day = date.getDay();
      return day !== 0 && day !== 6; // 日曜日(0)と土曜日(6)を除く
    },
    { message: '営業日（平日）を選択してください' }
  );

// 時間範囲チェック
export const timeRange = (startTime: string, endTime: string) =>
  z.string().refine(
    (time) => {
      return time >= startTime && time <= endTime;
    },
    { message: `${startTime}から${endTime}の間で選択してください` }
  );

// 依存フィールドバリデーション
export const dependentField = <T>(
  dependsOn: keyof T,
  condition: (value: any) => boolean,
  message: string
) =>
  z.any().refine(
    (value, ctx) => {
      const dependentValue = (ctx.parent as T)[dependsOn];
      if (condition(dependentValue)) {
        return value != null && value !== '';
      }
      return true;
    },
    { message }
  );
```

### 非同期バリデーション

```typescript
// lib/validation/async-validators.ts
import { z } from 'zod';

// メールアドレス重複チェック
export const uniqueEmail = () =>
  z
    .string()
    .email()
    .refine(
      async (email) => {
        const response = await fetch(`/api/check-email?email=${email}`);
        const { exists } = await response.json();
        return !exists;
      },
      { message: 'このメールアドレスは既に登録されています' }
    );

// プロジェクト名重複チェック
export const uniqueProjectName = (excludeId?: string) =>
  z.string().refine(
    async (name) => {
      const params = new URLSearchParams({ name });
      if (excludeId) {
        params.append('excludeId', excludeId);
      }

      const response = await fetch(`/api/check-project-name?${params}`);
      const { exists } = await response.json();
      return !exists;
    },
    { message: 'このプロジェクト名は既に使用されています' }
  );
```

## エラーハンドリング

### フォームエラー表示

```typescript
// components/forms/FormErrorSummary.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FieldErrors } from 'react-hook-form';

interface FormErrorSummaryProps {
  errors: FieldErrors;
  title?: string;
}

export function FormErrorSummary({
  errors,
  title = '入力内容にエラーがあります'
}: FormErrorSummaryProps) {
  const errorMessages = Object.entries(errors)
    .filter(([_, error]) => error?.message)
    .map(([field, error]) => ({
      field,
      message: error?.message as string
    }));

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 space-y-1">
          {errorMessages.map(({ field, message }) => (
            <li key={field} className="text-sm">
              • {message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
```

### フォーム送信状態管理

```typescript
// hooks/useFormSubmit.ts
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<void>,
  options: UseFormSubmitOptions<T> = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await submitFn(data);

      if (options.successMessage) {
        toast({
          title: '成功',
          description: options.successMessage,
        });
      }

      options.onSuccess?.(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : options.errorMessage || '送信に失敗しました';

      setSubmitError(errorMessage);

      toast({
        title: 'エラー',
        description: errorMessage,
        variant: 'destructive',
      });

      options.onError?.(error as Error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitError,
    handleSubmit,
    clearError: () => setSubmitError(null),
  };
}
```
