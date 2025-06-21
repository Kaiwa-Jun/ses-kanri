"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Calendar, Clock, FileText, AlertTriangle, Briefcase, BarChart2, ChevronRight, 
  FileInput, Calculator 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockEngineers, mockProjects, mockWorkReports } from "@/lib/data";

export default function EngineerDashboardPage() {
  // エンジニア情報（モックデータ - 実際はログインユーザーから取得）
  const engineer = mockEngineers[0];
  
  // 現在参加中の案件（モックデータ）
  const currentProject = mockProjects[0];
  
  // 稼働報告データ（モックデータ）
  const workReports = mockWorkReports.filter(report => report.engineerId === engineer.id);
  
  // 今月の稼働時間
  const monthlyHours = workReports.reduce((total, report) => total + report.workingHours + report.overtimeHours, 0);
  const targetHours = 160; // 目標稼働時間
  const progressPercentage = Math.min((monthlyHours / targetHours) * 100, 100);
  
  // 過去の案件
  const pastProjects = engineer.projects;
  
  // タスク（モックデータ）
  const tasks = [
    {
      id: "t1",
      title: "今月の稼働報告を提出",
      dueDate: "2023-07-15",
      status: "pending",
      priority: "high",
    },
    {
      id: "t2",
      title: "スキルシートの更新",
      dueDate: "2023-07-20",
      status: "in_progress",
      priority: "medium",
    },
    {
      id: "t3",
      title: "研修資料の確認",
      dueDate: "2023-07-10",
      status: "completed",
      priority: "low",
    },
  ];

  return (
    <div className="container py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">エンジニア　マイページ</h1>
          <p className="text-muted-foreground">
            こんにちは、{engineer.name}さん
          </p>
        </div>
        <Button size="sm" className="gap-2" asChild>
          <Link href="/engineer/reports">
            <FileInput className="h-4 w-4" />
            稼働報告を入力
          </Link>
        </Button>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>現在の案件</CardTitle>
              <CardDescription>
                現在参加中の案件情報
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b">
                <div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-2">
                    進行中
                  </Badge>
                  <h3 className="text-xl font-semibold">{currentProject.title}</h3>
                  <p className="text-muted-foreground">{currentProject.client}</p>
                </div>
                <div className="sm:ml-auto text-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>期間: {currentProject.startDate} 〜 {currentProject.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>勤務形態: {
                      currentProject.workStyle === "remote" ? "リモート" :
                      currentProject.workStyle === "onsite" ? "常駐" : "ハイブリッド"
                    }</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">案件概要</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {currentProject.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {currentProject.skills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" size="sm">
                案件の詳細を表示
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>今月の稼働状況</CardTitle>
              <CardDescription>
                稼働時間の集計と報告状況
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">稼働時間進捗</span>
                  <span className="text-sm font-medium">{monthlyHours} / {targetHours}時間</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  目標達成率: {progressPercentage.toFixed(1)}%
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">稼働日数</p>
                  <p className="text-xl font-bold">{workReports.length}日</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">基本時間</p>
                  <p className="text-xl font-bold">
                    {workReports.reduce((total, report) => total + report.workingHours, 0)}時間
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">残業時間</p>
                  <p className="text-xl font-bold">
                    {workReports.reduce((total, report) => total + report.overtimeHours, 0)}時間
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">承認済み</p>
                  <p className="text-xl font-bold">
                    {workReports.filter(report => report.status === "approved").length}日
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="sm" asChild>
                <Link href="/engineer/reports">
                  稼働報告を入力する
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>プロフィール</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center pb-4">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={engineer.imageUrl} />
                  <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{engineer.name}</h3>
                <p className="text-muted-foreground">{engineer.totalExperience}年の経験</p>
                
                <div className="w-full flex justify-center mt-3">
                  <Badge variant="outline" className={`
                    ${engineer.availability === "available" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                      engineer.availability === "partially" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : 
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}
                  `}>
                    {engineer.availability === "available" ? "稼働可能" : 
                      engineer.availability === "partially" ? "一部稼働可能" : "稼働不可"}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">トップスキル</p>
                  <div className="flex flex-wrap gap-1">
                    {engineer.skills
                      .sort((a, b) => b.level - a.level)
                      .slice(0, 5)
                      .map(skill => (
                      <Badge key={skill.name} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/engineer/skills">
                      スキル情報を編集
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>ToDo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <div className="flex items-start justify-between gap-2 py-2">
                    <div className="flex items-center gap-3">
                      {task.status === "pending" && task.priority === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                      
                      <div>
                        <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            期限: {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`
                        ${task.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                          task.status === "in_progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : 
                          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}
                      `}
                    >
                      {task.status === "completed" ? "完了" : 
                        task.status === "in_progress" ? "進行中" : "未着手"}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>案件履歴</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/engineer/history">
                    すべて表示
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pastProjects.slice(0, 2).map(project => (
                <div
                  key={project.id}
                  className="flex flex-col py-2"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {project.startDate.substring(0, 7)} 〜 {project.endDate ? project.endDate.substring(0, 7) : "現在"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.role}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}