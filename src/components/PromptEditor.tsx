import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Save, 
  Play, 
  Sparkles, 
  Eye, 
  Lightbulb, 
  Layers, 
  X,
  Plus,
  Tag,
  Settings,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface PromptEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
  };
  onSave: (prompt: any) => void;
}

const categories = [
  '文章生成', '画像生成', 'コード生成', '分析・要約', '翻訳', 'アイデア出し'
];

const aiSuggestions = [
  {
    type: 'improvement',
    title: 'より具体的な指示を追加',
    description: 'プロンプトに具体的な出力形式を指定すると、より一貫した結果が得られます。',
    suggestion: '以下の形式で出力してください：\n\n## タイトル\n内容...\n\n## 要約\n- ポイント1\n- ポイント2',
    impact: 'high'
  },
  {
    type: 'structure',
    title: 'ペルソナ設定を追加',
    description: 'AIに特定の役割を与えることで、より専門的な回答が期待できます。',
    suggestion: 'あなたは経験豊富な{{職種}}です。{{専門知識}}を活用して回答してください。',
    impact: 'medium'
  },
  {
    type: 'example',
    title: '例示の追加',
    description: '具体例を示すことで、期待する出力の品質が向上します。',
    suggestion: '例：\n入力: {{例1}}\n出力: {{例1の出力}}\n\n入力: {{例2}}\n出力: {{例2の出力}}',
    impact: 'medium'
  }
];

const promptElements = [
  { name: '目的・タスク', description: '何をさせたいのか', example: '商品説明文を作成する' },
  { name: 'ペルソナ・役割', description: 'AIに演じてもらう役割', example: '経験豊富なコピーライター' },
  { name: 'コンテキスト', description: '背景情報・前提条件', example: 'ECサイト用の商品説明文' },
  { name: '制約・条件', description: '守るべきルールや制限', example: '200文字以内で簡潔に' },
  { name: '出力形式', description: '結果の形式・構造', example: 'タイトル、説明、特徴の順番で' },
  { name: '例示', description: '具体例やサンプル', example: '例：商品名「○○」→「魅力的な○○で...」' }
];

export function PromptEditor({ open, onOpenChange, prompt, onSave }: PromptEditorProps) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [description, setDescription] = useState(prompt?.description || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [category, setCategory] = useState(prompt?.category || '');
  const [tags, setTags] = useState<string[]>(prompt?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('editor');

  const handleSave = () => {
    const promptData = {
      id: prompt?.id || Date.now().toString(),
      title,
      description,
      content,
      category,
      tags
    };
    onSave(promptData);
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const applySuggestion = (suggestion: string) => {
    setContent(content + '\n\n' + suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>{prompt ? 'プロンプト編集' : '新規プロンプト作成'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">エディタ</TabsTrigger>
              <TabsTrigger value="suggestions">AI提案</TabsTrigger>
              <TabsTrigger value="elements">要素分解</TabsTrigger>
              <TabsTrigger value="preview">プレビュー</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="editor" className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                  {/* Left Panel - Basic Info */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">基本情報</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title">タイトル</Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="プロンプトのタイトルを入力"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">説明</Label>
                          <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="プロンプトの用途や概要を説明"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">カテゴリー</Label>
                          <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">カテゴリーを選択</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label>タグ</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                                <span>{tag}</span>
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 hover:text-red-500"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="新しいタグを追加"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                            <Button type="button" onClick={handleAddTag} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Panel - Content */}
                  <div className="space-y-4">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">プロンプト内容</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="プロンプトの内容を入力してください..."
                          rows={15}
                          className="resize-none"
                        />
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                          <span>{content.length} 文字</span>
                          <span>変数: &#123;&#123;variable_name&#125;&#125; 形式で使用</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <h3 className="text-lg font-semibold">AI改善提案</h3>
                    </div>
                    
                    {aiSuggestions.map((suggestion, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center space-x-2">
                              <div className={`p-1 rounded-full ${
                                suggestion.impact === 'high' ? 'bg-red-100 text-red-600' :
                                suggestion.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {suggestion.impact === 'high' ? <AlertCircle className="h-4 w-4" /> :
                                 suggestion.impact === 'medium' ? <Zap className="h-4 w-4" /> :
                                 <CheckCircle className="h-4 w-4" />}
                              </div>
                              <span>{suggestion.title}</span>
                            </CardTitle>
                            <Badge variant={
                              suggestion.impact === 'high' ? 'destructive' :
                              suggestion.impact === 'medium' ? 'default' : 'secondary'
                            }>
                              {suggestion.impact === 'high' ? '高' :
                               suggestion.impact === 'medium' ? '中' : '低'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                          <div className="bg-gray-50 p-3 rounded-md mb-3">
                            <pre className="text-sm whitespace-pre-wrap">{suggestion.suggestion}</pre>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => applySuggestion(suggestion.suggestion)}
                            className="w-full"
                          >
                            適用する
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="elements" className="h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Layers className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">プロンプト要素分解</h3>
                    </div>
                    
                    {promptElements.map((element, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base">{element.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{element.description}</p>
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm font-medium text-blue-800">例:</p>
                            <p className="text-sm text-blue-700">{element.example}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="preview" className="h-full">
                <div className="h-full">
                  <div className="flex items-center space-x-2 mb-4">
                    <Eye className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">プレビュー</h3>
                  </div>
                  
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{title || 'プロンプトタイトル'}</span>
                        <Badge variant="outline">{category || 'カテゴリー未設定'}</Badge>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">説明</Label>
                          <p className="text-sm text-gray-600">{description || 'プロンプトの説明がここに表示されます'}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700">プロンプト内容</Label>
                          <div className="bg-gray-50 p-4 rounded-md mt-2">
                            <pre className="text-sm whitespace-pre-wrap">{content || 'プロンプトの内容がここに表示されます'}</pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              テスト実行
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}