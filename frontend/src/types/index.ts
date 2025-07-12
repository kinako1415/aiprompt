// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "free" | "pro" | "team" | "enterprise";
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  defaultAIModel: string;
  editorSettings: {
    fontSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    collaborative: boolean;
  };
}

// Prompt-related types
export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  category: string;
  tags: string[];
  aiModel: string;
  isPublic: boolean;
  isFavorite: boolean;
  importance: 1 | 2 | 3 | 4 | 5;
  version: number;
  parentId?: string; // For versions
  authorId: string;
  author: Pick<User, "id" | "name" | "avatar">;
  collaborators: string[];
  usageCount: number;
  rating: number;
  ratingCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: PromptMetadata;
}

export interface PromptMetadata {
  estimatedTokens?: number;
  suggestedParameters?: Record<string, string | number | boolean>;
  performanceMetrics?: {
    averageResponseTime: number;
    successRate: number;
    userSatisfaction: number;
  };
}

export interface CreatePromptRequest {
  title: string;
  content: string;
  description?: string;
  category: string;
  tags: string[];
  aiModel: string;
  isPublic?: boolean;
  template_id?: string;
  visibility?: 'private' | 'public' | 'team';
}

export interface UpdatePromptRequest {
  title?: string;
  content?: string;
  description?: string;
  category?: string;
  tags?: string[];
  aiModel?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  importance?: 1 | 2 | 3 | 4 | 5;
}

export interface PromptFilter {
  category?: string;
  tags?: string[];
  aiModel?: string;
  author?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  importance?: number[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

// A/B Test types
export interface ABTest {
  id: string;
  name: string;
  prompts: Prompt[];
  status: "draft" | "running" | "completed" | "paused";
  results: ABTestResult[];
  createdAt: string;
  updatedAt: string;
}

export interface ABTestResult {
  promptId: string;
  runs: number;
  averageRating: number;
  successRate: number;
  averageResponseTime: number;
  userFeedback: string[];
}

// Real-time collaboration types
export interface CollaborationSession {
  id: string;
  promptId: string;
  participants: CollaborationParticipant[];
  isActive: boolean;
  createdAt: string;
}

export interface CollaborationParticipant {
  userId: string;
  name: string;
  avatar?: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  isTyping: boolean;
  lastSeen: string;
}

// Collaboration event data types
export interface CursorEventData {
  position: number;
  range?: { start: number; end: number };
}

export interface SelectionEventData {
  start: number;
  end: number;
}

export interface EditEventData {
  operation: string;
  position: number;
  content: string;
  length?: number;
}

export interface JoinLeaveEventData {
  userName: string;
  timestamp: string;
}

export type CollaborationEventData =
  | CursorEventData
  | SelectionEventData
  | EditEventData
  | JoinLeaveEventData;

export interface CollaborationEvent {
  type: "cursor" | "selection" | "edit" | "join" | "leave";
  userId: string;
  timestamp: string;
  data: CollaborationEventData;
}

// Operational Transform types
export interface TextOperation {
  type: "insert" | "delete" | "retain";
  length?: number;
  text?: string;
}

export interface OperationTransformData {
  operations: TextOperation[];
  baseVersion: number;
}
