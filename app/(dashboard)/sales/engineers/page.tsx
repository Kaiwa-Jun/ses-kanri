'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  CalendarClock,
  Briefcase,
  Plus,
  CreditCard,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockEngineers, Engineer } from '@/lib/data';
import { AddEngineerModal } from '@/components/engineers/add-engineer-modal';

export default function EngineersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'experience' | 'rate' | 'name'>('experience');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  const filteredEngineers = mockEngineers.filter((engineer) => {
    const matchesSearch =
      engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.skills.some((skill) => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAvailability =
      !filterAvailability ||
      filterAvailability === 'all' ||
      engineer.availability === filterAvailability;

    return matchesSearch && matchesAvailability;
  });

  const sortedEngineers = [...filteredEngineers].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'experience':
        aValue = a.totalExperience;
        bValue = b.totalExperience;
        break;
      case 'rate':
        aValue = a.preferredRate;
        bValue = b.preferredRate;
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      default:
        aValue = a.totalExperience;
        bValue = b.totalExperience;
    }

    if (sortOrder === 'desc') {
      return typeof aValue === 'string' && typeof bValue === 'string'
        ? bValue.localeCompare(aValue)
        : (bValue as number) - (aValue as number);
    } else {
      return typeof aValue === 'string' && typeof bValue === 'string'
        ? aValue.localeCompare(bValue)
        : (aValue as number) - (bValue as number);
    }
  });

  const getAvailabilityColor = (availability: Engineer['availability']) => {
    switch (availability) {
      case 'available':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'partially':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'unavailable':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return '';
    }
  };

  const getAvailabilityText = (availability: Engineer['availability']) => {
    switch (availability) {
      case 'available':
        return '稼働可能';
      case 'partially':
        return '一部稼働可能';
      case 'unavailable':
        return '稼働不可';
      default:
        return availability;
    }
  };

  const getWorkStyleText = (workStyle: Engineer['preferredWorkStyle']) => {
    switch (workStyle) {
      case 'remote':
        return 'リモート';
      case 'onsite':
        return '常駐';
      case 'hybrid':
        return 'ハイブリッド';
      default:
        return workStyle;
    }
  };

  const handleAddEngineer = (data: any) => {
    console.log('New engineer data:', data);
    // 実際のアプリケーションではここでAPIを呼び出してエンジニアを追加
    setIsAddModalOpen(false);
  };

  const handleSort = (field: 'experience' | 'rate' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleRowClick = (engineerId: string) => {
    router.push(`/sales/engineers/${engineerId}`);
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-none">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">エンジニア一覧</h1>
            <p className="text-muted-foreground">
              所属エンジニアの情報一覧（{sortedEngineers.length}名）
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            エンジニアを追加
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="名前、スキルで検索..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterAvailability}
          onValueChange={(value) => setFilterAvailability(value || undefined)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="稼働状況" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全ての稼働状況</SelectItem>
            <SelectItem value="available">稼働可能</SelectItem>
            <SelectItem value="partially">一部稼働可能</SelectItem>
            <SelectItem value="unavailable">稼働不可</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>エンジニア</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('experience')}
                  >
                    経験年数
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>稼働状況</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('rate')}
                  >
                    希望単価
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>勤務形態</TableHead>
                <TableHead>稼働開始日</TableHead>
                <TableHead>主要スキル</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEngineers.map((engineer, index) => (
                <motion.tr
                  key={engineer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(engineer.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={engineer.imageUrl} />
                        <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{engineer.name}</p>
                        <p className="text-sm text-muted-foreground">{engineer.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{engineer.totalExperience}年</span>
                      {engineer.totalExperience >= 5 && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getAvailabilityColor(engineer.availability)}`}
                    >
                      {getAvailabilityText(engineer.availability)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{engineer.preferredRate}万円</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{getWorkStyleText(engineer.preferredWorkStyle)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{engineer.availableFrom || '未定'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {engineer.skills
                        .sort((a, b) => b.level - a.level)
                        .slice(0, 3)
                        .map((skill) => (
                          <Badge key={skill.name} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                      {engineer.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{engineer.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {sortedEngineers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterAvailability
                  ? '検索条件に一致するエンジニアがありません'
                  : 'エンジニアが登録されていません'}
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>エンジニアを追加する</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddEngineerModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddEngineer}
      />
    </div>
  );
}
