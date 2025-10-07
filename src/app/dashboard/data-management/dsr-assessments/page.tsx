'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { dataSubjectRightsAssessments } from '../../../../data/assessments';
import {
  filterAssessments,
  getStatusColor,
  getPriorityColor,
  formatDate,
  getDueDateColor,
  isDateOverdue,
  isDueSoon,
  getUniqueFrameworks,
  getUniqueAssignees,
  sortAssessments
} from '../../../../utils/assessmentUtils';
import { AssessmentFilters } from '../../../../types/assessments';

export default function DataSubjectRightsAssessmentsPage() {
  const [filters, setFilters] = useState<AssessmentFilters>({
    searchQuery: '',
    selectedType: 'dsr',
    selectedStatus: 'all',
    selectedFramework: 'all',
    selectedPriority: 'all',
    dateRange: 'all',
    assignedTo: 'all'
  });

  const [sortBy, setSortBy] = useState<'title' | 'createdDate' | 'dueDate' | 'priority' | 'status'>('createdDate');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const filteredAssessments = useMemo(() => {
    const filtered = filterAssessments(dataSubjectRightsAssessments, filters);
    return sortAssessments(filtered, sortBy) as typeof dataSubjectRightsAssessments;
  }, [filters, sortBy]);

  const uniqueFrameworks = getUniqueFrameworks(dataSubjectRightsAssessments);
  const uniqueAssignees = getUniqueAssignees(dataSubjectRightsAssessments);

  const stats = {
    total: dataSubjectRightsAssessments.length,
    completed: dataSubjectRightsAssessments.filter(a => a.status === 'completed').length,
    inProgress: dataSubjectRightsAssessments.filter(a => a.status === 'in-progress').length,
    pendingReview: dataSubjectRightsAssessments.filter(a => a.status === 'pending-review').length,
    overdue: dataSubjectRightsAssessments.filter(a => a.responseDeadline && isDateOverdue(a.responseDeadline)).length,
    averageResponseTime: dataSubjectRightsAssessments
      .filter(a => a.responseTime > 0)
      .reduce((acc, a) => acc + a.responseTime, 0) / 
      dataSubjectRightsAssessments.filter(a => a.responseTime > 0).length || 0
  };

  const selectedDSR = selectedAssessment ? 
    dataSubjectRightsAssessments.find(a => a.id === selectedAssessment) : null;

  const requestTypeStats = {
    access: dataSubjectRightsAssessments.filter(a => a.requestType === 'access').length,
    rectification: dataSubjectRightsAssessments.filter(a => a.requestType === 'rectification').length,
    erasure: dataSubjectRightsAssessments.filter(a => a.requestType === 'erasure').length,
    portability: dataSubjectRightsAssessments.filter(a => a.requestType === 'portability').length,
    objection: dataSubjectRightsAssessments.filter(a => a.requestType === 'objection').length,
    restriction: dataSubjectRightsAssessments.filter(a => a.requestType === 'restriction').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Subject Rights Assessments</h1>
            <p className="text-gray-600 mt-2">Evaluate readiness to handle data subject requests and track response effectiveness</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New DSR Assessment
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              DSR Templates
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total DSRs</div>
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
            <div className="text-2xl font-bold text-purple-600">{Math.round(stats.averageResponseTime)}h</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
        </div>

        {/* Request Type Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(requestTypeStats).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search DSRs..."
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

        {/* DSRs List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAssessments.map((dsr) => (
              <div key={dsr.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">👥</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{dsr.title}</h3>
                        <span className="text-sm text-gray-500">{dsr.frameworkIcon}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(dsr.status)}`}>
                          {dsr.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(dsr.priority)}`}>
                          {dsr.priority.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded border bg-blue-100 text-blue-700">
                          {dsr.requestType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{dsr.description}</p>
                      
                      {/* DSR Specific Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Data Subject:</span>
                          <div className="text-gray-900">{dsr.dataSubject}</div>
                        </div>
                        <div>
                          <span className="font-medium">Complexity:</span>
                          <div className="text-gray-900 capitalize">{dsr.complexity}</div>
                        </div>
                        <div>
                          <span className="font-medium">Data Volume:</span>
                          <div className="text-gray-900 capitalize">{dsr.dataVolume}</div>
                        </div>
                        <div>
                          <span className="font-medium">Verification Required:</span>
                          <div className="text-gray-900">{dsr.verificationRequired ? 'Yes' : 'No'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Assigned to: {dsr.assignedTo}</span>
                        <span>•</span>
                        <span>Request Date: {formatDate(dsr.requestDate)}</span>
                        <span>•</span>
                        <span className={getDueDateColor(dsr.responseDeadline)}>
                          Response Deadline: {formatDate(dsr.responseDeadline)}
                          {isDateOverdue(dsr.responseDeadline) && ' (Overdue)'}
                          {isDueSoon(dsr.responseDeadline) && !isDateOverdue(dsr.responseDeadline) && ' (Due Soon)'}
                        </span>
                        {dsr.responseTime > 0 && (
                          <>
                            <span>•</span>
                            <span>Response Time: {dsr.responseTime}h</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedAssessment(dsr.id)}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No DSR assessments found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find DSR assessments.</p>
            </div>
          )}
        </div>

        {/* DSR Details Modal */}
        {selectedDSR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">👥</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedDSR.title}</h2>
                      <p className="text-gray-600">{selectedDSR.framework} • {selectedDSR.frameworkIcon}</p>
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
                  <span className={`text-sm px-3 py-1 rounded border ${getStatusColor(selectedDSR.status)}`}>
                    {selectedDSR.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getPriorityColor(selectedDSR.priority)}`}>
                    {selectedDSR.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-sm px-3 py-1 rounded border bg-blue-100 text-blue-700">
                    {selectedDSR.requestType.toUpperCase()} REQUEST
                  </span>
                </div>

                {/* Request Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-900">Data Subject:</span>
                        <div className="text-gray-700">{selectedDSR.dataSubject}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Request Type:</span>
                        <div className="text-gray-700 capitalize">{selectedDSR.requestType}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Request Date:</span>
                        <div className="text-gray-700">{formatDate(selectedDSR.requestDate)}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Response Deadline:</span>
                        <div className={`text-gray-700 ${getDueDateColor(selectedDSR.responseDeadline)}`}>
                          {formatDate(selectedDSR.responseDeadline)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Assessment Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-900">Complexity:</span>
                        <div className="text-gray-700 capitalize">{selectedDSR.complexity}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Data Volume:</span>
                        <div className="text-gray-700 capitalize">{selectedDSR.dataVolume}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Verification Required:</span>
                        <div className="text-gray-700">{selectedDSR.verificationRequired ? 'Yes' : 'No'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Third Party Involved:</span>
                        <div className="text-gray-700">{selectedDSR.thirdPartyInvolved ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing Steps */}
                {selectedDSR.processingSteps.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Steps</h3>
                    <div className="space-y-3">
                      {selectedDSR.processingSteps.map((step) => (
                        <div key={step.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{step.step}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${
                              step.status === 'completed' ? 'bg-green-100 text-green-700' :
                              step.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {step.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Responsible:</span> {step.responsible}
                            </div>
                            <div>
                              <span className="font-medium">Completed:</span> {step.completedDate ? formatDate(step.completedDate) : 'Not completed'}
                            </div>
                          </div>
                          {step.notes && (
                            <div className="mt-2 text-xs text-gray-600">
                              <span className="font-medium">Notes:</span> {step.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{selectedDSR.responseTime}h</div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900 capitalize">{selectedDSR.resolutionStatus}</div>
                      <div className="text-sm text-gray-600">Resolution Status</div>
                    </div>
                    {selectedDSR.satisfactionScore && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{selectedDSR.satisfactionScore}/5</div>
                        <div className="text-sm text-gray-600">Satisfaction Score</div>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">{selectedDSR.followUpRequired ? 'Yes' : 'No'}</div>
                      <div className="text-sm text-gray-600">Follow-up Required</div>
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
