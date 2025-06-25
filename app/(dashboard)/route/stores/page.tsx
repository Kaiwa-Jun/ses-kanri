'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Building2,
  Calendar,
  Trash2,
  Snowflake,
  Sun,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { FreezeConfirmationModal } from '@/components/route/freeze-confirmation-modal';
import { DeleteConfirmationModal } from '@/components/route/delete-confirmation-modal';

// モックデータ
const mockStores = [
  {
    id: '1',
    name: 'レストラン田中',
    email: 'tanaka@example.com',
    contractStartDate: '2024/01/01',
    lastLogin: '2025/01/01',
    lastDataUpdate: '2025/01/01',
    status: 'applying', // applying, active, frozen
  },
  {
    id: '2',
    name: 'カフェ山田',
    email: 'yamada@example.com',
    contractStartDate: '2024/01/01',
    lastLogin: '2025/01/01',
    lastDataUpdate: '2025/01/01',
    status: 'active',
  },
  {
    id: '3',
    name: '居酒屋佐藤',
    email: 'sato@example.com',
    contractStartDate: '2024/01/01',
    lastLogin: '2025/01/01',
    lastDataUpdate: '2025/01/01',
    status: 'frozen',
  },
  {
    id: '4',
    name: 'ラーメン鈴木',
    email: 'suzuki@example.com',
    contractStartDate: '2024/01/15',
    lastLogin: '2025/01/02',
    lastDataUpdate: '2025/01/02',
    status: 'active',
  },
  {
    id: '5',
    name: 'イタリアン高橋',
    email: 'takahashi@example.com',
    contractStartDate: '2024/02/01',
    lastLogin: '2024/12/30',
    lastDataUpdate: '2024/12/30',
    status: 'applying',
  },
  {
    id: '6',
    name: 'そば処伊藤',
    email: 'ito@example.com',
    contractStartDate: '2024/02/15',
    lastLogin: '2025/01/03',
    lastDataUpdate: '2025/01/03',
    status: 'active',
  },
  {
    id: '7',
    name: 'フレンチ渡辺',
    email: 'watanabe@example.com',
    contractStartDate: '2024/03/01',
    lastLogin: '2024/12/15',
    lastDataUpdate: '2024/12/15',
    status: 'frozen',
  },
  {
    id: '8',
    name: '焼肉小林',
    email: 'kobayashi@example.com',
    contractStartDate: '2024/03/15',
    lastLogin: '2025/01/04',
    lastDataUpdate: '2025/01/04',
    status: 'active',
  },
  {
    id: '9',
    name: '寿司加藤',
    email: 'kato@example.com',
    contractStartDate: '2024/04/01',
    lastLogin: '2024/12/28',
    lastDataUpdate: '2024/12/28',
    status: 'applying',
  },
  {
    id: '10',
    name: 'バー吉田',
    email: 'yoshida@example.com',
    contractStartDate: '2024/04/15',
    lastLogin: '2025/01/05',
    lastDataUpdate: '2025/01/05',
    status: 'active',
  },
  {
    id: '11',
    name: 'パン屋松本',
    email: 'matsumoto@example.com',
    contractStartDate: '2024/05/01',
    lastLogin: '2024/11/20',
    lastDataUpdate: '2024/11/20',
    status: 'frozen',
  },
  {
    id: '12',
    name: '中華井上',
    email: 'inoue@example.com',
    contractStartDate: '2024/05/15',
    lastLogin: '2025/01/06',
    lastDataUpdate: '2025/01/06',
    status: 'active',
  },
  {
    id: '13',
    name: 'スイーツ木村',
    email: 'kimura@example.com',
    contractStartDate: '2024/06/01',
    lastLogin: '2024/12/25',
    lastDataUpdate: '2024/12/25',
    status: 'applying',
  },
  {
    id: '14',
    name: 'うどん林',
    email: 'hayashi@example.com',
    contractStartDate: '2024/06/15',
    lastLogin: '2025/01/07',
    lastDataUpdate: '2025/01/07',
    status: 'active',
  },
  {
    id: '15',
    name: 'ビストロ清水',
    email: 'shimizu@example.com',
    contractStartDate: '2024/07/01',
    lastLogin: '2024/10/30',
    lastDataUpdate: '2024/10/30',
    status: 'frozen',
  },
  {
    id: '16',
    name: 'とんかつ森田',
    email: 'morita@example.com',
    contractStartDate: '2024/07/15',
    lastLogin: '2025/01/08',
    lastDataUpdate: '2025/01/08',
    status: 'active',
  },
  {
    id: '17',
    name: 'たこ焼き池田',
    email: 'ikeda@example.com',
    contractStartDate: '2024/08/01',
    lastLogin: '2024/12/20',
    lastDataUpdate: '2024/12/20',
    status: 'applying',
  },
  {
    id: '18',
    name: 'お好み焼き橋本',
    email: 'hashimoto@example.com',
    contractStartDate: '2024/08/15',
    lastLogin: '2025/01/09',
    lastDataUpdate: '2025/01/09',
    status: 'active',
  },
  {
    id: '19',
    name: '天ぷら斎藤',
    email: 'saito@example.com',
    contractStartDate: '2024/09/01',
    lastLogin: '2024/09/15',
    lastDataUpdate: '2024/09/15',
    status: 'frozen',
  },
  {
    id: '20',
    name: 'しゃぶしゃぶ中村',
    email: 'nakamura@example.com',
    contractStartDate: '2024/09/15',
    lastLogin: '2025/01/10',
    lastDataUpdate: '2025/01/10',
    status: 'active',
  },
  {
    id: '21',
    name: 'ピザ岡田',
    email: 'okada@example.com',
    contractStartDate: '2024/10/01',
    lastLogin: '2024/12/15',
    lastDataUpdate: '2024/12/15',
    status: 'applying',
  },
  {
    id: '22',
    name: 'ステーキ藤田',
    email: 'fujita@example.com',
    contractStartDate: '2024/10/15',
    lastLogin: '2025/01/11',
    lastDataUpdate: '2025/01/11',
    status: 'active',
  },
  {
    id: '23',
    name: 'カレー野口',
    email: 'noguchi@example.com',
    contractStartDate: '2024/11/01',
    lastLogin: '2024/11/05',
    lastDataUpdate: '2024/11/05',
    status: 'frozen',
  },
  {
    id: '24',
    name: 'ハンバーガー村上',
    email: 'murakami@example.com',
    contractStartDate: '2024/11/15',
    lastLogin: '2025/01/12',
    lastDataUpdate: '2025/01/12',
    status: 'active',
  },
  {
    id: '25',
    name: 'オムライス前田',
    email: 'maeda@example.com',
    contractStartDate: '2024/12/01',
    lastLogin: '2024/12/10',
    lastDataUpdate: '2024/12/10',
    status: 'applying',
  },
];

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'name'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [freezeTarget, setFreezeTarget] = useState<{
    storeName: string;
    isMultiple: boolean;
    storeCount: number;
    selectedStores: Array<{ id: string; name: string; email: string }>;
  }>({ storeName: '', isMultiple: false, storeCount: 0, selectedStores: [] });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    storeName: string;
    isMultiple: boolean;
    storeCount: number;
    selectedStores: Array<{ id: string; name: string; email: string }>;
  }>({ storeName: '', isMultiple: false, storeCount: 0, selectedStores: [] });
  const itemsPerPage = 10;

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || filterStatus === 'all' || store.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (sortOrder === 'desc') {
      return bValue.localeCompare(aValue);
    } else {
      return aValue.localeCompare(bValue);
    }
  });

  // ページネーション
  const totalPages = Math.ceil(sortedStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStores = sortedStores.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string | undefined) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'applying':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'frozen':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '利用';
      case 'applying':
        return '申し込み';
      case 'frozen':
        return '凍結';
      default:
        return status;
    }
  };

  const handleSort = (field: 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectStore = (storeId: string, checked: boolean) => {
    if (checked) {
      setSelectedStores([...selectedStores, storeId]);
    } else {
      setSelectedStores(selectedStores.filter((id) => id !== storeId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStores(currentStores.map((store) => store.id));
    } else {
      setSelectedStores([]);
    }
  };

  const handleBulkFreeze = () => {
    if (selectedStores.length > 0) {
      const selectedStoreData = selectedStores.map((storeId) => {
        const store = mockStores.find((s) => s.id === storeId);
        return {
          id: storeId,
          name: store?.name || '',
          email: store?.email || '',
        };
      });

      setFreezeTarget({
        storeName: '',
        isMultiple: true,
        storeCount: selectedStores.length,
        selectedStores: selectedStoreData,
      });
      setFreezeModalOpen(true);
    }
  };

  const handleBulkUnfreeze = () => {
    console.log('まとめて凍結解除:', selectedStores);
    // 実際にはAPIを呼び出して凍結解除処理
    setSelectedStores([]);
  };

  const handleBulkDelete = () => {
    if (selectedStores.length > 0) {
      const selectedStoreData = selectedStores.map((storeId) => {
        const store = mockStores.find((s) => s.id === storeId);
        return {
          id: storeId,
          name: store?.name || '',
          email: store?.email || '',
        };
      });

      setDeleteTarget({
        storeName: '',
        isMultiple: true,
        storeCount: selectedStores.length,
        selectedStores: selectedStoreData,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleRowAction = (storeId: string, action: 'view' | 'freeze' | 'delete') => {
    const store = mockStores.find((s) => s.id === storeId);
    if (!store) return;

    if (action === 'freeze') {
      setFreezeTarget({
        storeName: store.name,
        isMultiple: false,
        storeCount: 1,
        selectedStores: [],
      });
      setFreezeModalOpen(true);
    } else if (action === 'delete') {
      setDeleteTarget({
        storeName: store.name,
        isMultiple: false,
        storeCount: 1,
        selectedStores: [],
      });
      setDeleteModalOpen(true);
    } else {
      console.log(`${action} for store:`, storeId);
      // 他のアクションの処理を実装
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
          <h1 className="text-3xl font-bold tracking-tight">加盟店一覧</h1>
        </div>
        {selectedStores.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkFreeze}>
              <Snowflake className="h-4 w-4 mr-2" />
              まとめて凍結
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkUnfreeze}>
              <Sun className="h-4 w-4 mr-2" />
              まとめて凍結解除
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              まとめて削除
            </Button>
          </div>
        )}
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="加盟店名を検索"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value) => handleStatusFilter(value || undefined)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="ステータス" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="active">利用</SelectItem>
            <SelectItem value="applying">申し込み</SelectItem>
            <SelectItem value="frozen">凍結</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedStores.length === currentStores.length && currentStores.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-12">
                    <Building2 className="h-4 w-4" />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('name')}
                    >
                      加盟店
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>利用開始日</TableHead>
                  <TableHead>最終ログイン</TableHead>
                  <TableHead>最終データ登録</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStores.map((store, index) => (
                  <TableRow
                    key={store.id}
                    className={`group hover:bg-muted/50 transition-colors ${
                      selectedStores.includes(store.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedStores.includes(store.id)}
                        onCheckedChange={(checked) =>
                          handleSelectStore(store.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-muted-foreground">{store.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{store.contractStartDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{store.lastLogin}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{store.lastDataUpdate}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(store.status)}>
                        {getStatusText(store.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRowAction(store.id, 'freeze')}
                        >
                          <Snowflake className="h-4 w-4" />
                          凍結
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRowAction(store.id, 'freeze')}
                        >
                          <Snowflake className="h-4 w-4" />
                          凍結解除
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRowAction(store.id, 'delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                          削除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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

      <FreezeConfirmationModal
        open={freezeModalOpen}
        onOpenChange={(open) => {
          setFreezeModalOpen(open);
          if (!open) {
            setSelectedStores([]);
          }
        }}
        storeName={freezeTarget.storeName}
        isMultiple={freezeTarget.isMultiple}
        storeCount={freezeTarget.storeCount}
        selectedStores={freezeTarget.selectedStores}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) {
            setSelectedStores([]);
          }
        }}
        storeName={deleteTarget.storeName}
        isMultiple={deleteTarget.isMultiple}
        storeCount={deleteTarget.storeCount}
        selectedStores={deleteTarget.selectedStores}
      />
    </div>
  );
}
