'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import DocumentCard from '../../../../components/DocumentCard';
import DocumentTable from '../../../../components/DocumentTable';
import DocumentFilters from '../../../../components/DocumentFilters';
import DocumentStats from '../../../../components/DocumentStats';
import DocumentDetailsModal from '../../../../components/DocumentDetailsModal';
import { Document, DocumentFilters as DocumentFiltersType } from '../../../../types/documents';
import { documents, calculateStats } from '../../../../data/documents';
import { filterDocuments } from '../../../../utils/documentUtils';



export default function DocumentsPage() {
  const [filters, setFilters] = useState<DocumentFiltersType>({
    searchQuery: '',
    selectedCategory: 'all',
    selectedStatus: 'all',
    viewMode: 'grid'
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = filterDocuments(documents, filters);
  const stats = calculateStats(documents);

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

          <DocumentStats stats={stats} />

          <DocumentFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        </div>

        {/* Documents Grid/List */}
        {filters.viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={setSelectedDocument}
              />
            ))}
          </div>
        ) : (
          <DocumentTable
            documents={filteredDocuments}
            onDocumentClick={setSelectedDocument}
          />
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

      <DocumentDetailsModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </DashboardLayout>
  );
}
