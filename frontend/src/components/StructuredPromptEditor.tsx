import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface StructuredPromptEditorProps {
  content: string;
  onChange: (content: string) => void;
  elements: Array<{
    name: string;
    description: string;
    example: string;
  }>;
}

interface StructuredData {
  [key: string]: string;
}

export function StructuredPromptEditor({
  content,
  onChange,
  elements,
}: StructuredPromptEditorProps) {
  const [structuredData, setStructuredData] = useState<StructuredData>(() =>
    parseStructuredContent(content)
  );

  const updateStructuredData = (elementName: string, value: string) => {
    const updated = { ...structuredData, [elementName]: value };
    setStructuredData(updated);
    onChange(generateStructuredContent(updated));
  };

  useEffect(() => {
    const currentGenerated = generateStructuredContent(structuredData);
    if (content !== currentGenerated) {
      setStructuredData(parseStructuredContent(content));
    }
  }, [content, structuredData]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {elements.map((element) => (
            <Card key={element.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{element.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {(structuredData[element.name] || "").length} 文字
                  </Badge>
                </CardTitle>
                <p className="text-xs text-gray-600">{element.description}</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={structuredData[element.name] || ""}
                  onChange={(e) =>
                    updateStructuredData(element.name, e.target.value)
                  }
                  placeholder={element.example}
                  rows={4}
                  className="resize-none min-h-[120px]"
                />
              </CardContent>
            </Card>
          ))}

          {/* 全体プレビュー */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">生成されたプロンプト</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">{content}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

// 構造化データの解析と生成関数
function parseStructuredContent(content: string): StructuredData {
  const sections: StructuredData = {};
  const lines = content.split("\n");
  let currentSection = "";
  let currentContent = "";

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentSection) {
        sections[currentSection] = currentContent.trim();
      }
      currentSection = line.substring(3);
      currentContent = "";
    } else {
      currentContent += line + "\n";
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.trim();
  }

  return sections;
}

function generateStructuredContent(structuredData: StructuredData): string {
  return Object.entries(structuredData)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `## ${key}\n${value}`)
    .join("\n\n");
}
