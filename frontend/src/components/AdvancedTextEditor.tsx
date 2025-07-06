import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Bold, Italic, Code, Undo, Redo, Search, Replace } from "lucide-react";

interface AdvancedTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function AdvancedTextEditor({
  content,
  onChange,
  placeholder,
}: AdvancedTextEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">プロンプト内容</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Code className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 relative">
          <Textarea
            ref={editorRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="resize-none h-full w-full font-mono text-sm min-h-[700px]"
          />

          {/* 行番号とガイド */}
          <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
            行: {content.split("\n").length} | 文字: {content.length}
          </div>
        </div>

        {/* エディター補助機能 */}
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <div className="flex space-x-4">
            <span>変数: {`{{variable_name}}`} 形式</span>
            <span>改行: Shift+Enter</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-1" />
              検索
            </Button>
            <Button variant="ghost" size="sm">
              <Replace className="h-4 w-4 mr-1" />
              置換
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
