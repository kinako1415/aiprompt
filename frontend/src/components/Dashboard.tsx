import { useState } from "react";
import { DashboardStats } from "./ui/dashboard-stats";
import { QuickActionsSection } from "./ui/quick-actions-section";
import { PromptListSection } from "./ui/prompt-list-section";
import { TrendingUp, FileText, Star, Eye } from "lucide-react";

interface DashboardProps {
  onCreatePrompt: () => void;
}

// Sample data
const dashboardStats = [
  {
    title: "総プロンプト数",
    value: "243",
    change: "+12",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "平均評価",
    value: "4.2",
    change: "+0.3",
    changeType: "positive" as const,
    icon: Star,
  },
  {
    title: "今月の使用数",
    value: "1,847",
    change: "+234",
    changeType: "positive" as const,
    icon: Eye,
  },
  {
    title: "今月の改善率",
    value: "23%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

const samplePrompts = [
  {
    id: "1",
    title: "商品説明文生成プロンプト",
    description:
      "ECサイト用の魅力的な商品説明文を生成するためのプロンプトテンプレート",
    content:
      "あなたは優秀なコピーライターです。以下の商品情報を基に、魅力的で購買意欲をそそる商品説明文を作成してください。\n\n商品名: {{product_name}}\n価格: {{price}}\n特徴: {{features}}\n\n以下の要素を含めてください：\n- 商品の主要な特徴とメリット\n- ターゲット顧客への訴求ポイント\n- 購入を促す魅力的な表現",
    category: "文章生成",
    tags: ["EC", "コピーライティング", "マーケティング"],
    rating: 4.8,
    ratingCount: 24,
    likeCount: 123,
    viewCount: 1200,
    usageCount: 89,
    createdAt: "2024-01-15",
    updatedAt: "3日前",
    author: {
      id: "user1",
      name: "田中太郎",
    },
    isFavorite: true,
    isPublic: true,
  },
  {
    id: "2",
    title: "コードレビュー支援プロンプト",
    description: "コードの品質チェックと改善提案を行うためのプロンプト",
    content:
      "あなたは経験豊富なシニアエンジニアです。以下のコードをレビューし、改善点を指摘してください：\n\n```{{language}}\n{{code}}\n```\n\n以下の観点から評価してください：\n- コードの可読性\n- パフォーマンス\n- セキュリティ\n- ベストプラクティス\n- バグの可能性",
    category: "コード生成",
    tags: ["コードレビュー", "プログラミング", "エンジニア"],
    rating: 4.5,
    ratingCount: 18,
    likeCount: 87,
    viewCount: 890,
    usageCount: 45,
    createdAt: "2024-01-10",
    updatedAt: "1週間前",
    author: {
      id: "user2",
      name: "佐藤花子",
    },
    isFavorite: false,
    isPublic: false,
  },
  {
    id: "3",
    title: "会議議事録要約プロンプト",
    description:
      "長い会議の議事録から要点を抽出し、アクションアイテムを整理するプロンプト",
    content:
      "以下の会議議事録を分析し、要約してください：\n\n{{meeting_transcript}}\n\n以下の形式で整理してください：\n\n## 会議概要\n- 日時：\n- 参加者：\n- 議題：\n\n## 主要な決定事項\n\n## アクションアイテム\n- [ ] 担当者：期限：内容\n\n## 次回会議予定",
    category: "分析・要約",
    tags: ["会議", "議事録", "ビジネス"],
    rating: 4.3,
    ratingCount: 31,
    likeCount: 156,
    viewCount: 1500,
    usageCount: 78,
    createdAt: "2024-01-08",
    updatedAt: "5日前",
    author: {
      id: "user3",
      name: "鈴木次郎",
    },
    isFavorite: true,
    isPublic: true,
  },
  {
    id: "4",
    title: "SNS投稿文生成プロンプト",
    description: "Twitter/X用の魅力的な投稿文を生成するプロンプト",
    content:
      "あなたはソーシャルメディアの専門家です。以下のトピックについて、エンゲージメントの高いSNS投稿文を作成してください：\n\nトピック: {{topic}}\n対象オーディエンス: {{audience}}\n\n要件：\n- 280文字以内\n- 適切なハッシュタグを含める\n- 読者の関心を引く書き出し\n- アクションを促す結び",
    category: "文章生成",
    tags: ["SNS", "マーケティング", "Twitter"],
    rating: 4.1,
    ratingCount: 42,
    likeCount: 203,
    viewCount: 2100,
    usageCount: 134,
    createdAt: "2024-01-05",
    updatedAt: "2日前",
    author: {
      id: "user4",
      name: "山田美咲",
    },
    isFavorite: false,
    isPublic: true,
  },
];

export function Dashboard({ onCreatePrompt }: DashboardProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  const handlePromptEdit = (id: string) => {
    console.log("Edit prompt:", id);
  };

  const handlePromptDelete = (id: string) => {
    console.log("Delete prompt:", id);
  };

  const handlePromptRun = (id: string) => {
    console.log("Run prompt:", id);
  };

  const handlePromptLike = (id: string) => {
    console.log("Toggle favorite:", id);
  };

  const handlePromptShare = (id: string) => {
    console.log("Share prompt:", id);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <DashboardStats stats={dashboardStats} />

      {/* Quick Actions */}
      <QuickActionsSection onCreatePrompt={onCreatePrompt} />

      {/* Prompts Section */}
      <PromptListSection
        prompts={samplePrompts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPromptEdit={handlePromptEdit}
        onPromptDelete={handlePromptDelete}
        onPromptRun={handlePromptRun}
        onPromptLike={handlePromptLike}
        onPromptShare={handlePromptShare}
      />
    </div>
  );
}
