"use client";

import { useRouter } from "next/navigation";
import { PromptWizard } from "../../../components/PromptWizard";
import { PromptTemplate } from "../../../components/PromptWizard";
import {
  MockTemplateService,
  MockPromptService,
} from "../../../utils/mockServices";

export default function AIAssistedPromptPage() {
  const router = useRouter();

  const handleComplete = async (template: PromptTemplate) => {
    console.log("プロンプト作成完了:", template);

    try {
      // 1. まず、テンプレートを保存
      const templateData = {
        name: template.name,
        description: `AI支援で作成された${template.metadata.category}テンプレート`,
        content: template.content,
        category: template.metadata.category,
        tags: [], // 今回は空のタグ配列
        variables: template.variables.map((v) => ({
          name: v.name,
          type: v.type === "file" || v.type === "date" ? "text" : v.type, // 対応している型に変換
          description: v.description,
          required: v.required,
          defaultValue: v.defaultValue,
          options: v.options,
        })),
        metadata: {
          category: template.metadata.category,
          difficulty: template.metadata.difficulty,
          rating: template.metadata.rating,
          usageCount: template.metadata.usageCount,
        },
      };

      console.log("テンプレートを保存中:", templateData);

      // モックサービスを使用してテンプレートを保存
      const templateResult = MockTemplateService.saveTemplate(templateData);
      console.log("テンプレートが保存されました:", templateResult);

      // 2. 次に、このテンプレートから生成されたプロンプトも保存
      const promptData = {
        title: template.name,
        description: `AI支援で作成された${template.metadata.category}プロンプト`,
        content: template.content,
        category: template.metadata.category,
        tags: template.variables.map((v) => v.name), // 変数名をタグとして使用
        aiModel: "gpt-4", // デフォルトのAIモデル
        template_id: templateResult.id, // テンプレートとの関連付け
        visibility: "private" as const,
        isPublic: false,
      };

      console.log("プロンプトを保存中:", promptData);

      // モックサービスを使用してプロンプトを保存
      const promptResult = MockPromptService.savePrompt(promptData);
      console.log("プロンプトが保存されました:", promptResult);

      // 保存完了後、マイプロンプトページに遷移
      router.push("/my-prompts");
    } catch (error) {
      console.error("保存エラー:", error);
      // エラーハンドリング: 必要に応じてエラーダイアログを表示
      alert("保存に失敗しました。再度お試しください。");
      router.push("/dashboard");
    }
  };

  const handleWizardCancel = () => {
    console.log("AI支援プロンプト作成をキャンセル");
    router.push("/dashboard");
  };

  return (
    <PromptWizard onComplete={handleComplete} onCancel={handleWizardCancel} />
  );
}
