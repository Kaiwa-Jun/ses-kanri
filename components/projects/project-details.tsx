'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  CreditCard,
  Briefcase,
  Calendar,
  ChevronLeft,
  UserCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Edit2,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockClients } from '@/lib/data';

export function ProjectDetails({
  project: initialProject,
  matchingEngineers,
}: {
  project: any;
  matchingEngineers: any[];
}) {
  const [project, setProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>([]);
  const [assignedEngineers, setAssignedEngineers] = useState<any[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'in_progress':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'negotiating':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'closed':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
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

  const getWorkStyleText = (workStyle: string) => {
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

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const handleAssign = () => {
    const engineersToAssign = matchingEngineers.filter(({ engineer }) =>
      selectedEngineers.includes(engineer.id)
    );

    setAssignedEngineers([...assignedEngineers, ...engineersToAssign]);
    setSelectedEngineers([]);
  };

  const handleUnassign = (engineerId: string) => {
    setAssignedEngineers(assignedEngineers.filter(({ engineer }) => engineer.id !== engineerId));
  };

  const toggleEngineer = (engineerId: string) => {
    if (selectedEngineers.includes(engineerId)) {
      setSelectedEngineers(selectedEngineers.filter((id) => id !== engineerId));
    } else {
      setSelectedEngineers([...selectedEngineers, engineerId]);
    }
  };

  const handleSave = () => {
    // 実際のアプリではここでAPIを呼び出して保存
    setIsEditing(false);
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/sales/projects">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            案件一覧に戻る
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-2 mb-2">
                  {isEditing ? (
                    <Select
                      value={project.status}
                      onValueChange={(value) => setProject({ ...project, status: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">募集中</SelectItem>
                        <SelectItem value="in_progress">進行中</SelectItem>
                        <SelectItem value="negotiating">交渉中</SelectItem>
                        <SelectItem value="closed">終了</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className={`${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </Button>
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={project.title}
                    onChange={(e) => setProject({ ...project, title: e.target.value })}
                    className="text-2xl font-bold"
                  />
                  <Select
                    value={project.client}
                    onValueChange={(value) => setProject({ ...project, client: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.name}>
                          {client.name}
                        </SelectItem>
                      ))}
                      {/* 現在のクライアント名がmockClientsに存在しない場合の対応 */}
                      {!mockClients.some((client) => client.name === project.client) &&
                        project.client && (
                          <SelectItem key="current" value={project.client}>
                            {project.client}
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <p className="text-muted-foreground">{project.client}</p>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    単価（下限）
                  </p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={project.minRate}
                      onChange={(e) =>
                        setProject({ ...project, minRate: parseInt(e.target.value) })
                      }
                      className="font-medium"
                      placeholder="800000"
                    />
                  ) : (
                    <p className="font-medium">{project.minRate.toLocaleString()}円</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    単価（上限）
                  </p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={project.maxRate}
                      onChange={(e) =>
                        setProject({ ...project, maxRate: parseInt(e.target.value) })
                      }
                      className="font-medium"
                      placeholder="1000000"
                    />
                  ) : (
                    <p className="font-medium">{project.maxRate.toLocaleString()}円</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    期間
                  </p>
                  {isEditing ? (
                    <Input
                      value={project.period}
                      onChange={(e) => setProject({ ...project, period: e.target.value })}
                      className="font-medium"
                    />
                  ) : (
                    <p className="font-medium">{project.period}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    勤務形態
                  </p>
                  {isEditing ? (
                    <Select
                      value={project.workStyle}
                      onValueChange={(value) => setProject({ ...project, workStyle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">リモート</SelectItem>
                        <SelectItem value="onsite">常駐</SelectItem>
                        <SelectItem value="hybrid">ハイブリッド</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{getWorkStyleText(project.workStyle)}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    勤務地
                  </p>
                  {isEditing ? (
                    <Input
                      value={project.location || ''}
                      onChange={(e) => setProject({ ...project, location: e.target.value })}
                      className="font-medium"
                      placeholder="未定"
                    />
                  ) : (
                    <p className="font-medium">{project.location || '未定'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    開始日
                  </p>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={project.startDate}
                      onChange={(e) => setProject({ ...project, startDate: e.target.value })}
                      className="font-medium"
                    />
                  ) : (
                    <p className="font-medium">{project.startDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    終了予定日
                  </p>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={project.endDate}
                      onChange={(e) => setProject({ ...project, endDate: e.target.value })}
                      className="font-medium"
                    />
                  ) : (
                    <p className="font-medium">{project.endDate}</p>
                  )}
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">必要スキル</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="gap-1">
                          {skill}
                          <button
                            onClick={() =>
                              setProject({
                                ...project,
                                skills: project.skills.filter((s: string) => s !== skill),
                              })
                            }
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="新しいスキルを入力"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value && !project.skills.includes(value)) {
                              setProject({
                                ...project,
                                skills: [...project.skills, value],
                              });
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Enterキーを押してスキルを追加</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">案件詳細</h3>
                {isEditing ? (
                  <Textarea
                    value={project.description}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    rows={5}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {project.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {assignedEngineers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  提案予定エンジニア
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedEngineers.map(({ engineer, score }) => (
                  <div
                    key={engineer.id}
                    className="flex items-center justify-between gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={engineer.imageUrl} />
                        <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{engineer.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getMatchColor(score)}>
                            マッチ度 {score}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/sales/engineers/${engineer.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          詳細
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnassign(engineer.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  マッチするエンジニア
                </CardTitle>
                <Button
                  size="sm"
                  onClick={handleAssign}
                  disabled={selectedEngineers.length === 0 || project.status === 'closed'}
                >
                  提案予定に追加
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <TooltipProvider>
                {matchingEngineers
                  .filter(
                    ({ engineer }) =>
                      !assignedEngineers.some((assigned) => assigned.engineer.id === engineer.id)
                  )
                  .map(({ engineer, score }, index) => (
                    <motion.div
                      key={engineer.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <div
                        className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        onClick={() => toggleEngineer(engineer.id)}
                      >
                        <Checkbox
                          checked={selectedEngineers.includes(engineer.id)}
                          onCheckedChange={() => toggleEngineer(engineer.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarImage src={engineer.imageUrl} />
                            <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate">{engineer.name}</p>
                              <p className={`text-sm font-semibold ${getMatchColor(score)}`}>
                                {score}%
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Progress value={score} className="h-1.5" />
                                  </TooltipTrigger>
                                  <TooltipContent>マッチ度: {score}%</TooltipContent>
                                </Tooltip>
                              </div>
                              <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {engineer.totalExperience}年
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {engineer.skills.slice(0, 3).map((skill: any) => (
                                <Badge key={skill.name} variant="outline" className="text-xs py-0">
                                  {skill.name}
                                </Badge>
                              ))}
                              {engineer.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs py-0">
                                  +{engineer.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link href={`/sales/engineers/${engineer.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            詳細
                          </Link>
                        </Button>
                      </div>
                      {index < matchingEngineers.length - 1 && <Separator className="my-2" />}
                    </motion.div>
                  ))}
              </TooltipProvider>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
