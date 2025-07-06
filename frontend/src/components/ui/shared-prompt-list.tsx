"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptCard } from "@/components/PromptCard";
import { ViewModeToggle } from "@/components/ui/view-mode-toggle";
import { FilterButton } from "@/components/ui/filter-button";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Search, 
  Users,
  Clock,
  Plus,
  Share2
} from "lucide-react";

interface SharedPrompt {
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
  usageCount: number;
  viewCount: number;
  likeCount: number;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  sharedWith?: string[];
  permissions?: string;
}

interface SharedPromptListProps {
  prompts: SharedPrompt[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  onPromptAction: (action: string, promptId: string) => void;
  onFilter?: () => void;
}

export function SharedPromptList({
  prompts,
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeTab,
  onTabChange,
  onPromptAction,
  onFilter
}: SharedPromptListProps) {
  const renderPromptGrid = (filteredPrompts: SharedPrompt[]) => (
    <div className={`grid gap-4 ${
      viewMode === "grid" 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1"
    }`}>
      {filteredPrompts.map((prompt) => (
        <div key={prompt.id} className="relative">
          <PromptCard
            prompt={prompt}
            onEdit={() => onPromptAction("edit", prompt.id)}
            onDelete={() => onPromptAction("delete", prompt.id)}
            onRun={() => onPromptAction("run", prompt.id)}
            onLike={() => onPromptAction("like", prompt.id)}
            onShare={() => onPromptAction("share", prompt.id)}
          />
          {/* 共有情報オーバーレイ */}
          {prompt.permissions && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {prompt.permissions}
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="共有プロンプトを検索..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <FilterButton onClick={onFilter} />
          </div>

          <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="shared">共有プロンプト ({prompts.length})</TabsTrigger>
            <TabsTrigger value="collaborative">
              <Users className="h-4 w-4 mr-1" />
              共同編集
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-1" />
              最近の活動
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shared">
            {prompts.length > 0 ? (
              renderPromptGrid(prompts)
            ) : (
              <EmptyState
                icon={<Share2 className="h-12 w-12" />}
                title="共有プロンプトがまだありません"
                description="チームメンバーとプロンプトを共有して、コラボレーションを始めましょう"
                action={{
                  label: "最初のプロンプトを共有",
                  onClick: () => onPromptAction("create", "new"),
                  icon: <Plus className="h-4 w-4" />
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="collaborative">
            {renderPromptGrid(prompts.filter(p => p.permissions === "編集可能"))}
          </TabsContent>

          <TabsContent value="recent">
            {renderPromptGrid(prompts.slice(0, 3))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
