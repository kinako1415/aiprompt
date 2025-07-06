"use client";

import { StatsCard } from "@/components/ui/stats-card";
import { Users, Share2, Edit, Clock } from "lucide-react";

interface SharedPageStatsProps {
  sharedPromptsCount: number;
  teamMembersCount: number;
  collaborativeCount: number;
  lastUpdated: string;
}

export function SharedPageStats({
  sharedPromptsCount,
  teamMembersCount,
  collaborativeCount,
  lastUpdated
}: SharedPageStatsProps) {
  const stats = [
    {
      title: "共有プロンプト数",
      value: sharedPromptsCount.toString(),
      change: "+1",
      changeType: "positive" as const,
      icon: Share2
    },
    {
      title: "チームメンバー",
      value: teamMembersCount.toString(),
      change: "アクティブ",
      changeType: "neutral" as const,
      icon: Users
    },
    {
      title: "共同編集",
      value: collaborativeCount.toString(),
      change: "編集可能",
      changeType: "neutral" as const,
      icon: Edit
    },
    {
      title: "最終更新",
      value: lastUpdated,
      change: "最新の共有",
      changeType: "neutral" as const,
      icon: Clock
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={<stat.icon className="h-5 w-5" />}
        />
      ))}
    </div>
  );
}
