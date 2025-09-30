'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { formatDate } from '../../../../utils/dateUtils';

// Document types
type DocumentStatus = 'active' | 'draft' | 'review' | 'archived' | 'expired';
type DocumentCategory = 'Privacy Policy' | 'Procedure' | 'Template' | 'Form' | 'Notice' | 'Agreement' | 'Report';

interface Document {
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

const documents: Document[] = [
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
    approver: 'Michael Chen',
    approvalDate: '2024-01-06',
    tags: ['Incident Response', 'Data Breach', 'Security', 'Procedure'],
    fileSize: '3.2 MB',
    downloadCount: 145,
    isTemplate: false
  },
  {
    id: '6',
    title: 'Vendor Data Processing Agreement Template',
    description: 'Standard template for data processing agreements with third-party vendors and suppliers.',
    category: 'Agreement',
    status: 'active',
    version: '2.3',
    lastModified: '2024-01-03',
    author: 'Anna Thompson',
    approver: 'Phillip Kisaka',
    approvalDate: '2024-01-04',
    expiryDate: '2025-01-03',
    tags: ['DPA', 'Vendor Management', 'Third Party', 'Contract'],
    fileSize: '1.8 MB',
    downloadCount: 198,
    isTemplate: true
  },
  {
    id: '7',
    title: 'Privacy Training Materials',
    description: 'Comprehensive training materials for employee privacy awareness and compliance education.',
    category: 'Report',
    status: 'draft',
    version: '1.0',
    lastModified: '2024-01-01',
    author: 'Robert Kim',
    tags: ['Training', 'Education', 'Awareness', 'Employees'],
    fileSize: '5.6 MB',
    downloadCount: 23,
    isTemplate: false
  },
  {
    id: '8',
    title: 'Records of Processing Activities (ROPA)',
    description: 'Detailed inventory of all data processing activities as required by privacy regulations.',
    category: 'Report',
    status: 'expired',
    version: '1.2',
    lastModified: '2023-12-28',
    author: 'Maria Garcia',
    expiryDate: '2024-01-01',
    tags: ['ROPA', 'Data Inventory', 'Processing Activities', 'Compliance'],
    fileSize: '4.3 MB',
    downloadCount: 112,
    isTemplate: false
  }
];

const statusConfig = {
  active: { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500', label: 'Active' },
  draft: { color: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500', label: 'Draft' },
  review: { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500', label: 'Under Review' },
  archived: { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500', label: 'Archived' },
  expired: { color: 'text-red-700', bg: 'bg-red-100', dot: 'bg-red-500', label: 'Expired' }
};

const categoryIcons = {
  'Privacy Policy': '📋',
  'Procedure': '📋',
  'Template': '📄',
  'Form': '📝',
  'Notice': '📢',
  'Agreement': '📜',
  'Report': '📊'
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    draft: documents.filter(d => d.status === 'draft').length,
    review: documents.filter(d => d.status === 'review').length,
    templates: documents.filter(d => d.isTemplate).length
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Documents</h1>
              <p className="text-gray-600 mt-2">Manage privacy policies, procedures, templates, and compliance documents</p>
              
              {/* What are documents explanation */}
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Document Management:</strong> This section contains all your privacy-related documents including policies, 
                      procedures, templates, and forms. Use templates to quickly create compliant documents and track approval workflows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import Documents
              </button>
              <button className="bg-[#26558e] text-white px-6 py-2 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Document
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Draft</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.review}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.templates}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search documents, tags, or content..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Privacy Policy">Privacy Policies</option>
                <option value="Procedure">Procedures</option>
                <option value="Template">Templates</option>
                <option value="Form">Forms</option>
                <option value="Notice">Notices</option>
                <option value="Agreement">Agreements</option>
                <option value="Report">Reports</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
                <option value="archived">Archived</option>
                <option value="expired">Expired</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[#26558e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#26558e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDocument(document)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                        {categoryIcons[document.category]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{document.title}</h3>
                        <p className="text-sm text-gray-500">{document.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[document.status].bg} ${statusConfig[document.status].color}`}>
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[document.status].dot}`}></span>
                        {statusConfig[document.status].label}
                      </span>
                      {document.isTemplate && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          Template
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{document.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Version {document.version}</span>
                      <span>{document.fileSize}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {document.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {tag}
                        </span>
                      ))}
                      {document.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                          +{document.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {document.author}</span>
                      <span>{document.downloadCount} downloads</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Updated {formatDate(document.lastModified)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg mr-4">
                            {categoryIcons[document.category]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{document.title}</div>
                            <div className="text-sm text-gray-500">{document.fileSize}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{document.category}</span>
                        {document.isTemplate && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                            Template
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[document.status].bg} ${statusConfig[document.status].color}`}>
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[document.status].dot}`}></span>
                          {statusConfig[document.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(document.lastModified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.downloadCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-[#26558e] hover:text-[#1e4470] mr-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocument(document);
                          }}
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find documents.</p>
          </div>
        )}
      </div>

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mr-4">
                    {categoryIcons[selectedDocument.category]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.title}</h2>
                    <p className="text-gray-600">{selectedDocument.category} • Version {selectedDocument.version}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{selectedDocument.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedDocument.status === 'active' && selectedDocument.approver && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Approval Information</h3>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-800">Approved by {selectedDocument.approver}</p>
                            <p className="text-sm text-green-600">
                              on {selectedDocument.approvalDate && formatDate(selectedDocument.approvalDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Document Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedDocument.status].bg} ${statusConfig[selectedDocument.status].color}`}>
                          {statusConfig[selectedDocument.status].label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="text-gray-900">{selectedDocument.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Downloads:</span>
                        <span className="text-gray-900">{selectedDocument.downloadCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Author:</span>
                        <span className="text-gray-900">{selectedDocument.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Modified:</span>
                        <span className="text-gray-900">{formatDate(selectedDocument.lastModified)}</span>
                      </div>
                      {selectedDocument.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expires:</span>
                          <span className="text-gray-900">{formatDate(selectedDocument.expiryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button className="w-full bg-[#26558e] text-white px-4 py-2 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
