"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Search, Filter, Building2, BarChart2, CreditCard, 
  UserPlus, Edit2, Save, Plus, Target, TrendingUp, Calendar,
  DollarSign, Briefcase, CheckCircle, PieChart, Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
} from "recharts";
import { SalesTargetModal } from "@/components/teams/sales-target-modal";

// モックデータ
const mockTeams = [
  {
    id: "t1",
    name: "第一営業部",
    members: [
      {
        id: "s1",
        name: "鈴木健太",
        role: "部長",
        imageUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
        monthlyRevenue: 2500000,
      },
      {
        id: "s2",
        name: "田中美咲",
        role: "主任",
        imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        monthlyRevenue: 1800000,
      },
      {
        id: "s3",
        name: "高橋誠",
        role: "一般",
        imageUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
        monthlyRevenue: 1200000,
      },
    ],
    monthlyRevenue: 5500000,
  },
  {
    id: "t2",
    name: "第二営業部",
    members: [
      {
        id: "s4",
        name: "佐藤一郎",
        role: "部長",
        imageUrl: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
        monthlyRevenue: 2200000,
      },
      {
        id: "s5",
        name: "山田花子",
        role: "主任",
        imageUrl: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
        monthlyRevenue: 1600000,
      },
      {
        id: "s6",
        name: "伊藤健一",
        role: "一般",
        imageUrl: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
        monthlyRevenue: 1400000,
      },
    ],
    monthlyRevenue: 5200000,
  },
];

// 売上・利益目標管理のモックデータ
const salesTargetData = {
  月次: {
    period: "月次",
    target: 12000000,
    current: 10700000,
    shortfall: 1300000,
    requiredDeals: 2,
    achievementRate: 89.2,
    // 利益関連データ
    profitTarget: 3600000, // 利益目標（売上の30%）
    currentProfit: 2890000, // 現在利益
    profitMargin: 27.0, // 利益率
    profitShortfall: 710000, // 利益不足額
    costs: {
      engineerCosts: 7810000, // エンジニア費用
      operatingCosts: 1200000, // 運営費
      salesCosts: 800000, // 営業費
    },
    projectAnalysis: {
      averageValue: 8500000,
      totalProjects: 15,
      inProgressProjects: 8,
      successRate: 65,
    },
    trendData: [
      { 
        period: "1月", 
        target: 11000000, 
        forecast: 10500000, 
        actual: 10200000,
        profitTarget: 3300000,
        profitActual: 2754000,
        profitMargin: 27.0
      },
      { 
        period: "2月", 
        target: 11500000, 
        forecast: 11200000, 
        actual: 11000000,
        profitTarget: 3450000,
        profitActual: 3080000,
        profitMargin: 28.0
      },
      { 
        period: "3月", 
        target: 12000000, 
        forecast: 11800000, 
        actual: 11500000,
        profitTarget: 3600000,
        profitActual: 3105000,
        profitMargin: 27.0
      },
      { 
        period: "4月", 
        target: 12000000, 
        forecast: 12200000, 
        actual: 11800000,
        profitTarget: 3600000,
        profitActual: 3186000,
        profitMargin: 27.0
      },
      { 
        period: "5月", 
        target: 12000000, 
        forecast: 12000000, 
        actual: 11900000,
        profitTarget: 3600000,
        profitActual: 3213000,
        profitMargin: 27.0
      },
      { 
        period: "6月", 
        target: 12000000, 
        forecast: 10700000, 
        actual: 10700000,
        profitTarget: 3600000,
        profitActual: 2890000,
        profitMargin: 27.0
      },
      { 
        period: "7月", 
        target: 12500000, 
        forecast: 12800000, 
        actual: null,
        profitTarget: 3750000,
        profitActual: null,
        profitMargin: 30.0
      },
      { 
        period: "8月", 
        target: 13000000, 
        forecast: 13200000, 
        actual: null,
        profitTarget: 3900000,
        profitActual: null,
        profitMargin: 30.0
      },
    ],
  },
  四半期: {
    period: "四半期",
    target: 36000000,
    current: 32100000,
    shortfall: 3900000,
    requiredDeals: 5,
    achievementRate: 89.2,
    profitTarget: 10800000,
    currentProfit: 8667000,
    profitMargin: 27.0,
    profitShortfall: 2133000,
    costs: {
      engineerCosts: 23430000,
      operatingCosts: 3600000,
      salesCosts: 2400000,
    },
    projectAnalysis: {
      averageValue: 7800000,
      totalProjects: 45,
      inProgressProjects: 22,
      successRate: 68,
    },
    trendData: [
      { 
        period: "Q1 2024", 
        target: 33000000, 
        forecast: 32500000, 
        actual: 32100000,
        profitTarget: 9900000,
        profitActual: 8667000,
        profitMargin: 27.0
      },
      { 
        period: "Q2 2024", 
        target: 35000000, 
        forecast: 34200000, 
        actual: 33800000,
        profitTarget: 10500000,
        profitActual: 9464000,
        profitMargin: 28.0
      },
      { 
        period: "Q3 2024", 
        target: 36000000, 
        forecast: 35800000, 
        actual: 35200000,
        profitTarget: 10800000,
        profitActual: 9504000,
        profitMargin: 27.0
      },
      { 
        period: "Q4 2024", 
        target: 38000000, 
        forecast: 37500000, 
        actual: null,
        profitTarget: 11400000,
        profitActual: null,
        profitMargin: 30.0
      },
    ],
  },
  年次: {
    period: "年次",
    target: 150000000,
    current: 133200000,
    shortfall: 16800000,
    requiredDeals: 20,
    achievementRate: 88.8,
    profitTarget: 45000000,
    currentProfit: 35964000,
    profitMargin: 27.0,
    profitShortfall: 9036000,
    costs: {
      engineerCosts: 97236000,
      operatingCosts: 14400000,
      salesCosts: 9600000,
    },
    projectAnalysis: {
      averageValue: 8400000,
      totalProjects: 180,
      inProgressProjects: 85,
      successRate: 72,
    },
    trendData: [
      { 
        period: "2020年", 
        target: 120000000, 
        forecast: 118000000, 
        actual: 115000000,
        profitTarget: 36000000,
        profitActual: 31050000,
        profitMargin: 27.0
      },
      { 
        period: "2021年", 
        target: 130000000, 
        forecast: 128000000, 
        actual: 125000000,
        profitTarget: 39000000,
        profitActual: 33750000,
        profitMargin: 27.0
      },
      { 
        period: "2022年", 
        target: 140000000, 
        forecast: 138000000, 
        actual: 135000000,
        profitTarget: 42000000,
        profitActual: 36450000,
        profitMargin: 27.0
      },
      { 
        period: "2023年", 
        target: 145000000, 
        forecast: 143000000, 
        actual: 140000000,
        profitTarget: 43500000,
        profitActual: 37800000,
        profitMargin: 27.0
      },
      { 
        period: "2024年", 
        target: 150000000, 
        forecast: 148000000, 
        actual: 133200000,
        profitTarget: 45000000,
        profitActual: 35964000,
        profitMargin: 27.0
      },
      { 
        period: "2025年", 
        target: 160000000, 
        forecast: 158000000, 
        actual: null,
        profitTarget: 48000000,
        profitActual: null,
        profitMargin: 30.0
      },
    ],
  },
};

const mockEngineerAssignments = [
  {
    engineerId: "e1",
    engineerName: "山田太郎",
    salesId: "s1",
    salesName: "鈴木健太",
    teamId: "t1",
    teamName: "第一営業部",
  },
  {
    engineerId: "e2",
    engineerName: "佐藤花子",
    salesId: "s2",
    salesName: "田中美咲",
    teamId: "t1",
    teamName: "第一営業部",
  },
  {
    engineerId: "e3",
    engineerName: "鈴木一郎",
    salesId: "s4",
    salesName: "佐藤一郎",
    teamId: "t2",
    teamName: "第二営業部",
  },
  {
    engineerId: "e4",
    engineerName: "田中美咲",
    salesId: "s5",
    salesName: "山田花子",
    teamId: "t2",
    teamName: "第二営業部",
  },
  {
    engineerId: "e5",
    engineerName: "伊藤健太",
    salesId: "s3",
    salesName: "高橋誠",
    teamId: "t1",
    teamName: "第一営業部",
  },
];

const mockProjectAssignments = [
  {
    projectId: "p1",
    projectName: "大手ECサイトリニューアル案件",
    clientName: "〇〇商事株式会社",
    salesIds: ["s1", "s2"],
    salesNames: ["鈴木健太", "田中美咲"],
    status: "in_progress",
    revenue: 800000,
  },
  {
    projectId: "p2",
    projectName: "金融システム保守運用",
    clientName: "〇〇銀行",
    salesIds: ["s4"],
    salesNames: ["佐藤一郎"],
    status: "negotiating",
    revenue: 750000,
  },
  {
    projectId: "p3",
    projectName: "スマートファクトリー構築支援",
    clientName: "〇〇製造株式会社",
    salesIds: ["s5", "s6"],
    salesNames: ["山田花子", "伊藤健一"],
    status: "in_progress",
    revenue: 900000,
  },
  {
    projectId: "p4",
    projectName: "医療系アプリケーション開発",
    clientName: "〇〇メディカル株式会社",
    salesIds: ["s3"],
    salesNames: ["高橋誠"],
    status: "completed",
    revenue: 650000,
  },
  {
    projectId: "p5",
    projectName: "決済システム連携開発",
    clientName: "〇〇ペイメント株式会社",
    salesIds: ["s2", "s3"],
    salesNames: ["田中美咲", "高橋誠"],
    status: "negotiating",
    revenue: 780000,
  },
];

const mockClientAssignments = [
  {
    clientId: "c1",
    clientName: "〇〇商事株式会社",
    salesIds: ["s1", "s2"],
    salesNames: ["鈴木健太", "田中美咲"],
    status: "active",
    notes: "新規案件の提案準備中\n次期フェーズの見積もり作成予定",
  },
  {
    clientId: "c2",
    clientName: "〇〇銀行",
    salesIds: ["s4"],
    salesNames: ["佐藤一郎"],
    status: "active",
    notes: "次期システム更改の相談あり\n予算30%増の打診あり",
  },
  {
    clientId: "c3",
    clientName: "〇〇製造株式会社",
    salesIds: ["s5", "s6"],
    salesNames: ["山田花子", "伊藤健一"],
    status: "active",
    notes: "新規IoTプロジェクトの企画提案中\n経営層プレゼン 7/15予定",
  },
  {
    clientId: "c4",
    clientName: "〇〇メディカル株式会社",
    salesIds: ["s3"],
    salesNames: ["高橋誠"],
    status: "negotiating",
    notes: "モバイルアプリ開発の見積提出済み\n技術選定レビュー待ち",
  },
  {
    clientId: "c5",
    clientName: "〇〇ペイメント株式会社",
    salesIds: ["s2", "s3"],
    salesNames: ["田中美咲", "高橋誠"],
    status: "active",
    notes: "決済システム連携の要件定義フェーズ\nPoC実施を検討中",
  },
];

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);
  const [targetPeriod, setTargetPeriod] = useState("月次");
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  
  // 選択された期間のデータを取得
  const currentTargetData = salesTargetData[targetPeriod as keyof typeof salesTargetData];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress": return "bg-green-100 text-green-700 dark:bg-green-900/30";
      case "negotiating": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30";
      case "completed": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress": return "進行中";
      case "negotiating": return "交渉中";
      case "completed": return "完了";
      default: return status;
    }
  };

  // 期間に応じた表示テキストを取得
  const getPeriodText = () => {
    switch (targetPeriod) {
      case "月次": return "2025年6月";
      case "四半期": return "2024年Q2";
      case "年次": return "2024年";
      default: return "";
    }
  };

  // 目標設定の保存処理
  const handleSaveTarget = (data: any) => {
    console.log("目標設定を保存:", data);
    // 実際のアプリケーションではここでAPIを呼び出して保存
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
          <h1 className="text-3xl font-bold tracking-tight">営業チーム管理</h1>
          <p className="text-muted-foreground">
            営業チームの担当状況と実績を管理
          </p>
        </div>
      </motion.div>
      
      {/* 売上・利益目標管理セクション */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">売上・利益目標管理</CardTitle>
                  <CardDescription>期間別の売上・利益目標と達成状況</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={targetPeriod} onValueChange={setTargetPeriod}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="月次">月次</SelectItem>
                    <SelectItem value="四半期">四半期</SelectItem>
                    <SelectItem value="年次">年次</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTargetModalOpen(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  目標設定
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">概要・推移</TabsTrigger>
                <TabsTrigger value="profit">利益分析</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* 売上KPI指標 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">売上目標</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {(currentTargetData.target / 10000).toFixed(0)}万円
                    </div>
                    <div className="text-sm text-muted-foreground">{getPeriodText()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">現在売上</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {(currentTargetData.current / 10000).toFixed(0)}万円
                    </div>
                    <div className="text-sm text-muted-foreground">
                      達成率: {currentTargetData.achievementRate}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-600">利益目標</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {(currentTargetData.profitTarget / 10000).toFixed(0)}万円
                    </div>
                    <div className="text-sm text-muted-foreground">
                      利益率: {((currentTargetData.profitTarget / currentTargetData.target) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-600">現在利益</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {(currentTargetData.currentProfit / 10000).toFixed(0)}万円
                    </div>
                    <div className="text-sm text-muted-foreground">
                      利益率: {currentTargetData.profitMargin}%
                    </div>
                  </div>
                </div>
                
                {/* 進捗バー */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">売上進捗</span>
                      <span className="text-sm font-medium">
                        {(currentTargetData.current / 10000).toFixed(0)} / {(currentTargetData.target / 10000).toFixed(0)}万円
                      </span>
                    </div>
                    <Progress value={currentTargetData.achievementRate} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>達成率: {currentTargetData.achievementRate}%</span>
                      <span className="text-red-600">
                        残り: {(currentTargetData.shortfall / 10000).toFixed(0)}万円
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">利益進捗</span>
                      <span className="text-sm font-medium">
                        {(currentTargetData.currentProfit / 10000).toFixed(0)} / {(currentTargetData.profitTarget / 10000).toFixed(0)}万円
                      </span>
                    </div>
                    <Progress 
                      value={(currentTargetData.currentProfit / currentTargetData.profitTarget) * 100} 
                      className="h-3" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        達成率: {((currentTargetData.currentProfit / currentTargetData.profitTarget) * 100).toFixed(1)}%
                      </span>
                      <span className="text-red-600">
                        残り: {(currentTargetData.profitShortfall / 10000).toFixed(0)}万円
                      </span>
                    </div>
                  </div>
                </div>

                {/* 売上・利益推移グラフ */}
                <div className="mt-8">
                  <h3 className="font-medium mb-4">売上・利益推移</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={currentTargetData.trendData}
                        margin={{
                          top: 20,
                          right: 60,
                          left: 80,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis 
                          yAxisId="left"
                          tickFormatter={(value) => `${(value / 10000).toFixed(0)}万円`}
                          width={70}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right"
                          tickFormatter={(value) => `${value}%`}
                          width={50}
                        />
                        <Tooltip 
                          formatter={(value: any, name: string) => {
                            if (name === "利益率") {
                              return [`${value}%`, name];
                            }
                            return [`${(value / 10000).toFixed(0)}万円`, name];
                          }}
                        />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="actual"
                          fill="hsl(var(--chart-1))"
                          name="売上実績"
                          opacity={0.8}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="profitActual"
                          fill="hsl(var(--chart-2))"
                          name="利益実績"
                          opacity={0.8}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="target"
                          stroke="hsl(var(--chart-3))"
                          strokeDasharray="5 5"
                          name="売上目標"
                          dot={false}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="profitTarget"
                          stroke="hsl(var(--chart-4))"
                          strokeDasharray="3 3"
                          name="利益目標"
                          dot={false}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="profitMargin"
                          stroke="hsl(var(--chart-5))"
                          strokeWidth={2}
                          name="利益率"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="profit" className="space-y-6">
                {/* 利益構造分析 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">コスト構造</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">エンジニア費用</span>
                        <span className="font-medium">
                          {(currentTargetData.costs.engineerCosts / 10000).toFixed(0)}万円
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">運営費</span>
                        <span className="font-medium">
                          {(currentTargetData.costs.operatingCosts / 10000).toFixed(0)}万円
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">営業費</span>
                        <span className="font-medium">
                          {(currentTargetData.costs.salesCosts / 10000).toFixed(0)}万円
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <span className="text-sm font-medium">総コスト</span>
                        <span className="font-bold">
                          {((currentTargetData.costs.engineerCosts + currentTargetData.costs.operatingCosts + currentTargetData.costs.salesCosts) / 10000).toFixed(0)}万円
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">利益分析</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <span className="text-sm">売上</span>
                        <span className="font-medium text-green-700 dark:text-green-400">
                          {(currentTargetData.current / 10000).toFixed(0)}万円
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <span className="text-sm">総コスト</span>
                        <span className="font-medium text-red-700 dark:text-red-400">
                          -{((currentTargetData.costs.engineerCosts + currentTargetData.costs.operatingCosts + currentTargetData.costs.salesCosts) / 10000).toFixed(0)}万円
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <span className="text-sm font-medium">純利益</span>
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                          {(currentTargetData.currentProfit / 10000).toFixed(0)}万円
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <span className="text-sm">利益率</span>
                        <span className="font-medium text-purple-700 dark:text-purple-400">
                          {currentTargetData.profitMargin}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 利益改善提案 */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 利益改善提案</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div>
                      <p className="font-medium mb-1">コスト削減案</p>
                      <ul className="space-y-1 text-xs">
                        <li>• エンジニア稼働率の最適化</li>
                        <li>• 運営費の見直し</li>
                        <li>• 営業効率の向上</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">売上向上案</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 高単価案件の獲得</li>
                        <li>• 既存顧客の拡大</li>
                        <li>• 新規サービスの展開</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* チーム一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>
                      メンバー: {team.members.length}名
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {team.members.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.imageUrl} />
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(member.monthlyRevenue / 10000).toFixed(0)}万円</p>
                        <p className="text-xs text-muted-foreground">今月の売上</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-sm text-muted-foreground">チーム売上</p>
                    <p className="text-xl font-bold">{(team.monthlyRevenue / 10000).toFixed(0)}万円</p>
                  </div>
                  <Progress value={70} className="h-2" />
                  <p className="text-xs text-right text-muted-foreground mt-1">
                    目標達成率: 70%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* 担当管理タブ */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>担当管理</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="検索..."
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
                  {mockTeams.map(team => (
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
          <Tabs defaultValue="engineers">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="engineers">エンジニア担当</TabsTrigger>
              <TabsTrigger value="projects">案件担当</TabsTrigger>
              <TabsTrigger value="clients">企業担当</TabsTrigger>
            </TabsList>
            
            <TabsContent value="engineers" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>エンジニア</TableHead>
                    <TableHead>担当営業</TableHead>
                    <TableHead>所属チーム</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEngineerAssignments.map(assignment => (
                    <TableRow key={assignment.engineerId}>
                      <TableCell>{assignment.engineerName}</TableCell>
                      <TableCell>{assignment.salesName}</TableCell>
                      <TableCell>{assignment.teamName}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          担当変更
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="projects" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>案件名</TableHead>
                    <TableHead>企業名</TableHead>
                    <TableHead>担当営業</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProjectAssignments.map(assignment => (
                    <TableRow key={assignment.projectId}>
                      <TableCell>{assignment.projectName}</TableCell>
                      <TableCell>{assignment.clientName}</TableCell>
                      <TableCell>{assignment.salesNames.join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(assignment.status)}>
                          {getStatusText(assignment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          担当変更
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="clients" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>企業名</TableHead>
                    <TableHead>担当営業</TableHead>
                    <TableHead>営業メモ</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClientAssignments.map(assignment => (
                    <TableRow key={assignment.clientId}>
                      <TableCell>{assignment.clientName}</TableCell>
                      <TableCell>{assignment.salesNames.join(", ")}</TableCell>
                      <TableCell>{assignment.notes}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          担当変更
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* 目標設定モーダル */}
      <SalesTargetModal
        open={isTargetModalOpen}
        onOpenChange={setIsTargetModalOpen}
        currentPeriod={targetPeriod}
        currentData={currentTargetData}
        onSave={handleSaveTarget}
      />
    </div>
  );
}