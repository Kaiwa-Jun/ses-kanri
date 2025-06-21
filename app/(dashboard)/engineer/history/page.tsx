'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Search,
  PlusCircle,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { mockEngineers } from '@/lib/data';
import { AddProjectModal } from '@/components/projects/add-project-modal';

export default function EngineerHistoryPage() {
  // モックデータからエンジニア情報を取得（実際はログインユーザー）
  const engineer = mockEngineers[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    // 現在のアサイン案件を追加
    {
      id: 'current',
      name: '大手ECサイトリニューアル案件',
      role: 'フロントエンドリード',
      description: '営業によってアサインが確定、もしくは契約が確定されたら、この画面に追加される',
      startDate: '2025-04-01',
      endDate: null,
      skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
      responsibilities: 'アーキテクチャ設計\nパフォーマンス最適化\nコンポーネント設計',
    },
    ...engineer.projects,
  ]);

  // 検索フィルター
  const filteredProjects = projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddProject = (projectData: any) => {
    const newProject = {
      id: `ep${projects.length + 1}`,
      ...projectData,
    };
    setProjects([newProject, ...projects]);
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
          <h1 className="text-3xl font-bold tracking-tight">案件履歴</h1>
          <p className="text-muted-foreground">これまでに参加した案件の履歴</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          案件を追加
        </Button>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="案件名、役割、スキルで検索..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>案件履歴</CardTitle>
          <CardDescription>これまでに参加したプロジェクトの一覧</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative pl-8 border-l border-muted pb-8 last:pb-0"
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 bg-background p-1">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                      <p className="text-muted-foreground">{project.role}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {project.startDate} 〜 {project.endDate || '現在'}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">プロジェクト概要</h4>
                      <p
                        className={`text-sm ${project.id === 'current' ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">使用技術</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">担当業務</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {(project.responsibilities || '').split('\n').map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? '検索条件に一致する案件がありません'
                  : 'まだ案件履歴が登録されていません'}
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>案件を追加する</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddProjectModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddProject}
      />
    </div>
  );
}
