import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "success";
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  const variants = {
    default: "bg-card",
    primary: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    secondary: "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20",
    success: "bg-gradient-to-br from-whatsapp/10 to-whatsapp/5 border-whatsapp/20",
  };

  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    success: "bg-whatsapp/20 text-whatsapp",
  };

  return (
    <div className={cn(
      "relative p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in overflow-hidden",
      variants[variant]
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-5">
        <Icon className="w-full h-full" />
      </div>

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">من الأمس</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconVariants[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
