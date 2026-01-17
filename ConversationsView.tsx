import { Search, Filter, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationItem } from "./ConversationItem";
import { cn } from "@/lib/utils";
import { useConversations } from "@/hooks/useConversations";
import { useState } from "react";

export function ConversationsView() {
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    messages, 
    loading, 
    messagesLoading 
  } = useConversations();
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    (conv.customer_name || conv.phone_number)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations List */}
      <Card className="w-96 border-0 shadow-lg flex flex-col">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg mb-4">المحادثات</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                name={conv.customer_name || conv.phone_number}
                lastMessage={conv.last_message || "لا توجد رسائل"}
                time={formatTime(conv.updated_at)}
                isActive={selectedConversation?.id === conv.id}
                onClick={() => setSelectedConversation(conv)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد محادثات بعد</p>
              <p className="text-sm">ستظهر المحادثات هنا عند استقبال رسائل واتساب</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat View */}
      <Card className="flex-1 border-0 shadow-lg flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {(selectedConversation.customer_name || selectedConversation.phone_number)[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    {selectedConversation.customer_name || selectedConversation.phone_number}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.phone_number}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.sender_type !== "customer" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      msg.sender_type !== "customer" 
                        ? "bg-primary/20" 
                        : "bg-secondary/20"
                    )}>
                      {msg.sender_type !== "customer" ? (
                        <Bot className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[70%] p-4 rounded-2xl",
                      msg.sender_type !== "customer" 
                        ? "bg-primary/10 rounded-br-md" 
                        : "bg-muted rounded-bl-md"
                    )}>
                      <p className="text-foreground">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.created_at).toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد رسائل في هذه المحادثة</p>
                  </div>
                </div>
              )}
            </CardContent>
            <div className="p-4 border-t bg-muted/30">
              <p className="text-center text-sm text-muted-foreground">
                هذه المحادثة تدار تلقائياً بواسطة الذكاء الاصطناعي
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">اختر محادثة لعرضها</p>
              <p className="text-sm">أو انتظر استقبال رسائل جديدة</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
