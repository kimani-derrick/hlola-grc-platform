'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { vendorPrivacyAssessments } from '../../../../data/assessments';
import {
  filterAssessments,
  getStatusColor,
  getPriorityColor,
  getComplianceScoreColor,
  getComplianceScoreBg,
  formatDate,
  getDueDateColor,
  isDateOverdue,
  isDueSoon,
  getUniqueFrameworks,
  getUniqueAssignees,
  sortAssessments
} from '../../../../utils/assessmentUtils';
import { AssessmentFilters } from '../../../../types/assessments';

export default function VendorPrivacyAssessmentsPage() {
  const [filters, setFilters] = useState<AssessmentFilters>({
    searchQuery: '',
    selectedType: 'vendor',
    selectedStatus: 'all',
    selectedFramework: 'all',
    selectedPriority: 'all',
    dateRange: 'all',
    assignedTo: 'all'
  });

  const [sortBy, setSortBy] = useState<'title' | 'createdDate' | 'dueDate' | 'priority' | 'status'>('createdDate');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const filteredAssessments = useMemo(() => {
    const filtered = filterAssessments(vendorPrivacyAssessments, filters);
    return sortAssessments(filtered, sortBy) as typeof vendorPrivacyAssessments;
  }, [filters, sortBy]);

  const uniqueFrameworks = getUniqueFrameworks(vendorPrivacyAssessments);
  const uniqueAssignees = getUniqueAssignees(vendorPrivacyAssessments);

  const stats = {
    total: vendorPrivacyAssessments.length,
    completed: vendorPrivacyAssessments.filter(a => a.status === 'completed').length,
    inProgress: vendorPrivacyAssessments.filter(a => a.status === 'in-progress').length,
    pendingReview: vendorPrivacyAssessments.filter(a => a.status === 'pending-review').length,
    overdue: vendorPrivacyAssessments.filter(a => a.nextAuditDate && isDateOverdue(a.nextAuditDate)).length,
    averageComplianceScore: vendorPrivacyAssessments
      .reduce((acc, a) => acc + a.complianceScore, 0) / vendorPrivacyAssessments.length || 0
  };

  const selectedVendor = selectedAssessment ? 
    vendorPrivacyAssessments.find(a => a.id === selectedAssessment) : null;

  const vendorTypeStats = {
    processor: vendorPrivacyAssessments.filter(a => a.vendorType === 'processor').length,
    controller: vendorPrivacyAssessments.filter(a => a.vendorType === 'controller').length,
    'joint-controller': vendorPrivacyAssessments.filter(a => a.vendorType === 'joint-controller').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Privacy Assessments</h1>
            <p className="text-gray-600 mt-2">Evaluate third-party privacy compliance and risk management</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Vendor Assessment
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Vendor Templates
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Vendors</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{Math.round(stats.averageComplianceScore)}%</div>
            <div className="text-sm text-gray-600">Avg Compliance</div>
          </div>
        </div>

        {/* Vendor Type Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(vendorTypeStats).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search vendors..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
            />
            <select
              value={filters.selectedStatus}
              onChange={(e) => setFilters({ ...filters, selectedStatus: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filters.selectedFramework}
              onChange={(e) => setFilters({ ...filters, selectedFramework: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
            >
              <option value="all">All Frameworks</option>
              {uniqueFrameworks.map((framework) => (
                <option key={framework} value={framework}>{framework}</option>
              ))}
            </select>
            <select
              value={filters.selectedPriority}
              onChange={(e) => setFilters({ ...filters, selectedPriority: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
            >
              <option value="all">All Assignees</option>
              {uniqueAssignees.map((assignee) => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'createdDate' | 'dueDate' | 'priority' | 'status')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
            >
              <option value="createdDate">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Vendors List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAssessments.map((vendor) => (
              <div key={vendor.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🏢</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{vendor.title}</h3>
                        <span className="text-sm text-gray-500">{vendor.frameworkIcon}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(vendor.status)}`}>
                          {vendor.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(vendor.priority)}`}>
                          {vendor.priority.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded border bg-blue-100 text-blue-700">
                          {vendor.vendorType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{vendor.description}</p>
                      
                      {/* Vendor Specific Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Vendor:</span>
                          <div className="text-gray-900">{vendor.vendorName}</div>
                        </div>
                        <div>
                          <span className="font-medium">Service:</span>
                          <div className="text-gray-900">{vendor.serviceDescription}</div>
                        </div>
                        <div>
                          <span className="font-medium">DPA Status:</span>
                          <div className="text-gray-900 capitalize">{vendor.dpaStatus.replace('-', ' ')}</div>
                        </div>
                        <div>
                          <span className="font-medium">Certifications:</span>
                          <div className="text-gray-900">{vendor.certifications.length} certifications</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Assigned to: {vendor.assignedTo}</span>
                        <span>•</span>
                        <span>Created: {formatDate(vendor.createdDate)}</span>
                        {vendor.nextAuditDate && (
                          <>
                            <span>•</span>
                            <span className={getDueDateColor(vendor.nextAuditDate)}>
                              Next Audit: {formatDate(vendor.nextAuditDate)}
                              {isDateOverdue(vendor.nextAuditDate) && ' (Overdue)'}
                              {isDueSoon(vendor.nextAuditDate) && !isDateOverdue(vendor.nextAuditDate) && ' (Due Soon)'}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className={`${getComplianceScoreColor(vendor.complianceScore)}`}>
                          Compliance: {vendor.complianceScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedAssessment(vendor.id)}
                      className="text-sm text-[#26558e] hover:underline"
                    >
                      View Details
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAssessments.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendor assessments found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find vendor assessments.</p>
            </div>
          )}
        </div>

        {/* Vendor Details Modal */}
        {selectedVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🏢</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedVendor.title}</h2>
                      <p className="text-gray-600">{selectedVendor.framework} • {selectedVendor.frameworkIcon}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-sm px-3 py-1 rounded border ${getStatusColor(selectedVendor.status)}`}>
                    {selectedVendor.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getPriorityColor(selectedVendor.priority)}`}>
                    {selectedVendor.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-sm px-3 py-1 rounded border bg-blue-100 text-blue-700">
                    {selectedVendor.vendorType.toUpperCase()}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getComplianceScoreBg(selectedVendor.complianceScore)} ${getComplianceScoreColor(selectedVendor.complianceScore)}`}>
                    COMPLIANCE: {selectedVendor.complianceScore}%
                  </span>
                </div>

                {/* Vendor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Vendor Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-900">Vendor Name:</span>
                        <div className="text-gray-700">{selectedVendor.vendorName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Service Description:</span>
                        <div className="text-gray-700">{selectedVendor.serviceDescription}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Vendor Type:</span>
                        <div className="text-gray-700 capitalize">{selectedVendor.vendorType.replace('-', ' ')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Contract Value:</span>
                        <div className="text-gray-700">{selectedVendor.contractCurrency} {selectedVendor.contractValue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance & Risk</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-900">Risk Score:</span>
                        <div className="text-gray-700">{selectedVendor.riskScore}/10</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Compliance Score:</span>
                        <div className={`${getComplianceScoreColor(selectedVendor.complianceScore)}`}>{selectedVendor.complianceScore}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">DPA Status:</span>
                        <div className="text-gray-700 capitalize">{selectedVendor.dpaStatus.replace('-', ' ')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Certification Status:</span>
                        <div className="text-gray-700 capitalize">{selectedVendor.certificationStatus.replace('-', ' ')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Processing Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Processing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="font-medium text-gray-900">Data Categories:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedVendor.dataCategories.map((category, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Processing Purposes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedVendor.dataProcessingPurposes.map((purpose, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {purpose}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                {selectedVendor.certifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.certifications.map((cert, index) => (
                        <span key={index} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contract Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900">Termination Clause</div>
                      <div className="text-lg font-bold text-gray-700">{selectedVendor.terminationClause ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900">Data Return Clause</div>
                      <div className="text-lg font-bold text-gray-700">{selectedVendor.dataReturnClause ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900">Breach Notification</div>
                      <div className="text-lg font-bold text-gray-700">{selectedVendor.breachNotificationClause ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900">Data Sharing Scope</div>
                      <div className="text-lg font-bold text-gray-700 capitalize">{selectedVendor.dataSharingScope}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex-1 bg-[#26558e] text-white px-4 py-3 rounded-lg hover:bg-[#1e4470] transition-colors">
                    Edit Assessment
                  </button>
                  <button className="flex-1 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    Download Report
                  </button>
                  <button className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
