'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Search,
  Filter,
  Calendar,
  Users,
  Plus,
  FileText,
  Mail,
  Phone,
  Star,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockClients } from '@/lib/data';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'rating' | 'projects' | 'name'>('rating');
  const router = useRouter();

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.preferredSkills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = !filterStatus || filterStatus === 'all' || client.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'projects':
        aValue = a.totalProjects;
        bValue = b.totalProjects;
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      default:
        aValue = a.rating;
        bValue = b.rating;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'negotiating':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'inactive':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '取引中';
      case 'negotiating':
        return '商談中';
      case 'inactive':
        return '取引停止';
      default:
        return status;
    }
  };

  const handleSort = (field: 'rating' | 'projects' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleRowClick = (clientId: string) => {
    router.push(`/sales/clients/${clientId}`);
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
          <h1 className="text-3xl font-bold tracking-tight">クライアント一覧</h1>
          <p className="text-muted-foreground">取引先企業の管理（{sortedClients.length}社）</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          新規クライアント登録
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="企業名、業種、スキルで検索..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value || undefined)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="ステータス" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全てのステータス</SelectItem>
            <SelectItem value="active">取引中</SelectItem>
            <SelectItem value="negotiating">商談中</SelectItem>
            <SelectItem value="inactive">取引停止</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>企業情報</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('rating')}
                  >
                    評価
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('projects')}
                  >
                    案件数
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>次回接触</TableHead>
                <TableHead>求められるスキル</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(client.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.industry}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={client.contacts[0].imageUrl} />
                        <AvatarFallback>{client.contacts[0].name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{client.contacts[0].name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.contacts[0].position}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(client.status)}>
                      {getStatusText(client.status)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(client.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{client.rating}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{client.activeProjects}</span>
                      <span className="text-muted-foreground">/ {client.totalProjects}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.nextContact}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {client.preferredSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {client.preferredSkills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{client.preferredSkills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {sortedClients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus
                  ? '検索条件に一致するクライアントがありません'
                  : 'クライアントが登録されていません'}
              </p>
              <Button>新規クライアントを登録する</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
