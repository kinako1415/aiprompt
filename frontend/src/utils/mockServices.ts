// 開発環境用のモック実装
import { PromptTemplate } from "@/store/api/templateApi";

// ローカルストレージのキー
const TEMPLATES_STORAGE_KEY = "aiprompt_templates";
const PROMPTS_STORAGE_KEY = "aiprompt_prompts";

// プロンプトの基本型
interface BasicPrompt {
  id?: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  tags: string[];
  aiModel: string;
  template_id?: string;
  visibility?: 'private' | 'public' | 'team';
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  usageCount?: number;
  rating?: number;
  ratingCount?: number;
}

// テンプレートのモック実装
export class MockTemplateService {
  // テンプレートを保存
  static saveTemplate(template: Omit<PromptTemplate, 'id'>): PromptTemplate {
    const templates = this.getTemplates();
    const newTemplate: PromptTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      rating: 0,
      ratingCount: 0,
    };
    
    templates.push(newTemplate);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    
    console.log("テンプレートが保存されました:", newTemplate);
    return newTemplate;
  }

  // テンプレート一覧を取得
  static getTemplates(): PromptTemplate[] {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // 特定のテンプレートを取得
  static getTemplate(id: string): PromptTemplate | null {
    const templates = this.getTemplates();
    return templates.find(t => t.id === id) || null;
  }

  // テンプレートを更新
  static updateTemplate(id: string, updates: Partial<PromptTemplate>): PromptTemplate | null {
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    return templates[index];
  }

  // テンプレートを削除
  static deleteTemplate(id: string): boolean {
    const templates = this.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    
    if (filtered.length === templates.length) return false;
    
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  // テンプレートからプロンプトを生成
  static generateFromTemplate(
    templateId: string, 
    variables: Record<string, string | number | boolean>
  ): string {
    const template = this.getTemplate(templateId);
    if (!template) throw new Error("テンプレートが見つかりません");
    
    let content = template.content;
    
    // 変数を置き換え
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      content = content.replace(regex, String(value));
    }
    
    return content;
  }
}

// プロンプトのモック実装
export class MockPromptService {
  // プロンプトを保存
  static savePrompt(prompt: Omit<BasicPrompt, 'id'>): BasicPrompt {
    const prompts = this.getPrompts();
    const newPrompt: BasicPrompt = {
      ...prompt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      rating: 0,
      ratingCount: 0,
    };
    
    prompts.push(newPrompt);
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
    
    console.log("プロンプトが保存されました:", newPrompt);
    return newPrompt;
  }

  // プロンプト一覧を取得
  static getPrompts(): BasicPrompt[] {
    const stored = localStorage.getItem(PROMPTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // 特定のプロンプトを取得
  static getPrompt(id: string): BasicPrompt | null {
    const prompts = this.getPrompts();
    return prompts.find(p => p.id === id) || null;
  }

  // プロンプトを更新
  static updatePrompt(id: string, updates: Partial<BasicPrompt>): BasicPrompt | null {
    const prompts = this.getPrompts();
    const index = prompts.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    prompts[index] = {
      ...prompts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
    return prompts[index];
  }

  // プロンプトを削除
  static deletePrompt(id: string): boolean {
    const prompts = this.getPrompts();
    const filtered = prompts.filter(p => p.id !== id);
    
    if (filtered.length === prompts.length) return false;
    
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}

// サンプルデータを初期化
export const initializeSampleData = () => {
  const templates = MockTemplateService.getTemplates();
  
  if (templates.length === 0) {
    // サンプルテンプレートを作成
    const sampleTemplate: Omit<PromptTemplate, 'id'> = {
      name: "ブログ記事作成テンプレート",
      description: "SEOに最適化されたブログ記事を効率的に作成するためのテンプレート",
      content: "あなたは経験豊富なブログライターです。\n\n以下のテーマで{word_count}文字程度のブログ記事を作成してください。\n\n**テーマ**: {theme}\n**対象読者**: {target_audience}\n**SEOキーワード**: {seo_keywords}\n\n記事には以下の要素を含めてください：\n- 魅力的なタイトル\n- 導入部分\n- 見出しのある本文\n- まとめ\n\n読者にとって有益で、SEOに効果的な記事を作成してください。",
      category: "文章生成",
      tags: ["ブログ", "SEO", "マーケティング"],
      variables: [
        {
          name: "theme",
          type: "text",
          description: "記事のテーマ",
          required: true,
        },
        {
          name: "target_audience",
          type: "text",
          description: "対象読者",
          required: true,
        },
        {
          name: "seo_keywords",
          type: "text",
          description: "SEOキーワード",
          required: true,
        },
        {
          name: "word_count",
          type: "number",
          description: "文字数",
          required: true,
          defaultValue: "800",
        },
      ],
      metadata: {
        category: "文章生成",
        difficulty: "intermediate",
        rating: 4.7,
        usageCount: 856,
      },
    };
    
    MockTemplateService.saveTemplate(sampleTemplate);
    console.log("サンプルテンプレートが作成されました");
  }
};

// 開発環境でのデータ初期化
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  initializeSampleData();
}
