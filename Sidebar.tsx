import { useState } from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  Settings, 
  Bot, 
  Power,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "لوحة التحكم", id: "dashboard" },
  { icon: MessageSquare, label: "المحادثات", id: "conversations" },
  { icon: Database, label: "قاعدة المعرفة", id: "knowledge" },
  { icon: Bot, label: "إعدادات الذكاء", id: "ai-settings" },
  { icon: Settings, label: "الإعدادات", id: "settings" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  automationEnabled: boolean;
  onAutomationToggle: (enabled: boolean) => void;
}

export function Sidebar({ activeTab, onTabChange, automationEnabled, onAutomationToggle }: SidebarProps) {
  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-sidebar border-l border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">أتمتة واتساب</h1>
            <p className="text-xs text-sidebar-foreground/60">نظام ذكي متكامل</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 mr-auto rotate-180" />}
            </button>
          );
        })}
      </nav>

      {/* Automation Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "p-4 rounded-xl transition-all duration-300",
          automationEnabled 
            ? "bg-primary/20 border border-primary/30" 
            : "bg-sidebar-accent border border-sidebar-border"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Power className={cn(
                "w-5 h-5 transition-colors",
                automationEnabled ? "text-primary" : "text-sidebar-foreground/50"
              )} />
              <span className="text-sm font-medium text-sidebar-foreground">الأتمتة</span>
            </div>
            <Switch 
              checked={automationEnabled} 
              onCheckedChange={onAutomationToggle}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <p className="text-xs text-sidebar-foreground/60">
            {automationEnabled ? "النظام يعمل ويرد تلقائياً" : "الأتمتة متوقفة حالياً"}
          </p>
        </div>
      </div>
    </aside>
  );
}
