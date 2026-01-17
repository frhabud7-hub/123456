import { Bot, Sliders, MessageSquare, Sparkles, Save, Plus, Trash2, Key, CheckCircle, Cpu, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAIModels } from "@/hooks/useAIModels";
import { useAISettings } from "@/hooks/useAISettings";

const aiProviders = [
  { id: "gemini", name: "Google Gemini", models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"] },
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"] },
  { id: "anthropic", name: "Anthropic Claude", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"] },
  { id: "groq", name: "Groq", models: ["llama-3.1-70b", "llama-3.1-8b", "mixtral-8x7b"] },
];

const responseStyles = [
  { id: "formal", label: "رسمي", description: "ردود احترافية ومهنية" },
  { id: "friendly", label: "ودّي", description: "ردود دافئة وقريبة" },
  { id: "brief", label: "مختصر", description: "ردود سريعة ومباشرة" },
];

export function AISettingsView() {
  const { models, loading: modelsLoading, addModel, deleteModel, setActiveModel } = useAIModels();
  const { settings, loading: settingsLoading, updateSettings, defaultSystemPrompt } = useAISettings();
  
  const [selectedStyle, setSelectedStyle] = useState("brief");
  const [creativity, setCreativity] = useState([20]);
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  
  // AI Models form state
  const [showAddModel, setShowAddModel] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [addingModel, setAddingModel] = useState(false);

  // Sync state with settings from DB
  useEffect(() => {
    if (settings) {
      setSelectedStyle(settings.response_style);
      setCreativity([settings.creativity_level]);
      setSystemPrompt(settings.system_prompt || defaultSystemPrompt);
    }
  }, [settings, defaultSystemPrompt]);

  const handleSave = async () => {
    await updateSettings({
      system_prompt: systemPrompt,
      response_style: selectedStyle,
      creativity_level: creativity[0],
    });
  };

  const handleAddModel = async () => {
    if (!selectedProvider || !selectedModel || !apiKey) {
      return;
    }

    setAddingModel(true);
    const success = await addModel(selectedProvider, selectedModel, apiKey);
    
    if (success) {
      setShowAddModel(false);
      setSelectedProvider("");
      setSelectedModel("");
      setApiKey("");
    }
    setAddingModel(false);
  };

  const getProviderModels = () => {
    const provider = aiProviders.find((p) => p.id === selectedProvider);
    return provider?.models || [];
  };

  const getProviderName = (providerId: string) => {
    return aiProviders.find((p) => p.id === providerId)?.name || providerId;
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">إعدادات الذكاء الاصطناعي</h2>
        <p className="text-muted-foreground">تحكم في سلوك وطريقة رد الذكاء الاصطناعي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Models Section */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="w-5 h-5 text-primary" />
                  نماذج الذكاء الاصطناعي
                </CardTitle>
                <CardDescription>أضف وأدر نماذج AI المختلفة مثل Gemini و OpenAI</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModel(!showAddModel)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة نموذج
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Model Form */}
            {showAddModel && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>المزود</Label>
                    <Select value={selectedProvider} onValueChange={(value) => {
                      setSelectedProvider(value);
                      setSelectedModel("");
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المزود" />
                      </SelectTrigger>
                      <SelectContent>
                        {aiProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>النموذج</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النموذج" />
                      </SelectTrigger>
                      <SelectContent>
                        {getProviderModels().map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      placeholder="أدخل مفتاح API"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowAddModel(false)}>
                    إلغاء
                  </Button>
                  <Button 
                    variant="whatsapp" 
                    onClick={handleAddModel}
                    disabled={addingModel || !selectedProvider || !selectedModel || !apiKey}
                  >
                    {addingModel ? <Loader2 className="w-4 h-4 animate-spin" /> : "إضافة"}
                  </Button>
                </div>
              </div>
            )}

            {/* Models List */}
            {modelsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : models.length > 0 ? (
              <div className="space-y-3">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      model.is_active
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        model.is_active ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{model.model_name}</p>
                          {model.is_active && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              نشط
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{getProviderName(model.provider)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Key className="w-4 h-4" />
                        <span className="font-mono">{maskApiKey(model.api_key)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">متصل</span>
                      </div>
                      <div className="flex gap-1">
                        {!model.is_active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveModel(model.id)}
                            className="text-primary hover:text-primary"
                          >
                            تفعيل
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteModel(model.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Cpu className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>لم تتم إضافة أي نماذج بعد</p>
                <p className="text-sm">اضغط على "إضافة نموذج" للبدء</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Style */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
              أسلوب الرد
            </CardTitle>
            <CardDescription>اختر الطريقة التي سيرد بها الذكاء الاصطناعي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {responseStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "w-full p-4 rounded-xl border text-right transition-all duration-200",
                  selectedStyle === style.id
                    ? "bg-primary/10 border-primary/30 shadow-sm"
                    : "border-border hover:border-primary/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 transition-colors",
                    selectedStyle === style.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )} />
                  <div>
                    <p className="font-medium text-foreground">{style.label}</p>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Creativity Level */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              مستوى الإبداع
            </CardTitle>
            <CardDescription>تحكم في مدى إبداعية وتنوع الردود</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">دقيق</span>
                <span className="text-2xl font-bold text-primary">{creativity[0]}%</span>
                <span className="text-sm text-muted-foreground">إبداعي</span>
              </div>
              <Slider
                value={creativity}
                onValueChange={setCreativity}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
              بالنسبة لهذا النظام، يُفضل إبقاء المستوى منخفضاً (20% أو أقل) لضمان دقة الردود والتزامها بالبيانات فقط.
            </p>
          </CardContent>
        </Card>

        {/* System Prompt */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              التعليمات الأساسية (System Prompt)
            </CardTitle>
            <CardDescription>حدد شخصية وتعليمات الذكاء الاصطناعي - هذا هو البرومبت الذي يحكم سلوك النظام</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="أدخل التعليمات الأساسية للذكاء الاصطناعي..."
              className="min-h-[320px] resize-none font-mono text-sm leading-relaxed"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                هذه التعليمات تحدد سلوك الذكاء الاصطناعي وكيفية تعامله مع الرسائل
              </p>
              <Button variant="whatsapp" onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sliders className="w-5 h-5 text-primary" />
              إعدادات متقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <Label className="text-foreground">الرد على الرسائل الصوتية</Label>
                  <p className="text-sm text-muted-foreground">تحويل الرسائل الصوتية إلى نص والرد عليها</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <Label className="text-foreground">إرسال صور المنتجات</Label>
                  <p className="text-sm text-muted-foreground">إرفاق صور المنتجات في الردود</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <Label className="text-foreground">الرد خارج ساعات العمل</Label>
                  <p className="text-sm text-muted-foreground">تفعيل الردود التلقائية على مدار الساعة</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <Label className="text-foreground">تتبع المحادثات</Label>
                  <p className="text-sm text-muted-foreground">تذكر سياق المحادثات السابقة</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
