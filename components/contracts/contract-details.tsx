"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ChevronLeft, Building2, FileText, Calendar, Clock, Users, Briefcase,
  CreditCard, MapPin, FileCheck, AlertTriangle, Edit2, Save, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContractDetailsProps {
  contract: any; // 型は実際のcontractの型に合わせて定義してください
}

export function ContractDetails({ contract: initialContract }: ContractDetailsProps) {
  const [contract, setContract] = useState(initialContract);
  const [isEditing, setIsEditing] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-500 bg-green-100 dark:bg-green-900/30";
      case "ended": return "text-gray-500 bg-gray-100 dark:bg-gray-900/30";
      case "draft": return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
      default: return "";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "契約中";
      case "ended": return "終了";
      case "draft": return "ドラフト";
      default: return status;
    }
  };
  
  const handleSave = () => {
    // 実際のアプリではここでAPIを呼び出して保存
    setIsEditing(false);
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/sales/contracts">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            契約一覧に戻る
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
          {/* 契約基本情報 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className={getStatusColor(contract.status)}>
                    {getStatusText(contract.status)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {isEditing ? (
                  <Input
                    value={contract.clientName}
                    onChange={(e) => setContract({ ...contract, clientName: e.target.value })}
                    className="text-2xl font-bold"
                  />
                ) : (
                  contract.clientName
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約ID</p>
                  <p className="font-mono">{contract.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約書</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    {contract.contractFile}
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約開始日</p>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={contract.startDate}
                      onChange={(e) => setContract({ ...contract, startDate: e.target.value })}
                    />
                  ) : (
                    <p>{contract.startDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約終了日</p>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={contract.endDate}
                      onChange={(e) => setContract({ ...contract, endDate: e.target.value })}
                    />
                  ) : (
                    <p>{contract.endDate}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 契約条件 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                契約条件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約形態</p>
                  {isEditing ? (
                    <Select
                      value={contract.contractType}
                      onValueChange={(value) => setContract({ ...contract, contractType: value })}
                    >
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
                    <p>{contract.contractType}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">支払条件</p>
                  {isEditing ? (
                    <Input
                      value={contract.paymentTerms}
                      onChange={(e) => setContract({ ...contract, paymentTerms: e.target.value })}
                    />
                  ) : (
                    <p>{contract.paymentTerms}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">勤務形態</p>
                  {isEditing ? (
                    <Select
                      value={contract.workStyle}
                      onValueChange={(value) => setContract({ ...contract, workStyle: value })}
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
                    <p>{contract.workStyle}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">作業場所</p>
                  {isEditing ? (
                    <Input
                      value={contract.workLocation}
                      onChange={(e) => setContract({ ...contract, workLocation: e.target.value })}
                    />
                  ) : (
                    <p>{contract.workLocation}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">稼働時間帯</p>
                  {isEditing ? (
                    <Input
                      value={contract.workingHours}
                      onChange={(e) => setContract({ ...contract, workingHours: e.target.value })}
                    />
                  ) : (
                    <p>{contract.workingHours}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">稼働日数</p>
                  {isEditing ? (
                    <Input
                      value={contract.workingDays}
                      onChange={(e) => setContract({ ...contract, workingDays: e.target.value })}
                    />
                  ) : (
                    <p>{contract.workingDays}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 単価・費用 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                単価・費用
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">単価（円／月）</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={contract.rate}
                      onChange={(e) => setContract({ ...contract, rate: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p className="text-xl font-bold">¥{contract.rate.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約工数（h/月）</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={contract.workload}
                      onChange={(e) => setContract({ ...contract, workload: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p>{contract.workload}h</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">最小稼働時間</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={contract.minHours}
                      onChange={(e) => setContract({ ...contract, minHours: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p>{contract.minHours}h</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">最大稼働時間</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={contract.maxHours}
                      onChange={(e) => setContract({ ...contract, maxHours: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p>{contract.maxHours}h</p>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">超過／控除ルール</p>
                {isEditing ? (
                  <Input
                    value={contract.overtimeRule}
                    onChange={(e) => setContract({ ...contract, overtimeRule: e.target.value })}
                  />
                ) : (
                  <p>{contract.overtimeRule}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* 関連人物情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                関連人物情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">SESエンジニア</h3>
                <div className="space-y-1">
                  <p>{contract.engineer.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.engineer.email}</p>
                  <p className="text-sm text-muted-foreground">{contract.engineer.phone}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">営業担当者</h3>
                <div className="space-y-1">
                  <p>{contract.salesPerson.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.salesPerson.email}</p>
                  <p className="text-sm text-muted-foreground">{contract.salesPerson.phone}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">クライアント担当者</h3>
                <div className="space-y-1">
                  <p>{contract.clientContact.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.clientContact.department}</p>
                  <p className="text-sm text-muted-foreground">{contract.clientContact.email}</p>
                  <p className="text-sm text-muted-foreground">{contract.clientContact.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 契約更新・終了情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                契約更新情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">更新予定日</p>
                <p>{contract.renewalDate}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">確認状況</p>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30">
                  {contract.renewalStatus}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">更新条件</p>
                {isEditing ? (
                  <Input
                    value={contract.renewalConditions}
                    onChange={(e) => setContract({ ...contract, renewalConditions: e.target.value })}
                  />
                ) : (
                  <p>{contract.renewalConditions}</p>
                )}
              </div>
              
              {contract.status === "ended" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">契約終了理由</p>
                  {isEditing ? (
                    <Input
                      placeholder="契約終了理由を入力"
                    />
                  ) : (
                    <p className="text-muted-foreground">-</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* 備考・メモ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                備考・メモ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={contract.notes}
                  onChange={(e) => setContract({ ...contract, notes: e.target.value })}
                  rows={5}
                />
              ) : (
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {contract.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}