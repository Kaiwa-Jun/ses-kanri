'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Printer, X } from 'lucide-react';
import { type Engineer } from '@/lib/data';

interface EngineerSkillSheetProps {
  engineer: Engineer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 責任範囲を配列として取得する関数
const getResponsibilities = (responsibilities: string[] | string): string[] => {
  if (Array.isArray(responsibilities)) {
    return responsibilities;
  }
  // 文字列の場合は改行で分割して配列に変換
  return responsibilities.split('\n').filter(Boolean);
};

export function EngineerSkillSheet({ engineer, open, onOpenChange }: EngineerSkillSheetProps) {
  const skillCategoryNames: Record<string, string> = {
    language: 'プログラミング言語',
    framework: 'フレームワーク',
    database: 'データベース',
    infrastructure: 'インフラ・クラウド',
    tool: 'ツール',
    other: 'その他',
  };

  // スキルをカテゴリーでグループ化
  const skillsByCategory = engineer.skills.reduce(
    (acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, typeof engineer.skills>
  );

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between print:hidden">
          <DialogTitle>スキルシート</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              印刷
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF保存
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8 print:text-black">
          {/* ヘッダー */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">スキルシート</h1>
            <p className="text-muted-foreground">
              作成日: {new Date().toLocaleDateString('ja-JP')}
            </p>
          </div>

          {/* 基本情報 */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">基本情報</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">氏名</p>
                <p className="font-medium">{engineer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">経験年数</p>
                <p className="font-medium">{engineer.totalExperience}年</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">希望単価</p>
                <p className="font-medium">{engineer.preferredRate}万円</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">希望勤務形態</p>
                <p className="font-medium">{getWorkStyleText(engineer.preferredWorkStyle)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">稼働開始可能日</p>
                <p className="font-medium">{engineer.availableFrom || '応相談'}</p>
              </div>
            </div>
          </div>

          {/* スキル一覧 */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">スキル一覧</h2>

            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="font-semibold mb-2">{skillCategoryNames[category] || category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skills
                      .sort((a, b) => b.level - a.level)
                      .map((skill) => (
                        <div key={skill.name} className="flex items-center gap-3">
                          <div className="w-32">
                            <p className="font-medium">{skill.name}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                {skill.experienceYears}年
                              </span>
                              <Progress value={skill.level * 20} className="h-1.5 w-16" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 案件履歴 */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">案件履歴</h2>

            <div className="space-y-8">
              {engineer.projects.map((project, index) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(project.startDate)} 〜{' '}
                      {project.endDate ? formatDate(project.endDate) : '現在'}
                    </p>
                  </div>

                  <p className="text-sm">
                    <span className="font-medium">役割:</span> {project.role}
                  </p>

                  <div>
                    <p className="text-sm font-medium mb-1">使用技術:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm">{project.description}</p>

                  <div>
                    <p className="text-sm font-medium mb-1">担当業務:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {getResponsibilities(project.responsibilities).map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  {index < engineer.projects.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
