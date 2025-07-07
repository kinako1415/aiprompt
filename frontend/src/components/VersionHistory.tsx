import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Plus, Eye, RotateCcw, Clock } from "lucide-react";

interface Version {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  description?: string;
  content: string;
}

interface VersionHistoryProps {
  promptId: string;
  onRestore?: (version: Version) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VersionHistory({ promptId, onRestore }: VersionHistoryProps) {
  // モックデータ（実際はAPIから取得）
  const [versions] = useState<Version[]>([
    {
      id: "1",
      version: "1.3",
      timestamp: "2024-01-15 14:30",
      author: "山田太郎",
      description: "出力形式を明確化",
      content: "改善されたプロンプト内容...",
    },
    {
      id: "2",
      version: "1.2",
      timestamp: "2024-01-14 09:15",
      author: "佐藤花子",
      description: "例示を追加",
      content: "例示付きプロンプト内容...",
    },
    {
      id: "3",
      version: "1.1",
      timestamp: "2024-01-13 16:45",
      author: "田中一郎",
      content: "初期プロンプト内容...",
    },
  ]);

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">バージョン履歴</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          スナップショット作成
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {versions.map((version) => (
            <Card
              key={version.id}
              className={`p-3 cursor-pointer transition-colors ${
                selectedVersion === version.id
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedVersion(version.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-sm">
                      v{version.version}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      最新
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{version.timestamp}</span>
                    <span>|</span>
                    <span>{version.author}</span>
                  </div>
                  {version.description && (
                    <div className="text-xs text-gray-600 mt-1">
                      {version.description}
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // プレビュー機能
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRestore) {
                        onRestore(version);
                      }
                    }}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* 選択されたバージョンの詳細 */}
      {selectedVersion && (
        <Card className="mt-4">
          <CardContent className="p-3">
            <div className="text-sm font-medium mb-2">バージョン詳細</div>
            <div className="bg-gray-50 p-2 rounded text-xs">
              <pre className="whitespace-pre-wrap">
                {versions.find((v) => v.id === selectedVersion)?.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
