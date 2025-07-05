import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
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
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    rating: number;
    ratingCount: number;
    likeCount: number;
    viewCount: number;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
    author: {
      name: string;
      avatar?: string;
    };
    isFavorite: boolean;
    isPublic: boolean;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onShare: (id: string) => void;
}

const categoryColors: { [key: string]: string } = {
  '文章生成': 'bg-blue-100 text-blue-800 border-blue-200',
  '画像生成': 'bg-green-100 text-green-800 border-green-200',
  'コード生成': 'bg-purple-100 text-purple-800 border-purple-200',
  '分析・要約': 'bg-orange-100 text-orange-800 border-orange-200',
  '翻訳': 'bg-red-100 text-red-800 border-red-200',
  'アイデア出し': 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export function PromptCard({ 
  prompt, 
  onEdit, 
  onDelete, 
  onRun, 
  onToggleFavorite, 
  onShare 
}: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryStyle = categoryColors[prompt.category] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <Card 
      className={`h-full transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isHovered ? 'border-blue-300' : 'border-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className={categoryStyle}>
                {prompt.category}
              </Badge>
              {prompt.isPublic && (
                <Badge variant="secondary" className="text-xs">
                  公開
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
              {prompt.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {prompt.description}
            </p>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(prompt.id);
              }}
              className="p-1 h-auto"
            >
              <Heart 
                className={`h-4 w-4 ${
                  prompt.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`} 
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(prompt.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRun(prompt.id)}>
                  <Play className="mr-2 h-4 w-4" />
                  実行
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(prompt.id)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  共有
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  複製
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(prompt.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{prompt.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Content Preview */}
        <div className="bg-gray-50 rounded-md p-3 mb-3">
          <p className="text-sm text-gray-700 line-clamp-3">
            {prompt.content}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{prompt.rating.toFixed(1)}</span>
              <span>({prompt.ratingCount})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{prompt.viewCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Play className="h-4 w-4" />
              <span>{prompt.usageCount}</span>
            </div>
          </div>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={prompt.author.avatar} alt={prompt.author.name} />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>{prompt.author.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{prompt.updatedAt}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-3">
          <Button
            size="sm"
            onClick={() => onRun(prompt.id)}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            実行
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(prompt.id)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}