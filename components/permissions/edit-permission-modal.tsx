import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: {
    id: string;
    name: string;
    teamName: string;
    imageUrl: string;
    permissions: {
      engineers: string;
      projects: string;
      clients: string;
      revenue: string;
      edit: boolean;
    };
  };
  onSave: (memberId: string, permissions: any) => void;
}

// 権限テンプレート定義
const permissionTemplates = [
  {
    id: "manager",
    name: "マネージャー",
    permissions: {
      engineers: "all",
      projects: "all",
      clients: "all",
      revenue: "all",
      edit: true,
    },
  },
  {
    id: "leader",
    name: "リーダー",
    permissions: {
      engineers: "team",
      projects: "team",
      clients: "team",
      revenue: "team",
      edit: true,
    },
  },
  {
    id: "member",
    name: "一般メンバー",
    permissions: {
      engineers: "own",
      projects: "own",
      clients: "own",
      revenue: "own",
      edit: false,
    },
  },
];

export function EditPermissionModal({ open, onOpenChange, member, onSave }: EditPermissionModalProps) {
  const [permissions, setPermissions] = useState(member.permissions);
  
  const handleSave = () => {
    onSave(member.id, permissions);
    onOpenChange(false);
  };
  
  const permissionLevels = [
    { value: "all", label: "全体" },
    { value: "team", label: "チーム内" },
    { value: "own", label: "担当のみ" },
    { value: "none", label: "非表示" },
  ];
  
  const getPermissionColor = (level: string) => {
    switch (level) {
      case "all": return "bg-green-100 text-green-700 dark:bg-green-900/30";
      case "team": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30";
      case "own": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30";
      case "none": return "bg-red-100 text-red-700 dark:bg-red-900/30";
      default: return "";
    }
  };

  // テンプレート適用処理
  const applyTemplate = (templateId: string) => {
    const template = permissionTemplates.find(t => t.id === templateId);
    if (template) {
      setPermissions(template.permissions);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>権限設定の編集</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.imageUrl} />
              <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.teamName}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">権限テンプレート</label>
            <Select onValueChange={applyTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="テンプレートを選択" />
              </SelectTrigger>
              <SelectContent>
                {permissionTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-sm font-medium">エンジニア情報</label>
              <Select
                value={permissions.engineers}
                onValueChange={(value) => setPermissions({ ...permissions, engineers: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {permissionLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge variant="outline" className={getPermissionColor(level.value)}>
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-sm font-medium">案件情報</label>
              <Select
                value={permissions.projects}
                onValueChange={(value) => setPermissions({ ...permissions, projects: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {permissionLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge variant="outline" className={getPermissionColor(level.value)}>
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-sm font-medium">企業情報</label>
              <Select
                value={permissions.clients}
                onValueChange={(value) => setPermissions({ ...permissions, clients: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {permissionLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge variant="outline" className={getPermissionColor(level.value)}>
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-sm font-medium">売上情報</label>
              <Select
                value={permissions.revenue}
                onValueChange={(value) => setPermissions({ ...permissions, revenue: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {permissionLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge variant="outline" className={getPermissionColor(level.value)}>
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                checked={permissions.edit}
                onCheckedChange={(checked) => setPermissions({ ...permissions, edit: !!checked })}
              />
              <label className="text-sm font-medium">編集権限を付与</label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}