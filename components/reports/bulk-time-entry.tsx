"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isWeekend, isSunday, isSaturday, startOfWeek, endOfWeek, addDays, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import { Copy, ClipboardCopy, Save, CheckCircle, Calendar, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const timeEntrySchema = z.object({
  entries: z.array(z.object({
    date: z.string(),
    workingHours: z.coerce.number().min(0).max(24),
    overtimeHours: z.coerce.number().min(0).max(24),
    description: z.string(),
    isApproved: z.boolean().optional(),
  })),
});

type TimeEntryFormValues = z.infer<typeof timeEntrySchema>;

export function BulkTimeEntry() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [copiedValues, setCopiedValues] = useState<{
    workingHours: string;
    overtimeHours: string;
    description: string;
  } | null>(null);

  // 一括入力用の状態
  const [bulkSettings, setBulkSettings] = useState({
    dateRange: "this-week", // this-week, this-month
    workingHours: "8",
    overtimeHours: "0",
    description: "",
  });

  // 先月のデータ（モック）
  const getPreviousMonthData = () => {
    return {
      workingHours: "8",
      overtimeHours: "1",
      description: "システム開発・機能実装・テスト実施",
    };
  };

  // フォームの初期値を生成する関数
  const generateDefaultValues = (date: Date): TimeEntryFormValues => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return {
      entries: daysInMonth.map((date, index) => ({
        date: format(date, "yyyy-MM-dd"),
        workingHours: isWeekend(date) ? 0 : 8,
        overtimeHours: 0,
        description: "",
        // モックデータとして、最初の5日間を承認済みとする
        isApproved: index < 5,
      })),
    };
  };

  const form = useForm<TimeEntryFormValues>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: generateDefaultValues(selectedMonth),
  });

  const handleMonthChange = (value: string) => {
    const [year, month] = value.split("-").map(Number);
    const newDate = new Date(year, month - 1);
    setSelectedMonth(newDate);
    form.reset(generateDefaultValues(newDate));
  };

  const handleCopy = (index: number) => {
    const entry = form.getValues().entries[index];
    setCopiedValues({
      workingHours: entry.workingHours.toString(),
      overtimeHours: entry.overtimeHours.toString(),
      description: entry.description,
    });
  };

  const handlePaste = (index: number) => {
    if (!copiedValues) return;

    const entries = form.getValues().entries;
    entries[index] = {
      ...entries[index],
      workingHours: Number(copiedValues.workingHours),
      overtimeHours: Number(copiedValues.overtimeHours),
      description: copiedValues.description,
    };
    form.reset({ entries });
  };

  // 一括入力の実行
  const handleBulkInput = () => {
    const entries = form.getValues().entries;
    const targetDates = getTargetDates();
    
    const updatedEntries = entries.map(entry => {
      const entryDate = new Date(entry.date);
      const shouldUpdate = targetDates.some(targetDate => 
        format(targetDate, "yyyy-MM-dd") === entry.date
      ) && !entry.isApproved; // 承認済みは除外

      if (shouldUpdate) {
        return {
          ...entry,
          workingHours: Number(bulkSettings.workingHours),
          overtimeHours: Number(bulkSettings.overtimeHours),
          description: bulkSettings.description,
        };
      }
      return entry;
    });

    form.reset({ entries: updatedEntries });
  };

  // 先月データで一括入力
  const handlePreviousMonthInput = () => {
    const previousData = getPreviousMonthData();
    const entries = form.getValues().entries;
    const targetDates = getTargetDates();
    
    const updatedEntries = entries.map(entry => {
      const entryDate = new Date(entry.date);
      const shouldUpdate = targetDates.some(targetDate => 
        format(targetDate, "yyyy-MM-dd") === entry.date
      ) && !entry.isApproved; // 承認済みは除外

      if (shouldUpdate) {
        return {
          ...entry,
          workingHours: Number(previousData.workingHours),
          overtimeHours: Number(previousData.overtimeHours),
          description: previousData.description,
        };
      }
      return entry;
    });

    form.reset({ entries: updatedEntries });
  };

  // 対象日付を取得する関数
  const getTargetDates = (): Date[] => {
    const today = new Date();
    
    switch (bulkSettings.dateRange) {
      case "this-week":
        return eachDayOfInterval({
          start: startOfWeek(today, { locale: ja }),
          end: endOfWeek(today, { locale: ja }),
        });
      case "this-month":
        return eachDayOfInterval({
          start: startOfMonth(selectedMonth),
          end: endOfMonth(selectedMonth),
        });
      default:
        return [];
    }
  };

  const onSubmit = (data: TimeEntryFormValues) => {
    console.log(data);
  };

  // 土日の背景色を取得する関数
  const getRowBackground = (date: Date, isApproved: boolean) => {
    if (isApproved) return "bg-green-50/50 dark:bg-green-950/20";
    if (isSunday(date)) return "bg-red-50/50 dark:bg-red-950/20";
    if (isSaturday(date)) return "bg-blue-50/50 dark:bg-blue-950/20";
    return "";
  };

  const previousMonthName = format(subMonths(selectedMonth, 1), "M月", { locale: ja });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Select
            value={format(selectedMonth, "yyyy-MM")}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - 6 + i);
                return (
                  <SelectItem 
                    key={format(date, "yyyy-MM")} 
                    value={format(date, "yyyy-MM")}
                  >
                    {format(date, "yyyy年M月", { locale: ja })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button onClick={form.handleSubmit(onSubmit)} className="gap-2">
            <Save className="h-4 w-4" />
            保存
          </Button>
        </div>

        {/* 一括入力設定 */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">一括入力設定</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousMonthInput}
                  className="gap-2 text-xs"
                >
                  <History className="h-4 w-4" />
                  {previousMonthName}と同じ内容で入力
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium mb-2 block">対象期間</label>
                  <Select
                    value={bulkSettings.dateRange}
                    onValueChange={(value) => setBulkSettings({ ...bulkSettings, dateRange: value })}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-week">今週</SelectItem>
                      <SelectItem value="this-month">今月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">稼働時間</label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={bulkSettings.workingHours}
                    onChange={(e) => setBulkSettings({ ...bulkSettings, workingHours: e.target.value })}
                    className="w-[80px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">残業時間</label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={bulkSettings.overtimeHours}
                    onChange={(e) => setBulkSettings({ ...bulkSettings, overtimeHours: e.target.value })}
                    className="w-[80px]"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">業務内容</label>
                  <Input
                    value={bulkSettings.description}
                    onChange={(e) => setBulkSettings({ ...bulkSettings, description: e.target.value })}
                    placeholder="業務内容を入力"
                  />
                </div>

                <div>
                  <Button 
                    onClick={handleBulkInput}
                    className="gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    一括入力
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {bulkSettings.dateRange === "this-week" && "今週の平日に一括入力されます"}
                {bulkSettings.dateRange === "this-month" && "今月の平日に一括入力されます"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="h-10">
                  <TableHead className="w-[180px] py-2">日付</TableHead>
                  <TableHead className="w-[100px] py-2">稼働時間</TableHead>
                  <TableHead className="w-[100px] py-2">残業時間</TableHead>
                  <TableHead className="flex-1 py-2">業務内容</TableHead>
                  <TableHead className="w-[100px] py-2">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.getValues().entries.map((entry, index) => {
                  const date = new Date(entry.date);
                  const isWeekendDay = isWeekend(date);
                  const isApproved = entry.isApproved;

                  return (
                    <TableRow 
                      key={entry.date}
                      className={`h-12 ${getRowBackground(date, isApproved || false)}`}
                    >
                      <TableCell className="py-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${isWeekendDay ? "text-muted-foreground" : ""}`}>
                            {format(date, "M/d(E)", { locale: ja })}
                          </span>
                          {isApproved && (
                            <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 text-xs px-2 py-0 ml-2">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              承認済
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <FormField
                          control={form.control}
                          name={`entries.${index}.workingHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.5" 
                                  {...field}
                                  disabled={isApproved}
                                  className={`w-20 h-8 text-sm ${isWeekendDay || isApproved ? "bg-muted" : ""}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell className="py-2">
                        <FormField
                          control={form.control}
                          name={`entries.${index}.overtimeHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.5" 
                                  {...field}
                                  disabled={isApproved}
                                  className={`w-20 h-8 text-sm ${isWeekendDay || isApproved ? "bg-muted" : ""}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell className="py-2">
                        <FormField
                          control={form.control}
                          name={`entries.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field}
                                  disabled={isApproved}
                                  className={`h-8 text-sm ${isWeekendDay || isApproved ? "bg-muted" : ""}`}
                                  placeholder="業務内容を入力"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(index)}
                            className="px-2 h-7 text-xs"
                            disabled={isApproved}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handlePaste(index)}
                            disabled={!copiedValues || isApproved}
                            className="px-2 h-7 text-xs"
                          >
                            <ClipboardCopy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </form>
      </Form>
    </div>
  );
}
