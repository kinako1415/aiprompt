"use client";

import { ReactNode } from "react";

interface StatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
}

interface StatsSummaryProps {
  title?: string;
  stats: StatItem[];
  className?: string;
}

export function StatsSummary({ 
  title, 
  stats, 
  className = "" 
}: StatsSummaryProps) {
  const getColorClasses = (color?: string) => {
    switch (color) {
      case "primary":
        return "text-blue-600 bg-blue-50";
      case "secondary":
        return "text-gray-600 bg-gray-50";
      case "success":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "danger":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            {stat.icon && (
              <div className={`inline-flex p-2 rounded-lg mb-2 ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>
            )}
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
