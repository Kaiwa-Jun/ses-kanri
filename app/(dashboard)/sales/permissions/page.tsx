'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Building2,
  Search,
  Save,
  Plus,
  Edit2,
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EditPermissionModal } from '@/components/permissions/edit-permission-modal';

// モックデータ
const mockTeams = [
  { id: 't1', name: '第一営業部' },
  { id: 't2', name: '第二営業部' },
];

// モックデータ
const mockPermissions = {
  teams: [
    {
      id: 't1',
      name: '第一営業部',
      permissions: {
        engineers: 'all',
        projects: 'all',
        clients: 'all',
        revenue: 'team',
        edit: true,
      },
    },
    {
      id: 't2',
      name: '第二営業部',
      permissions: {
        engineers: 'team',
        projects: 'team',
        clients: 'team',
        revenue: 'team',
        edit: true,
      },
    },
  ],
  individuals: [
    {
      id: 's1',
      name: '鈴木健太',
      role: '部長',
      teamId: 't1',
      teamName: '第一営業部',
      imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      permissions: {
        engineers: 'all',
        projects: 'all',
        clients: 'all',
        revenue: 'all',
        edit: true,
      },
      template: 'manager',
    },
    {
      id: 's2',
      name: '田中美咲',
      role: '主任',
      teamId: 't1',
      teamName: '第一営業部',
      imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      permissions: {
        engineers: 'team',
        projects: 'team',
        clients: 'team',
        revenue: 'team',
        edit: true,
      },
      template: 'leader',
    },
    {
      id: 's3',
      name: '高橋誠',
      role: '一般',
      teamId: 't1',
      teamName: '第一営業部',
      imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      permissions: {
        engineers: 'own',
        projects: 'own',
        clients: 'own',
        revenue: 'own',
        edit: false,
      },
      template: 'member',
    },
    {
      id: 's4',
      name: '佐藤一郎',
      role: '部長',
      teamId: 't2',
      teamName: '第二営業部',
      imageUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
      permissions: {
        engineers: 'all',
        projects: 'all',
        clients: 'all',
        revenue: 'all',
        edit: true,
      },
      template: 'manager',
    },
    {
      id: 's5',
      name: '山田花子',
      role: '主任',
      teamId: 't2',
      teamName: '第二営業部',
      imageUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      permissions: {
        engineers: 'team',
        projects: 'team',
        clients: 'team',
        revenue: 'team',
        edit: true,
      },
      template: 'leader',
    },
  ],
};

// 権限テンプレート
const permissionTemplates = [
  {
    id: 'manager',
    name: 'マネージャー',
    permissions: {
      engineers: 'all',
      projects: 'all',
      clients: 'all',
      revenue: 'all',
      edit: true,
    },
  },
  {
    id: 'leader',
    name: 'リーダー',
    permissions: {
      engineers: 'team',
      projects: 'team',
      clients: 'team',
      revenue: 'team',
      edit: true,
    },
  },
  {
    id: 'member',
    name: '一般メンバー',
    permissions: {
      engineers: 'own',
      projects: 'own',
      clients: 'own',
      revenue: 'own',
      edit: false,
    },
  },
];

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);
  const [selectedMember, setSelectedMember] = useState<string | undefined>(undefined);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [permissions, setPermissions] = useState(mockPermissions);

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'all':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30';
      case 'team':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
      case 'own':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30';
      case 'none':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30';
      default:
        return '';
    }
  };

  const getPermissionText = (level: string) => {
    switch (level) {
      case 'all':
        return '全体';
      case 'team':
        return 'チーム内';
      case 'own':
        return '担当のみ';
      case 'none':
        return '非表示';
      default:
        return level;
    }
  };

  const getPermissionIcon = (level: string) => {
    switch (level) {
      case 'all':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'own':
        return <AlertCircle className="h-4 w-4" />;
      case 'none':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleEditClick = (member: any) => {
    setEditingMember(member);
    setEditModalOpen(true);
  };

  const handleSavePermissions = (memberId: string, newPermissions: any) => {
    setPermissions((prev) => ({
      ...prev,
      individuals: prev.individuals.map((member) =>
        member.id === memberId ? { ...member, permissions: newPermissions } : member
      ),
    }));
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
          <h1 className="text-3xl font-bold tracking-tight">営業権限管理</h1>
          <p className="text-muted-foreground">営業メンバーの閲覧・編集権限を管理</p>
        </div>
      </motion.div>

      <Tabs defaultValue="individual">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="individual">個人単位</TabsTrigger>
          <TabsTrigger value="team">チーム単位</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>個人権限設定</CardTitle>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="名前で検索..."
                      className="pl-10 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="チームで絞り込み" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全てのチーム</SelectItem>
                      {mockTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>営業担当者</TableHead>
                    <TableHead>エンジニア情報</TableHead>
                    <TableHead>案件情報</TableHead>
                    <TableHead>企業情報</TableHead>
                    <TableHead>売上情報</TableHead>
                    <TableHead>編集権限</TableHead>
                    <TableHead>テンプレート</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.individuals.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.imageUrl} />
                            <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.teamName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(member.permissions.engineers)}
                        >
                          {getPermissionIcon(member.permissions.engineers)}
                          {getPermissionText(member.permissions.engineers)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(member.permissions.projects)}
                        >
                          {getPermissionIcon(member.permissions.projects)}
                          {getPermissionText(member.permissions.projects)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(member.permissions.clients)}
                        >
                          {getPermissionIcon(member.permissions.clients)}
                          {getPermissionText(member.permissions.clients)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(member.permissions.revenue)}
                        >
                          {getPermissionIcon(member.permissions.revenue)}
                          {getPermissionText(member.permissions.revenue)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={member.permissions.edit} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {permissionTemplates.find((t) => t.id === member.template)?.name ||
                            'カスタム'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(member)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          編集
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>権限テンプレート</CardTitle>
              <CardDescription>よく使う権限設定をテンプレートとして保存</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {permissionTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">エンジニア情報</span>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(template.permissions.engineers)}
                        >
                          {getPermissionText(template.permissions.engineers)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">案件情報</span>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(template.permissions.projects)}
                        >
                          {getPermissionText(template.permissions.projects)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">企業情報</span>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(template.permissions.clients)}
                        >
                          {getPermissionText(template.permissions.clients)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">売上情報</span>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(template.permissions.revenue)}
                        >
                          {getPermissionText(template.permissions.revenue)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">編集権限</span>
                        <Checkbox checked={template.permissions.edit} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>チーム権限設定</CardTitle>
              <CardDescription>チーム単位でデフォルトの権限を設定</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>チーム</TableHead>
                    <TableHead>エンジニア情報</TableHead>
                    <TableHead>案件情報</TableHead>
                    <TableHead>企業情報</TableHead>
                    <TableHead>売上情報</TableHead>
                    <TableHead>編集権限</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(team.permissions.engineers)}
                        >
                          {getPermissionIcon(team.permissions.engineers)}
                          {getPermissionText(team.permissions.engineers)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(team.permissions.projects)}
                        >
                          {getPermissionIcon(team.permissions.projects)}
                          {getPermissionText(team.permissions.projects)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(team.permissions.clients)}
                        >
                          {getPermissionIcon(team.permissions.clients)}
                          {getPermissionText(team.permissions.clients)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPermissionColor(team.permissions.revenue)}
                        >
                          {getPermissionIcon(team.permissions.revenue)}
                          {getPermissionText(team.permissions.revenue)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={team.permissions.edit} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4 mr-2" />
                          編集
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editingMember && (
        <EditPermissionModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          member={editingMember}
          onSave={handleSavePermissions}
        />
      )}
    </div>
  );
}
