import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface KnowledgeFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useKnowledgeFiles() {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("knowledge_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("حدث خطأ في جلب الملفات");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, category: string) => {
    try {
      // Upload to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("knowledge-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("knowledge-files")
        .getPublicUrl(fileName);

      // Save to database
      const { data, error } = await supabase
        .from("knowledge_files")
        .insert({
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          file_type: file.type || getFileType(file.name),
          category,
          status: "ready",
        })
        .select()
        .single();

      if (error) throw error;
      setFiles([data, ...files]);
      toast.success("تم رفع الملف بنجاح");
      return true;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("حدث خطأ في رفع الملف");
      return false;
    }
  };

  const deleteFile = async (id: string, filePath: string) => {
    try {
      // Extract file name from path
      const fileName = filePath.split("/").pop();
      
      // Delete from storage
      if (fileName) {
        await supabase.storage.from("knowledge-files").remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase.from("knowledge_files").delete().eq("id", id);
      if (error) throw error;
      
      setFiles(files.filter((f) => f.id !== id));
      toast.success("تم حذف الملف");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("حدث خطأ في حذف الملف");
    }
  };

  const updateCategory = async (id: string, category: string) => {
    try {
      const { error } = await supabase
        .from("knowledge_files")
        .update({ category })
        .eq("id", id);

      if (error) throw error;
      setFiles(files.map((f) => (f.id === id ? { ...f, category } : f)));
      toast.success("تم تحديث الفئة");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("حدث خطأ في تحديث الفئة");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    loading,
    uploadFile,
    deleteFile,
    updateCategory,
    refetch: fetchFiles,
  };
}

function getFileType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv",
    txt: "text/plain",
    json: "application/json",
  };
  return typeMap[ext || ""] || "application/octet-stream";
}
