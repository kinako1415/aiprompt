import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Search,
  Bell,
  Plus,
  Menu,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Command,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const handleCreatePrompt = () => {
    router.push("/prompts/new");
  };

  const searchSuggestions = [
    "ChatGPT プロンプト",
    "画像生成 プロンプト",
    "文章作成 テンプレート",
    "コード生成 プロンプト",
    "翻訳 プロンプト",
  ];

  const notifications = [
    {
      id: 1,
      title: "新しいコメント",
      message: "「商品説明文生成」プロンプトに新しいコメントが追加されました",
      time: "2分前",
      unread: true,
    },
    {
      id: 2,
      title: "A/Bテスト完了",
      message: "マーケティング用プロンプトのA/Bテストが完了しました",
      time: "1時間前",
      unread: true,
    },
    {
      id: 3,
      title: "共有プロンプト更新",
      message: "チームメンバーがプロンプトを更新しました",
      time: "3時間前",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4">
      {/* Left Section */}

      <Button
        variant="ghost"
        size="sm"
        onClick={onSidebarToggle}
        className="p-1 hover:bg-gray-100"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Search Bar */}
      <div className="relative w-1/2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="プロンプトを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchSuggestions(true)}
            onBlur={() =>
              setTimeout(() => setShowSearchSuggestions(false), 200)
            }
            className="pl-10 pr-12 border-gray-100 focus:border-gray-100 focus:ring-1 focus:ring-gray-100"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-100 bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        {/* Search Suggestions */}
        {showSearchSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-md shadow-lg z-50">
            <div className="p-1">
              <div className="text-xs text-gray-500 mb-1 px-2 font-medium">
                最近の検索
              </div>
              {searchSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-1.5 h-auto hover:bg-gray-50"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSearchSuggestions(false);
                  }}
                >
                  <Search className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="text-sm font-normal">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Create Button */}
        <Button
          onClick={handleCreatePrompt}
          className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>新規作成</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative p-1 hover:bg-gray-100"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-semibold">
              通知
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-2">
                <div className="flex items-start space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      notification.unread ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900">
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 font-normal">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-light">
                      {notification.time}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-blue-50">
              <span className="text-sm text-blue-600 font-medium">
                すべての通知を表示
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">田中太郎</p>
                <p className="text-xs text-gray-500 font-normal">
                  tanaka@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-50">
              <User className="mr-2 h-4 w-4" />
              <span className="font-medium">プロフィール</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50">
              <Settings className="mr-2 h-4 w-4" />
              <span className="font-medium">設定</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span className="font-medium">ヘルプ</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-red-50 text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-medium">ログアウト</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
