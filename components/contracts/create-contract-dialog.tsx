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

const contractSchema = z.object({
  clientName: z.string().min(1, 'クライアント名を入力してください'),
  contractType: z.string().min(1, '契約形態を選択してください'),
  startDate: z.string().min(1, '開始日を入力してください'),
  endDate: z.string().min(1, '終了日を入力してください'),
  workStyle: z.string().min(1, '勤務形態を選択してください'),
  workLocation: z.string().optional(),
  workingHoursStart: z.string().min(1, '開始時間を選択してください'),
  workingHoursEnd: z.string().min(1, '終了時間を選択してください'),
  isFlextime: z.boolean().default(false),
  workingDaysUnit: z.enum(['週', '月']),
  workingDaysCount: z.string().min(1, '日数を選択してください'),
  rate: z.coerce.number().positive('単価を入力してください'),
  workload: z.coerce.number().positive('契約工数を入力してください'),
  minHours: z.coerce.number().positive('最小稼働時間を入力してください'),
  maxHours: z.coerce.number().positive('最大稼働時間を入力してください'),
  overtimeRule: z.string().min(1, '超過／控除ルールを入力してください'),
  paymentTerms: z.string().min(1, '支払条件を選択してください'),
});

type ContractFormValues = z.infer<typeof contractSchema>;

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 時間の選択肢を生成
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

// 支払条件の選択肢
const paymentTermsOptions = [
  { value: '月末締め翌月末払い', label: '月末締め翌月末払い' },
  { value: '月末締め翌月15日払い', label: '月末締め翌月15日払い' },
  { value: '15日締め月末払い', label: '15日締め月末払い' },
  { value: '15日締め翌月15日払い', label: '15日締め翌月15日払い' },
  { value: '月末締め翌々月末払い', label: '月末締め翌々月末払い' },
];

// 稼働日数の選択肢
const workingDaysOptions = Array.from({ length: 7 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1}日`,
}));

export function CreateContractDialog({ open, onOpenChange }: CreateContractDialogProps) {
  const timeOptions = generateTimeOptions();

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      clientName: '',
      contractType: '準委任',
      startDate: '',
      endDate: '',
      workStyle: 'remote',
      workLocation: '',
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
      isFlextime: false,
      workingDaysUnit: '週',
      workingDaysCount: '5',
      rate: 0,
      workload: 160,
      minHours: 140,
      maxHours: 180,
      overtimeRule: '1時間単位で精算（基準単価の1.25倍）',
      paymentTerms: '月末締め翌月末払い',
    },
  });

  const onSubmit = (data: ContractFormValues) => {
    console.log(data);
    // 実際には保存処理を行う
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規契約書作成</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="font-medium">基本情報</h3>

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>クライアント名</FormLabel>
                    <FormControl>
                      <Input placeholder="〇〇株式会社" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>開始日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>終了日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* 契約条件 */}
            <div className="space-y-4">
              <h3 className="font-medium">契約条件</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contractType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>契約形態</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="契約形態を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="準委任">準委任</SelectItem>
                          <SelectItem value="請負">請負</SelectItem>
                          <SelectItem value="派遣">派遣</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>支払条件</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="支払条件を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTermsOptions.map((option) => (
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
                  name="workStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>勤務形態</FormLabel>
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

                <FormField
                  control={form.control}
                  name="workLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>作業場所</FormLabel>
                      <FormControl>
                        <Input placeholder="東京都渋谷区〇〇" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 稼働時間帯 */}
              <div className="space-y-2">
                <FormLabel>稼働時間帯</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workingHoursStart"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="開始時間" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
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
                    name="workingHoursEnd"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="終了時間" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
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
                  name="isFlextime"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">フレックスタイム制</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* 稼働日数 */}
              <div className="space-y-2">
                <FormLabel>稼働日数</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workingDaysUnit"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="単位" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="週">週</SelectItem>
                            <SelectItem value="月">月</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workingDaysCount"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="日数" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workingDaysOptions.map((option) => (
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
              </div>
            </div>

            <Separator />

            {/* 単価・費用 */}
            <div className="space-y-4">
              <h3 className="font-medium">単価・費用</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>単価（円／月）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="800000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workload"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>契約工数（h/月）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="160" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>最小稼働時間</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="140" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>最大稼働時間</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="180" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="overtimeRule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>超過／控除ルール</FormLabel>
                    <FormControl>
                      <Input placeholder="1時間単位で精算" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              <Button type="submit">作成する</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
