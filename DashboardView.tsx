import { MessageSquare, Users, Clock, TrendingUp, Bot, Zap } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { ConversationItem } from "./ConversationItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentConversations = [
  { id: 1, name: "أحمد محمد", lastMessage: "شكراً على الرد السريع!", time: "منذ 5 دقائق", unread: 2 },
  { id: 2, name: "فاطمة علي", lastMessage: "متى يكون التوصيل؟", time: "منذ 15 دقيقة" },
  { id: 3, name: "محمد سعيد", lastMessage: "أريد معرفة الأسعار", time: "منذ ساعة" },
  { id: 4, name: "نورة أحمد", lastMessage: "هل يوجد خصم؟", time: "منذ ساعتين" },
];

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">مرحباً بك 👋</h2>
          <p className="text-muted-foreground">إليك نظرة عامة على أداء نظامك اليوم</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-whatsapp/10 border border-whatsapp/20">
          <div className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
          <span className="text-sm font-medium text-whatsapp">متصل</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي المحادثات"
          value="1,234"
          subtitle="هذا الشهر"
          icon={MessageSquare}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="العملاء الجدد"
          value="89"
          subtitle="هذا الأسبوع"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          variant="secondary"
        />
        <StatsCard
          title="متوسط وقت الرد"
          value="3 ثوانٍ"
          subtitle="رد تلقائي"
          icon={Clock}
          variant="success"
        />
        <StatsCard
          title="نسبة الرضا"
          value="96%"
          subtitle="بناءً على التقييمات"
          icon={TrendingUp}
          trend={{ value: 4, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Conversations */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
              آخر المحادثات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                name={conv.name}
                lastMessage={conv.lastMessage}
                time={conv.time}
                unread={conv.unread}
              />
            ))}
          </CardContent>
        </Card>

        {/* AI Status */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              حالة الذكاء الاصطناعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-pulse-glow" />
                <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-1">يعمل بكفاءة عالية</h4>
              <p className="text-sm text-muted-foreground">جاهز للرد على الرسائل</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">الردود اليوم</span>
                <span className="font-bold text-foreground">156</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">دقة الفهم</span>
                <span className="font-bold text-primary">98%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">الاستفسارات المحلولة</span>
                <span className="font-bold text-success">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="gradient-primary p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">نظامك يعمل بشكل مثالي!</h3>
                <p className="text-white/80">تم الرد على 156 رسالة تلقائياً اليوم</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-left">
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-sm text-white/70">متاح على مدار الساعة</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
