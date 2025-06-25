'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, User, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AddSalesModal } from '@/components/sales-manager/add-sales-modal';
import { InviteConfirmationModal } from '@/components/sales-manager/invite-confirmation-modal';

// モックデータ
const mockSalesData = [
  {
    id: '1',
    name: '鈴木幸作',
    email: 'suzuki@example.com',
    status: 'applying' as const,
    team: '営業1部',
    avatar: '/avatars/suzuki.jpg',
  },
  {
    id: '2',
    name: '田中太郎',
    email: 'tanaka@example.com',
    status: 'invited' as const,
    team: '営業1部',
    avatar: '/avatars/tanaka.jpg',
  },
  {
    id: '3',
    name: '佐藤花子',
    email: 'sato@example.com',
    status: 'retired' as const,
    team: '営業2部',
    avatar: '/avatars/sato.jpg',
  },
  {
    id: '4',
    name: '山田次郎',
    email: 'yamada@example.com',
    status: 'applying' as const,
    team: '営業1部',
    avatar: '/avatars/yamada.jpg',
  },
  {
    id: '5',
    name: '高橋美咲',
    email: 'takahashi@example.com',
    status: 'invited' as const,
    team: '営業2部',
    avatar: '/avatars/takahashi.jpg',
  },
  {
    id: '6',
    name: '伊藤健一',
    email: 'ito@example.com',
    status: 'applying' as const,
    team: '営業1部',
    avatar: '/avatars/ito.jpg',
  },
  {
    id: '7',
    name: '渡辺由美',
    email: 'watanabe@example.com',
    status: 'retired' as const,
    team: '営業2部',
    avatar: '/avatars/watanabe.jpg',
  },
  {
    id: '8',
    name: '小林正義',
    email: 'kobayashi@example.com',
    status: 'invited' as const,
    team: '営業1部',
    avatar: '/avatars/kobayashi.jpg',
  },
  {
    id: '9',
    name: '加藤真理',
    email: 'kato@example.com',
    status: 'applying' as const,
    team: '営業2部',
    avatar: '/avatars/kato.jpg',
  },
  {
    id: '10',
    name: '吉田和也',
    email: 'yoshida@example.com',
    status: 'invited' as const,
    team: '営業1部',
    avatar: '/avatars/yoshida.jpg',
  },
  {
    id: '11',
    name: '松本恵子',
    email: 'matsumoto@example.com',
    status: 'retired' as const,
    team: '営業2部',
    avatar: '/avatars/matsumoto.jpg',
  },
  {
    id: '12',
    name: '井上大輔',
    email: 'inoue@example.com',
    status: 'applying' as const,
    team: '営業1部',
    avatar: '/avatars/inoue.jpg',
  },
  {
    id: '13',
    name: '木村智子',
    email: 'kimura@example.com',
    status: 'invited' as const,
    team: '営業2部',
    avatar: '/avatars/kimura.jpg',
  },
  {
    id: '14',
    name: '林雄一',
    email: 'hayashi@example.com',
    status: 'applying' as const,
    team: '営業1部',
    avatar: '/avatars/hayashi.jpg',
  },
  {
    id: '15',
    name: '清水美穂',
    email: 'shimizu@example.com',
    status: 'retired' as const,
    team: '営業2部',
    avatar: '/avatars/shimizu.jpg',
  },
  {
    id: '16',
    name: '森田康夫',
    email: 'morita@example.com',
    status: 'invited' as const,
    team: '営業1部',
    avatar: '/avatars/morita.jpg',
  },
  {
    id: '17',
    name: '池田麻衣',
    email: 'ikeda@example.com',
    status: 'applying' as const,
    team: '営業2部',
    avatar: '/avatars/ikeda.jpg',
  },
  {
    id: '18',
    name: '橋本拓也',
    email: 'hashimoto@example.com',
    status: 'invited' as const,
    team: '営業1部',
    avatar: '/avatars/hashimoto.jpg',
  },
  {
    id: '19',
    name: '斎藤理恵',
    email: 'saito@example.com',
    status: 'retired' as const,
    team: '営業2部',
    avatar: '/avatars/saito.jpg',
  },
  {
    id: '20',
    name: '中村俊介',
    email: 'nakamura@example.com',
    status: 'applying' as const,
    team: '営業1部',
    avatar: '/avatars/nakamura.jpg',
  },
  {
    id: '21',
    name: '岡田奈々',
    email: 'okada@example.com',
    status: 'invited' as const,
    team: '営業2部',
    avatar: '/avatars/okada.jpg',
  },
  {
    id: '22',
    name: '藤田浩二',
    email: 'fujita@example.com',
    status: 'applying' as const,
    team: '営業1部',
    avatar: '/avatars/fujita.jpg',
  },
  {
    id: '23',
    name: '野口千春',
    email: 'noguchi@example.com',
    status: 'retired' as const,
    team: '営業2部',
    avatar: '/avatars/noguchi.jpg',
  },
  {
    id: '24',
    name: '村上洋平',
    email: 'murakami@example.com',
    status: 'invited' as const,
    team: '営業1部',
    avatar: '/avatars/murakami.jpg',
  },
  {
    id: '25',
    name: '前田さくら',
    email: 'maeda@example.com',
    status: 'applying' as const,
    team: '営業2部',
    avatar: '/avatars/maeda.jpg',
  },
];

type SalesStatus = 'applying' | 'invited' | 'retired';

const getStatusColor = (status: SalesStatus) => {
  switch (status) {
    case 'applying':
      return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
    case 'invited':
      return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    case 'retired':
      return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    default:
      return '';
  }
};

const getStatusText = (status: SalesStatus) => {
  switch (status) {
    case 'applying':
      return '仮登録';
    case 'invited':
      return '招待中';
    case 'retired':
      return '退会';
    default:
      return status;
  }
};

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });
  const itemsPerPage = 10;

  // フィルタリングされたデータ
  const filteredSales = useMemo(() => {
    return mockSalesData.filter((sales) => {
      const matchesSearch =
        sales.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sales.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || sales.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // ページネーション
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, endIndex);

  // 全選択の処理
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSales(currentSales.map((sales) => sales.id));
    } else {
      setSelectedSales([]);
    }
  };

  // 個別選択の処理
  const handleSelectSales = (salesId: string, checked: boolean) => {
    if (checked) {
      setSelectedSales((prev) => [...prev, salesId]);
    } else {
      setSelectedSales((prev) => prev.filter((id) => id !== salesId));
    }
  };

  // まとめて招待の処理
  const handleBulkInvite = () => {
    const selectedSalesData = selectedSales
      .map((salesId) => {
        const sales = mockSalesData.find((s) => s.id === salesId);
        return sales ? { id: sales.id, name: sales.name, email: sales.email } : null;
      })
      .filter(Boolean) as Array<{ id: string; name: string; email: string }>;

    if (selectedSalesData.length > 0) {
      setInviteTarget({ id: '', name: '' }); // 複数選択時はクリア
      setIsInviteModalOpen(true);
    }
  };

  // 個別アクション
  const handleInvite = (salesId: string) => {
    const sales = mockSalesData.find((s) => s.id === salesId);
    if (sales) {
      setInviteTarget({ id: salesId, name: sales.name });
      setIsInviteModalOpen(true);
    }
  };

  const handleConfirmInvite = () => {
    if (selectedSales.length > 0) {
      // まとめて招待の場合
      console.log('まとめて招待確定:', selectedSales);
      setSelectedSales([]); // 選択状態をクリア
    } else {
      // 個別招待の場合
      console.log('招待確定:', inviteTarget);
    }
  };

  const handleEdit = (salesId: string) => {
    console.log('編集:', salesId);
  };

  const handleRetire = (salesId: string) => {
    console.log('退会取消:', salesId);
  };

  const isAllSelected = currentSales.length > 0 && selectedSales.length === currentSales.length;
  const isIndeterminate = selectedSales.length > 0 && selectedSales.length < currentSales.length;

  return (
    <div className="px-4 py-6 space-y-6 max-w-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">営業一覧</h1>
        </div>
        <div className="flex items-center gap-2">
          {selectedSales.length > 0 && (
            <Button onClick={handleBulkInvite} className="bg-blue-600 hover:bg-blue-700">
              まとめて招待
            </Button>
          )}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            営業を追加
          </Button>
        </div>
      </motion.div>

      {/* 検索とフィルター */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="営業名で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="ステータス" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="applying">仮登録</SelectItem>
            <SelectItem value="invited">招待中</SelectItem>
            <SelectItem value="retired">退会</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* テーブル */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="すべて選択"
                      {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                    />
                  </TableHead>
                  <TableHead>営業</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>所属チーム</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSales.map((sales) => (
                  <motion.tr
                    key={sales.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedSales.includes(sales.id)}
                        onCheckedChange={(checked) =>
                          handleSelectSales(sales.id, checked as boolean)
                        }
                        aria-label={`${sales.name}を選択`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={sales.avatar} alt={sales.name} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{sales.name}</div>
                          <div className="text-sm text-muted-foreground">{sales.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sales.status)}`}
                      >
                        {getStatusText(sales.status)}
                      </div>
                    </TableCell>
                    <TableCell>{sales.team}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInvite(sales.id)}
                          className="h-8 px-3 flex items-center gap-1"
                        >
                          <User className="h-4 w-4" />
                          <span className="text-xs">招待</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(sales.id)}
                          className="h-8 px-3 flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="text-xs">編集</span>
                        </Button>
                        {sales.status === 'retired' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetire(sales.id)}
                            className="h-8 px-3 flex items-center gap-1"
                          >
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs">退会取消</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

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

      {/* 営業追加モーダル */}
      <AddSalesModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* 招待確認モーダル */}
      <InviteConfirmationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        salesName={selectedSales.length === 0 ? inviteTarget.name : undefined}
        salesList={
          selectedSales.length > 0
            ? (selectedSales
                .map((salesId) => {
                  const sales = mockSalesData.find((s) => s.id === salesId);
                  return sales ? { id: sales.id, name: sales.name, email: sales.email } : null;
                })
                .filter(Boolean) as Array<{ id: string; name: string; email: string }>)
            : undefined
        }
        onConfirm={handleConfirmInvite}
      />
    </div>
  );
}
