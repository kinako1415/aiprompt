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

export function Sidebar({ isCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

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
      </ScrollArea>
    </div>
  );
}
