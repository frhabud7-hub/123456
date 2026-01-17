import { Key, Bell, Shield, Globe, Webhook } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function SettingsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">الإعدادات</h2>
        <p className="text-muted-foreground">إعدادات الاتصال والتكامل مع واتساب</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp API */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="w-5 h-5 text-primary" />
                WhatsApp Cloud API
              </CardTitle>
              <Badge className="bg-whatsapp/20 text-whatsapp border-0">متصل</Badge>
            </div>
            <CardDescription>إعدادات الاتصال مع Meta WhatsApp API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number ID</Label>
              <Input 
                type="password" 
                defaultValue="123456789012345"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input 
                type="password" 
                defaultValue="EAAxxxxxxxxxxxxxx"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Business Account ID</Label>
              <Input 
                type="password" 
                defaultValue="987654321098765"
                className="font-mono"
              />
            </div>
            <Button variant="outline" className="w-full">تحديث البيانات</Button>
          </CardContent>
        </Card>

        {/* Webhook */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Webhook className="w-5 h-5 text-primary" />
              Webhook
            </CardTitle>
            <CardDescription>إعدادات استقبال الرسائل</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value="https://api.example.com/webhook/whatsapp"
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon">
                  <Globe className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Verify Token</Label>
              <Input 
                type="password" 
                defaultValue="my_verify_token_123"
                className="font-mono"
              />
            </div>
            <div className="p-4 bg-whatsapp/10 rounded-xl border border-whatsapp/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
                <span className="text-sm font-medium text-whatsapp">Webhook نشط</span>
              </div>
              <p className="text-xs text-muted-foreground">آخر رسالة مستلمة: منذ 5 دقائق</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              الإشعارات
            </CardTitle>
            <CardDescription>تحكم في الإشعارات التي تتلقاها</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">رسالة جديدة</p>
                <p className="text-sm text-muted-foreground">إشعار عند استلام رسالة</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">طلب دعم بشري</p>
                <p className="text-sm text-muted-foreground">إشعار عند طلب تحويل للدعم</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">تقرير يومي</p>
                <p className="text-sm text-muted-foreground">ملخص يومي للمحادثات</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              الأمان
            </CardTitle>
            <CardDescription>إعدادات الأمان والخصوصية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">تشفير البيانات</p>
                <p className="text-sm text-muted-foreground">تشفير جميع الرسائل المخزنة</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">حذف تلقائي</p>
                <p className="text-sm text-muted-foreground">حذف المحادثات بعد 30 يوم</p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
              تغيير كلمة المرور
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
