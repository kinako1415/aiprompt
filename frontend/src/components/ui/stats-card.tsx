"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  description?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = () => {
    if (changeType === "positive") {
      return <TrendingUp className="h-3 w-3 mr-1" />;
    } else if (changeType === "negative") {
      return <TrendingDown className="h-3 w-3 mr-1" />;
    }
    return null;
  };

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1 font-medium">{title}</p>
            <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
            {change && (
              <p
                className={`text-xs flex items-center font-medium ${getChangeColor()}`}
              >
                {getTrendIcon()}
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-1 font-normal">
                {description}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="text-gray-600">{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
