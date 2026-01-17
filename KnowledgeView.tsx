import { useState, useRef } from "react";
import { Plus, Search, Trash2, Package, HelpCircle, DollarSign, FileText, Upload, File, Loader2, FileSpreadsheet, FileType } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useKnowledgeFiles } from "@/hooks/useKnowledgeFiles";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { id: "products", label: "المنتجات", icon: Package },
  { id: "faq", label: "الأسئلة الشائعة", icon: HelpCircle },
  { id: "prices", label: "الأسعار", icon: DollarSign },
  { id: "general", label: "معلومات عامة", icon: FileText },
];

function getFileIcon(fileType: string) {
  if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("csv")) {
    return FileSpreadsheet;
  }
  if (fileType.includes("pdf")) {
    return FileType;
  }
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function KnowledgeView() {
  const { files, loading, uploadFile, deleteFile } = useKnowledgeFiles();
  const [activeCategory, setActiveCategory] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter((file) => {
    const matchesCategory = file.category === activeCategory;
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  const getCategoryCount = (categoryId: string) => {
    return files.filter((f) => f.category === categoryId).length;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const success = await uploadFile(file, selectedCategory);
    
    if (success) {
      setUploadDialogOpen(false);
      setActiveCategory(selectedCategory);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">قاعدة المعرفة</h2>
          <p className="text-muted-foreground">ارفع ملفات البيانات التي سيستخدمها الذكاء الاصطناعي للرد على العملاء</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="whatsapp" className="gap-2">
              <Upload className="w-4 h-4" />
              رفع ملف
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>رفع ملف جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الملف</Label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.json"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">اسحب وأفلت الملف هنا</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PDF, Excel, CSV, Word, JSON, TXT
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        جاري الرفع...
                      </>
                    ) : (
                      "اختر ملف"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="بحث في الملفات..." 
          className="pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = getCategoryCount(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 text-right",
                isActive 
                  ? "bg-primary/10 border-primary/30 shadow-md" 
                  : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isActive ? "bg-primary/20" : "bg-muted"
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
              <p className={cn("font-medium", isActive ? "text-primary" : "text-foreground")}>
                {cat.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Files List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">
            {categories.find(c => c.id === activeCategory)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="divide-y">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.file_type);
                return (
                  <div 
                    key={file.id}
                    className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{file.file_name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.file_size)}</span>
                          <span>•</span>
                          <span>{new Date(file.created_at).toLocaleDateString("ar-SA")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={file.status === "ready" ? "default" : "secondary"}
                        className={file.status === "ready" ? "bg-green-500/20 text-green-600" : ""}
                      >
                        {file.status === "ready" ? "جاهز" : "قيد المعالجة"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteFile(file.id, file.file_path)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredFiles.length === 0 && (
                <div className="p-12 text-center">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-2">لا توجد ملفات في هذه الفئة</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    ارفع ملفات Excel أو PDF أو CSV لبناء قاعدة المعرفة
                  </p>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    رفع ملف جديد
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
