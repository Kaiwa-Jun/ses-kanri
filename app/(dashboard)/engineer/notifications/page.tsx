"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Clock, AlertTriangle, CheckCircle2, Bell, Calendar, FileText, Calculator,
  ChevronDown, ChevronUp, CalendarX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// モック通知データ
const mockNotifications = [
  {
    id: "n1",
    type: "workReport",
    title: "日報未提出",
    description: "2024年3月15日の日報が未提出です",
    date: "2024-03-16",
    status: "unread",
    priority: "high",
  },
  {
    id: "n2",
    type: "timesheet",
    title: "工数報告未提出",
    description: "2024年3月の工数報告が未提出です",
    date: "2024-03-15",
    status: "unread",
    priority: "high",
  },
  {
    id: "n3",
    type: "workReport",
    title: "日報未提出",
    description: "2024年3月13日の日報が未提出です",
    date: "2024-03-14",
    status: "read",
    priority: "high",
  },
  {
    id: "n4",
    type: "workReport",
    title: "日報未提出",
    description: "2024年3月12日の日報が未提出です",
    date: "2024-03-13",
    status: "unread",
    priority: "high",
  },
  {
    id: "n5",
    type: "overtime",
    title: "工数超過アラート",
    description: "今月の工数が契約上限を超過しています",
    date: "2024-03-14",
    status: "read",
    priority: "medium",
  },
  {
    id: "n6",
    type: "overtime",
    title: "工数不足アラート",
    description: "今月の工数が契約下限を下回っています",
    date: "2024-03-12",
    status: "read",
    priority: "medium",
  },
  {
    id: "n7",
    type: "overtime",
    title: "工数超過アラート",
    description: "先月の工数が契約上限を超過しました",
    date: "2024-03-01",
    status: "read",
    priority: "medium",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isUnsubmittedOpen, setIsUnsubmittedOpen] = useState(true);
  const [isOvertimeOpen, setIsOvertimeOpen] = useState(true);
  
  // 未提出系の通知をグループ化
  const unsubmittedNotifications = notifications.filter(n => 
    n.type === "workReport" || n.type === "timesheet"
  );
  
  // 工数アラート系の通知をグループ化
  const overtimeNotifications = notifications.filter(n => 
    n.type === "overtime"
  );
  
  // その他の通知
  const otherNotifications = notifications.filter(n => 
    !["workReport", "timesheet", "overtime"].includes(n.type)
  );
  
  // 締切日を計算する関数
  const getDeadlineDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    // 当月末日を取得
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 締切までの残り日数を計算
  const getDaysUntilDeadline = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const diffTime = lastDay.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const deadlineDate = getDeadlineDate();
  const daysUntilDeadline = getDaysUntilDeadline();
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "workReport":
        return <FileText className="h-5 w-5" />;
      case "timesheet":
        return <Calendar className="h-5 w-5" />;
      case "overtime":
        return <Calculator className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const getNotificationColor = (priority: string, status: string) => {
    if (status === "unread") {
      switch (priority) {
        case "high":
          return "bg-red-50 dark:bg-red-900/10";
        case "medium":
          return "bg-yellow-50 dark:bg-yellow-900/10";
        default:
          return "bg-blue-50 dark:bg-blue-900/10";
      }
    }
    return "";
  };

  const renderNotificationGroup = (notifications: typeof mockNotifications, title: string, icon: React.ReactNode) => {
    if (notifications.length === 0) return null;

    return (
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div 
              className={`flex items-start justify-between gap-2 p-3 hover:bg-muted rounded-lg transition-colors ${
                getNotificationColor(notification.priority, notification.status)
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  ${notification.status === "unread" ? "text-primary" : "text-muted-foreground"}
                `}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div>
                  <p className={`font-medium ${
                    notification.status === "unread" ? "text-primary" : ""
                  }`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {notification.date}
                </span>
              </div>
            </div>
            {index < notifications.length - 1 && <Separator className="my-2" />}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">通知</h1>
          <p className="text-muted-foreground">
            未読の通知が{notifications.filter(n => n.status === "unread").length}件あります
          </p>
        </div>
      </motion.div>
      
      {/* 未提出系通知 */}
      {unsubmittedNotifications.length > 0 && (
        <Collapsible open={isUnsubmittedOpen} onOpenChange={setIsUnsubmittedOpen}>
          <Card className="border-red-200 dark:border-red-800">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <CardTitle className="text-lg">未提出の報告</CardTitle>
                      <CardDescription>
                        日報・工数報告の未提出があります
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {unsubmittedNotifications.filter(n => n.status === "unread").length}件
                    </Badge>
                    {isUnsubmittedOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {/* 締切情報 */}
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarX className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800 dark:text-red-200">提出締切</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        daysUntilDeadline <= 3 
                          ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400" 
                          : "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}
                    >
                      残り{daysUntilDeadline}日
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-red-700 dark:text-red-300 font-medium">{deadlineDate}まで</span>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      すべての日報・工数報告は毎月末までに提出してください
                    </p>
                  </div>

                  <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Link href="/engineer/reports?tab=bulk">
                      まとめて提出する
                    </Link>
                  </Button>
                </div>

                {renderNotificationGroup(
                  unsubmittedNotifications,
                  "未提出の報告",
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* 工数アラート系通知 */}
      {overtimeNotifications.length > 0 && (
        <Collapsible open={isOvertimeOpen} onOpenChange={setIsOvertimeOpen}>
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-yellow-500" />
                    <div>
                      <CardTitle className="text-lg">工数アラート</CardTitle>
                      <CardDescription>
                        工数の超過・不足に関するアラート
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30">
                      {overtimeNotifications.filter(n => n.status === "unread").length}件
                    </Badge>
                    {isOvertimeOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {/* 工数管理の注意事項 */}
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">工数管理について</span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    契約工数の範囲内での稼働を心がけてください。超過・不足がある場合は営業担当者にご相談ください。
                  </p>
                </div>

                {renderNotificationGroup(
                  overtimeNotifications,
                  "工数アラート",
                  <Calculator className="h-5 w-5 text-yellow-500" />
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* その他の通知 */}
      {otherNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <CardTitle className="text-lg">その他の通知</CardTitle>
                <CardDescription>
                  一般的な通知・お知らせ
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderNotificationGroup(
              otherNotifications,
              "その他の通知",
              <Bell className="h-5 w-5 text-blue-500" />
            )}
          </CardContent>
        </Card>
      )}

      {/* 通知がない場合 */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium mb-2">すべての通知を確認済みです</p>
            <p className="text-muted-foreground">新しい通知はありません</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}