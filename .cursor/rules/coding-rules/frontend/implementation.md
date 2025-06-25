# フロントエンド実装規約

## 基本原則

- **型安全性を最優先とする**
- **React Hook FormとZodを組み合わせたフォーム実装**
- **shadcn/uiコンポーネントを基盤とする**
- **カスタムhooksでロジックを分離する**
- **エラーハンドリングを統一する**
- **アクセシビリティを考慮する**

## TypeScript型定義

### 基本型定義パターン

```typescript
// types/index.ts - 共通型定義
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// エラー型定義
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}
```

### ドメイン固有型定義

```typescript
// types/project.ts
export interface Project extends BaseEntity {
  name: string;
  description: string;
  clientId: string;
  status: 'active' | 'planning' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget: number;
  requiredSkills: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  clientId: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
  requiredSkills: string[];
}

export interface ProjectWithDetails extends Project {
  client: {
    name: string;
    company: string;
  };
  assignments: {
    userId: string;
    userName: string;
    role: string;
  }[];
}
```

## React Hook Form + Zod実装

### フォームスキーマ定義

```typescript
// lib/schemas/project.ts
import { z } from 'zod';

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'プロジェクト名は必須です')
    .max(100, 'プロジェクト名は100文字以内で入力してください'),

  description: z
    .string()
    .min(10, '説明は10文字以上入力してください')
    .max(500, '説明は500文字以内で入力してください'),

  clientId: z.string().min(1, 'クライアントを選択してください'),

  startDate: z.date({
    required_error: '開始日は必須です',
    invalid_type_error: '正しい日付を入力してください',
  }),

  endDate: z
    .date()
    .optional()
    .refine((date, ctx) => {
      const startDate = ctx.parent.startDate;
      if (date && startDate && date <= startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '終了日は開始日より後の日付を選択してください',
        });
        return false;
      }
      return true;
    }),

  budget: z
    .number()
    .min(1, '予算は1円以上で入力してください')
    .max(999999999, '予算は9億円以下で入力してください'),

  requiredSkills: z
    .array(z.string())
    .min(1, '最低1つのスキルを選択してください')
    .max(10, 'スキルは最大10個まで選択できます'),
});

export type ProjectFormSchema = z.infer<typeof projectSchema>;
```

### フォームコンポーネント実装

```typescript
// components/forms/ProjectForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormSchema } from '@/lib/schemas/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ProjectFormProps {
  initialData?: Partial<ProjectFormSchema>;
  onSubmit: (data: ProjectFormSchema) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProjectForm({ initialData, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const { toast } = useToast();

  const form = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      clientId: '',
      startDate: new Date(),
      endDate: undefined,
      budget: 0,
      requiredSkills: [],
      ...initialData
    }
  });

  const handleSubmit = async (data: ProjectFormSchema) => {
    try {
      await onSubmit(data);
      toast({
        title: 'プロジェクトを保存しました',
        description: 'プロジェクト情報が正常に保存されました。'
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>プロジェクト名 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="プロジェクト名を入力してください"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="プロジェクトの説明を入力してください"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>クライアント *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="クライアントを選択してください" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="client1">株式会社サンプル</SelectItem>
                  <SelectItem value="client2">テスト商事</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>開始日 *</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    placeholder="開始日を選択してください"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>終了日</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    placeholder="終了日を選択してください（任意）"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>予算 *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="予算を入力してください"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>必要スキル *</FormLabel>
              <FormControl>
                <MultiSelect
                  options={[
                    { value: 'javascript', label: 'JavaScript' },
                    { value: 'typescript', label: 'TypeScript' },
                    { value: 'react', label: 'React' },
                    { value: 'nextjs', label: 'Next.js' },
                    { value: 'nodejs', label: 'Node.js' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="必要なスキルを選択してください"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
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

## shadcn/ui コンポーネント活用

### カスタムコンポーネント拡張

```typescript
// components/ui/data-table.tsx
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState
} from '@tanstack/react-table';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = '検索...'
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              表示項目 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  データがありません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} 行選択中
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            前へ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            次へ
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### ステータス表示コンポーネント

```typescript
// components/ui/status-badge.tsx
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'active' | 'planning' | 'completed' | 'cancelled';
  className?: string;
}

const statusConfig = {
  active: {
    label: '進行中',
    className: 'bg-green-100 text-green-800 hover:bg-green-100'
  },
  planning: {
    label: '計画中',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  },
  completed: {
    label: '完了',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  },
  cancelled: {
    label: 'キャンセル',
    className: 'bg-red-100 text-red-800 hover:bg-red-100'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="secondary"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
```

## カスタムhooks

### データフェッチhook

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  deps: any[] = [],
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall();

      if (response.error) {
        setError(response.error);
        onError?.(response.error);
      } else {
        setData(response.data || null);
        onSuccess?.(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, deps);

  return { data, loading, error, execute, refetch: execute };
}

// プロジェクト専用hook
export function useProjects() {
  return useApi(() => fetch('/api/projects').then((res) => res.json()));
}

export function useProject(id: string) {
  return useApi(() => fetch(`/api/projects/${id}`).then((res) => res.json()), [id]);
}
```

### フォーム状態管理hook

```typescript
// hooks/useFormState.ts
import { useState } from 'react';

interface UseFormStateOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useFormState<T>(
  submitFn: (data: T) => Promise<void>,
  options: UseFormStateOptions = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await submitFn(data);
      options.onSuccess?.(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '送信に失敗しました';
      setSubmitError(errorMessage);
      options.onError?.(errorMessage);
      throw error; // フォームのエラーハンドリングのために再スロー
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

## エラーハンドリング

### エラーバウンダリ

```typescript
// components/error-boundary.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        エラーが発生しました
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        申し訳ございません。予期しないエラーが発生しました。
        ページを再読み込みするか、しばらく時間をおいて再度お試しください。
      </p>
      <div className="space-x-4">
        <Button onClick={reset}>
          再試行
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          ページを再読み込み
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-100 rounded-md max-w-2xl w-full">
          <summary className="cursor-pointer font-medium">エラー詳細</summary>
          <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}
```

### エラー通知システム

```typescript
// hooks/useErrorHandler.ts
import { useToast } from '@/components/ui/use-toast';
import { useCallback } from 'react';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      console.error('Error occurred:', error, context);

      let message = '予期しないエラーが発生しました';

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      toast({
        title: 'エラー',
        description: context ? `${context}: ${message}` : message,
        variant: 'destructive',
      });
    },
    [toast]
  );

  const handleApiError = useCallback(
    (response: ApiResponse<any>, context?: string) => {
      if (response.error) {
        handleError(response.error, context);
      }
    },
    [handleError]
  );

  return { handleError, handleApiError };
}
```

## ページコンポーネント実装例

```typescript
// app/(dashboard)/projects/page.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useProjects } from '@/hooks/useApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { Project } from '@/types/project';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'name',
    header: 'プロジェクト名'
  },
  {
    accessorKey: 'client',
    header: 'クライアント',
    cell: ({ row }) => row.original.client?.name || '-'
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => <StatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'startDate',
    header: '開始日',
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString('ja-JP')
  },
  {
    accessorKey: 'budget',
    header: '予算',
    cell: ({ row }) => `¥${row.original.budget.toLocaleString()}`
  }
];

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: projects, loading, error, refetch } = useProjects();
  const { handleError } = useErrorHandler();

  if (error) {
    handleError(error, 'プロジェクト一覧の取得');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">プロジェクト管理</h1>
          <p className="text-muted-foreground">
            プロジェクトの作成・編集・管理を行います
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新規プロジェクト
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={projects || []}
          searchKey="name"
          searchPlaceholder="プロジェクト名で検索..."
        />
      )}

      <ProjectFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetch();
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
}
```

## アクセシビリティ

### ARIA属性とキーボードナビゲーション

```typescript
// components/ui/accessible-button.tsx
import { Button, ButtonProps } from '@/components/ui/button';
import { forwardRef } from 'react';

interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, loading, 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        aria-label={ariaLabel}
        aria-busy={loading}
        disabled={loading || props.disabled}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
```

### フォーカス管理

```typescript
// hooks/useFocusManagement.ts
import { useEffect, useRef } from 'react';

export function useFocusManagement(isOpen: boolean, closeOnEscape: boolean = true) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 現在のフォーカス要素を保存
      previousFocusRef.current = document.activeElement as HTMLElement;

      // コンテナ内の最初のフォーカス可能要素にフォーカス
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else {
      // 前のフォーカス要素に戻す
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // エスケープキーでダイアログを閉じる処理
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);

  return containerRef;
}
```
