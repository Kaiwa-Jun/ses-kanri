'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSalesModal({ isOpen, onClose }: AddSalesModalProps) {
  const [salesName, setSalesName] = useState('');
  const [email, setEmail] = useState('');
  const [teamAssignmentMethod, setTeamAssignmentMethod] = useState('select');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log('営業登録:', {
      salesName,
      email,
      teamAssignmentMethod,
      selectedTeam,
      profileImage,
    });
    // モーダルを閉じる
    onClose();
    // フォームをリセット
    setSalesName('');
    setEmail('');
    setTeamAssignmentMethod('select');
    setSelectedTeam('');
    setProfileImage(null);
  };

  const handleCancel = () => {
    onClose();
    // フォームをリセット
    setSalesName('');
    setEmail('');
    setTeamAssignmentMethod('select');
    setSelectedTeam('');
    setProfileImage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* ヘッダー */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">営業登録</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* コンテンツ */}
              <div className="p-6 space-y-6">
                {/* 顔写真アップロード */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">顔写真</Label>
                  <div className="flex items-start space-x-4">
                    {/* プロフィール画像プレビュー */}
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="プロフィール"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    {/* アップロード領域 */}
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">ドラッグ&ドロップ</p>
                        <p className="text-xs text-gray-500 mb-2">
                          またはクリックしてファイルをアップロード
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 営業名 */}
                <div className="space-y-2">
                  <Label htmlFor="salesName" className="text-sm font-medium">
                    営業名
                  </Label>
                  <Input
                    id="salesName"
                    placeholder="営業名"
                    value={salesName}
                    onChange={(e) => setSalesName(e.target.value)}
                  />
                </div>

                {/* メールアドレス */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    メールアドレス
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* 所属チーム設定方法 */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">所属チーム設定方法</Label>
                  <RadioGroup
                    value={teamAssignmentMethod}
                    onValueChange={setTeamAssignmentMethod}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="select" id="select" />
                      <Label htmlFor="select" className="text-sm">
                        選択
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new" className="text-sm">
                        新規登録
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 所属チーム */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">所属チーム</Label>
                  {teamAssignmentMethod === 'select' ? (
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger>
                        <SelectValue placeholder="所属チーム" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales1">営業1部</SelectItem>
                        <SelectItem value="sales2">営業2部</SelectItem>
                        <SelectItem value="sales3">営業3部</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="新しいチーム名を入力"
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {/* フッター */}
              <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                <Button variant="outline" onClick={handleCancel} className="px-6">
                  キャンセル
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="px-6 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  登録する
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
