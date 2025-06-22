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
  MoreHorizontal,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// モック通知データ（大幅に増量）
const mockNotifications = [
  {
    id: 'n1',
    notification_type: 'contract_renewal',
    title: '〇〇商事株式会社 業務委託契約',
    description: '大手ECサイトリニューアル案件',
    priority: 'high',
    status: 'unread',
    due_date: '2025-06-30',
    engineer_name: '山田太郎',
    contract_id: 'c1',
    project_name: '大手ECサイトリニューアル案件',
  },
  {
    id: 'n2',
    notification_type: 'contract_renewal',
    title: '△△システムズ株式会社 業務委託契約',
    description: '基幹システム開発案件',
    priority: 'high',
    status: 'unread',
    due_date: '2025-07-15',
    engineer_name: '佐藤花子',
    contract_id: 'c2',
    project_name: '基幹システム開発案件',
  },
  {
    id: 'n3',
    notification_type: 'contract_renewal',
    title: '◇◇フィナンシャル株式会社 業務委託契約',
    description: 'モバイルアプリ開発案件',
    priority: 'medium',
    status: 'unread',
    due_date: '2025-08-01',
    engineer_name: '鈴木一郎',
    contract_id: 'c3',
    project_name: 'モバイルアプリ開発案件',
  },
  {
    id: 'n4',
    notification_type: 'sales_performance',
    title: '売上実績が5件計上されました。',
    description:
      '工数の精算編内である前提で売上実績が計上されています。清算幅から外れた場合は手直ししてください。',
    priority: 'low',
    status: 'unread',
    due_date: '2024-03-16',
  },
  {
    id: 'n5',
    notification_type: 'contract_renewal',
    title: '☆☆テクノロジー株式会社 業務委託契約',
    description: 'AI・機械学習システム開発案件',
    priority: 'high',
    status: 'unread',
    due_date: '2025-06-20',
    engineer_name: '田中美咲',
    contract_id: 'c4',
    project_name: 'AI・機械学習システム開発案件',
  },
  {
    id: 'n6',
    notification_type: 'contract_expiry',
    title: '※※コンサルティング株式会社 業務委託契約',
    description: 'データ分析・可視化案件',
    priority: 'high',
    status: 'unread',
    due_date: '2025-05-31',
    engineer_name: '伊藤健太',
    contract_id: 'c5',
    project_name: 'データ分析・可視化案件',
  },
  {
    id: 'n7',
    notification_type: 'sales_performance',
    title: '売上実績が3件計上されました。',
    description:
      '工数の精算編内である前提で売上実績が計上されています。清算幅から外れた場合は手直ししてください。',
    priority: 'low',
    status: 'unread',
    due_date: '2024-03-15',
  },
  {
    id: 'n8',
    notification_type: 'contract_renewal',
    title: '■■インダストリー株式会社 業務委託契約',
    description: 'IoTシステム構築案件',
    priority: 'medium',
    status: 'unread',
    due_date: '2025-07-30',
    engineer_name: '高橋誠',
    contract_id: 'c6',
    project_name: 'IoTシステム構築案件',
  },
  {
    id: 'n9',
    notification_type: 'contract_renewal',
    title: '●●メディア株式会社 業務委託契約',
    description: 'コンテンツ管理システム開発案件',
    priority: 'medium',
    status: 'unread',
    due_date: '2025-08-15',
    engineer_name: '中村太郎',
    contract_id: 'c7',
    project_name: 'コンテンツ管理システム開発案件',
  },
  {
    id: 'n10',
    notification_type: 'sales_performance',
    title: '売上実績が7件計上されました。',
    description:
      '工数の精算編内である前提で売上実績が計上されています。清算幅から外れた場合は手直ししてください。',
    priority: 'low',
    status: 'unread',
    due_date: '2024-03-14',
  },
  {
    id: 'n11',
    notification_type: 'contract_expiry',
    title: '▲▲エネルギー株式会社 業務委託契約',
    description: 'スマートグリッドシステム開発案件',
    priority: 'high',
    status: 'unread',
    due_date: '2025-06-10',
    engineer_name: '小林恵子',
    contract_id: 'c8',
    project_name: 'スマートグリッドシステム開発案件',
  },
  {
    id: 'n12',
    notification_type: 'contract_renewal',
    title: '▼▼ロジスティクス株式会社 業務委託契約',
    description: '物流管理システム開発案件',
    priority: 'medium',
    status: 'unread',
    due_date: '2025-09-01',
    engineer_name: '加藤雄介',
    contract_id: 'c9',
    project_name: '物流管理システム開発案件',
  },
  {
    id: 'n13',
    notification_type: 'sales_performance',
    title: '売上実績が2件計上されました。',
    description:
      '工数の精算編内である前提で売上実績が計上されています。清算幅から外れた場合は手直ししてください。',
    priority: 'low',
    status: 'unread',
    due_date: '2024-03-13',
  },
  {
    id: 'n14',
    notification_type: 'contract_renewal',
    title: '◆◆ヘルスケア株式会社 業務委託契約',
    description: '医療情報システム開発案件',
    priority: 'high',
    status: 'unread',
    due_date: '2025-06-25',
    engineer_name: '渡辺直美',
    contract_id: 'c10',
    project_name: '医療情報システム開発案件',
  },
  {
    id: 'n15',
    notification_type: 'contract_expiry',
    title: '◎◎エデュケーション株式会社 業務委託契約',
    description: 'eラーニングプラットフォーム開発案件',
    priority: 'medium',
    status: 'unread',
    due_date: '2025-07-10',
    engineer_name: '松本和也',
    contract_id: 'c11',
    project_name: 'eラーニングプラットフォーム開発案件',
  },
];

// モックアクションアイテムデータ
const mockActionItems = {
  c1: [
    {
      id: 1,
      notification_id: 'n1',
      contract_id: 'c1',
      assigned_sales_id: 'sales1',
      title: 'クライアントに契約更新意向を確認',
      description: 'クライアントとの契約更新についての意向確認を行う',
      due_date: '2025-06-20',
      status: 'incomplete',
      is_completed: false,
      completed_at: null,
      assigned_sales_name: '担当者A',
    },
    {
      id: 2,
      notification_id: 'n1',
      contract_id: 'c1',
      assigned_sales_id: 'sales1',
      title: 'エンジニアの継続意向を確認',
      description: 'エンジニアの契約継続についての意向確認を行う',
      due_date: '2025-06-20',
      status: 'incomplete',
      is_completed: false,
      completed_at: null,
      assigned_sales_name: '担当者A',
    },
    {
      id: 3,
      notification_id: 'n1',
      contract_id: 'c1',
      assigned_sales_id: 'sales1',
      title: '契約書の準備・作成',
      description: '新しい契約書の準備と作成を行う',
      due_date: '2025-06-20',
      status: 'incomplete',
      is_completed: false,
      completed_at: null,
      assigned_sales_name: '担当者A',
    },
    {
      id: 4,
      notification_id: 'n1',
      contract_id: 'c1',
      assigned_sales_id: 'sales1',
      title: '契約書の締結',
      description: '契約書の最終確認と締結を行う',
      due_date: '2025-06-20',
      status: 'incomplete',
      is_completed: false,
      completed_at: null,
      assigned_sales_name: '担当者A',
    },
  ],
};

export default function SalesNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isContractOpen, setIsContractOpen] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionItems, setActionItems] = useState(mockActionItems);

  // フィルタリング用のstate
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ページネーション用のstate
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // フィルタリング処理
  const filteredNotifications = notifications.filter((notification) => {
    // 検索条件
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.engineer_name &&
        notification.engineer_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // ステータス条件
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // フィルタリング後の通知を優先度とタイプでソート
  const sortedNotifications = filteredNotifications.sort((a, b) => {
    // 1. 最優先: high優先度
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;

    // 2. high優先度同士の場合は、契約関連を優先
    if (a.priority === 'high' && b.priority === 'high') {
      const aIsContract = ['contract_renewal', 'contract_expiry'].includes(a.notification_type);
      const bIsContract = ['contract_renewal', 'contract_expiry'].includes(b.notification_type);
      if (aIsContract && !bIsContract) return -1;
      if (!aIsContract && bIsContract) return 1;
      return 0;
    }

    // 3. high以外の場合: 売上実績を次に優先
    const aIsSales = a.notification_type === 'sales_performance';
    const bIsSales = b.notification_type === 'sales_performance';
    if (aIsSales && !bIsSales) return -1;
    if (!aIsSales && bIsSales) return 1;

    // 4. 売上実績以外は契約関連を優先
    const aIsContract = ['contract_renewal', 'contract_expiry'].includes(a.notification_type);
    const bIsContract = ['contract_renewal', 'contract_expiry'].includes(b.notification_type);
    if (aIsContract && !bIsContract) return -1;
    if (!aIsContract && bIsContract) return 1;

    // 5. 同じタイプの場合は優先度順: medium > low
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
    );
  });

  // 契約関連の通知を抽出（表示用）
  const contractNotifications = sortedNotifications.filter(
    (n) => n.notification_type === 'contract_renewal' || n.notification_type === 'contract_expiry'
  );

  // その他の通知を抽出（表示用）
  const otherNotifications = sortedNotifications.filter(
    (n) => !['contract_renewal', 'contract_expiry'].includes(n.notification_type)
  );

  // 全通知をページネーション用に使用（フィルタリング＆ソート済み）
  const allNotifications = sortedNotifications;
  const totalPages = Math.ceil(allNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = allNotifications.slice(startIndex, endIndex);

  // 現在のページの通知を契約関連とその他に分割
  const currentContractNotifications = currentNotifications.filter(
    (n) => n.notification_type === 'contract_renewal' || n.notification_type === 'contract_expiry'
  );
  const currentOtherNotifications = currentNotifications.filter(
    (n) => !['contract_renewal', 'contract_expiry'].includes(n.notification_type)
  );

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 検索ハンドラー（ページを1に戻す）
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ステータスフィルタハンドラー（ページを1に戻す）
  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // 期限までの日数を計算
  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 優先度に応じた背景色を取得
  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800';
    }
  };

  // ステータスに応じたバッジの色を取得
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30';
    }
  };

  // ステータスの日本語表示
  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread':
        return '未完了';
      case 'in_progress':
        return '進行中';
      case 'completed':
        return '完了';
      default:
        return '不明';
    }
  };

  // 通知タイプの日本語表示
  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'contract_renewal':
        return '契約更新';
      case 'contract_expiry':
        return '契約終了';
      case 'sales_performance':
        return '売上実績';
      default:
        return 'その他';
    }
  };

  // アクションアイテムのチェック状態を切り替え
  const toggleActionItem = (contractId: string, itemId: number) => {
    setActionItems((prev) => {
      const updatedItems = {
        ...prev,
        [contractId]:
          prev[contractId as keyof typeof prev]?.map((item) =>
            item.id === itemId ? { ...item, is_completed: !item.is_completed } : item
          ) || [],
      };

      // 更新後のアイテム状態で通知のステータスを更新
      const items = updatedItems[contractId as keyof typeof updatedItems] || [];
      const allCompleted = items.every((item) => item.is_completed);
      const anyCompleted = items.some((item) => item.is_completed);

      let newStatus = 'unread'; // 未完了
      if (allCompleted && items.length > 0) {
        newStatus = 'completed'; // 完了
      } else if (anyCompleted) {
        newStatus = 'in_progress'; // 進行中
      }

      // 通知のステータスを更新
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.contract_id === contractId
            ? { ...notification, status: newStatus }
            : notification
        )
      );

      return updatedItems;
    });
  };

  // モーダルを開く
  const openModal = (notification: any) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setSelectedNotification(null);
    setIsModalOpen(false);
  };

  const renderContractNotificationCard = (notification: any, index: number) => {
    const daysUntilDue = getDaysUntilDue(notification.due_date);

    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className={`${getPriorityBgColor(notification.priority)} mb-4`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              {/* 左側のアイコンとコンテンツ */}
              <div className="flex items-center gap-3 flex-1">
                {/* アイコン */}
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-gray-600" />
                </div>

                {/* 優先度アイコン */}
                <div className="flex-shrink-0">
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      notification.priority === 'high'
                        ? 'text-red-500'
                        : notification.priority === 'medium'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                    }`}
                  />
                </div>

                {/* メインコンテンツ - 1行にまとめる */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 text-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {notification.title}
                    </h3>
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {notification.description}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 flex-shrink-0">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">{notification.engineer_name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側の情報 */}
              <div className="flex items-center gap-4 ml-6">
                {/* ステータスバッジ */}
                <Badge
                  variant="outline"
                  className={`${getStatusBadgeVariant(notification.status)} text-xs px-2 py-1`}
                >
                  {getStatusText(notification.status)}
                </Badge>

                {/* 期限情報 */}
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <div className="flex flex-col items-center">
                    <span
                      className={`${daysUntilDue <= 14 ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                    >
                      {daysUntilDue}日後
                    </span>
                    <span className="text-gray-500">{notification.due_date}</span>
                  </div>
                </div>

                {/* プログレスバー */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-800 rounded-full" style={{ width: '0%' }} />
                  </div>
                  <span className="text-xs text-gray-600">0/4</span>
                </div>

                {/* 3点リーダーアイコン */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => openModal(notification)}
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderOtherNotificationCard = (notification: any, index: number) => {
    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className={`${getPriorityBgColor(notification.priority)} mb-4`}>
          <CardContent className="p-3">
            <div className="space-y-3">
              {/* 1行目: アイコンとコンテンツ */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* アイコン */}
                  <div className="flex-shrink-0">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>

                  {/* メインコンテンツ */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 text-sm">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {notification.title}
                      </h3>
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {notification.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 右側の日付情報 */}
                <div className="text-xs text-gray-500 ml-4">{notification.due_date}</div>
              </div>

              {/* 2行目: 契約管理画面で確認するボタン */}
              <div className="flex justify-center">
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-6 py-2 w-full max-w-md"
                >
                  <Link href="/sales/contracts">契約管理画面で確認する</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ページネーションコンポーネント
  const renderPagination = () => {
    return (
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {/* ページ番号を表示 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNumber)}
                  isActive={pageNumber === currentPage}
                  className="cursor-pointer"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={
                  currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
          <p className="text-sm text-gray-600 mt-1">
            全{allNotifications.length}件中 {startIndex + 1}-
            {Math.min(endIndex, allNotifications.length)}件を表示
            {(searchTerm || filterStatus !== 'all') && (
              <span className="ml-2 text-gray-500">
                （{notifications.length}件中からフィルタリング）
              </span>
            )}
          </p>
        </div>
      </motion.div>

      {/* 検索・フィルタ */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="タイトル、説明、エンジニア名で検索"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全てのステータス</SelectItem>
            <SelectItem value="unread">未完了</SelectItem>
            <SelectItem value="in_progress">進行中</SelectItem>
            <SelectItem value="completed">完了</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* アクションが必要な契約セクション */}
      {currentContractNotifications.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">アクションが必要な契約</h2>
            <span className="text-sm text-gray-600">
              契約更新・終了などの対応が必要な契約（{contractNotifications.length}件）
            </span>
          </div>

          <div className="space-y-0">
            {currentContractNotifications.map((notification, index) =>
              renderContractNotificationCard(notification, index)
            )}
          </div>
        </div>
      )}

      {/* その他の通知 */}
      {currentOtherNotifications.length > 0 && (
        <div className="space-y-4">
          {currentOtherNotifications.map((notification, index) =>
            renderOtherNotificationCard(notification, index)
          )}
        </div>
      )}

      {/* 通知がない場合 */}
      {currentNotifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {searchTerm || filterStatus !== 'all' ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">検索条件に一致する通知がありません</p>
                <p className="text-muted-foreground">検索条件を変更してお試しください</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium mb-2">すべての通知を確認済みです</p>
                <p className="text-muted-foreground">新しい通知はありません</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ページネーション */}
      {totalPages > 1 && renderPagination()}

      {/* 契約アクション管理モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">契約アクション管理</DialogTitle>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-6">
              {/* 契約情報 */}
              <Card className="bg-gray-50 dark:bg-gray-900/50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-3">{selectedNotification.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">プロジェクト:</span>
                      <div className="font-medium">{selectedNotification.project_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">エンジニア:</span>
                      <div className="font-medium">{selectedNotification.engineer_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">期限:</span>
                      <div className="font-medium">
                        {selectedNotification.due_date} (
                        {getDaysUntilDue(selectedNotification.due_date)}日後)
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">種別:</span>
                      <div className="font-medium">
                        {getNotificationTypeText(selectedNotification.notification_type)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* アクションアイテム */}
              <div>
                <h4 className="font-semibold text-base mb-4">アクションアイテム</h4>
                <div className="space-y-3">
                  {actionItems[selectedNotification.contract_id as keyof typeof actionItems]?.map(
                    (item, index) => {
                      const itemDaysUntilDue = getDaysUntilDue(item.due_date);
                      return (
                        <Card key={item.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={item.is_completed}
                                onCheckedChange={() =>
                                  toggleActionItem(selectedNotification.contract_id, item.id)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-sm mb-1">{item.title}</h5>
                                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                  <span>期限:{item.due_date}</span>
                                  <span>担当:{item.assigned_sales_name}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span
                                  className={`${itemDaysUntilDue <= 7 ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                                >
                                  {itemDaysUntilDue}日後
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                  )}
                </div>
              </div>

              {/* ボタン */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={closeModal}>
                  閉じる
                </Button>
                <Button className="bg-gray-800 hover:bg-gray-900 text-white">契約書を表示</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
