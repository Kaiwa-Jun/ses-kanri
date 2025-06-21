'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Download,
  User,
  CreditCard,
  Briefcase,
  BarChart2,
  Award,
  GraduationCap,
  Layers,
  CalendarClock,
  FileText,
  Building2,
  Users,
  Star,
  MessageSquare,
  Edit2,
  Save,
  CheckCircle,
  Clock,
  Target,
  Zap,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Engineer, Skill } from '@/lib/data';
import { EngineerSkillSheet } from '@/components/engineers/engineer-skill-sheet';

interface EngineerProfileProps {
  engineer: Engineer;
}

export function EngineerProfile({ engineer: initialEngineer }: EngineerProfileProps) {
  const [engineer, setEngineer] = useState(initialEngineer);
  const [isSkillSheetOpen, setIsSkillSheetOpen] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [memo, setMemo] = useState(
    '非常に優秀なエンジニアです。技術力が高く、コミュニケーション能力も優れています。クライアントからの評価も高く、次回も指名で依頼したいとのことでした。'
  );

  // 新しいスキル追加用の状態
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'language' as Skill['category'],
    experienceYears: 1,
  });

  // 現在の案件情報の状態
  const [currentProject, setCurrentProject] = useState({
    client: '〇〇商事株式会社',
    projectName: '大手ECサイトリニューアル案件',
    salesPerson: '鈴木健太',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    status: '進行中',
  });

  // 工程・ポジション情報の状態
  const [participationPhases, setParticipationPhases] = useState([
    { name: '要件定義', participated: true },
    { name: '設計', participated: true },
    { name: '開発', participated: true },
    { name: 'テスト', participated: true },
  ]);

  const [positionExperience, setPositionExperience] = useState([
    { name: 'PM', experience: false },
    { name: 'PL', experience: true },
    { name: 'メンバー', experience: true },
  ]);

  const getAvailabilityColor = (availability: Engineer['availability']) => {
    switch (availability) {
      case 'available':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
      case 'unavailable':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      default:
        return '';
    }
  };

  const getAvailabilityText = (availability: Engineer['availability']) => {
    switch (availability) {
      case 'available':
        return '空き';
      case 'unavailable':
        return '稼働中';
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

  const skillCategoryNames: Record<string, string> = {
    language: '言語',
    framework: 'FW',
    database: 'DB',
    infrastructure: 'インフラ',
    tool: 'ツール',
    other: 'その他',
  };

  // 職務経歴書エクスポート関数
  const handleExportResume = (format: 'word' | 'excel' | 'pdf') => {
    console.log(`Exporting resume in ${format} format for ${engineer.name}`);
    const fileName = `${engineer.name}_職務経歴書.${format === 'word' ? 'docx' : format === 'excel' ? 'xlsx' : 'pdf'}`;
    alert(`${fileName} をダウンロードします`);
  };

  const handleSaveMemo = () => {
    setIsEditingMemo(false);
    console.log('Saving memo:', memo);
  };

  const handleSaveBasicInfo = () => {
    setIsEditingBasicInfo(false);
    console.log('Saving engineer data:', engineer);
  };

  const handleCancelBasicInfo = () => {
    setIsEditingBasicInfo(false);
    setEngineer(initialEngineer);
  };

  const handleSaveProject = () => {
    setIsEditingProject(false);
    console.log('Saving project data:', currentProject);
  };

  const handleCancelProject = () => {
    setIsEditingProject(false);
    setCurrentProject({
      client: '〇〇商事株式会社',
      projectName: '大手ECサイトリニューアル案件',
      salesPerson: '鈴木健太',
      startDate: '2024-04-01',
      endDate: '2024-09-30',
      status: '進行中',
    });
  };

  const handleSaveSkills = () => {
    setIsEditingSkills(false);
    console.log('Saving skills:', engineer.skills);
  };

  const handleCancelSkills = () => {
    setIsEditingSkills(false);
    setEngineer(initialEngineer);
  };

  const togglePhaseParticipation = (phaseName: string) => {
    setParticipationPhases((prev) =>
      prev.map((phase) =>
        phase.name === phaseName ? { ...phase, participated: !phase.participated } : phase
      )
    );
  };

  const togglePositionExperience = (positionName: string) => {
    setPositionExperience((prev) =>
      prev.map((position) =>
        position.name === positionName
          ? { ...position, experience: !position.experience }
          : position
      )
    );
  };

  // スキル編集関連の関数
  const addSkill = () => {
    if (newSkill.name.trim()) {
      const updatedSkills = [
        ...engineer.skills,
        {
          ...newSkill,
          level: 3 as Skill['level'], // デフォルト値として3を設定（表示はしない）
        },
      ];
      setEngineer({ ...engineer, skills: updatedSkills });
      setNewSkill({
        name: '',
        category: 'language',
        experienceYears: 1,
      });
    }
  };

  const removeSkill = (skillName: string) => {
    const updatedSkills = engineer.skills.filter((skill) => skill.name !== skillName);
    setEngineer({ ...engineer, skills: updatedSkills });
  };

  const updateSkill = (skillName: string, field: keyof Skill, value: any) => {
    const updatedSkills = engineer.skills.map((skill) =>
      skill.name === skillName ? { ...skill, [field]: value } : skill
    );
    setEngineer({ ...engineer, skills: updatedSkills });
  };

  return (
    <div className="container py-4 max-w-7xl">
      <div className="mb-4">
        <Link href="/sales/engineers">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            エンジニア一覧に戻る
          </Button>
        </Link>
      </div>

      {/* メインコンテナ - 罫線ベースのレイアウト */}
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        {/* ヘッダー部分 */}
        <div className="border-b border-border bg-muted/30 p-4">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-bold">エンジニア詳細</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isEditingBasicInfo ? handleSaveBasicInfo() : setIsEditingBasicInfo(true)
              }
              className="gap-2"
            >
              {isEditingBasicInfo ? (
                <>
                  <Save className="h-4 w-4" />
                  保存
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  編集
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* プロフィール */}
            <div className="col-span-2 flex flex-col items-center">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={engineer.imageUrl} />
                <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {isEditingBasicInfo ? (
                <Input
                  value={engineer.name}
                  onChange={(e) => setEngineer({ ...engineer, name: e.target.value })}
                  className="text-center text-lg font-bold mb-1"
                />
              ) : (
                <h2 className="text-lg font-bold text-center">{engineer.name}</h2>
              )}
              {isEditingBasicInfo ? (
                <Input
                  type="number"
                  value={engineer.totalExperience}
                  onChange={(e) =>
                    setEngineer({ ...engineer, totalExperience: parseInt(e.target.value) || 0 })
                  }
                  className="text-center text-sm w-20"
                  placeholder="年数"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{engineer.totalExperience}年経験</p>
              )}
              {isEditingBasicInfo ? (
                <Select
                  value={engineer.availability}
                  onValueChange={(value: Engineer['availability']) =>
                    setEngineer({ ...engineer, availability: value })
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">空き</SelectItem>
                    <SelectItem value="unavailable">稼働中</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant="outline"
                  className={`${getAvailabilityColor(engineer.availability)} text-xs mt-1`}
                >
                  {getAvailabilityText(engineer.availability)}
                </Badge>
              )}
            </div>

            {/* 基本情報 */}
            <div className="col-span-3 border-l border-border pl-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                基本情報
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {isEditingBasicInfo ? (
                    <Input
                      type="email"
                      value={engineer.email}
                      onChange={(e) => setEngineer({ ...engineer, email: e.target.value })}
                      className="h-6 text-sm"
                    />
                  ) : (
                    <span>{engineer.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {isEditingBasicInfo ? (
                    <Input
                      value={engineer.phone}
                      onChange={(e) => setEngineer({ ...engineer, phone: e.target.value })}
                      className="h-6 text-sm"
                    />
                  ) : (
                    <span>{engineer.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-3 w-3 text-muted-foreground" />
                  {isEditingBasicInfo ? (
                    <Input
                      type="date"
                      value={engineer.availableFrom || ''}
                      onChange={(e) => setEngineer({ ...engineer, availableFrom: e.target.value })}
                      className="h-6 text-sm"
                    />
                  ) : (
                    <span>{engineer.availableFrom || '応相談'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3 text-muted-foreground" />
                  {isEditingBasicInfo ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={engineer.preferredRate}
                        onChange={(e) =>
                          setEngineer({ ...engineer, preferredRate: parseInt(e.target.value) || 0 })
                        }
                        className="h-6 text-sm w-20"
                      />
                      <span className="text-xs">万円</span>
                    </div>
                  ) : (
                    <span className="font-medium">{engineer.preferredRate}万円</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {isEditingBasicInfo ? (
                    <Select
                      value={engineer.preferredWorkStyle}
                      onValueChange={(value: Engineer['preferredWorkStyle']) =>
                        setEngineer({ ...engineer, preferredWorkStyle: value })
                      }
                    >
                      <SelectTrigger className="h-6 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">リモート</SelectItem>
                        <SelectItem value="onsite">常駐</SelectItem>
                        <SelectItem value="hybrid">ハイブリッド</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{getWorkStyleText(engineer.preferredWorkStyle)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 工程・ポジション */}
            <div className="col-span-3 border-l border-border pl-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  工程・ポジション
                </h3>
                {isEditingBasicInfo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      console.log('Saving phases and positions:', {
                        participationPhases,
                        positionExperience,
                      });
                    }}
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium mb-2">参加工程</p>
                  <div className="grid grid-cols-2 gap-1">
                    {participationPhases.map((phase) => (
                      <div
                        key={phase.name}
                        className={`flex items-center gap-1 ${isEditingBasicInfo ? 'cursor-pointer' : ''}`}
                        onClick={() => isEditingBasicInfo && togglePhaseParticipation(phase.name)}
                      >
                        {phase.participated ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                        )}
                        <span
                          className={`text-xs ${phase.participated ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {phase.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium mb-2">ポジション</p>
                  <div className="flex gap-1">
                    {positionExperience.map((position) => (
                      <Badge
                        key={position.name}
                        variant={position.experience ? 'default' : 'outline'}
                        className={`text-xs px-2 py-0 ${isEditingBasicInfo ? 'cursor-pointer' : ''}`}
                        onClick={() =>
                          isEditingBasicInfo && togglePositionExperience(position.name)
                        }
                      >
                        {position.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 現在の案件 - editアイコンを削除 */}
            <div className="col-span-3 border-l border-border pl-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                現在の案件
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">{currentProject.client}</p>
                  <p className="text-muted-foreground text-xs">{currentProject.projectName}</p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>担当営業: {currentProject.salesPerson}</p>
                  <p>
                    期間: {currentProject.startDate} ~ {currentProject.endDate}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 text-xs"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {currentProject.status}
                </Badge>
              </div>
            </div>

            {/* 職務経歴書 */}
            <div className="col-span-1 border-l border-border pl-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                職務経歴書
              </h3>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => handleExportResume('pdf')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => handleExportResume('word')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Word
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => handleExportResume('excel')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ部分 */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* スキル情報 */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  スキル情報
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isEditingSkills ? handleSaveSkills() : setIsEditingSkills(true))}
                  className="gap-2"
                >
                  {isEditingSkills ? (
                    <>
                      <Save className="h-4 w-4" />
                      保存
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      編集
                    </>
                  )}
                </Button>
              </div>

              {/* 新しいスキル追加フォーム（編集モード時のみ表示） */}
              {isEditingSkills && (
                <div className="mb-6 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5">
                  <h4 className="text-sm font-semibold mb-3">新しいスキルを追加</h4>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Input
                      placeholder="スキル名"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="h-8 text-sm"
                    />
                    <Select
                      value={newSkill.category}
                      onValueChange={(value: Skill['category']) =>
                        setNewSkill({ ...newSkill, category: value })
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="language">言語</SelectItem>
                        <SelectItem value="framework">FW</SelectItem>
                        <SelectItem value="database">DB</SelectItem>
                        <SelectItem value="infrastructure">インフラ</SelectItem>
                        <SelectItem value="tool">ツール</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      placeholder="経験年数"
                      value={newSkill.experienceYears}
                      onChange={(e) =>
                        setNewSkill({
                          ...newSkill,
                          experienceYears: parseFloat(e.target.value) || 1,
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={addSkill}
                    disabled={!newSkill.name.trim()}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    追加
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
                      {skillCategoryNames[category] || category}
                    </h4>
                    <div className="space-y-2">
                      {skills
                        .sort((a, b) => b.experienceYears - a.experienceYears)
                        .map((skill) => (
                          <div
                            key={skill.name}
                            className="flex justify-between items-center py-1 border-b border-muted/50 last:border-b-0 group"
                          >
                            <div className="flex-1 min-w-0">
                              {isEditingSkills ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={skill.name}
                                    onChange={(e) =>
                                      updateSkill(skill.name, 'name', e.target.value)
                                    }
                                    className="h-6 text-sm font-medium flex-1"
                                  />
                                  <Input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    value={skill.experienceYears}
                                    onChange={(e) =>
                                      updateSkill(
                                        skill.name,
                                        'experienceYears',
                                        parseFloat(e.target.value) || 1
                                      )
                                    }
                                    className="h-6 text-xs w-16"
                                    title="経験年数"
                                  />
                                  <span className="text-xs text-muted-foreground">年</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {skill.experienceYears}年
                                  </span>
                                </div>
                              )}
                            </div>
                            {isEditingSkills && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeSkill(skill.name)}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {isEditingSkills && (
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={handleCancelSkills}>
                    キャンセル
                  </Button>
                  <Button size="sm" onClick={handleSaveSkills}>
                    保存
                  </Button>
                </div>
              )}
            </div>

            {/* 右側コンテンツ */}
            <div className="space-y-6">
              {/* 案件履歴 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-border pb-2">
                  <Briefcase className="h-5 w-5" />
                  案件履歴
                </h3>

                <div className="space-y-3">
                  {engineer.projects.slice(0, 3).map((project, index) => (
                    <div
                      key={project.id}
                      className={`p-3 bg-muted/30 rounded border-l-4 border-primary/30 ${index > 0 ? 'border-t border-border pt-3' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">{project.name}</h4>
                          <p className="text-muted-foreground text-xs">{project.role}</p>
                        </div>
                        <Badge variant="outline" className="text-xs px-2 py-0 whitespace-nowrap">
                          {project.startDate.substring(0, 7)} ~{' '}
                          {project.endDate?.substring(0, 7) || '現在'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {project.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs px-1 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{project.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {engineer.projects.length > 3 && (
                    <div className="text-center py-2 border-t border-dashed border-border">
                      <p className="text-xs text-muted-foreground">
                        他 {engineer.projects.length - 3} 件の案件履歴
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 評価メモ */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    評価メモ
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => (isEditingMemo ? handleSaveMemo() : setIsEditingMemo(true))}
                  >
                    {isEditingMemo ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </Button>
                </div>

                {isEditingMemo ? (
                  <div className="space-y-3">
                    <Textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      rows={4}
                      placeholder="クライアントからの評価やメモを入力してください"
                      className="text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditingMemo(false)}>
                        キャンセル
                      </Button>
                      <Button size="sm" onClick={handleSaveMemo}>
                        保存
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-yellow-400">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-sm">クライアント評価</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{memo}</p>
                    </div>

                    <div className="text-xs text-muted-foreground border-t border-dashed border-border pt-2">
                      最終更新: 2024年3月15日
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EngineerSkillSheet
        engineer={engineer}
        open={isSkillSheetOpen}
        onOpenChange={setIsSkillSheetOpen}
      />
    </div>
  );
}
