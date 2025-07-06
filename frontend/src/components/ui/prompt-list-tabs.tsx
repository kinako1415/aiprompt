"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptCard } from "@/components/PromptCard";

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

interface PromptListTabsProps {
  prompts: Prompt[];
  activeTab: string;
  onTabChange: (value: string) => void;
  viewMode: "grid" | "list";
  onPromptEdit: (id: string) => void;
  onPromptDelete: (id: string) => void;
  onPromptRun: (id: string) => void;
  onPromptLike: (id: string) => void;
  onPromptShare: (id: string) => void;
}

export function PromptListTabs({
  prompts,
  activeTab,
  onTabChange,
  viewMode,
  onPromptEdit,
  onPromptDelete,
  onPromptRun,
  onPromptLike,
  onPromptShare
}: PromptListTabsProps) {
  const getGridClasses = () => {
    return viewMode === "grid"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1";
  };

  const renderPromptGrid = (filteredPrompts: Prompt[]) => (
    <div className={`grid gap-4 ${getGridClasses()}`}>
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onEdit={onPromptEdit}
          onDelete={onPromptDelete}
          onRun={onPromptRun}
          onLike={onPromptLike}
          onShare={onPromptShare}
        />
      ))}
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">すべて</TabsTrigger>
        <TabsTrigger value="recent">最近使用</TabsTrigger>
        <TabsTrigger value="favorites">お気に入り</TabsTrigger>
        <TabsTrigger value="public">公開中</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        {renderPromptGrid(prompts)}
      </TabsContent>

      <TabsContent value="recent">
        {renderPromptGrid(prompts.slice(0, 2))}
      </TabsContent>

      <TabsContent value="favorites">
        {renderPromptGrid(prompts.filter(p => p.isFavorite))}
      </TabsContent>

      <TabsContent value="public">
        {renderPromptGrid(prompts.filter(p => p.isPublic))}
      </TabsContent>
    </Tabs>
  );
}
