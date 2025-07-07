import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Eye,
  FileText,
  Hash,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface LivePreviewPanelProps {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
}

export function LivePreviewPanel({
  title,
  description,
  content,
  category,
  tags,
}: LivePreviewPanelProps) {
  const variables = extractVariables(content);
  const qualityChecks = performQualityCheck(content);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h3 className="font-semibold flex items-center space-x-2 text-sm">
          <Eye className="h-4 w-4" />
          <span>リアルタイムプレビュー</span>
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* カード形式プレビュー */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="truncate">
                  {title || "プロンプトタイトル"}
                </span>
                <Badge variant="outline" className="text-xs">
                  {category || "未分類"}
                </Badge>
              </CardTitle>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-1 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              <div>
                <Label className="text-xs font-medium text-gray-700">
                  説明
                </Label>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                  {description || "説明がここに表示されます"}
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-xs font-medium text-gray-700">
                  プロンプト
                </Label>
                <div className="bg-gray-50 p-2 rounded-md mt-1 max-h-32 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {content || "プロンプト内容がここに表示されます"}
                  </pre>
                </div>
              </div>

              {/* 統計情報 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <FileText className="h-3 w-3" />
                  <span>{content.length} 文字</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Hash className="h-3 w-3" />
                  <span>{content.split("\n").length} 行</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 変数一覧 */}
          {variables.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">検出された変数</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-1">
                  {variables.map((variable, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs mr-1"
                    >
                      {variable}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 品質チェック */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">品質チェック</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-1">
                {qualityChecks.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-1 text-xs"
                  >
                    {check.type === "error" && (
                      <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    {check.type === "warning" && (
                      <Info className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    )}
                    {check.type === "success" && (
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={
                        check.type === "error"
                          ? "text-red-600"
                          : check.type === "warning"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {check.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

// 変数抽出関数
function extractVariables(content: string): string[] {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = variableRegex.exec(content)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
}

// 品質チェック関数
function performQualityCheck(content: string) {
  const checks = [];

  // 基本的な品質チェック
  if (content.length < 10) {
    checks.push({
      type: "error" as const,
      message: "プロンプトが短すぎます（10文字以上推奨）",
    });
  } else if (content.length > 2000) {
    checks.push({
      type: "warning" as const,
      message: "プロンプトが長すぎる可能性があります（2000文字以下推奨）",
    });
  } else {
    checks.push({
      type: "success" as const,
      message: "適切な長さです",
    });
  }

  // 構造化チェック
  if (content.includes("\n\n")) {
    checks.push({
      type: "success" as const,
      message: "段落分けが適切です",
    });
  } else {
    checks.push({
      type: "warning" as const,
      message: "段落分けを推奨します",
    });
  }

  // 変数チェック
  const variables = extractVariables(content);
  if (variables.length > 0) {
    checks.push({
      type: "success" as const,
      message: `${variables.length}個の変数が検出されました`,
    });
  }

  return checks;
}
