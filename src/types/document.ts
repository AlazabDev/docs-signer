export type DocumentStatus = 
  | 'draft'
  | 'in_review'
  | 'needs_fix'
  | 'ready_to_approve'
  | 'approved'
  | 'signed'
  | 'archived';

export type DocumentType = 'invoice' | 'quote' | 'estimate';

export interface Document {
  id: string;
  daftraId: string;
  type: DocumentType;
  number: string;
  clientName: string;
  clientEmail: string;
  total: number;
  currency: string;
  date: string;
  status: DocumentStatus;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  pdfUrl?: string;
  htmlUrl?: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  text: string;
  page?: number;
  x?: number;
  y?: number;
  createdAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  source: 'daftra' | 'upload';
  fileUrl: string;
  createdBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: 'مسودة',
  in_review: 'قيد المراجعة',
  needs_fix: 'يحتاج تعديل',
  ready_to_approve: 'جاهز للاعتماد',
  approved: 'معتمد',
  signed: 'موقّع',
  archived: 'مؤرشف',
};

export const STATUS_CLASSES: Record<DocumentStatus, string> = {
  draft: 'status-draft',
  in_review: 'status-review',
  needs_fix: 'status-needsfix',
  ready_to_approve: 'status-ready',
  approved: 'status-approved',
  signed: 'status-signed',
  archived: 'status-archived',
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  invoice: 'فاتورة',
  quote: 'عرض سعر',
  estimate: 'تقدير',
};
