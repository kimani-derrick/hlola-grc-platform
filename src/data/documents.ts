import { Document, DocumentStats } from '../types/documents';

export const documents: Document[] = [
  {
    id: '1',
    title: 'Privacy Policy v3.2',
    description: 'Comprehensive privacy policy covering data collection, processing, and user rights in compliance with African data protection laws.',
    category: 'Privacy Policy',
    status: 'active',
    version: '3.2',
    lastModified: '2024-01-15',
    author: 'Phillip Kisaka',
    approver: 'Michael Chen',
    approvalDate: '2024-01-20',
    expiryDate: '2024-12-31',
    tags: ['GDPR', 'POPIA', 'Kenya DPA', 'Customer Data'],
    fileSize: '2.4 MB',
    downloadCount: 156,
    isTemplate: false
  },
  {
    id: '2',
    title: 'Data Subject Request Form',
    description: 'Standard form for individuals to submit data access, rectification, or deletion requests.',
    category: 'Form',
    status: 'active',
    version: '2.1',
    lastModified: '2024-01-12',
    author: 'Emma Wilson',
    approver: 'Phillip Kisaka',
    approvalDate: '2024-01-14',
    tags: ['DSR', 'Data Rights', 'GDPR', 'Form'],
    fileSize: '245 KB',
    downloadCount: 89,
    isTemplate: true
  },
  {
    id: '3',
    title: 'Data Processing Impact Assessment Template',
    description: 'Template for conducting privacy impact assessments for new projects and data processing activities.',
    category: 'Template',
    status: 'active',
    version: '1.8',
    lastModified: '2024-01-10',
    author: 'David Kumar',
    approver: 'Michael Chen',
    approvalDate: '2024-01-11',
    tags: ['DPIA', 'PIA', 'Risk Assessment', 'Template'],
    fileSize: '1.1 MB',
    downloadCount: 234,
    isTemplate: true
  },
  {
    id: '4',
    title: 'Cookie Notice and Consent Management',
    description: 'Website cookie notice and consent management procedures for compliance with privacy regulations.',
    category: 'Notice',
    status: 'review',
    version: '2.0',
    lastModified: '2024-01-08',
    author: 'Lisa Park',
    tags: ['Cookies', 'Consent', 'Website', 'GDPR'],
    fileSize: '892 KB',
    downloadCount: 67,
    isTemplate: false
  },
  {
    id: '5',
    title: 'Data Breach Response Procedure',
    description: 'Step-by-step procedure for responding to data security incidents and breaches.',
    category: 'Procedure',
    status: 'active',
    version: '1.5',
    lastModified: '2024-01-05',
    author: 'James Rodriguez',
    approver: 'Phillip Kisaka',
    approvalDate: '2024-01-06',
    tags: ['Breach', 'Incident Response', 'Security', 'Procedure'],
    fileSize: '1.8 MB',
    downloadCount: 123,
    isTemplate: false
  },
  {
    id: '6',
    title: 'Vendor Data Processing Agreement Template',
    description: 'Standard template for data processing agreements with third-party vendors and service providers.',
    category: 'Agreement',
    status: 'active',
    version: '2.3',
    lastModified: '2024-01-03',
    author: 'Sarah Johnson',
    approver: 'Michael Chen',
    approvalDate: '2024-01-04',
    tags: ['DPA', 'Vendor', 'Third Party', 'Agreement'],
    fileSize: '3.2 MB',
    downloadCount: 198,
    isTemplate: true
  },
  {
    id: '7',
    title: 'Privacy Compliance Report Q4 2023',
    description: 'Quarterly compliance report covering privacy program metrics, incidents, and improvement initiatives.',
    category: 'Report',
    status: 'active',
    version: '1.0',
    lastModified: '2024-01-01',
    author: 'Michael Chen',
    approver: 'CEO',
    approvalDate: '2024-01-02',
    tags: ['Report', 'Compliance', 'Q4 2023', 'Metrics'],
    fileSize: '4.1 MB',
    downloadCount: 45,
    isTemplate: false
  },
  {
    id: '8',
    title: 'Employee Privacy Training Materials',
    description: 'Comprehensive training materials for employee privacy awareness and data protection best practices.',
    category: 'Template',
    status: 'draft',
    version: '1.2',
    lastModified: '2023-12-28',
    author: 'Emma Wilson',
    tags: ['Training', 'Employee', 'Awareness', 'Education'],
    fileSize: '5.7 MB',
    downloadCount: 0,
    isTemplate: true
  },
  {
    id: '9',
    title: 'Data Retention Policy',
    description: 'Policy defining data retention periods and secure disposal procedures for different data types.',
    category: 'Procedure',
    status: 'active',
    version: '1.1',
    lastModified: '2023-12-20',
    author: 'David Kumar',
    approver: 'Phillip Kisaka',
    approvalDate: '2023-12-21',
    tags: ['Retention', 'Disposal', 'Data Lifecycle', 'Policy'],
    fileSize: '1.3 MB',
    downloadCount: 78,
    isTemplate: false
  },
  {
    id: '10',
    title: 'Consent Management System Configuration Guide',
    description: 'Technical guide for configuring consent management systems and cookie banners.',
    category: 'Procedure',
    status: 'archived',
    version: '1.0',
    lastModified: '2023-12-15',
    author: 'James Rodriguez',
    tags: ['Consent', 'Technical', 'Configuration', 'System'],
    fileSize: '2.1 MB',
    downloadCount: 34,
    isTemplate: false
  },
  {
    id: '11',
    title: 'Data Subject Rights Request Log Template',
    description: 'Template for logging and tracking data subject rights requests and responses.',
    category: 'Template',
    status: 'active',
    version: '1.4',
    lastModified: '2023-12-10',
    author: 'Lisa Park',
    approver: 'Emma Wilson',
    approvalDate: '2023-12-11',
    tags: ['DSR', 'Logging', 'Tracking', 'Template'],
    fileSize: '456 KB',
    downloadCount: 112,
    isTemplate: true
  },
  {
    id: '12',
    title: 'Privacy Impact Assessment for New CRM System',
    description: 'Detailed PIA for the implementation of a new customer relationship management system.',
    category: 'Report',
    status: 'review',
    version: '1.0',
    lastModified: '2023-12-05',
    author: 'David Kumar',
    tags: ['PIA', 'CRM', 'Assessment', 'New System'],
    fileSize: '6.8 MB',
    downloadCount: 23,
    isTemplate: false
  }
];

export const categoryIcons: Record<string, string> = {
  'Privacy Policy': '📄',
  'Procedure': '📋',
  'Template': '📝',
  'Form': '📋',
  'Notice': '📢',
  'Agreement': '🤝',
  'Report': '📊'
};

export const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-green-700', bg: 'bg-green-100' },
  draft: { label: 'Draft', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  review: { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-100' },
  archived: { label: 'Archived', color: 'text-gray-700', bg: 'bg-gray-100' },
  expired: { label: 'Expired', color: 'text-red-700', bg: 'bg-red-100' }
};

export const calculateStats = (docs: Document[]): DocumentStats => {
  return {
    total: docs.length,
    active: docs.filter(doc => doc.status === 'active').length,
    draft: docs.filter(doc => doc.status === 'draft').length,
    review: docs.filter(doc => doc.status === 'review').length,
    templates: docs.filter(doc => doc.isTemplate).length
  };
};
