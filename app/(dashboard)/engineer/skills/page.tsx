"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, Trash2, Award, ChevronDown, ChevronUp, Edit2, Star 
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockEngineers, Skill } from "@/lib/data";

// スキル入力フォームのスキーマ
const skillFormSchema = z.object({
  name: z.string().min(1, "スキル名を入力してください"),
  category: z.string().min(1, "カテゴリを選択してください"),
  level: z.coerce.number().min(1).max(5),
  experienceYears: z.coerce.number().min(0.1, "経験年数を入力してください"),
});

// プロジェクト入力フォームのスキーマ
const projectFormSchema = z.object({
  name: z.string().min(1, "プロジェクト名を入力してください"),
  role: z.string().min(1, "役割を入力してください"),
  description: z.string().min(1, "説明を入力してください"),
  startDate: z.string().min(1, "開始日を入力してください"),
  endDate: z.string().optional(),
  skills: z.array(z.string()).min(1, "スキルを1つ以上選択してください"),
  responsibilities: z.string().min(1, "担当業務を入力してください"),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;
type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function EngineerSkillsPage() {
  // モックデータからエンジニア情報を取得（実際はログインユーザー）
  const engineer = mockEngineers[0];
  
  const [skills, setSkills] = useState<Skill[]>(engineer.skills);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [skillsByCategory, setSkillsByCategory] = useState(() => {
    return engineer.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  });
  
  // スキル追加・編集フォーム
  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      category: "",
      level: 3,
      experienceYears: 1,
    },
  });
  
  // スキル追加・編集の送信処理
  const onSubmitSkill = (data: SkillFormValues) => {
    if (editingSkillIndex !== null) {
      // スキルの編集
      const updatedSkills = [...skills];
      updatedSkills[editingSkillIndex] = data as Skill;
      setSkills(updatedSkills);
      
      // カテゴリごとのスキルも更新
      updateSkillsByCategory(updatedSkills);
      
      setEditingSkillIndex(null);
    } else {
      // 新しいスキルの追加
      const newSkills = [...skills, data as Skill];
      setSkills(newSkills);
      
      // カテゴリごとのスキルも更新
      updateSkillsByCategory(newSkills);
    }
    
    // フォームのリセットと入力状態の終了
    skillForm.reset();
    setIsAddingSkill(false);
  };
  
  // スキル削除
  const deleteSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    updateSkillsByCategory(updatedSkills);
  };
  
  // スキル編集の開始
  const startEditingSkill = (skill: Skill, index: number) => {
    skillForm.reset({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      experienceYears: skill.experienceYears,
    });
    setEditingSkillIndex(index);
    setIsAddingSkill(true);
  };
  
  // カテゴリごとのスキル更新
  const updateSkillsByCategory = (updatedSkills: Skill[]) => {
    const newSkillsByCategory = updatedSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    
    setSkillsByCategory(newSkillsByCategory);
  };
  
  // 総経験年数の計算
  const calculateTotalExperience = () => {
    const experienceYears = skills.reduce((acc, skill) => acc + skill.experienceYears, 0);
    const uniqueYears = Math.min(Math.max(Math.round(experienceYears / skills.length), 1), 20);
    return uniqueYears;
  };
  
  // カテゴリの表示名
  const categoryDisplayNames: Record<string, string> = {
    language: "プログラミング言語",
    framework: "フレームワーク",
    database: "データベース",
    infrastructure: "インフラ・クラウド",
    tool: "ツール",
    other: "その他",
  };
  
  // カテゴリの選択肢
  const categoryOptions = [
    { value: "language", label: "プログラミング言語" },
    { value: "framework", label: "フレームワーク" },
    { value: "database", label: "データベース" },
    { value: "infrastructure", label: "インフラ・クラウド" },
    { value: "tool", label: "ツール" },
    { value: "other", label: "その他" },
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
          <h1 className="text-3xl font-bold tracking-tight">スキル情報</h1>
          <p className="text-muted-foreground">
            スキルや経験を登録・更新する
          </p>
        </div>
        <Button 
          onClick={() => {
            setIsAddingSkill(true);
            setEditingSkillIndex(null);
            skillForm.reset({
              name: "",
              category: "",
              level: 3,
              experienceYears: 1,
            });
          }}
          size="sm" 
          className="gap-2"
          disabled={isAddingSkill}
        >
          <Plus className="h-4 w-4" />
          新しいスキルを追加
        </Button>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <AnimatePresence>
            {isAddingSkill && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{editingSkillIndex !== null ? "スキルを編集" : "新しいスキルを追加"}</CardTitle>
                    <CardDescription>
                      スキル情報を入力してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...skillForm}>
                      <form onSubmit={skillForm.handleSubmit(onSubmitSkill)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={skillForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>スキル名</FormLabel>
                                <FormControl>
                                  <Input placeholder="JavaScriptなど" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={skillForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>カテゴリ</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="カテゴリを選択" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categoryOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={skillForm.control}
                            name="level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>スキルレベル (1-5)</FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input type="number" min="1" max="5" {...field} />
                                  </FormControl>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map(level => (
                                      <Star
                                        key={level}
                                        className={`h-5 w-5 ${level <= field.value ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <FormDescription>
                                  1: 基礎知識あり、5: エキスパート
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={skillForm.control}
                            name="experienceYears"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>経験年数</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.5" min="0.1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  そのスキルを使用した年数
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsAddingSkill(false);
                              setEditingSkillIndex(null);
                              skillForm.reset();
                            }}
                          >
                            キャンセル
                          </Button>
                          <Button type="submit">
                            {editingSkillIndex !== null ? "更新" : "追加"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Card>
            <CardHeader>
              <CardTitle>登録スキル一覧</CardTitle>
              <CardDescription>
                保有スキルとその経験年数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(skillsByCategory).length > 0 ? (
                <Accordion type="multiple" className="w-full">
                  {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{categoryDisplayNames[category] || category}</span>
                          <Badge variant="outline">
                            {categorySkills.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {categorySkills
                            .sort((a, b) => b.level - a.level)
                            .map((skill, index) => {
                              const globalIndex = skills.findIndex(s => s.name === skill.name && s.category === skill.category);
                              return (
                                <motion.div
                                  key={skill.name}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="bg-muted/30 p-3 rounded-lg"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{skill.name}</h3>
                                        <Badge variant="outline">
                                          {skill.experienceYears}年
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map(level => (
                                            <Star
                                              key={level}
                                              className={`h-4 w-4 ${level <= skill.level ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => startEditingSkill(skill, globalIndex)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteSkill(globalIndex)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">まだスキルが登録されていません</p>
                  <Button onClick={() => setIsAddingSkill(true)}>
                    スキルを追加する
                  </Button>
                </div>
              )}
            </CardContent>
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
              <CardTitle>スキルサマリー</CardTitle>
              <CardDescription>
                スキル経験のまとめ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">総経験年数</span>
                <span className="text-2xl font-bold">{calculateTotalExperience()}年</span>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">カテゴリ別経験</h3>
                {Object.entries(skillsByCategory)
                  .sort((a, b) => {
                    const aTotal = a[1].reduce((sum, skill) => sum + skill.experienceYears, 0);
                    const bTotal = b[1].reduce((sum, skill) => sum + skill.experienceYears, 0);
                    return bTotal - aTotal;
                  })
                  .map(([category, categorySkills]) => {
                    const totalYears = categorySkills.reduce((sum, skill) => sum + skill.experienceYears, 0);
                    const averageYears = totalYears / categorySkills.length;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{categoryDisplayNames[category] || category}</span>
                          <span className="text-sm font-medium">{averageYears.toFixed(1)}年</span>
                        </div>
                        <Progress 
                          value={(averageYears / 10) * 100} 
                          className="h-2" 
                        />
                      </div>
                    );
                  })}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">トップスキル</h3>
                <div className="space-y-2">
                  {skills
                    .sort((a, b) => {
                      if (b.level !== a.level) return b.level - a.level;
                      return b.experienceYears - a.experienceYears;
                    })
                    .slice(0, 5)
                    .map((skill, index) => (
                      <div key={skill.name} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{skill.name}</p>
                            <Badge variant="outline">
                              {skill.experienceYears}年
                            </Badge>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(level => (
                              <Star
                                key={level}
                                className={`h-3.5 w-3.5 ${level <= skill.level ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>最近の案件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {engineer.projects.slice(0, 2).map((project) => (
                <div key={project.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{project.role}</p>
                  <div className="text-xs text-muted-foreground mb-2">
                    {project.startDate} 〜 {project.endDate || "現在"}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.skills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/engineer/history">
                    すべての案件を表示
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}