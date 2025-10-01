// Document types
export type DocumentStatus = 'active' | 'draft' | 'review' | 'archived' | 'expired';
export type DocumentCategory = 'Privacy Policy' | 'Procedure' | 'Template' | 'Form' | 'Notice' | 'Agreement' | 'Report';

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
}

export interface DocumentStats {
  total: number;
  active: number;
  draft: number;
  review: number;
  templates: number;
}

export interface DocumentFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  viewMode: 'grid' | 'list';
}
