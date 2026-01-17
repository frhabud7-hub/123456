import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AIModel {
  id: string;
  provider: string;
  model_name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_models")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("حدث خطأ في جلب النماذج");
    } finally {
      setLoading(false);
    }
  };

  const addModel = async (provider: string, modelName: string, apiKey: string) => {
    try {
      // Deactivate all models first if this is the first one
      const isFirst = models.length === 0;

      const { data, error } = await supabase
        .from("ai_models")
        .insert({
          provider,
          model_name: modelName,
          api_key: apiKey,
          is_active: isFirst,
        })
        .select()
        .single();

      if (error) throw error;
      setModels([data, ...models]);
      toast.success("تمت إضافة النموذج بنجاح");
      return true;
    } catch (error) {
      console.error("Error adding model:", error);
      toast.error("حدث خطأ في إضافة النموذج");
      return false;
    }
  };

  const deleteModel = async (id: string) => {
    try {
      const { error } = await supabase.from("ai_models").delete().eq("id", id);
      if (error) throw error;
      setModels(models.filter((m) => m.id !== id));
      toast.success("تم حذف النموذج");
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error("حدث خطأ في حذف النموذج");
    }
  };

  const setActiveModel = async (id: string) => {
    try {
      // First deactivate all
      await supabase.from("ai_models").update({ is_active: false }).neq("id", "");
      
      // Then activate the selected one
      const { error } = await supabase
        .from("ai_models")
        .update({ is_active: true })
        .eq("id", id);

      if (error) throw error;
      setModels(models.map((m) => ({ ...m, is_active: m.id === id })));
      toast.success("تم تفعيل النموذج");
    } catch (error) {
      console.error("Error setting active model:", error);
      toast.error("حدث خطأ في تفعيل النموذج");
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    loading,
    addModel,
    deleteModel,
    setActiveModel,
    refetch: fetchModels,
  };
}
