'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  CreditCard,
  Briefcase,
  ArrowUpDown,
  Building2,
  Calendar,
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
import { mockProjects, Project } from '@/lib/data';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<'title' | 'client' | 'rate' | 'startDate'>(
    'startDate'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filterStatus || filterStatus === 'all' || project.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'client':
        aValue = a.client;
        bValue = b.client;
        break;
      case 'rate':
        aValue = a.rate;
        bValue = b.rate;
        break;
      case 'startDate':
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
        break;
      default:
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
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

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'open':
        return 'text-green-500 bg-green-100';
      case 'in_progress':
        return 'text-blue-500 bg-blue-100';
      case 'negotiating':
        return 'text-yellow-500 bg-yellow-100';
      case 'closed':
        return 'text-gray-500 bg-gray-100';
      default:
        return '';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'open':
        return '募集中';
      case 'in_progress':
        return '進行中';
      case 'negotiating':
        return '交渉中';
      case 'closed':
        return '終了';
      default:
        return status;
    }
  };

  const getWorkStyleText = (workStyle: Project['workStyle']) => {
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

  const handleSort = (field: 'title' | 'client' | 'rate' | 'startDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleRowClick = (projectId: string) => {
    router.push(`/sales/projects/${projectId}`);
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
          <h1 className="text-3xl font-bold tracking-tight">案件一覧</h1>
          <p className="text-muted-foreground">
            全ての案件を管理・閲覧できます（{sortedProjects.length}件）
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          新規案件登録
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="案件名、スキル、クライアント名で検索..."
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
            <SelectItem value="open">募集中</SelectItem>
            <SelectItem value="in_progress">進行中</SelectItem>
            <SelectItem value="negotiating">交渉中</SelectItem>
            <SelectItem value="closed">終了</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('title')}
                  >
                    案件名
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('client')}
                  >
                    クライアント
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">ステータス</TableHead>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('rate')}
                  >
                    単価
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[250px]">期間・勤務形態</TableHead>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('startDate')}
                  >
                    開始日
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[200px]">必要スキル</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.map((project, index) => (
                <TableRow
                  key={project.id}
                  className="group hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(project.id)}
                >
                  <TableCell className="w-[300px]">
                    <p className="font-medium line-clamp-2">{project.title}</p>
                  </TableCell>

                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium truncate">{project.client}</span>
                    </div>
                  </TableCell>

                  <TableCell className="w-[100px]">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(project.status)} whitespace-nowrap`}
                    >
                      {getStatusText(project.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-[120px]">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium">{project.rate}万円</span>
                    </div>
                  </TableCell>

                  <TableCell className="w-[250px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{project.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{getWorkStyleText(project.workStyle)}</span>
                        {project.location && (
                          <>
                            <span className="text-muted-foreground mx-1">•</span>
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{project.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="w-[120px]">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{project.startDate}</span>
                    </div>
                  </TableCell>

                  <TableCell className="w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {project.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs whitespace-nowrap"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {project.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          +{project.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sortedProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus
                  ? '検索条件に一致する案件がありません'
                  : '案件が登録されていません'}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>新規案件を登録する</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
}
