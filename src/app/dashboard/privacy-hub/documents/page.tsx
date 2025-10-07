'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import DocumentCard from '../../../../components/DocumentCard';
import DocumentTable from '../../../../components/DocumentTable';
import DocumentDetailsModal from '../../../../components/DocumentDetailsModal';
import { Document, DocumentFilters as DocumentFiltersType } from '../../../../types/documents';
import { allDocuments, calculateStats } from '../../../../data/documents';
import { filterDocuments, getUniqueFrameworks, getUniqueControls, getUniqueTasks } from '../../../../utils/documentUtils';



export default function DocumentsPage() {
  const [filters, setFilters] = useState<DocumentFiltersType>({
    searchQuery: '',
    selectedCategory: 'all',
    selectedStatus: 'all',
    selectedFramework: 'all',
    selectedControl: 'all',
    selectedTask: 'all',
    selectedEvidenceType: 'all',
    viewMode: 'grid',
    showEvidenceOnly: true
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = filterDocuments(allDocuments, filters);
  const stats = calculateStats(allDocuments);
  
  // Get unique frameworks, controls, and tasks for filters
  const frameworks = useMemo(() => getUniqueFrameworks(allDocuments), []);
  const controls = useMemo(() => getUniqueControls(allDocuments, filters.selectedFramework !== 'all' ? filters.selectedFramework : undefined), [filters.selectedFramework]);
  const tasks = useMemo(() => getUniqueTasks(allDocuments, filters.selectedFramework !== 'all' ? filters.selectedFramework : undefined, filters.selectedControl !== 'all' ? filters.selectedControl : undefined), [filters.selectedFramework, filters.selectedControl]);

  const evidenceTypeOptions = [
    { id: 'policy', name: 'Policy Documents' },
    { id: 'procedure', name: 'Procedures' },
    { id: 'screenshot', name: 'Screenshots' },
    { id: 'certificate', name: 'Certificates' },
    { id: 'audit-report', name: 'Audit Reports' },
    { id: 'training-record', name: 'Training Records' },
    { id: 'assessment', name: 'Assessments' },
    { id: 'other', name: 'Other' }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Evidence & Documents</h1>
              <p className="text-gray-600 mt-2">Manage compliance evidence uploaded from frameworks, controls, and tasks</p>
              
              {/* Information panel */}
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>Evidence Management:</strong> This section contains all compliance evidence uploaded from your controls implementation. 
                      Filter by framework, control, or task to find specific evidence. Evidence is linked to compliance requirements for easy audit preparation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Evidence</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.evidence}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.review}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Frameworks</p>
                  <p className="text-2xl font-bold text-purple-600">{frameworks.length}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Templates</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.templates}</p>
                </div>
                <div className="bg-indigo-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button 
                onClick={() => setFilters({
                  searchQuery: '',
                  selectedCategory: 'all',
                  selectedStatus: 'all',
                  selectedFramework: 'all',
                  selectedControl: 'all',
                  selectedTask: 'all',
                  selectedEvidenceType: 'all',
                  viewMode: filters.viewMode,
                  showEvidenceOnly: true
                })}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search evidence..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Framework Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
                <select
                  value={filters.selectedFramework}
                  onChange={(e) => setFilters({ ...filters, selectedFramework: e.target.value, selectedControl: 'all', selectedTask: 'all' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Frameworks</option>
                  {frameworks.map(fw => (
                    <option key={fw.id} value={fw.id}>{fw.name}</option>
                  ))}
                </select>
              </div>

              {/* Control Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Control</label>
                <select
                  value={filters.selectedControl}
                  onChange={(e) => setFilters({ ...filters, selectedControl: e.target.value, selectedTask: 'all' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={controls.length === 0}
                >
                  <option value="all">All Controls</option>
                  {controls.map(ctrl => (
                    <option key={ctrl.id} value={ctrl.id}>{ctrl.name}</option>
                  ))}
                </select>
              </div>

              {/* Task Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
                <select
                  value={filters.selectedTask}
                  onChange={(e) => setFilters({ ...filters, selectedTask: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={tasks.length === 0}
                >
                  <option value="all">All Tasks</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Evidence Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Type</label>
                <select
                  value={filters.selectedEvidenceType}
                  onChange={(e) => setFilters({ ...filters, selectedEvidenceType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {evidenceTypeOptions.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.selectedStatus}
                  onChange={(e) => setFilters({ ...filters, selectedStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, viewMode: 'grid' })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      filters.viewMode === 'grid'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, viewMode: 'list' })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      filters.viewMode === 'list'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Show Evidence Only Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter Options</label>
                <label className="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={filters.showEvidenceOnly}
                    onChange={(e) => setFilters({ ...filters, showEvidenceOnly: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Evidence Only</span>
                </label>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredDocuments.length}</span> of <span className="font-semibold text-gray-900">{allDocuments.length}</span> documents
              </p>
            </div>
          </div>
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
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters to find documents.</p>
            <p className="text-gray-500">No evidence documents found. Evidence will appear here when uploaded.</p>
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
