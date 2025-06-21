'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  addDays,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { Search, Filter, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockEngineers } from '@/lib/data';

// モックデータ: エンジニアの稼働情報
const mockWorkloads = [
  {
    engineerId: 'e1',
    projectId: 'p1',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    status: 'planned', // planned, actual, missing
    workload: 160,
  },
  {
    engineerId: 'e2',
    projectId: 'p2',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    status: 'actual',
    workload: 140,
  },
  {
    engineerId: 'e3',
    projectId: 'p3',
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    status: 'missing',
    workload: 0,
  },
];

export default function WBSPage() {
  const [selectedEngineers, setSelectedEngineers] = useState(mockEngineers.map((e) => e.id));
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // 表示期間の計算
  const displayRange = (() => {
    switch (viewMode) {
      case 'day':
        return eachDayOfInterval({
          start: currentDate,
          end: addDays(currentDate, 30),
        });
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate, { locale: ja }),
          end: addDays(endOfWeek(currentDate, { locale: ja }), 42),
        });
      case 'month':
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: addDays(endOfMonth(addDays(currentDate, 60)), 0),
        });
    }
  })();

  // エンジニアのフィルタリング
  const filteredEngineers = mockEngineers.filter((engineer) => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isSelected = selectedEngineers.includes(engineer.id);
    return matchesSearch && isSelected;
  });

  // ステータスに応じた色を取得
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-500/20 border-blue-500';
      case 'actual':
        return 'bg-green-500/20 border-green-500';
      case 'missing':
        return 'bg-red-500/20 border-red-500';
      default:
        return 'bg-gray-500/20 border-gray-500';
    }
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
          <h1 className="text-3xl font-bold tracking-tight">稼働状況（WBS）</h1>
          <p className="text-muted-foreground">エンジニアの稼働状況をガントチャートで確認</p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="エンジニア名で検索..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={viewMode}
          onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}
        >
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">日単位</SelectItem>
            <SelectItem value="week">週単位</SelectItem>
            <SelectItem value="month">月単位</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            稼働状況
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* ヘッダー（日付） */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `200px repeat(${displayRange.length}, minmax(40px, 1fr))`,
              }}
            >
              <div className="p-2 font-medium border-b">エンジニア</div>
              {displayRange.map((date, index) => (
                <div
                  key={date.toString()}
                  className={`p-2 text-center border-b text-xs ${
                    isToday(date) ? 'bg-primary/5 font-bold' : ''
                  }`}
                >
                  {viewMode === 'day'
                    ? format(date, 'M/d')
                    : viewMode === 'week'
                      ? index % 7 === 0 && format(date, 'M/d')
                      : index % 30 === 0 && format(date, 'yyyy/M')}
                </div>
              ))}
            </div>

            {/* エンジニア行 */}
            {filteredEngineers.map((engineer) => (
              <div
                key={engineer.id}
                className="grid relative"
                style={{
                  gridTemplateColumns: `200px repeat(${displayRange.length}, minmax(40px, 1fr))`,
                }}
              >
                {/* エンジニア情報 */}
                <div className="p-2 border-b flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={engineer.imageUrl} />
                    <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{engineer.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {engineer.totalExperience}年
                    </Badge>
                  </div>
                </div>

                {/* 日付セル */}
                {displayRange.map((date) => (
                  <div
                    key={date.toString()}
                    className={`p-2 border-b ${isToday(date) ? 'bg-primary/5' : ''}`}
                  />
                ))}

                {/* 稼働バー */}
                {mockWorkloads
                  .filter((workload) => workload.engineerId === engineer.id)
                  .map((workload) => {
                    const startDate = new Date(workload.startDate);
                    const endDate = new Date(workload.endDate);
                    const startIndex = displayRange.findIndex(
                      (date) => date.getTime() >= startDate.getTime()
                    );
                    const endIndex = displayRange.findIndex(
                      (date) => date.getTime() >= endDate.getTime()
                    );
                    const duration = endIndex - startIndex + 1;

                    if (startIndex === -1 || duration <= 0) return null;

                    return (
                      <div
                        key={`${workload.engineerId}-${workload.projectId}`}
                        className={`absolute h-8 border-2 rounded-md ${getStatusColor(workload.status)}`}
                        style={{
                          left: `calc(200px + ${startIndex} * 100% / ${displayRange.length})`,
                          width: `calc(${duration} * 100% / ${displayRange.length})`,
                          top: '4px',
                        }}
                      />
                    );
                  })}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-sm">凡例:</div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getStatusColor('planned')}`} />
              <span className="text-sm">予定</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getStatusColor('actual')}`} />
              <span className="text-sm">実績</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getStatusColor('missing')}`} />
              <span className="text-sm">未入力</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
