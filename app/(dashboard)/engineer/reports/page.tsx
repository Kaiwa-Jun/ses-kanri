"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Calendar as CalendarIcon, Clock, FileText, CheckCircle, XCircle, AlertCircle, 
  ChevronLeft, ChevronRight, Plus, Edit2, Save, PlayCircle, StopCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isWeekend, isSunday, isSaturday } from "date-fns";
import { ja } from "date-fns/locale";
import { mockWorkReports } from "@/lib/data";
import { BulkTimeEntry } from "@/components/reports/bulk-time-entry";

const formSchema = z.object({
  date: z.date(),
  workingHours: z.coerce
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(24, "24以下の数値を入力してください"),
  overtimeHours: z.coerce
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(24, "24以下の数値を入力してください"),
  description: z.string().min(5, "5文字以上入力してください"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EngineerReportsPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // 初期値を本日に設定
  const [isEditing, setIsEditing] = useState(false);
  const [reportMode, setReportMode] = useState<"daily" | "monthly" | "bulk">("daily");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  
  // 現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // モックデータから稼働報告を取得
  const reportsByDate = mockWorkReports.reduce((acc, report) => {
    acc[report.date] = report;
    return acc;
  }, {} as Record<string, typeof mockWorkReports[0]>);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      workingHours: 8,
      overtimeHours: 0,
      description: "昨日入力された業務内容が初期表示されます",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    console.log(data);
    // 実際はAPI呼び出しで保存
    setIsEditing(false);
  };
  
  // 選択した日付の稼働報告
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedReport = reportsByDate[selectedDateStr];
  
  // 月の日付を取得
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // 日付をクリックしたときの処理
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsEditing(false);
    
    // 稼働報告がある場合は、フォームに値をセット
    const dateStr = format(date, "yyyy-MM-dd");
    if (reportsByDate[dateStr]) {
      const report = reportsByDate[dateStr];
      form.reset({
        date,
        workingHours: report.workingHours,
        overtimeHours: report.overtimeHours,
        description: report.description,
      });
    } else {
      // ない場合はデフォルト値
      form.reset({
        date,
        workingHours: 8,
        overtimeHours: 0,
        description: "昨日入力された業務内容が初期表示されます",
      });
    }
  };
  
  // ステータスに応じた色を取得
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-500 bg-green-100 dark:bg-green-900/30";
      case "submitted": return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
      case "rejected": return "text-red-500 bg-red-100 dark:bg-red-900/30";
      case "draft": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";
      default: return "";
    }
  };
  
  // ステータスに応じたテキストを取得
  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "承認済み";
      case "submitted": return "提出済み";
      case "rejected": return "差し戻し";
      case "draft": return "下書き";
      default: return status;
    }
  };
  
  // ステータスに応じたアイコンを取得
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "submitted": return <Clock className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "draft": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };
  
  // 土日の背景色を取得する関数
  const getWeekendBackground = (date: Date) => {
    if (isSunday(date)) return "bg-red-50/50 dark:bg-red-950/20";
    if (isSaturday(date)) return "bg-blue-50/50 dark:bg-blue-950/20";
    return "";
  };

  // 土日のボーダー色を取得する関数
  const getWeekendBorder = (date: Date) => {
    if (isSunday(date)) return "border-red-100 dark:border-red-900/30";
    if (isSaturday(date)) return "border-blue-100 dark:border-blue-900/30";
    return "";
  };

  // 土日のバッジ色を取得する関数
  const getWeekendBadgeColor = (date: Date) => {
    if (isSunday(date)) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (isSaturday(date)) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    return "";
  };

  // 合計稼働時間を計算
  const calculateTotalHours = () => {
    const entries = form.getValues();
    return entries.workingHours + entries.overtimeHours;
  };

  // 目標稼働時間を計算（平日 * 8時間）
  const calculateTargetHours = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const workdays = daysInMonth.filter(date => !isWeekend(date)).length;
    return workdays * 8;
  };

  const totalHours = calculateTotalHours();
  const targetHours = calculateTargetHours();
  const progressPercentage = (totalHours / targetHours) * 100;

  return (
    <div className="container py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">稼働報告（工数入力）</h1>
          <p className="text-muted-foreground">
            日々の稼働時間と作業内容を記録
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={reportMode === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportMode("daily")}
          >
            日次
          </Button>
          <Button 
            variant={reportMode === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportMode("monthly")}
          >
            月次
          </Button>
          <Button 
            variant={reportMode === "bulk" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportMode("bulk")}
          >
            一括入力
          </Button>
        </div>
      </motion.div>
      
      {reportMode === "bulk" ? (
        <BulkTimeEntry />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>カレンダー</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const prevMonth = new Date(currentDate);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        setCurrentDate(prevMonth);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-28 text-center">
                      {format(currentDate, "yyyy年M月", { locale: ja })}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const nextMonth = new Date(currentDate);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        setCurrentDate(nextMonth);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                    <div key={day} className="text-xs font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-start-${i}`} className="p-2" />
                  ))}
                  
                  {daysInMonth.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const hasReport = reportsByDate[dateStr];
                    const isSelected = selectedDate && 
                                      day.getDate() === selectedDate.getDate() && 
                                      day.getMonth() === selectedDate.getMonth();
                    
                    return (
                      <button
                        key={day.toString()}
                        className={`
                          relative p-2 rounded-md hover:bg-accent transition-colors text-center
                          ${isToday(day) ? "border border-primary" : ""}
                          ${!isSameMonth(day, currentDate) ? "text-muted-foreground" : ""}
                          ${isSelected ? "bg-accent" : ""}
                          ${getWeekendBackground(day)}
                        `}
                        onClick={() => handleDateClick(day)}
                      >
                        <span className="text-sm">{format(day, "d")}</span>
                        {hasReport && (
                          <div 
                            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                              hasReport.status === "approved" ? "bg-green-500" :
                              hasReport.status === "submitted" ? "bg-blue-500" :
                              hasReport.status === "rejected" ? "bg-red-500" : "bg-yellow-500"
                            }`} 
                          />
                        )}
                      </button>
                    );
                  })}
                  
                  {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
                    <div key={`empty-end-${i}`} className="p-2" />
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs">承認済み</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs">提出済み</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-xs">下書き</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs">差し戻し</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {reportMode === "daily" ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {selectedDate ? format(selectedDate, "yyyy年M月d日 (E)", { locale: ja }) : "日付を選択してください"}
                    </CardTitle>
                    {selectedReport && !isEditing && (
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(selectedReport.status)}`}
                      >
                        {getStatusIcon(selectedReport.status)}
                        {getStatusText(selectedReport.status)}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    稼働時間と業務内容を記録
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* 打刻エリア */}
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-4xl font-bold font-mono">
                          {format(currentTime, "HH:mm:ss")}
                        </div>
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setClockInTime(new Date())}
                            disabled={!!clockInTime}
                          >
                            <PlayCircle className="h-4 w-4 text-green-500" />
                            出勤
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setClockOutTime(new Date())}
                            disabled={!clockInTime || !!clockOutTime}
                          >
                            <StopCircle className="h-4 w-4 text-red-500" />
                            退勤
                          </Button>
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground">
                          <div>
                            出勤時刻: {clockInTime ? format(clockInTime, "HH:mm:ss") : "--:--:--"}
                          </div>
                          <div>
                            退勤時刻: {clockOutTime ? format(clockOutTime, "HH:mm:ss") : "--:--:--"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedDate ? (
                    isEditing || !selectedReport ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="workingHours"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>稼働時間</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.5" placeholder="8.0" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="overtimeHours"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>残業時間</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.5" placeholder="0.0" {...field} />
                                  </FormControl>
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
                                <FormLabel>業務内容</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="実施した作業内容を入力してください" 
                                    rows={5}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end gap-2">
                            {isEditing && (
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                              >
                                キャンセル
                              </Button>
                            )}
                            <Button type="submit">
                              保存
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium mb-1">稼働時間</h3>
                            <p className="text-2xl font-bold">{selectedReport.workingHours}時間</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1">残業時間</h3>
                            <p className="text-2xl font-bold">{selectedReport.overtimeHours}時間</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">業務内容</h3>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="whitespace-pre-line">{selectedReport.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline"
                            className="gap-2"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit2 className="h-4 w-4" />
                            編集
                          </Button>
                          
                          {selectedReport.status === "draft" && (
                            <Button className="gap-2">
                              <Save className="h-4 w-4" />
                              提出
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground">左のカレンダーから日付を選択してください</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>月次レポート</CardTitle>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      承認待ち
                    </Badge>
                  </div>
                  <CardDescription>
                    {format(currentDate, "yyyy年M月", { locale: ja })}の稼働サマリー
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">稼働日数</p>
                      <p className="text-2xl font-bold">18日</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">総稼働時間</p>
                      <p className="text-2xl font-bold">144時間</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">残業時間</p>
                      <p className="text-2xl font-bold">8時間</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">達成率</p>
                      <p className="text-2xl font-bold">95%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">月次コメント</h3>
                    <Textarea 
                      placeholder="月全体の業務サマリーや特記事項を入力してください" 
                      rows={4}
                      className="mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      ※月次レポートを提出する前に、すべての日次報告が完了していることを確認してください
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">日次報告状況</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>承認済み</span>
                        <span className="font-medium">16日</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>提出済み（承認待ち）</span>
                        <span className="font-medium">2日</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>下書き</span>
                        <span className="font-medium">0日</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>差し戻し</span>
                        <span className="font-medium">0日</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">プレビュー</Button>
                    <Button>月次レポート提出</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}