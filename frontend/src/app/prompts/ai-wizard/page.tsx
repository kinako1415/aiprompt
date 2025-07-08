"use client";

import { useRouter } from "next/navigation";
import { PromptWizard } from "../../../components/PromptWizard";
import { PromptTemplate } from "../../../components/PromptWizard";

export default function AIAssistedPromptPage() {
  const router = useRouter();

  const handleComplete = (template: PromptTemplate) => {
    console.log("プロンプト作成完了:", template);
    // 実際の実装では、作成されたプロンプトをAPIに保存し、
    // マイプロンプトページにリダイレクト
    router.push("/my-prompts");
  };

  const handleCancel = () => {
    console.log("プロンプト作成をキャンセル");
    // 実際の実装では、ダッシュボードやプロンプト一覧にリダイレクト
    router.push("/dashboard");
  };

  return <PromptWizard onComplete={handleComplete} onCancel={handleCancel} />;
}
