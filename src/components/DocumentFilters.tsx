'use client';

import { DocumentFilters as DocumentFiltersType } from '../types/documents';

interface DocumentFiltersProps {
  filters: DocumentFiltersType;
  onFiltersChange: (filters: DocumentFiltersType) => void;
}

export default function DocumentFilters({ filters, onFiltersChange }: DocumentFiltersProps) {
  const handleSearchChange = (searchQuery: string) => {
    onFiltersChange({ ...filters, searchQuery });
  };

  const handleCategoryChange = (selectedCategory: string) => {
    onFiltersChange({ ...filters, selectedCategory });
  };

  const handleStatusChange = (selectedStatus: string) => {
    onFiltersChange({ ...filters, selectedStatus });
  };

  const handleViewModeChange = (viewMode: 'grid' | 'list') => {
    onFiltersChange({ ...filters, viewMode });
  };

  return (
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
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
          value={filters.selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
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
          value={filters.selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
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
            className={`px-3 py-2 ${filters.viewMode === 'grid' ? 'bg-[#26558e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => handleViewModeChange('grid')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            className={`px-3 py-2 ${filters.viewMode === 'list' ? 'bg-[#26558e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => handleViewModeChange('list')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
