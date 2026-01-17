import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  phone_number: string;
  customer_name: string | null;
  last_message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
      
      // Select first conversation if none selected
      if (data && data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("حدث خطأ في جلب المحادثات");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("حدث خطأ في جلب الرسائل");
    } finally {
      setMessagesLoading(false);
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    const conversationsChannel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, []);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    fetchMessages(selectedConversation.id);

    const messagesChannel = supabase
      .channel(`messages-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        () => {
          fetchMessages(selectedConversation.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [selectedConversation?.id]);

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    loading,
    messagesLoading,
    refetch: fetchConversations,
  };
}
