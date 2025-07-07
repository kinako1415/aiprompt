import { PromptWizard } from '../../../components/PromptWizard';
import { PromptTemplate } from '../../../components/PromptWizard';

export default function AIAssistedPromptPage() {
  const handleComplete = (template: PromptTemplate) => {
    console.log('プロンプト作成完了:', template);
    // 実際の実装では、作成されたプロンプトをAPIに保存し、
    // プロンプト一覧画面やダッシュボードにリダイレクト
  };

  const handleCancel = () => {
    console.log('プロンプト作成をキャンセル');
    // 実際の実装では、ダッシュボードやプロンプト一覧にリダイレクト
  };

  return (
    <PromptWizard
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
