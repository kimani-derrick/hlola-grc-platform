// Document types
export type DocumentStatus = 'active' | 'draft' | 'review' | 'archived' | 'expired';
export type DocumentCategory = 'Privacy Policy' | 'Procedure' | 'Template' | 'Form' | 'Notice' | 'Agreement' | 'Report' | 'Evidence';
export type EvidenceType = 'policy' | 'procedure' | 'screenshot' | 'certificate' | 'audit-report' | 'training-record' | 'assessment' | 'other';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: string;
  lastModified: string;
  author: string;
  approver?: string;
  approvalDate?: string;
  expiryDate?: string;
  tags: string[];
  fileSize: string;
  downloadCount: number;
  isTemplate: boolean;
  // Evidence-specific fields
  isEvidence?: boolean;
  evidenceType?: EvidenceType;
  frameworkId?: string;
  frameworkName?: string;
  controlId?: string;
  controlName?: string;
  taskId?: string;
  taskName?: string;
  uploadedDate?: string;
  fileType?: string;
  fileUrl?: string;
}

export interface DocumentStats {
  total: number;
  active: number;
  draft: number;
  review: number;
  templates: number;
  evidence: number;
}

export interface DocumentFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  selectedFramework: string;
  selectedControl: string;
  selectedTask: string;
  selectedEvidenceType: string;
  viewMode: 'grid' | 'list';
  showEvidenceOnly: boolean;
}
