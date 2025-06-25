'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InviteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesName?: string;
  salesList?: Array<{ id: string; name: string; email: string }>;
  onConfirm: () => void;
}

export function InviteConfirmationModal({
  isOpen,
  onClose,
  salesName,
  salesList,
  onConfirm,
}: InviteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* ヘッダー */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">招待の確認</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* コンテンツ */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700">選択した営業を招待します。</p>

                {/* 単一営業の場合 */}
                {salesName && !salesList && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">営業名：</p>
                    <p className="font-medium">{salesName}</p>
                  </div>
                )}

                {/* 複数営業の場合 */}
                {salesList && salesList.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">
                      選択した営業（{salesList.length}名）：
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {salesList.map((sales) => (
                        <div
                          key={sales.id}
                          className="flex items-center gap-3 p-2 bg-white rounded border"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">
                              {sales.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{sales.name}</p>
                            <p className="text-xs text-gray-500">{sales.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* フッター */}
              <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                <Button variant="outline" onClick={onClose} className="px-6">
                  キャンセル
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="px-6 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  確定
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
