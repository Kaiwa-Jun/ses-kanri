'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronLeft,
  Building2,
  FileText,
  Calendar,
  Clock,
  Users,
  Briefcase,
  CreditCard,
  MapPin,
  FileCheck,
  AlertTriangle,
  Edit2,
  Save,
  Download,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContractDetailsProps {
  contract: any; // 型は実際のcontractの型に合わせて定義してください
}

export function ContractDetails({ contract: initialContract }: ContractDetailsProps) {
  const [contract, setContract] = useState(initialContract);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'ended':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
      case 'draft':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '契約中';
      case 'ended':
        return '終了';
      case 'draft':
        return 'ドラフト';
      default:
        return status;
    }
  };

  const handleSave = () => {
    // 実際のアプリではここでAPIを呼び出して保存
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-none">
      {/* 戻るボタン */}
      <div className="mb-6">
        <Link href="/sales/contracts">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            契約一覧に戻る
          </Button>
        </Link>
      </div>

      {/* 全体を1つのカードにまとめる */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          {/* カードヘッダー */}
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">契約詳細</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-0">
            {/* 上段 - 4つのメインセクション */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
              {/* 契約している企業情報 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">契約詳細</h3>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">契約中</p>
                  {isEditing ? (
                    <Select defaultValue={contract.status || 'active'}>
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">契約中</SelectItem>
                        <SelectItem value="ended">終了</SelectItem>
                        <SelectItem value="draft">ドラフト</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 dark:bg-green-900/30"
                    >
                      契約中
                    </Badge>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <Input
                      defaultValue={contract.clientName || '□□メディカル株式会社'}
                      className="font-medium text-lg"
                    />
                  ) : (
                    <p className="font-medium text-lg">□□メディカル株式会社</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約ID:</p>
                  <p className="font-mono text-sm">c4</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約書:</p>
                  <Button variant="outline" size="sm" className="gap-2 h-8">
                    <Download className="h-3 w-3" />
                    contract_20240101.pdf
                  </Button>
                </div>
              </div>

              {/* 契約期間・条件 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">契約期間・条件</h3>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約期間:</p>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        defaultValue={contract.startDate || '2024-01-01'}
                        className="w-full"
                      />
                      <span>~</span>
                      <Input
                        type="date"
                        defaultValue={contract.endDate || '2024-12-31'}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <p className="font-medium">
                      {contract.startDate || '2024-01-01'} ~ {contract.endDate || '2024-12-31'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約形態:</p>
                  {isEditing ? (
                    <Select defaultValue={contract.contractType || '準委任'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="準委任">準委任</SelectItem>
                        <SelectItem value="請負">請負</SelectItem>
                        <SelectItem value="派遣">派遣</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{contract.contractType || '準委任'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">支払条件:</p>
                  {isEditing ? (
                    <Input defaultValue={contract.paymentTerms || '月末締め翌月末払い'} />
                  ) : (
                    <p className="font-medium">{contract.paymentTerms || '月末締め翌月末払い'}</p>
                  )}
                </div>
              </div>

              {/* 勤務条件 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">勤務条件</h3>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">勤務形態:</p>
                  {isEditing ? (
                    <Select defaultValue="常駐">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="常駐">常駐</SelectItem>
                        <SelectItem value="リモート">リモート</SelectItem>
                        <SelectItem value="ハイブリッド">ハイブリッド</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">常駐</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">作業場所:</p>
                  {isEditing ? (
                    <Input defaultValue="東京都港区○○町3-3-3" />
                  ) : (
                    <p className="font-medium">東京都港区○○町3-3-3</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">稼働時間:</p>
                  {isEditing ? (
                    <Input defaultValue="9:00~18:00" />
                  ) : (
                    <p className="font-medium">9:00~18:00</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">稼働日数:</p>
                  {isEditing ? (
                    <Input defaultValue="週5日" />
                  ) : (
                    <p className="font-medium">週5日</p>
                  )}
                </div>
              </div>

              {/* 単価・費用 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">単価・費用</h3>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">単価 (円/月):</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      defaultValue={contract.rate || 950000}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-2xl font-bold">
                      ¥{(contract.rate || 950000).toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約工数:</p>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        defaultValue={contract.workload || '160'}
                        className="w-20"
                      />
                      <span>h/月</span>
                    </div>
                  ) : (
                    <p className="font-medium">{contract.workload || '160'}h/月</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">稼働時間:</p>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        defaultValue={contract.minHours || '140'}
                        className="w-20"
                      />
                      <span>h~</span>
                      <Input
                        type="number"
                        defaultValue={contract.maxHours || '180'}
                        className="w-20"
                      />
                      <span>h</span>
                    </div>
                  ) : (
                    <p className="font-medium">
                      {contract.minHours || '140'}h~{contract.maxHours || '180'}h
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">超過/控除:</p>
                  {isEditing ? (
                    <Textarea
                      defaultValue={contract.overtimeRule || '1時間単位で精算 (基準単価の1.25倍)'}
                      className="text-sm"
                      rows={2}
                    />
                  ) : (
                    <p className="font-medium text-sm">
                      {contract.overtimeRule || '1時間単位で精算 (基準単価の1.25倍)'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* 中段 - 関連人物情報 */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold text-lg">関連人物情報</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 契約したエンジニア */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">契約したエンジニア</p>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        鈴木
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">鈴木一郎</p>
                      <p className="text-sm text-muted-foreground">フロントエンドエンジニア</p>
                    </div>
                  </div>
                </div>

                {/* 営業担当者 */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">営業担当者</p>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        佐藤
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">佐藤健太</p>
                      <p className="text-sm text-muted-foreground">sato.k@example.com</p>
                      <p className="text-sm text-muted-foreground">090-6543-2109</p>
                    </div>
                  </div>
                </div>

                {/* クライアント担当者 */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">クライアント担当者</p>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        田中
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">田中部長</p>
                      <p className="text-sm text-muted-foreground">開発部</p>
                      <p className="text-sm text-muted-foreground">tanaka@medical.com</p>
                      <p className="text-sm text-muted-foreground">03-4567-8901</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 下段 - 3つのセクション */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* 契約更新情報 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">契約更新情報</h3>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">更新予定日:</p>
                  {isEditing ? (
                    <Input
                      type="date"
                      defaultValue={contract.renewalDate || '2024-11-30'}
                      className="w-40"
                    />
                  ) : (
                    <p className="font-medium">{contract.renewalDate || '2024-11-30'}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">確認状況:</p>
                  {isEditing ? (
                    <Select defaultValue={contract.renewalStatus || '継続予定'}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="継続予定">継続予定</SelectItem>
                        <SelectItem value="未確認">未確認</SelectItem>
                        <SelectItem value="終了予定">終了予定</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                    >
                      {contract.renewalStatus || '継続予定'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-start gap-1">
                  <p className="text-sm text-muted-foreground">更新条件:</p>
                  {isEditing ? (
                    <Input
                      defaultValue={contract.renewalConditions || '現行条件で継続'}
                      className="text-sm flex-1"
                    />
                  ) : (
                    <p className="text-sm">{contract.renewalConditions || '現行条件で継続'}</p>
                  )}
                </div>
              </div>

              {/* プロジェクト情報 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">プロジェクト情報</h3>
                </div>
                <div className="space-y-3">
                  {isEditing ? (
                    <Input
                      defaultValue={contract.project || '医療系アプリケーション開発'}
                      className="font-medium"
                    />
                  ) : (
                    <p className="font-medium">
                      {contract.project || '医療系アプリケーション開発'}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="date"
                          defaultValue={contract.startDate || '2024-01-01'}
                          className="w-32 h-7 text-sm"
                        />
                        <span>~</span>
                        <Input
                          type="date"
                          defaultValue={contract.endDate || '2024-12-31'}
                          className="w-32 h-7 text-sm"
                        />
                      </div>
                    ) : (
                      <span>
                        {contract.startDate || '2024-01-01'} ~ {contract.endDate || '2024-12-31'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {isEditing ? (
                      <Input defaultValue="東京都港区○○町3-3-3" className="text-sm h-7" />
                    ) : (
                      <span>東京都港区○○町3-3-3</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 備考・メモ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">備考・メモ</h3>
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <Textarea
                      defaultValue={`• 医療システムのため機密性重視
• オンサイト必須
• セキュリティクリアランス必要`}
                      rows={4}
                      className="text-sm"
                    />
                  ) : (
                    <ul className="text-sm space-y-1">
                      <li>• 医療システムのため機密性重視</li>
                      <li>• オンサイト必須</li>
                      <li>• セキュリティクリアランス必要</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
