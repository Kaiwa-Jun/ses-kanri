"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ChevronLeft, Building2, Mail, Phone, User, FileText, Calendar,
  Users, Star, Briefcase, Edit2, Save, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { mockProjects, type Client } from "@/lib/data";

interface ClientDetailsProps {
  client: Client;
}

export function ClientDetails({ client: initialClient }: ClientDetailsProps) {
  const [client, setClient] = useState(initialClient);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
    // 実際のアプリではここでAPIを呼び出して保存
    setIsEditing(false);
  };

  // モッククライアント詳細データ（実際のアプリではAPIから取得）
  const clientDetails = {
    description: "大手商社。IT投資に積極的で、特にDX推進に注力している。",
    projects: mockProjects.slice(0, 3),
    successfulEngineers: [
      {
        name: "山田太郎",
        role: "フロントエンドリード",
        period: "2022年4月〜2023年3月",
        rating: 4.8,
        imageUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
      },
      {
        name: "鈴木花子",
        role: "バックエンドエンジニア",
        period: "2022年7月〜2023年6月",
        rating: 4.5,
        imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
      }
    ],
    notes: "・新規案件の打診は部長経由で行うこと\n・見積もりは必ず課長の確認を得ること\n・リモートワークに柔軟な対応が可能",
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/sales/clients">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            クライアント一覧に戻る
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
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6" />
                  {isEditing ? (
                    <Input
                      value={client.name}
                      onChange={(e) => setClient({ ...client, name: e.target.value })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{client.name}</h1>
                  )}
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
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">企業概要</h3>
                {isEditing ? (
                  <Textarea
                    value={clientDetails.description}
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{clientDetails.description}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">担当者情報</h3>
                <div className="space-y-4">
                  {client.contacts.map((contact, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <Avatar>
                        <AvatarImage src={contact.imageUrl} />
                        <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.position}</p>
                          </div>
                          {isEditing && (
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">求められるスキル</h3>
                <div className="flex flex-wrap gap-2">
                  {client.preferredSkills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">営業メモ</h3>
                {isEditing ? (
                  <Textarea
                    value={clientDetails.notes}
                    rows={5}
                  />
                ) : (
                  <p className="text-muted-foreground whitespace-pre-line">{clientDetails.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                案件履歴
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {clientDetails.projects.map((project, index) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{project.title}</h3>
                    <Badge variant="outline">
                      {project.startDate} 〜 {project.endDate}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skills.map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {index < clientDetails.projects.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                好評だったエンジニア
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clientDetails.successfulEngineers.map((engineer, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition-colors">
                  <Avatar>
                    <AvatarImage src={engineer.imageUrl} />
                    <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{engineer.name}</p>
                    <p className="text-sm text-muted-foreground">{engineer.role}</p>
                    <p className="text-sm text-muted-foreground">{engineer.period}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(engineer.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{engineer.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                コンタクト履歴
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">最終接触日</p>
                  <p className="font-medium">{client.lastContact}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">次回アポイント</p>
                  <p className="font-medium">{client.nextContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}