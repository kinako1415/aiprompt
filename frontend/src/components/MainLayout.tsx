"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <Header onSidebarToggle={handleSidebarToggle} />

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* サイドバー */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
