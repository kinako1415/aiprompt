"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "./utils";

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
  disabled?: boolean;
  className?: string;
}

export function QuickActionButton({
  icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
  className,
}: QuickActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={cn(
        "h-24 flex flex-col items-center justify-center space-y-2 min-w-0 rounded-lg border transition-all duration-200",
        variant === "default"
          ? "bg-gray-900 hover:bg-gray-800 text-white border-gray-900"
          : "border-gray-100 hover:bg-gray-50 hover:border-gray-200",
        className
      )}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium text-center leading-tight px-1">
        {label}
      </span>
    </Button>
  );
}
