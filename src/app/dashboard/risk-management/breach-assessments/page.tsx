'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { breachRiskAssessments } from '../../../../data/assessments';
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

export default function BreachRiskAssessmentsPage() {
  const [filters, setFilters] = useState<AssessmentFilters>({
    searchQuery: '',
    selectedType: 'breach-risk',
    selectedStatus: 'all',
    selectedFramework: 'all',
    selectedPriority: 'all',
    dateRange: 'all',
    assignedTo: 'all'
  });

  const [sortBy, setSortBy] = useState<'title' | 'createdDate' | 'dueDate' | 'priority' | 'status'>('createdDate');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const filteredAssessments = useMemo(() => {
    const filtered = filterAssessments(breachRiskAssessments, filters);
    return sortAssessments(filtered, sortBy) as typeof breachRiskAssessments;
  }, [filters, sortBy]);

  const uniqueFrameworks = getUniqueFrameworks(breachRiskAssessments);
  const uniqueAssignees = getUniqueAssignees(breachRiskAssessments);

  const stats = {
    total: breachRiskAssessments.length,
    completed: breachRiskAssessments.filter(a => a.status === 'completed').length,
    inProgress: breachRiskAssessments.filter(a => a.status === 'in-progress').length,
    pendingReview: breachRiskAssessments.filter(a => a.status === 'pending-review').length,
    highRisk: breachRiskAssessments.filter(a => a.riskScore >= 7).length,
    averageRiskScore: breachRiskAssessments
      .reduce((acc, a) => acc + a.riskScore, 0) / breachRiskAssessments.length || 0
  };

  const selectedBreach = selectedAssessment ? 
    breachRiskAssessments.find(a => a.id === selectedAssessment) : null;

  const riskLevelStats = {
    critical: breachRiskAssessments.filter(a => a.likelihood === 'critical' || a.impact === 'critical').length,
    high: breachRiskAssessments.filter(a => a.likelihood === 'high' || a.impact === 'high').length,
    medium: breachRiskAssessments.filter(a => a.likelihood === 'medium' || a.impact === 'medium').length,
    low: breachRiskAssessments.filter(a => a.likelihood === 'low' && a.impact === 'low').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Breach Risk Assessments</h1>
            <p className="text-gray-600 mt-2">Evaluate breach likelihood and impact scenarios for proactive risk management</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Breach Assessment
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Breach Templates
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Assessments</div>
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
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-orange-600">{Math.round(stats.averageRiskScore * 10) / 10}</div>
            <div className="text-sm text-gray-600">Avg Risk Score</div>
          </div>
        </div>

        {/* Risk Level Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(riskLevelStats).map(([level, count]) => (
              <div key={level} className={`text-center p-4 rounded-lg ${
                level === 'critical' ? 'bg-red-50 border border-red-200' :
                level === 'high' ? 'bg-orange-50 border border-orange-200' :
                level === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <div className={`text-2xl font-bold ${
                  level === 'critical' ? 'text-red-600' :
                  level === 'high' ? 'text-orange-600' :
                  level === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>{count}</div>
                <div className="text-sm text-gray-600 capitalize">{level} Risk</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search assessments..."
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

        {/* Assessments List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAssessments.map((breach) => (
              <div key={breach.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">⚠️</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{breach.title}</h3>
                        <span className="text-sm text-gray-500">{breach.frameworkIcon}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(breach.status)}`}>
                          {breach.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(breach.priority)}`}>
                          {breach.priority.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getRiskScoreBg(breach.riskScore)} ${getRiskScoreColor(breach.riskScore)}`}>
                          Risk: {breach.riskScore}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{breach.description}</p>
                      
                      {/* Breach Specific Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Scenario:</span>
                          <div className="text-gray-900">{breach.breachScenario}</div>
                        </div>
                        <div>
                          <span className="font-medium">Likelihood:</span>
                          <div className="text-gray-900 capitalize">{breach.likelihood}</div>
                        </div>
                        <div>
                          <span className="font-medium">Impact:</span>
                          <div className="text-gray-900 capitalize">{breach.impact}</div>
                        </div>
                        <div>
                          <span className="font-medium">Affected Subjects:</span>
                          <div className="text-gray-900">{breach.affectedDataSubjects.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Assigned to: {breach.assignedTo}</span>
                        <span>•</span>
                        <span>Created: {formatDate(breach.createdDate)}</span>
                        {breach.notificationRequired && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600">
                              Notification Required: {breach.notificationDeadline ? formatDate(breach.notificationDeadline) : 'Immediate'}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>Recovery Time: {breach.recoveryTime}h</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedAssessment(breach.id)}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No breach risk assessments found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find breach risk assessments.</p>
            </div>
          )}
        </div>

        {/* Breach Details Modal */}
        {selectedBreach && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">⚠️</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedBreach.title}</h2>
                      <p className="text-gray-600">{selectedBreach.framework} • {selectedBreach.frameworkIcon}</p>
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
                  <span className={`text-sm px-3 py-1 rounded border ${getStatusColor(selectedBreach.status)}`}>
                    {selectedBreach.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getPriorityColor(selectedBreach.priority)}`}>
                    {selectedBreach.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getRiskScoreBg(selectedBreach.riskScore)} ${getRiskScoreColor(selectedBreach.riskScore)}`}>
                    RISK SCORE: {selectedBreach.riskScore}/10
                  </span>
                </div>

                {/* Breach Scenario */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Breach Scenario</h3>
                  <p className="text-gray-700 mb-4">{selectedBreach.breachScenario}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900">Likelihood</div>
                      <div className="text-2xl font-bold text-red-600 capitalize">{selectedBreach.likelihood}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900">Impact</div>
                      <div className="text-2xl font-bold text-orange-600 capitalize">{selectedBreach.impact}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900">Risk Score</div>
                      <div className="text-2xl font-bold text-purple-600">{selectedBreach.riskScore}/10</div>
                    </div>
                  </div>
                </div>

                {/* Impact Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Impact</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Financial:</span>
                        <span className="font-medium">{selectedBreach.businessImpact.financial}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operational:</span>
                        <span className="font-medium">{selectedBreach.businessImpact.operational}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reputational:</span>
                        <span className="font-medium">{selectedBreach.businessImpact.reputational}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Regulatory:</span>
                        <span className="font-medium">{selectedBreach.businessImpact.regulatory}/10</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium text-gray-900">Total:</span>
                        <span className="font-bold text-gray-900">{selectedBreach.businessImpact.total}/10</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Impact</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Integrity:</span>
                        <span className="font-medium capitalize">{selectedBreach.technicalImpact.dataIntegrity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">System Availability:</span>
                        <span className="font-medium capitalize">{selectedBreach.technicalImpact.systemAvailability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Confidentiality:</span>
                        <span className="font-medium capitalize">{selectedBreach.technicalImpact.dataConfidentiality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">System Performance:</span>
                        <span className="font-medium capitalize">{selectedBreach.technicalImpact.systemPerformance}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Categories and Affected Subjects */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="font-medium text-gray-900">Data Categories:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBreach.dataCategories.map((category, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Affected Data Subjects:</span>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{selectedBreach.affectedDataSubjects.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Notification Requirements */}
                {selectedBreach.notificationRequired && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notification Requirements</h3>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-orange-800">Notification Required</span>
                      </div>
                      <div className="text-sm text-orange-700">
                        <p>Deadline: {selectedBreach.notificationDeadline ? formatDate(selectedBreach.notificationDeadline) : 'Immediate'}</p>
                        <p>Regulatory Notification: {selectedBreach.regulatoryNotification ? 'Yes' : 'No'}</p>
                        {selectedBreach.affectedRegulators.length > 0 && (
                          <p>Affected Regulators: {selectedBreach.affectedRegulators.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Containment and Recovery */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Containment & Recovery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Containment Measures</h4>
                      <ul className="space-y-1">
                        {selectedBreach.containmentMeasures.map((measure, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recovery Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Recovery Time:</span>
                          <div className="font-medium">{selectedBreach.recoveryTime} hours</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Prevention Measures:</span>
                          <div className="text-sm text-gray-600 mt-1">
                            {selectedBreach.preventionMeasures.length} measures identified
                          </div>
                        </div>
                      </div>
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
