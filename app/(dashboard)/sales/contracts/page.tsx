'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Building, User, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { CreateContractDialog } from '@/components/contracts/create-contract-dialog';
import { mockContracts } from '@/lib/data';

export default function ContractsPage() {
  const [contracts, setContracts] = useState(mockContracts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // フィルタリング
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.engineer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.clientName && contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ページネーション計算
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContracts = filteredContracts.slice(startIndex, endIndex);

  // ページ変更時に1ページ目に戻す
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // 契約詳細画面への遷移
  const handleContractClick = (contractId: string) => {
    router.push(`/sales/contracts/${contractId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'expiring':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'draft':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
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
          新規契約を追加
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="契約名、企業名で検索"
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
            <SelectItem value="active">契約中</SelectItem>
            <SelectItem value="expiring">期限間近</SelectItem>
            <SelectItem value="draft">下書き</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* テーブル */}
      <div className="bg-white dark:bg-gray-950 rounded-lg border">
        {/* テーブルヘッダー */}
        <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building className="h-4 w-4" />
            プロジェクト
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building className="h-4 w-4" />
            クライアント
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            エンジニア
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            契約期間
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            単価
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            営業担当
          </div>
        </div>

        {/* テーブルボディ */}
        <div className="divide-y">
          {currentContracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors"
              onClick={() => handleContractClick(contract.id)}
            >
              {/* プロジェクト */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {contract.project}
                  </p>
                </div>
              </div>

              {/* クライアント */}
              <div className="flex items-center">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {contract.clientName || 'ロメディカル'}
                </p>
              </div>

              {/* エンジニア */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {contract.engineer.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {contract.engineer}
                  </p>
                </div>
              </div>

              {/* 契約期間 */}
              <div className="flex items-center">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {contract.endDate || '2025-05-07'}
                </p>
              </div>

              {/* 単価 */}
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ¥{(contract.rate || 900000).toLocaleString()}
                </p>
              </div>

              {/* 営業担当 */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {(contract.salesPerson?.name || '佐藤健太').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {contract.salesPerson?.name || '佐藤健太'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all'
                ? '検索条件に一致する契約がありません'
                : '契約が登録されていません'}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>新規契約を作成する</Button>
          </div>
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {/* ページ番号を表示 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={pageNumber === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <CreateContractDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
}
