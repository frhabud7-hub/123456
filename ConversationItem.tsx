import { cn } from "@/lib/utils";
import { MessageSquare, Clock, CheckCheck } from "lucide-react";

interface ConversationItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function ConversationItem({ 
  name, 
  lastMessage, 
  time, 
  unread, 
  isActive,
  onClick 
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl text-right transition-all duration-200 border",
        isActive 
          ? "bg-primary/10 border-primary/30 shadow-sm" 
          : "bg-card border-transparent hover:bg-muted/50 hover:border-border"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">{name[0]}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-foreground truncate">{name}</h4>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
            <CheckCheck className="w-4 h-4 text-primary shrink-0" />
            {lastMessage}
          </p>
        </div>

        {/* Unread badge */}
        {unread && unread > 0 && (
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
            {unread}
          </div>
        )}
      </div>
    </button>
  );
}
