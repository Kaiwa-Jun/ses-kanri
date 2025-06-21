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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Target, DollarSign, Calendar, TrendingUp, Users } from 'lucide-react';

const targetSchema = z.object({
  period: z.string().min(1, '期間を選択してください'),
  targetAmount: z.coerce.number().positive('目標金額を入力してください'),
  targetDate: z.string().min(1, '目標期限を入力してください'),
  averageProjectValue: z.coerce.number().positive('平均案件単価を入力してください'),
  expectedSuccessRate: z.coerce.number().min(1).max(100, '成約率は1-100%で入力してください'),
  teamTarget: z.string().min(1, 'チーム目標を選択してください'),
});

type TargetFormValues = z.infer<typeof targetSchema>;

interface SalesTargetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPeriod: string;
  currentData: any;
  onSave: (data: TargetFormValues) => void;
}

export function SalesTargetModal({
  open,
  onOpenChange,
  currentPeriod,
  currentData,
  onSave,
}: SalesTargetModalProps) {
  const form = useForm<TargetFormValues>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      period: currentPeriod,
      targetAmount: currentData?.target ? currentData.target / 10000 : 0,
      targetDate: '',
      averageProjectValue: currentData?.projectAnalysis?.averageValue
        ? currentData.projectAnalysis.averageValue / 10000
        : 0,
      expectedSuccessRate: currentData?.projectAnalysis?.successRate || 65,
      teamTarget: 'both',
    },
  });

  const watchedValues = form.watch();

  // 必要契約数を計算
  const calculateRequiredDeals = () => {
    const targetAmount = watchedValues.targetAmount * 10000;
    const avgValue = watchedValues.averageProjectValue * 10000;
    const successRate = watchedValues.expectedSuccessRate / 100;

    if (avgValue > 0 && successRate > 0) {
      return Math.ceil(targetAmount / (avgValue * successRate));
    }
    return 0;
  };

  const handleSubmit = (data: TargetFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  const getPeriodOptions = () => {
    return [
      { value: '月次', label: '月次目標' },
      { value: '四半期', label: '四半期目標' },
      { value: '年次', label: '年次目標' },
    ];
  };

  const getDatePlaceholder = () => {
    switch (watchedValues.period) {
      case '月次':
        return '2025-06';
      case '四半期':
        return '2024-Q2';
      case '年次':
        return '2024';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            売上目標設定
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* 基本設定 */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                基本設定
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>目標期間</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="期間を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getPeriodOptions().map((option) => (
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
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>目標期限</FormLabel>
                      <FormControl>
                        <Input placeholder={getDatePlaceholder()} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>目標金額（万円）</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 案件分析設定 */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                案件分析設定
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="averageProjectValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>平均案件単価（万円）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="850" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedSuccessRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>期待成約率（%）</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" placeholder="65" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* チーム設定 */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                チーム設定
              </h3>

              <FormField
                control={form.control}
                name="teamTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>目標適用チーム</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="チームを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="both">全チーム</SelectItem>
                        <SelectItem value="team1">第一営業部</SelectItem>
                        <SelectItem value="team2">第二営業部</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 計算結果プレビュー */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                目標達成に必要な指標
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">必要契約数</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {calculateRequiredDeals()}件
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">月平均必要契約数</span>
                    <Badge variant="outline">
                      {watchedValues.period === '月次'
                        ? calculateRequiredDeals()
                        : watchedValues.period === '四半期'
                          ? Math.ceil(calculateRequiredDeals() / 3)
                          : Math.ceil(calculateRequiredDeals() / 12)}
                      件/月
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">目標金額</span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 dark:bg-green-900/30"
                    >
                      {watchedValues.targetAmount}万円
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">期間</span>
                    <Badge variant="outline">{watchedValues.period}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>アドバイス:</strong>
                  {calculateRequiredDeals() > 10
                    ? '目標達成には多くの契約が必要です。平均案件単価の向上や成約率の改善を検討してください。'
                    : '現実的な目標設定です。計画的な営業活動で達成可能と思われます。'}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              <Button type="submit">目標を設定</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
