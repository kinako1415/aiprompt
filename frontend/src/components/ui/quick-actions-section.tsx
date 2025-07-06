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
  onAiAssistant,
}: QuickActionsSectionProps) {
  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Sparkles className="h-5 w-5" />
          <span>クイックアクション</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionButton
            icon={<Plus className="h-6 w-6" />}
            label="新規プロンプト作成"
            onClick={onCreatePrompt}
            className="bg-gray-900 hover:bg-gray-800 text-white border-gray-900"
          />
          <QuickActionButton
            icon={<FileText className="h-6 w-6" />}
            label="テンプレートから作成"
            onClick={onCreateFromTemplate || (() => {})}
            variant="outline"
            className="border-gray-100 hover:bg-gray-50"
          />
          <QuickActionButton
            icon={<Upload className="h-6 w-6" />}
            label="インポート"
            onClick={onImport || (() => {})}
            variant="outline"
            className="border-gray-100 hover:bg-gray-50"
          />
          <QuickActionButton
            icon={<Sparkles className="h-6 w-6" />}
            label="AIアシスタント"
            onClick={onAiAssistant || (() => {})}
            variant="outline"
            className="border-gray-100 hover:bg-gray-50"
          />
        </div>
      </CardContent>
    </Card>
  );
}
