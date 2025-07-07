import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Star,
  Heart,
  Eye,
  Copy,
  Edit,
  Trash2,
  Share2,
  Play,
  MoreHorizontal,
  User,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// カテゴリ別スタイル定義
const getCategoryStyle = (category: string): string => {
  const styles: { [key: string]: string } = {
    文章生成: "bg-blue-100 text-blue-800 border-blue-200",
    画像生成: "bg-green-100 text-green-800 border-green-200",
    コード生成: "bg-purple-100 text-purple-800 border-purple-200",
    "分析・要約": "bg-orange-100 text-orange-800 border-orange-200",
    翻訳: "bg-red-100 text-red-800 border-red-200",
    アイデア出し: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return styles[category] || "bg-gray-100 text-gray-800 border-gray-100";
};

interface PromptCardProps {
  prompt: {
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
  };
  viewMode?: "grid" | "list";
  onView?: (id: string) => void;
  onLike?: (id: string) => void;
  onCopy?: (id: string) => void;
  onEdit?: (id: string) => void;
  onRun?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PromptCard({
  prompt,
  viewMode = "grid",
  onView,
  onLike,
  onCopy,
  onEdit,
  onRun,
  onShare,
  onDelete,
}: PromptCardProps) {
  const [isLiked, setIsLiked] = useState(prompt.isFavorite);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(prompt.id);
  };

  const handleCopy = () => {
    onCopy?.(prompt.id);
  };

  const handleView = () => {
    onView?.(prompt.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <Card className="border border-gray-100">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={prompt.author.avatar}
                  alt={prompt.author.name}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1" onClick={handleView}>
                <h3 className="font-semibold text-sm mb-1 text-gray-900">
                  {prompt.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1 font-normal">
                  {prompt.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {prompt.category}
                  </Badge>
                  {prompt.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {prompt.viewCount}
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  {prompt.rating}
                </div>
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {prompt.likeCount}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className="h-8 w-8 p-0"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {/* 実行・編集ボタン */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRun?.(prompt.id);
                    }}
                    className="bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    実行
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(prompt.id);
                    }}
                    className="border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    編集
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={prompt.author.avatar}
                alt={prompt.author.name}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {prompt.author.name}
              </p>
              <p className="text-xs text-gray-400 flex items-center font-normal">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(prompt.createdAt)}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(prompt.id)}>
                <Edit className="mr-2 h-4 w-4" />
                編集
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRun?.(prompt.id)}>
                <Play className="mr-2 h-4 w-4" />
                実行
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare?.(prompt.id)}>
                <Share2 className="mr-2 h-4 w-4" />
                共有
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(prompt.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0" onClick={handleView}>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
          {prompt.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed font-normal">
          {prompt.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge
            variant="secondary"
            className={`text-xs ${getCategoryStyle(prompt.category)}`}
          >
            {prompt.category}
          </Badge>
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-gray-100 text-gray-600"
            >
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs border-gray-100 text-gray-600"
            >
              +{prompt.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {prompt.viewCount}
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {prompt.rating}
              <span className="text-xs text-gray-400 ml-1">
                ({prompt.ratingCount})
              </span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {prompt.likeCount}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="h-8 w-8 p-0 hover:bg-red-50"
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </Button>
          </div>
        </div>

        {/* 実行・編集ボタン */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRun?.(prompt.id);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white transition-colors"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            実行
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(prompt.id);
            }}
            className="border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
