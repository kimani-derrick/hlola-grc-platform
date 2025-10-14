import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Document, DocumentStats } from '../types/documents';

export function useDocumentsData() {
  const { user, isLoading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    active: 0,
    draft: 0,
    review: 0,
    templates: 0,
    evidence: 0
  });

  const fetchDocuments = async () => {
    if (!user?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getDocuments(user.organizationId);
      
      if (response.success && response.data) {
        const documentsData = (response.data as any)?.documents || [];
        
        // Transform API data to match Document interface
        const transformedDocuments: Document[] = documentsData.map((doc: any) => ({
          id: doc.id,
          title: doc.name || doc.title || 'Untitled Document',
          description: doc.description || '',
          category: mapDocumentTypeToCategory(doc.document_type),
          status: mapDocumentStatus(doc.status),
          version: doc.version || '1.0',
          lastModified: doc.updated_at || doc.created_at,
          author: `${doc.uploader_first_name || ''} ${doc.uploader_last_name || ''}`.trim() || 'Unknown',
          approver: doc.approver || undefined,
          approvalDate: doc.approval_date || undefined,
          expiryDate: doc.expiry_date || undefined,
          tags: doc.tags ? (Array.isArray(doc.tags) ? doc.tags : doc.tags.split(',')) : [],
          fileSize: formatFileSize(doc.file_size),
          downloadCount: doc.download_count || 0,
          isTemplate: doc.is_template || false,
          // Evidence-specific fields
          isEvidence: doc.is_evidence || false,
          evidenceType: mapEvidenceType(doc.document_type),
          frameworkId: doc.framework_id,
          frameworkName: doc.framework_name,
          controlId: doc.control_id,
          controlName: doc.control_title,
          taskId: doc.task_id,
          taskName: doc.task_title,
          uploadedDate: doc.created_at,
          fileType: getFileTypeFromMime(doc.mime_type) || getFileTypeFromPath(doc.file_path),
          fileUrl: doc.file_path
        }));

        setDocuments(transformedDocuments);
        
        // Calculate stats
        const calculatedStats = calculateDocumentStats(transformedDocuments);
        setStats(calculatedStats);

        console.log('🔍 DEBUG - Documents loaded:', {
          total: transformedDocuments.length,
          evidence: transformedDocuments.filter(d => d.isEvidence).length,
          stats: calculatedStats
        });
      }
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.organizationId) {
      fetchDocuments();
    }
  }, [user?.organizationId, authLoading]);

  return {
    documents,
    stats,
    loading: loading || authLoading,
    error,
    refetch: fetchDocuments
  };
}

// Helper functions
function mapDocumentTypeToCategory(documentType: string): Document['category'] {
  const typeMap: Record<string, Document['category']> = {
    'policy': 'Privacy Policy',
    'procedure': 'Procedure',
    'template': 'Template',
    'form': 'Form',
    'notice': 'Notice',
    'agreement': 'Agreement',
    'report': 'Report',
    'evidence': 'Evidence'
  };
  return typeMap[documentType] || 'Evidence';
}

function mapDocumentStatus(status: string): Document['status'] {
  const statusMap: Record<string, Document['status']> = {
    'active': 'active',
    'draft': 'draft',
    'review': 'review',
    'archived': 'archived',
    'expired': 'expired'
  };
  return statusMap[status] || 'active';
}

function mapEvidenceType(documentType: string): Document['evidenceType'] {
  const typeMap: Record<string, Document['evidenceType']> = {
    'policy': 'policy',
    'procedure': 'procedure',
    'screenshot': 'screenshot',
    'certificate': 'certificate',
    'audit-report': 'audit-report',
    'training-record': 'training-record',
    'assessment': 'assessment',
    'other': 'other'
  };
  return typeMap[documentType] || 'other';
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function getFileTypeFromMime(mimeType: string): string | undefined {
  if (!mimeType) return undefined;
  
  const mimeMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'application/zip': 'zip'
  };
  
  return mimeMap[mimeType];
}

function getFileTypeFromPath(filePath: string): string | undefined {
  if (!filePath) return undefined;
  
  const extension = filePath.split('.').pop()?.toLowerCase();
  return extension;
}

function calculateDocumentStats(documents: Document[]): DocumentStats {
  return {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    draft: documents.filter(d => d.status === 'draft').length,
    review: documents.filter(d => d.status === 'review').length,
    templates: documents.filter(d => d.isTemplate).length,
    evidence: documents.filter(d => d.isEvidence).length
  };
}
