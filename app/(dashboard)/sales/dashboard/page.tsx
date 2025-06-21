'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Filter,
  Download,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProjects, mockEngineers } from '@/lib/data';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

export default function SalesDashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // 案件ステータス集計
  const projectStatusCounts = mockProjects.reduce(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // エンジニア稼働状況集計
  const engineerAvailabilityCounts = mockEngineers.reduce(
    (acc, engineer) => {
      acc[engineer.availability] = (acc[engineer.availability] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // ステータスごとの案件データ
  const projectStatusData = [
    { name: '募集中', value: projectStatusCounts.open || 0, color: 'hsl(var(--chart-1))' },
    { name: '進行中', value: projectStatusCounts.in_progress || 0, color: 'hsl(var(--chart-2))' },
    { name: '交渉中', value: projectStatusCounts.negotiating || 0, color: 'hsl(var(--chart-3))' },
    { name: '終了', value: projectStatusCounts.closed || 0, color: 'hsl(var(--chart-4))' },
  ];

  // エンジニア稼働状況データ
  const engineerAvailabilityData = [
    {
      name: '稼働可能',
      value: engineerAvailabilityCounts.available || 0,
      color: 'hsl(var(--chart-1))',
    },
    {
      name: '一部稼働可能',
      value: engineerAvailabilityCounts.partially || 0,
      color: 'hsl(var(--chart-2))',
    },
    {
      name: '稼働不可',
      value: engineerAvailabilityCounts.unavailable || 0,
      color: 'hsl(var(--chart-3))',
    },
  ];

  // 売上データ（モック）
  const revenueData = {
    month: {
      current: 4850000,
      previous: 4200000,
      target: 5000000,
      growth: 15.5,
      data: [
        { period: '1月', revenue: 3800000, target: 4000000 },
        { period: '2月', revenue: 4100000, target: 4200000 },
        { period: '3月', revenue: 4500000, target: 4500000 },
        { period: '4月', revenue: 4200000, target: 4300000 },
        { period: '5月', revenue: 4600000, target: 4600000 },
        { period: '6月', revenue: 4850000, target: 5000000 },
      ],
    },
    quarter: {
      current: 14250000,
      previous: 12100000,
      target: 15000000,
      growth: 17.8,
      data: [
        { period: 'Q1 2024', revenue: 12400000, target: 12600000 },
        { period: 'Q2 2024', revenue: 13750000, target: 13800000 },
        { period: 'Q3 2024', revenue: 14250000, target: 15000000 },
        { period: 'Q4 2024', revenue: 15200000, target: 15500000 },
      ],
    },
    year: {
      current: 55650000,
      previous: 48200000,
      target: 60000000,
      growth: 15.5,
      data: [
        { period: '2020', revenue: 38000000, target: 40000000 },
        { period: '2021', revenue: 42500000, target: 45000000 },
        { period: '2022', revenue: 48200000, target: 50000000 },
        { period: '2023', revenue: 52800000, target: 55000000 },
        { period: '2024', revenue: 55650000, target: 60000000 },
      ],
    },
  };

  // エンジニア別売上データ（モック）
  const engineerRevenueData = [
    { name: '山田太郎', revenue: 8500000, projects: 2 },
    { name: '佐藤花子', revenue: 7200000, projects: 1 },
    { name: '鈴木一郎', revenue: 6800000, projects: 1 },
    { name: '田中美咲', revenue: 6500000, projects: 1 },
    { name: '伊藤健太', revenue: 9200000, projects: 2 },
  ].sort((a, b) => b.revenue - a.revenue);

  // クライアント別売上データ（モック）
  const clientRevenueData = [
    { name: '〇〇商事', revenue: 12500000, color: 'hsl(var(--chart-1))' },
    { name: '△△システムズ', revenue: 9800000, color: 'hsl(var(--chart-2))' },
    { name: '◇◇フィナンシャル', revenue: 8200000, color: 'hsl(var(--chart-3))' },
    { name: '□□メディカル', revenue: 7100000, color: 'hsl(var(--chart-4))' },
    { name: '☆☆テクノロジー', revenue: 6400000, color: 'hsl(var(--chart-5))' },
  ];

  // 月別案件推移データ（モック）
  const monthlyProjectData = [
    { name: '4月', 新規案件: 3, 終了案件: 1 },
    { name: '5月', 新規案件: 5, 終了案件: 2 },
    { name: '6月', 新規案件: 4, 終了案件: 3 },
    { name: '7月', 新規案件: 6, 終了案件: 2 },
    { name: '8月', 新規案件: 8, 終了案件: 4 },
    { name: '9月', 新規案件: 7, 終了案件: 5 },
  ];

  // スキル需要データ（モック）
  const skillDemandData = [
    { name: 'React', count: 15 },
    { name: 'TypeScript', count: 12 },
    { name: 'Node.js', count: 10 },
    { name: 'Python', count: 8 },
    { name: 'Java', count: 7 },
    { name: 'AWS', count: 14 },
    { name: 'Docker', count: 9 },
    { name: 'Kubernetes', count: 6 },
  ].sort((a, b) => b.count - a.count);

  const currentRevenueData = revenueData[revenuePeriod];
  const achievementRate = (currentRevenueData.current / currentRevenueData.target) * 100;

  return (
    <div className="container py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">営業ダッシュボード</h1>
          <p className="text-muted-foreground">案件・エンジニア・売上状況の概要</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          レポート出力
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">売上</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(currentRevenueData.current / 10000).toFixed(0)}万円
              </div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`${currentRevenueData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {currentRevenueData.growth >= 0 ? '+' : ''}
                  {currentRevenueData.growth}%
                </span>{' '}
                前期比
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">エンジニア総数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockEngineers.length}名</div>
              <p className="text-xs text-muted-foreground">
                稼働可能: {engineerAvailabilityCounts.available || 0}名
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">案件総数</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjects.length}件</div>
              <p className="text-xs text-muted-foreground">
                募集中: {projectStatusCounts.open || 0}件
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">進行中案件</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStatusCounts.in_progress || 0}件</div>
              <p className="text-xs text-muted-foreground">前月比: +2件</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">目標達成率</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{achievementRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                目標: {(currentRevenueData.target / 10000).toFixed(0)}万円
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 売上分析セクション */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>売上分析</CardTitle>
              <CardDescription>期間別の売上推移と目標達成状況</CardDescription>
            </div>
            <Select
              value={revenuePeriod}
              onValueChange={(value: 'month' | 'quarter' | 'year') => setRevenuePeriod(value)}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">月次</SelectItem>
                <SelectItem value="quarter">四半期</SelectItem>
                <SelectItem value="year">年次</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentRevenueData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}万円`} />
                <Tooltip formatter={(value: any) => [`${(value / 10000).toFixed(0)}万円`]} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="target"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                  name="目標"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="2"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                  name="実績"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>案件状況</CardTitle>
              <CardDescription>ステータス別の案件数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>クライアント別売上</CardTitle>
              <CardDescription>主要クライアントの売上構成</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientRevenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${(value / 10000).toFixed(0)}万円`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {clientRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${(value / 10000).toFixed(0)}万円`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>エンジニア別売上ランキング</CardTitle>
            <CardDescription>売上貢献度の高いエンジニア</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engineerRevenueData.map((engineer, index) => (
                <div key={engineer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{engineer.name}</p>
                      <p className="text-sm text-muted-foreground">{engineer.projects}案件</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{(engineer.revenue / 10000).toFixed(0)}万円</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>エンジニア稼働状況</CardTitle>
            <CardDescription>稼働状況別のエンジニア数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engineerAvailabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engineerAvailabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">案件推移</TabsTrigger>
          <TabsTrigger value="skills">スキル需要</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>月別案件推移</CardTitle>
              <CardDescription>過去6ヶ月の新規・終了案件数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyProjectData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="新規案件"
                      stroke="hsl(var(--chart-1))"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="終了案件" stroke="hsl(var(--chart-2))" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>スキル需要ランキング</CardTitle>
              <CardDescription>案件で最も求められているスキル</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillDemandData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
