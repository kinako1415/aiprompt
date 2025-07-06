"use client";

import { Dashboard } from "@/components/Dashboard";

export default function DashboardPage() {
  const handleCreatePrompt = () => {
    console.log("ダッシュボードから新規作成がクリックされました");
  };

  return <Dashboard onCreatePrompt={handleCreatePrompt} />;
}
