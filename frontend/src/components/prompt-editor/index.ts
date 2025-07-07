// 新しいPromptEditor関連コンポーネントのエクスポート
export { PromptEditor } from "../PromptEditor";
export { StructuredPromptEditor } from "../StructuredPromptEditor";
export { AdvancedTextEditor } from "../AdvancedTextEditor";
export { LivePreviewPanel } from "../LivePreviewPanel";
export { VersionHistory } from "../VersionHistory";

// コンポーネントのProps型定義
export interface PromptData {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
  version?: string;
}

export interface PromptVersion {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  description?: string;
  content: string;
}

export interface QualityCheckResult {
  type: "error" | "warning" | "success";
  message: string;
}

export interface AISuggestion {
  type: string;
  title: string;
  description: string;
  suggestion: string;
  impact: "high" | "medium" | "low";
}

export interface PromptElement {
  name: string;
  description: string;
  example: string;
}
