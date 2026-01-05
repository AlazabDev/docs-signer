import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Document {
  id: string;
  daftra_id: string | null;
  type: string;
  number: string;
  client_name: string;
  client_email: string | null;
  total: number;
  currency: string;
  date: string;
  status: string;
  payment_status: string;
  pdf_url: string | null;
  html_url: string | null;
  file_url: string | null;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
  ai_summary: string | null;
  ai_extracted_data: Record<string, unknown> | null;
  raw_json: Record<string, unknown> | null;
}

export interface DocumentStats {
  inReview: number;
  needsFix: number;
  readyToApprove: number;
  approvedToday: number;
  totalDocuments: number;
  pendingSignatures: number;
}

export function useDocuments(status?: string, search?: string) {
  return useQuery({
    queryKey: ['documents', status, search],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`number.ilike.%${search}%,client_name.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Document[];
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Document;
    },
    enabled: !!id,
  });
}

export function useDocumentStats() {
  return useQuery({
    queryKey: ['documentStats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      const [
        { count: inReview },
        { count: needsFix },
        { count: readyToApprove },
        { count: approvedToday },
        { count: totalDocuments },
        { count: pendingSignatures },
      ] = await Promise.all([
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'in_review'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'needs_fix'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'ready_to_approve'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'approved').gte('updated_at', today),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'ready_to_approve'),
      ]);

      return {
        inReview: inReview || 0,
        needsFix: needsFix || 0,
        readyToApprove: readyToApprove || 0,
        approvedToday: approvedToday || 0,
        totalDocuments: totalDocuments || 0,
        pendingSignatures: pendingSignatures || 0,
      } as DocumentStats;
    },
  });
}

export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('documents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      toast.success('تم تحديث حالة المستند');
    },
    onError: (error) => {
      toast.error('فشل تحديث حالة المستند');
      console.error(error);
    },
  });
}

export function useDocumentComments(documentId: string) {
  return useQuery({
    queryKey: ['documentComments', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: {
      document_id: string;
      text: string;
      user_name: string;
      page?: number;
    }) => {
      const { data, error } = await supabase
        .from('document_comments')
        .insert(comment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentComments', variables.document_id] });
      toast.success('تم إضافة التعليق');
    },
  });
}

export function useDocumentVersions(documentId: string) {
  return useQuery({
    queryKey: ['documentVersions', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });
}

export function useDocumentAuditLogs(documentId?: string) {
  return useQuery({
    queryKey: ['documentAuditLogs', documentId],
    queryFn: async () => {
      let query = supabase
        .from('document_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (documentId) {
        query = query.eq('document_id', documentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
}
