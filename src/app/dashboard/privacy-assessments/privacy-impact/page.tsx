'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { privacyImpactAssessments } from '../../../../data/assessments';
import {
  filterAssessments,
  getStatusColor,
  getPriorityColor,
  getRiskScoreColor,
  getRiskScoreBg,
  formatDate,
  getDueDateColor,
  isDateOverdue,
  isDueSoon,
  getUniqueFrameworks,
  getUniqueAssignees,
  sortAssessments
} from '../../../../utils/assessmentUtils';
import { AssessmentFilters } from '../../../../types/assessments';

export default function PrivacyImpactAssessmentsPage() {
  const [filters, setFilters] = useState<AssessmentFilters>({
    searchQuery: '',
    selectedType: 'pia',
    selectedStatus: 'all',
    selectedFramework: 'all',
    selectedPriority: 'all',
    dateRange: 'all',
    assignedTo: 'all'
  });

  const [sortBy, setSortBy] = useState<'title' | 'createdDate' | 'dueDate' | 'priority' | 'status'>('createdDate');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const filteredAssessments = useMemo(() => {
    const filtered = filterAssessments(privacyImpactAssessments, filters);
    return sortAssessments(filtered, sortBy) as typeof privacyImpactAssessments;
  }, [filters, sortBy]);

  const uniqueFrameworks = getUniqueFrameworks(privacyImpactAssessments);
  const uniqueAssignees = getUniqueAssignees(privacyImpactAssessments);

  const stats = {
    total: privacyImpactAssessments.length,
    completed: privacyImpactAssessments.filter(a => a.status === 'completed').length,
    inProgress: privacyImpactAssessments.filter(a => a.status === 'in-progress').length,
    pendingReview: privacyImpactAssessments.filter(a => a.status === 'pending-review').length,
    overdue: privacyImpactAssessments.filter(a => a.dueDate && isDateOverdue(a.dueDate)).length,
    highRisk: privacyImpactAssessments.filter(a => a.riskScore >= 7).length
  };

  const selectedPIA = selectedAssessment ? 
    privacyImpactAssessments.find(a => a.id === selectedAssessment) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Impact Assessments</h1>
            <p className="text-gray-600 mt-2">Evaluate privacy risks of data processing activities and ensure compliance</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New PIA
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PIA Templates
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total PIAs</div>
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
            <div className="text-2xl font-bold text-orange-600">{stats.highRisk}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search PIAs..."
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

        {/* PIAs List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAssessments.map((pia) => (
              <div key={pia.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📊</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{pia.title}</h3>
                        <span className="text-sm text-gray-500">{pia.frameworkIcon}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(pia.status)}`}>
                          {pia.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(pia.priority)}`}>
                          {pia.priority.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getRiskScoreBg(pia.riskScore)} ${getRiskScoreColor(pia.riskScore)}`}>
                          Risk: {pia.riskScore}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{pia.description}</p>
                      
                      {/* PIA Specific Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Processing Activity:</span>
                          <div className="text-gray-900">{pia.processingActivity}</div>
                        </div>
                        <div>
                          <span className="font-medium">Legal Basis:</span>
                          <div className="text-gray-900">{pia.legalBasis}</div>
                        </div>
                        <div>
                          <span className="font-medium">Data Categories:</span>
                          <div className="text-gray-900">{pia.dataCategories.length} categories</div>
                        </div>
                        <div>
                          <span className="font-medium">Cross-border Transfer:</span>
                          <div className="text-gray-900">{pia.crossBorderTransfer ? 'Yes' : 'No'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Assigned to: {pia.assignedTo}</span>
                        <span>•</span>
                        <span>Created: {formatDate(pia.createdDate)}</span>
                        {pia.dueDate && (
                          <>
                            <span>•</span>
                            <span className={getDueDateColor(pia.dueDate)}>
                              Due: {formatDate(pia.dueDate)}
                              {isDateOverdue(pia.dueDate) && ' (Overdue)'}
                              {isDueSoon(pia.dueDate) && !isDateOverdue(pia.dueDate) && ' (Due Soon)'}
                            </span>
                          </>
                        )}
                        {pia.nextReviewDate && (
                          <>
                            <span>•</span>
                            <span>Next Review: {formatDate(pia.nextReviewDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedAssessment(pia.id)}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PIAs found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find PIAs.</p>
            </div>
          )}
        </div>

        {/* PIA Details Modal */}
        {selectedPIA && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📊</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPIA.title}</h2>
                      <p className="text-gray-600">{selectedPIA.framework} • {selectedPIA.frameworkIcon}</p>
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
                  <span className={`text-sm px-3 py-1 rounded border ${getStatusColor(selectedPIA.status)}`}>
                    {selectedPIA.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getPriorityColor(selectedPIA.priority)}`}>
                    {selectedPIA.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getRiskScoreBg(selectedPIA.riskScore)} ${getRiskScoreColor(selectedPIA.riskScore)}`}>
                    RISK SCORE: {selectedPIA.riskScore}/10
                  </span>
                </div>

                {/* Processing Activity Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Activity</h3>
                    <p className="text-gray-700 mb-4">{selectedPIA.processingActivity}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-900">Data Categories:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPIA.dataCategories.map((category, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Data Subjects:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPIA.dataSubjects.map((subject, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal & Compliance</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-900">Legal Basis:</span>
                        <div className="text-gray-700">{selectedPIA.legalBasis}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Retention Period:</span>
                        <div className="text-gray-700">{selectedPIA.retentionPeriod}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Data Sharing:</span>
                        <div className="text-gray-700">{selectedPIA.dataSharing ? 'Yes' : 'No'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Cross-border Transfer:</span>
                        <div className="text-gray-700">{selectedPIA.crossBorderTransfer ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {selectedPIA.riskFactors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Factors</h3>
                    <div className="space-y-3">
                      {selectedPIA.riskFactors.map((factor) => (
                        <div key={factor.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                            <span className={`text-xs px-2 py-1 rounded border ${getRiskScoreBg(factor.riskScore)} ${getRiskScoreColor(factor.riskScore)}`}>
                              {factor.riskScore}/10
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Likelihood:</span> {factor.likelihood}
                            </div>
                            <div>
                              <span className="font-medium">Impact:</span> {factor.impact}
                            </div>
                            <div>
                              <span className="font-medium">Mitigation:</span> {factor.mitigation}
                            </div>
                            <div>
                              <span className="font-medium">Residual Risk:</span> {factor.residualRisk}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mitigation Measures */}
                {selectedPIA.mitigationMeasures.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Mitigation Measures</h3>
                    <div className="space-y-3">
                      {selectedPIA.mitigationMeasures.map((measure) => (
                        <div key={measure.id} className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{measure.measure}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${
                              measure.implementationStatus === 'completed' ? 'bg-green-100 text-green-700' :
                              measure.implementationStatus === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {measure.implementationStatus.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{measure.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Effectiveness:</span> {measure.effectiveness}
                            </div>
                            <div>
                              <span className="font-medium">Cost:</span> {measure.cost}
                            </div>
                            <div>
                              <span className="font-medium">Timeline:</span> {measure.timeline}
                            </div>
                            <div>
                              <span className="font-medium">Responsible:</span> {measure.responsible}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex-1 bg-[#26558e] text-white px-4 py-3 rounded-lg hover:bg-[#1e4470] transition-colors">
                    Edit PIA
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
