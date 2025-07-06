import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Home,
  FileText,
  Star,
  Puzzle,
  Users,
  Trophy,
  BarChart3,
  Settings,
  Filter,
  Calendar,
  Tag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
}

const menuItems = [
  { icon: Home, label: "ダッシュボード", href: "/dashboard", badge: null },
  { icon: FileText, label: "マイプロンプト", href: "/my-prompts", badge: 243 },
  { icon: Star, label: "お気に入り", href: "/favorites", badge: 12 },
  { icon: Puzzle, label: "テンプレート", href: "/templates", badge: 8 },
  { icon: Users, label: "共有・チーム", href: "/shared", badge: 3 },
  { icon: Trophy, label: "コミュニティ", href: "/community", badge: null },
  { icon: BarChart3, label: "統計・分析", href: "/analytics", badge: null },
  { icon: Settings, label: "設定", href: "/settings", badge: null },
];

const filterCategories = [
  { name: "文章生成", count: 87, color: "bg-blue-500" },
  { name: "画像生成", count: 23, color: "bg-green-500" },
  { name: "コード生成", count: 45, color: "bg-purple-500" },
  { name: "分析・要約", count: 34, color: "bg-orange-500" },
  { name: "翻訳", count: 19, color: "bg-red-500" },
  { name: "アイデア出し", count: 31, color: "bg-yellow-500" },
];

export function Sidebar({ isCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showCategories, setShowCategories] = useState(true);
  const [showTags, setShowTags] = useState(true);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div
      className={`h-full bg-white border-r border-gray-100 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-900">PromptHub</h1>
        )}
      </div>

      <ScrollArea className="flex-1">
        {/* Main Navigation */}
        <nav className="p-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  isCollapsed ? "px-2" : "px-3"
                } ${
                  pathname === item.href
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </div>
        </nav>

        {/* Filters Section */}
        {!isCollapsed && (
          <div className="p-2 border-t border-gray-100 mt-4">
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">カテゴリー</span>
                  {showCategories ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                {showCategories && (
                  <div className="ml-4 mt-2 space-y-1">
                    {filterCategories.map((category) => (
                      <Button
                        key={category.name}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start p-2 h-auto text-gray-600 hover:bg-gray-50"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${category.color} mr-2`}
                        />
                        <span className="flex-1 text-left text-sm">
                          {category.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-auto text-xs border-gray-100 text-gray-500"
                        >
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowTags(!showTags)}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">タグ</span>
                  {showTags ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                {showTags && (
                  <div className="ml-4 mt-2 space-y-1">
                    {["チャット", "コード", "画像", "分析", "翻訳"].map(
                      (tag) => (
                        <Button
                          key={tag}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start p-2 h-auto text-gray-600 hover:bg-gray-50"
                        >
                          <span className="text-sm">{tag}</span>
                        </Button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Date Filter */}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-2 text-gray-700 hover:bg-gray-100"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">作成日</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
