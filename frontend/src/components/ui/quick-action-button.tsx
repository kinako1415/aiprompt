"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "./utils";

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  variant?: "default" | "outline";
  disabled?: boolean;
  className?: string;
}

export function QuickActionButton({
  icon,
  label,
  variant = "default",
  disabled = false,
  className,
}: QuickActionButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleSave = () => {
    // 保存処理を実装
    console.log("プロンプトを保存しました。");
    setShowDialog(false);
  };

  const handleClick = () => {
    setShowDialog(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
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

      {showDialog && (
        <Dialog onOpenChange={setShowDialog} open={showDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>保存確認</DialogTitle>
            </DialogHeader>
            <p>プロンプトを保存しますか？</p>
            <DialogFooter>
              <Button onClick={handleSave}>保存</Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                キャンセル
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
