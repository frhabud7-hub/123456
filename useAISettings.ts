import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AISettings {
  id: string;
  system_prompt: string | null;
  response_style: string;
  creativity_level: number;
  created_at: string;
  updated_at: string;
}

const defaultSystemPrompt = `أنت نظام تنفيذ ذكي مرتبط فعليًا بواتساب وقواعد بيانات داخلية.
أي رسالة تصل إليك مصدرها واتساب فقط.

قواعد إلزامية:
1. لا تُنشئ أي معلومة من عندك.
2. استخدم قواعد البيانات المرفوعة في لوحة التحكم كمصدر وحيد للحقيقة.
3. لا تعتمد على المعرفة العامة أو التدريب السابق.
4. إذا لم تجد إجابة صريحة داخل البيانات، أرسل الرد التالي فقط:
   "لا تتوفر لدي هذه المعلومة حاليًا، يرجى مراجعة الدعم."
5. عند وجود تطابق في البيانات:
   - أنشئ ردًا واضحًا ومباشرًا.
   - لا تضف تفسير زائد أو افتراضات.
6. أرسال الرد النهائي مباشرة عبر قناة واتساب.
7. أي رد لا يعتمد على قاعدة بيانات يُعتبر خطأ ويجب منعه.

الأولوية المطلقة لبيانات لوحة التحكم، وهذا النظام يعمل كواجهة ذكية لها فقط.`;

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const { data: newData, error: createError } = await supabase
          .from("ai_settings")
          .insert({
            system_prompt: defaultSystemPrompt,
            response_style: "brief",
            creativity_level: 20,
          })
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newData);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("حدث خطأ في جلب الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Omit<AISettings, "id" | "created_at" | "updated_at">>) => {
    if (!settings) return false;

    try {
      const { error } = await supabase
        .from("ai_settings")
        .update(updates)
        .eq("id", settings.id);

      if (error) throw error;
      setSettings({ ...settings, ...updates });
      toast.success("تم حفظ الإعدادات بنجاح");
      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("حدث خطأ في حفظ الإعدادات");
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
    defaultSystemPrompt,
  };
}
