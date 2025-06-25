'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  isMultiple?: boolean;
  storeCount?: number;
  selectedStores?: Array<{ id: string; name: string; email: string }>;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  storeName,
  isMultiple = false,
  storeCount = 1,
  selectedStores = [],
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    // 削除処理（実装不要）
    console.log('削除確定');
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold border-b pb-4">削除の確認</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <p className="text-base mb-4">
            {isMultiple
              ? `選択した${storeCount}件の加盟店を削除します。`
              : '選択した加盟店を削除します。'}
          </p>
          {isMultiple ? (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">削除対象の加盟店：</p>
              <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                {selectedStores.map((store, index) => (
                  <div key={store.id} className="flex items-center py-1">
                    <span className="text-sm">
                      {index + 1}. {store.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({store.email})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-base">加盟店名：{storeName}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-8 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            確定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
