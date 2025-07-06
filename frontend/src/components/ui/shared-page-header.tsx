"use client";

import { Button } from "@/components/ui/button";
import { Users, UserPlus, Share2 } from "lucide-react";

interface SharedPageHeaderProps {
  onInviteMember?: () => void;
  onSharePrompt?: () => void;
}

export function SharedPageHeader({ 
  onInviteMember, 
  onSharePrompt 
}: SharedPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          共有・チーム
        </h1>
        <p className="text-gray-600 mt-1">チームメンバーと共有されたプロンプトを管理</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onInviteMember || (() => {})}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          メンバー招待
        </Button>
        <Button 
          size="sm"
          onClick={onSharePrompt || (() => {})}
        >
          <Share2 className="h-4 w-4 mr-2" />
          プロンプト共有
        </Button>
      </div>
    </div>
  );
}
