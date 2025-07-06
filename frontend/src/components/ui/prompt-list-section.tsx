"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ViewModeToggle } from "@/components/ui/view-mode-toggle";
import { PromptListTabs } from "@/components/ui/prompt-list-tabs";
import { Filter } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  ratingCount: number;
  likeCount: number;
  viewCount: number;
  usageCount: number;
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptListSectionProps {
  prompts: Prompt[];
  activeTab: string;
  onTabChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onPromptEdit: (id: string) => void;
  onPromptDelete: (id: string) => void;
  onPromptRun: (id: string) => void;
  onPromptLike: (id: string) => void;
  onPromptShare: (id: string) => void;
  onFilter?: () => void;
}

export function PromptListSection({
  prompts,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  onPromptEdit,
  onPromptDelete,
  onPromptRun,
  onPromptLike,
  onPromptShare,
  onFilter
}: PromptListSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>プロンプト一覧</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onFilter || (() => {})}
            >
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
            <ViewModeToggle 
              value={viewMode} 
              onChange={onViewModeChange} 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PromptListTabs
          prompts={prompts}
          activeTab={activeTab}
          onTabChange={onTabChange}
          viewMode={viewMode}
          onPromptEdit={onPromptEdit}
          onPromptDelete={onPromptDelete}
          onPromptRun={onPromptRun}
          onPromptLike={onPromptLike}
          onPromptShare={onPromptShare}
        />
      </CardContent>
    </Card>
  );
}
