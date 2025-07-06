"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActionButton } from "@/components/ui/quick-action-button";
import { Plus, FileText, Upload, Sparkles } from "lucide-react";

interface QuickActionsSectionProps {
  onCreatePrompt: () => void;
  onCreateFromTemplate?: () => void;
  onImport?: () => void;
  onAiAssistant?: () => void;
}

export function QuickActionsSection({
  onCreatePrompt,
  onCreateFromTemplate,
  onImport,
  onAiAssistant
}: QuickActionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span>クイックアクション</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={<Plus className="h-6 w-6" />}
            label="新規プロンプト作成"
            onClick={onCreatePrompt}
          />
          <QuickActionButton
            icon={<FileText className="h-6 w-6" />}
            label="テンプレートから作成"
            onClick={onCreateFromTemplate || (() => {})}
            variant="outline"
          />
          <QuickActionButton
            icon={<Upload className="h-6 w-6" />}
            label="インポート"
            onClick={onImport || (() => {})}
            variant="outline"
          />
          <QuickActionButton
            icon={<Sparkles className="h-6 w-6" />}
            label="AIアシスタント"
            onClick={onAiAssistant || (() => {})}
            variant="outline"
          />
        </div>
      </CardContent>
    </Card>
  );
}
