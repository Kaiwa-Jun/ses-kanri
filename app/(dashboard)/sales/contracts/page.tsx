'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  MoreHorizontal,
  Plus,
  User,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CreateContractDialog } from '@/components/contracts/create-contract-dialog';
import { mockContracts } from '@/lib/data';

export default function ContractsPage() {
  const [contracts, setContracts] = useState(mockContracts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // アクションが必要な契約とそうでない契約に分ける
  const actionRequiredContracts = contracts.filter(
    (contract) => contract.hasNotification && contract.actionStatus !== 'completed'
  );

  const noActionRequiredContracts = contracts.filter(
    (contract) => !contract.hasNotification || contract.actionStatus === 'completed'
  );

  // フィルタリング
  const filterContracts = (contractList: typeof contracts) => {
    return contractList.filter((contract) => {
      const matchesSearch =
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.engineer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.project.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'notifications' && contract.hasNotification) ||
        contract.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredActionRequired = filterContracts(actionRequiredContracts);
  const filteredNoActionRequired = filterContracts(noActionRequiredContracts);

  // ステータス更新
  const updateContractStatus = (contractId: string, newStatus: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, actionStatus: newStatus } : c))
    );
  };

  // アクションアイテムの完了状態を切り替え
  const toggleActionItem = (contractId: string, actionId: string) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              actionItems: c.actionItems?.map((item) =>
                item.id === actionId ? { ...item, completed: !item.completed } : item
              ),
            }
          : c
      )
    );
  };

  // ステータスに応じた色とアイコンを取得
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
          icon: <PauseCircle className="h-3 w-3" />,
          text: '未着手',
        };
      case 'in_progress':
        return {
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          icon: <PlayCircle className="h-3 w-3" />,
          text: '進行中',
        };
      case 'completed':
        return {
          color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          icon: <CheckCircle className="h-3 w-3" />,
          text: '完了',
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          icon: <XCircle className="h-3 w-3" />,
          text: 'キャンセル',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30',
          icon: <PauseCircle className="h-3 w-3" />,
          text: '未着手',
        };
    }
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'expiring':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'draft':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      default:
        return '';
    }
  };

  const getContractStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '契約中';
      case 'expiring':
        return '期限間近';
      case 'draft':
        return '下書き';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'renewal':
        return '契約更新';
      case 'termination':
        return '契約終了';
      case 'nda':
        return 'NDA';
      case 'ongoing':
        return '継続中';
      default:
        return type;
    }
  };

  // 期限までの日数を計算
  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 詳細モーダルを開く
  const openDetailModal = (contract: any) => {
    setSelectedContract(contract);
    setIsDetailModalOpen(true);
  };

  // 契約詳細画面への遷移
  const handleContractClick = (contractId: string) => {
    router.push(`/sales/contracts/${contractId}`);
  };

  // 契約リストのレンダリング関数
  const renderContractList = (contractList: typeof contracts, showActionStatus = true) => {
    return contractList.map((contract, index) => {
      const statusInfo = getStatusInfo(contract.actionStatus);
      const completedActions = contract.actionItems?.filter((item) => item.completed).length || 0;
      const totalActions = contract.actionItems?.length || 0;
      const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 100;
      const daysUntilDue = getDaysUntilDue(contract.dueDate);

      return (
        <motion.div
          key={contract.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div
            className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer ${
              contract.hasNotification && showActionStatus
                ? contract.notificationPriority === 'high'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200'
                  : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200'
                : 'border-border'
            }`}
            onClick={() => handleContractClick(contract.id)}
          >
            <div className="flex items-center justify-between gap-4">
              {/* 左側：基本情報 */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {contract.hasNotification && showActionStatus && (
                    <AlertTriangle
                      className={`h-4 w-4 flex-shrink-0 ${
                        contract.notificationPriority === 'high'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{contract.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">{contract.project}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{contract.engineer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 中央：ステータス・バッジ */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {contract.status !== 'active' && (
                  <Badge
                    variant="outline"
                    className={`${getContractStatusColor(contract.status)} text-xs px-2 py-0`}
                  >
                    {getContractStatusText(contract.status)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs px-2 py-0">
                  {getTypeText(contract.type)}
                </Badge>
                {showActionStatus && (
                  <Badge
                    variant="outline"
                    className={`${statusInfo.color} text-xs px-2 py-0 gap-1`}
                  >
                    {statusInfo.icon}
                    {statusInfo.text}
                  </Badge>
                )}
              </div>

              {/* 右側：期限・進捗・アクション */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* 期限 */}
                <div className="text-xs text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" />
                    <span
                      className={`${daysUntilDue <= 30 && showActionStatus ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}
                    >
                      {daysUntilDue}日後
                    </span>
                  </div>
                  <div className="text-muted-foreground">{contract.dueDate}</div>
                </div>

                {/* 進捗 */}
                {totalActions > 0 && showActionStatus && (
                  <div className="text-xs text-center min-w-[60px]">
                    <div className="mb-1 font-medium">
                      {completedActions}/{totalActions}
                    </div>
                    <Progress value={progressPercentage} className="h-1 w-12" />
                  </div>
                )}

                {/* アクションボタン */}
                <div className="flex items-center gap-1">
                  {showActionStatus && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(contract);
                      }}
                      className="text-xs px-2 py-1 h-7"
                    >
                      詳細管理
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {showActionStatus && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              updateContractStatus(contract.id, 'pending');
                            }}
                          >
                            <PauseCircle className="h-4 w-4 mr-2" />
                            未着手にする
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              updateContractStatus(contract.id, 'in_progress');
                            }}
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            進行中にする
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              updateContractStatus(contract.id, 'completed');
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            完了にする
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              updateContractStatus(contract.id, 'cancelled');
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            キャンセルする
                          </DropdownMenuItem>
                          <Separator />
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContractClick(contract.id);
                        }}
                      >
                        契約書を表示
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          {index < contractList.length - 1 && <Separator className="my-1" />}
        </motion.div>
      );
    });
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
          <h1 className="text-3xl font-bold tracking-tight">契約管理</h1>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          新規契約書作成
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="契約名、プロジェクト名、エンジニア名で検索..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="ステータス" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全てのステータス</SelectItem>
            <SelectItem value="notifications">通知あり</SelectItem>
            <SelectItem value="active">契約中</SelectItem>
            <SelectItem value="expiring">期限間近</SelectItem>
            <SelectItem value="draft">下書き</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* アクションが必要な契約 */}
      {filteredActionRequired.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <CardTitle className="text-lg">アクションが必要な契約</CardTitle>
                <CardDescription>
                  契約更新・終了などの対応が必要な契約（{filteredActionRequired.length}件）
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {renderContractList(filteredActionRequired, true)}
          </CardContent>
        </Card>
      )}

      {/* アクション不要な契約 */}
      {filteredNoActionRequired.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <CardTitle className="text-lg">継続中の契約</CardTitle>
                <CardDescription>
                  現在進行中で特別な対応が不要な契約（{filteredNoActionRequired.length}件）
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {renderContractList(filteredNoActionRequired, false)}
          </CardContent>
        </Card>
      )}

      {/* 契約がない場合 */}
      {filteredActionRequired.length === 0 && filteredNoActionRequired.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== 'all'
              ? '検索条件に一致する契約がありません'
              : '契約が登録されていません'}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>新規契約書を作成する</Button>
        </div>
      )}

      {/* 詳細管理モーダル */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>契約アクション管理</DialogTitle>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">{selectedContract.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">プロジェクト:</span>
                    <p>{selectedContract.project}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">エンジニア:</span>
                    <p>{selectedContract.engineer}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">期限:</span>
                    <p
                      className={`${getDaysUntilDue(selectedContract.dueDate) <= 7 ? 'text-red-600 font-medium' : ''}`}
                    >
                      {selectedContract.dueDate} ({getDaysUntilDue(selectedContract.dueDate)}日後)
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">種類:</span>
                    <p>{getTypeText(selectedContract.type)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">アクションアイテム</h4>
                <div className="space-y-3">
                  {selectedContract.actionItems?.map((item: any) => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg ${item.completed ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleActionItem(selectedContract.id, item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p
                            className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {item.task}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>期限: {item.dueDate}</span>
                            <span>担当: {item.assignee}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span
                            className={`text-sm ${
                              getDaysUntilDue(item.dueDate) <= 3
                                ? 'text-red-600 font-medium'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {getDaysUntilDue(item.dueDate)}日後
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              閉じる
            </Button>
            <Button
              onClick={() => {
                if (selectedContract) {
                  handleContractClick(selectedContract.id);
                  setIsDetailModalOpen(false);
                }
              }}
            >
              契約書を表示
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateContractDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
}
