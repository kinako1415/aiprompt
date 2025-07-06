"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { PromptEditor } from "./PromptEditor";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleCreatePrompt = () => {
    setIsPromptEditorOpen(true);
  };

  const handlePromptSave = (prompt: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    console.log("保存されたプロンプト:", prompt);
    // ここで実際の保存処理を実装
  };

  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <Header 
        onSidebarToggle={handleSidebarToggle}
        onCreatePrompt={handleCreatePrompt}
      />
      
      {/* メインコンテンツエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* サイドバー */}
        <Sidebar isCollapsed={isSidebarCollapsed} />
        
        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* プロンプトエディター */}
      <PromptEditor
        open={isPromptEditorOpen}
        onOpenChange={setIsPromptEditorOpen}
        onSave={handlePromptSave}
      />
    </div>
  );
}
