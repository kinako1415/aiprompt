"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Settings } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "active" | "away" | "offline";
}

interface TeamMembersSectionProps {
  members: TeamMember[];
  onManagePermissions?: () => void;
}

export function TeamMembersSection({ 
  members, 
  onManagePermissions 
}: TeamMembersSectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "away":
        return "secondary";
      case "offline":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "オンライン";
      case "away":
        return "離席中";
      case "offline":
        return "オフライン";
      default:
        return "不明";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            チームメンバー
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onManagePermissions || (() => {})}
          >
            <Settings className="h-4 w-4 mr-2" />
            権限設定
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  {member.role}
                  <Badge 
                    variant={getStatusColor(member.status)} 
                    className="ml-2 text-xs"
                  >
                    {getStatusText(member.status)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
