'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Calendar,
  FileText,
  Calculator,
  ChevronDown,
  ChevronUp,
  CalendarX,
  Building2,
  Users,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// モック通知データ
const mockNotifications = [
  {
    id: 'n1',
    type: 'contract_renewal',
    title: '契約更新期限が近づいています',
    description: '山田太郎さんの契約が2024年3月31日に終了予定です',
    date: '2024-03-16',
    status: 'unread',
    priority: 'high',
    clientName: '〇〇商事株式会社',
    engineerName: '山田太郎',
    dueDate: '2024-03-31',
  },
  {
    id: 'n2',
    type: 'contract_expiry',
    title: '契約終了通知',
    description: '佐藤花子さんの契約が今月末で終了します',
    date: '2024-03-15',
    status: 'unread',
    priority: 'high',
    clientName: '△△システムズ株式会社',
    engineerName: '佐藤花子',
    dueDate: '2024-03-31',
  },
  {
    id: 'n3',
    type: 'overtime_excess',
    title: '残業時間超過アラート',
    description: '鈴木一郎さんの今月の残業時間が規定を超過しています',
    date: '2024-03-14',
    status: 'read',
    priority: 'medium',
    engineerName: '鈴木一郎',
    overtimeHours: 45,
    limitHours: 40,
  },
  {
    id: 'n4',
    type: 'billing_deviation',
    title: '精算幅逸脱アラート',
    description: '田中美咲さんの稼働時間が契約範囲を下回っています',
    date: '2024-03-13',
    status: 'unread',
    priority: 'medium',
    engineerName: '田中美咲',
    actualHours: 120,
    contractMinHours: 140,
  },
  {
    id: 'n5',
    type: 'contract_renewal',
    title: '契約更新確認が必要です',
    description: '伊藤健太さんの契約更新について確認が必要です',
    date: '2024-03-12',
    status: 'read',
    priority: 'medium',
    clientName: '◇◇フィナンシャル株式会社',
    engineerName: '伊藤健太',
    dueDate: '2024-04-30',
  },
  {
    id: 'n6',
    type: 'overtime_excess',
    title: '残業時間超過アラート',
    description: '高橋誠さんの今月の残業時間が規定を超過しています',
    date: '2024-03-11',
    status: 'read',
    priority: 'medium',
    engineerName: '高橋誠',
    overtimeHours: 38,
    limitHours: 35,
  },
  {
    id: 'n7',
    type: 'billing_deviation',
    title: '精算幅逸脱アラート',
    description: '中村太郎さんの稼働時間が契約範囲を上回っています',
    date: '2024-03-10',
    status: 'read',
    priority: 'medium',
    engineerName: '中村太郎',
    actualHours: 185,
    contractMaxHours: 180,
  },
];

export default function SalesNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isContractOpen, setIsContractOpen] = useState(true);
  const [isWorkingHoursOpen, setIsWorkingHoursOpen] = useState(true);

  // 契約関連の通知をグループ化
  const contractNotifications = notifications.filter(
    (n) => n.type === 'contract_renewal' || n.type === 'contract_expiry'
  );

  // 稼働時間関連の通知をグループ化
  const workingHoursNotifications = notifications.filter(
    (n) => n.type === 'overtime_excess' || n.type === 'billing_deviation'
  );

  // その他の通知
  const otherNotifications = notifications.filter(
    (n) =>
      !['contract_renewal', 'contract_expiry', 'overtime_excess', 'billing_deviation'].includes(
        n.type
      )
  );

  // 契約更新期限までの日数を計算
  const getDaysUntilRenewal = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderNotificationGroup = (
    notifications: typeof mockNotifications,
    title: string,
    icon: React.ReactNode
  ) => {
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
                notification.status === 'unread'
                  ? notification.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-900/10'
                    : 'bg-yellow-50 dark:bg-yellow-900/10'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  ${notification.status === 'unread' ? 'text-primary' : 'text-muted-foreground'}
                `}
                >
                  {notification.type === 'contract_renewal' ||
                  notification.type === 'contract_expiry' ? (
                    <FileText className="h-5 w-5" />
                  ) : notification.type === 'overtime_excess' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : notification.type === 'billing_deviation' ? (
                    <Calculator className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p
                    className={`font-medium ${
                      notification.status === 'unread' ? 'text-primary' : ''
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>

                  {/* 追加情報の表示 */}
                  {notification.type === 'contract_renewal' ||
                  notification.type === 'contract_expiry' ? (
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>クライアント: {notification.clientName}</span>
                      <span>エンジニア: {notification.engineerName}</span>
                    </div>
                  ) : notification.type === 'overtime_excess' ? (
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="text-muted-foreground">残業時間:</span>
                      <span className="font-medium text-red-600">
                        {notification.overtimeHours}h
                      </span>
                      <span className="text-muted-foreground">
                        / 上限 {notification.limitHours}h
                      </span>
                    </div>
                  ) : notification.type === 'billing_deviation' ? (
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="text-muted-foreground">稼働時間:</span>
                      <span
                        className={`font-medium ${
                          (notification.actualHours || 0) < (notification.contractMinHours || 0)
                            ? 'text-red-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {notification.actualHours}h
                      </span>
                      <span className="text-muted-foreground">
                        / 契約範囲 {notification.contractMinHours || notification.contractMaxHours}h
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{notification.date}</span>
              </div>
            </div>
            {index < notifications.length - 1 && <Separator className="my-2" />}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-none">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">通知</h1>
          <p className="text-muted-foreground">
            未読の通知が{notifications.filter((n) => n.status === 'unread').length}件あります
          </p>
        </div>
      </motion.div>

      {/* 契約関連通知 */}
      {contractNotifications.length > 0 && (
        <Collapsible open={isContractOpen} onOpenChange={setIsContractOpen}>
          <Card className="border-red-200 dark:border-red-800">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-500" />
                    <div>
                      <CardTitle className="text-lg">契約関連</CardTitle>
                      <CardDescription>契約更新・終了に関する重要な通知</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {contractNotifications.filter((n) => n.status === 'unread').length}件
                    </Badge>
                    {isContractOpen ? (
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
                {/* 契約管理の注意事項 */}
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarX className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800 dark:text-red-200">
                        契約管理について
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      契約更新・終了の手続きは期限の1ヶ月前までに完了してください。
                      クライアントとの調整が必要な場合は早めにご対応ください。
                    </p>
                  </div>

                  <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Link href="/sales/contracts">契約管理画面で確認する</Link>
                  </Button>
                </div>

                {renderNotificationGroup(
                  contractNotifications,
                  '契約関連',
                  <FileText className="h-5 w-5 text-red-500" />
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* 稼働時間関連通知 */}
      {workingHoursNotifications.length > 0 && (
        <Collapsible open={isWorkingHoursOpen} onOpenChange={setIsWorkingHoursOpen}>
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-yellow-500" />
                    <div>
                      <CardTitle className="text-lg">稼働時間アラート</CardTitle>
                      <CardDescription>残業超過・精算幅逸脱に関するアラート</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                    >
                      {workingHoursNotifications.filter((n) => n.status === 'unread').length}件
                    </Badge>
                    {isWorkingHoursOpen ? (
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
                {/* 稼働時間管理の注意事項 */}
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">
                      稼働時間管理について
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    エンジニアの健康管理と契約遵守のため、稼働時間の適切な管理をお願いします。
                    問題がある場合は速やかにエンジニアと相談してください。
                  </p>
                </div>

                {renderNotificationGroup(
                  workingHoursNotifications,
                  '稼働時間アラート',
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
                <CardDescription>一般的な通知・お知らせ</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderNotificationGroup(
              otherNotifications,
              'その他の通知',
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
