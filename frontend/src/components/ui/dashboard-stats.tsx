"use client";

import { StatsCard } from "@/components/ui/stats-card";
import { LucideIcon } from "lucide-react";

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

interface DashboardStatsProps {
  stats: DashboardStat[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
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
