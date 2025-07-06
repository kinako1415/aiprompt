"use client";

import { useState } from "react";
import { SharedPageHeader } from "@/components/ui/shared-page-header";
import { SharedPageStats } from "@/components/ui/shared-page-stats";
import { TeamMembersSection } from "@/components/ui/team-members-section";
import { SharedPromptList } from "@/components/ui/shared-prompt-list";

// チーム・共有プロンプトのサンプルデータ
const sharedPrompts = [
  {
    id: "shared-1",
    title: "チーム用API文書作成プロンプト",
    description: "API仕様書を自動生成するためのチーム共有プロンプト",
    content: "あなたは技術文書作成のエキスパートです。以下のAPIエンドポイント情報を基に、開発者向けの詳細な文書を作成してください。",
    category: "文章生成",
    tags: ["API", "文書作成", "チーム"],
    author: {
      id: "user1",
      name: "開発チーム",
      avatar: "/team-avatar.png"
    },
    rating: 4.6,
    ratingCount: 12,
    usageCount: 156,
    viewCount: 890,
    likeCount: 23,
    isPublic: true,
    isFavorite: false,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    sharedWith: ["チーム全体"],
    permissions: "編集可能"
  },
  {
    id: "shared-2",
    title: "プロジェクト進捗レポート生成",
    description: "週次・月次のプロジェクト進捗レポートを自動作成",
    content: "プロジェクトマネージャーとして、以下の情報を基に進捗レポートを作成してください。",
    category: "分析・要約",
    tags: ["レポート", "プロジェクト管理", "ビジネス"],
    author: {
      id: "user2",
      name: "PM部門",
      avatar: "/pm-avatar.png"
    },
    rating: 4.8,
    ratingCount: 8,
    usageCount: 89,
    viewCount: 567,
    likeCount: 34,
    isPublic: true,
    isFavorite: true,
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
    sharedWith: ["PM部門", "開発チーム"],
    permissions: "閲覧のみ"
  }
];

const teamMembers = [
  { id: "1", name: "田中太郎", role: "開発者", avatar: "/avatar1.png", status: "active" as const },
  { id: "2", name: "佐藤花子", role: "デザイナー", avatar: "/avatar2.png", status: "active" as const },
  { id: "3", name: "鈴木次郎", role: "PM", avatar: "/avatar3.png", status: "away" as const },
];

export default function SharedPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("shared");

  const handlePromptAction = (action: string, promptId: string) => {
    console.log(`${action} action for prompt ${promptId}`);
  };

  const handleInviteMember = () => {
    console.log("Invite member clicked");
  };

  const handleSharePrompt = () => {
    console.log("Share prompt clicked");
  };

  const handleManagePermissions = () => {
    console.log("Manage permissions clicked");
  };

  const handleFilter = () => {
    console.log("Filter clicked");
  };

  return (
    <div className="p-6 space-y-6">
      {/* ページヘッダー */}
      <SharedPageHeader 
        onInviteMember={handleInviteMember}
        onSharePrompt={handleSharePrompt}
      />

      {/* 統計情報 */}
      <SharedPageStats
        sharedPromptsCount={sharedPrompts.length}
        teamMembersCount={teamMembers.length}
        collaborativeCount={2}
        lastUpdated="3日前"
      />

      {/* チームメンバー */}
      <TeamMembersSection 
        members={teamMembers}
        onManagePermissions={handleManagePermissions}
      />

      {/* 共有プロンプト一覧 */}
      <SharedPromptList
        prompts={sharedPrompts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPromptAction={handlePromptAction}
        onFilter={handleFilter}
      />
    </div>
  );
}
