'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { privacyMaturityAssessments } from '../../../../data/assessments';
import {
  filterAssessments,
  getStatusColor,
  getPriorityColor,
  getMaturityScoreColor,
  getMaturityScoreBg,
  formatDate,
  getDueDateColor,
  isDateOverdue,
  isDueSoon,
  getUniqueFrameworks,
  getUniqueAssignees,
  sortAssessments
} from '../../../../utils/assessmentUtils';
import { AssessmentFilters } from '../../../../types/assessments';

export default function PrivacyMaturityAssessmentsPage() {
  const [filters, setFilters] = useState<AssessmentFilters>({
    searchQuery: '',
    selectedType: 'maturity',
    selectedStatus: 'all',
    selectedFramework: 'all',
    selectedPriority: 'all',
    dateRange: 'all',
    assignedTo: 'all'
  });

  const [sortBy, setSortBy] = useState<'title' | 'createdDate' | 'dueDate' | 'priority' | 'status'>('createdDate');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const filteredAssessments = useMemo(() => {
    const filtered = filterAssessments(privacyMaturityAssessments, filters);
    return sortAssessments(filtered, sortBy) as typeof privacyMaturityAssessments;
  }, [filters, sortBy]);

  const uniqueFrameworks = getUniqueFrameworks(privacyMaturityAssessments);
  const uniqueAssignees = getUniqueAssignees(privacyMaturityAssessments);

  const stats = {
    total: privacyMaturityAssessments.length,
    completed: privacyMaturityAssessments.filter(a => a.status === 'completed').length,
    inProgress: privacyMaturityAssessments.filter(a => a.status === 'in-progress').length,
    pendingReview: privacyMaturityAssessments.filter(a => a.status === 'pending-review').length,
    averageMaturityScore: privacyMaturityAssessments
      .reduce((acc, a) => acc + a.maturityScore, 0) / privacyMaturityAssessments.length || 0,
    highMaturity: privacyMaturityAssessments.filter(a => a.maturityScore >= 80).length
  };

  const selectedMaturity = selectedAssessment ? 
    privacyMaturityAssessments.find(a => a.id === selectedAssessment) : null;

  const maturityLevelStats = {
    optimizing: privacyMaturityAssessments.filter(a => a.overallMaturity === 'optimizing').length,
    quantified: privacyMaturityAssessments.filter(a => a.overallMaturity === 'quantified').length,
    defined: privacyMaturityAssessments.filter(a => a.overallMaturity === 'defined').length,
    managed: privacyMaturityAssessments.filter(a => a.overallMaturity === 'managed').length,
    initial: privacyMaturityAssessments.filter(a => a.overallMaturity === 'initial').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Maturity Assessments</h1>
            <p className="text-gray-600 mt-2">Evaluate overall privacy program maturity and identify improvement opportunities</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Maturity Assessment
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Maturity Templates
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
            <div className="text-2xl font-bold text-purple-600">{stats.highMaturity}</div>
            <div className="text-sm text-gray-600">High Maturity</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-indigo-600">{Math.round(stats.averageMaturityScore)}%</div>
            <div className="text-sm text-gray-600">Avg Maturity</div>
          </div>
        </div>

        {/* Maturity Level Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Maturity Level Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(maturityLevelStats).map(([level, count]) => (
              <div key={level} className={`text-center p-4 rounded-lg ${
                level === 'optimizing' ? 'bg-green-50 border border-green-200' :
                level === 'quantified' ? 'bg-blue-50 border border-blue-200' :
                level === 'defined' ? 'bg-yellow-50 border border-yellow-200' :
                level === 'managed' ? 'bg-orange-50 border border-orange-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <div className={`text-2xl font-bold ${
                  level === 'optimizing' ? 'text-green-600' :
                  level === 'quantified' ? 'text-blue-600' :
                  level === 'defined' ? 'text-yellow-600' :
                  level === 'managed' ? 'text-orange-600' :
                  'text-red-600'
                }`}>{count}</div>
                <div className="text-sm text-gray-600 capitalize">{level}</div>
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
            {filteredAssessments.map((maturity) => (
              <div key={maturity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📈</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{maturity.title}</h3>
                        <span className="text-sm text-gray-500">{maturity.frameworkIcon}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(maturity.status)}`}>
                          {maturity.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(maturity.priority)}`}>
                          {maturity.priority.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getMaturityScoreBg(maturity.maturityScore)} ${getMaturityScoreColor(maturity.maturityScore)}`}>
                          {maturity.overallMaturity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{maturity.description}</p>
                      
                      {/* Maturity Specific Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Assessment Period:</span>
                          <div className="text-gray-900">{maturity.assessmentPeriod}</div>
                        </div>
                        <div>
                          <span className="font-medium">Maturity Score:</span>
                          <div className="text-gray-900">{maturity.maturityScore}%</div>
                        </div>
                        <div>
                          <span className="font-medium">Dimensions:</span>
                          <div className="text-gray-900">{maturity.dimensions.length} dimensions</div>
                        </div>
                        <div>
                          <span className="font-medium">Improvement Targets:</span>
                          <div className="text-gray-900">{maturity.improvementTargets.length} targets</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Assigned to: {maturity.assignedTo}</span>
                        <span>•</span>
                        <span>Created: {formatDate(maturity.createdDate)}</span>
                        <span>•</span>
                        <span>Next Assessment: {formatDate(maturity.nextAssessmentDate)}</span>
                        <span>•</span>
                        <span className={`${getMaturityScoreColor(maturity.maturityScore)}`}>
                          Maturity: {maturity.maturityScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedAssessment(maturity.id)}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maturity assessments found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find maturity assessments.</p>
            </div>
          )}
        </div>

        {/* Maturity Details Modal */}
        {selectedMaturity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📈</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedMaturity.title}</h2>
                      <p className="text-gray-600">{selectedMaturity.framework} • {selectedMaturity.frameworkIcon}</p>
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
                  <span className={`text-sm px-3 py-1 rounded border ${getStatusColor(selectedMaturity.status)}`}>
                    {selectedMaturity.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getPriorityColor(selectedMaturity.priority)}`}>
                    {selectedMaturity.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className={`text-sm px-3 py-1 rounded border ${getMaturityScoreBg(selectedMaturity.maturityScore)} ${getMaturityScoreColor(selectedMaturity.maturityScore)}`}>
                    MATURITY: {selectedMaturity.overallMaturity.toUpperCase()}
                  </span>
                </div>

                {/* Executive Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedMaturity.executiveSummary}</p>
                  </div>
                </div>

                {/* Maturity Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900">Overall Maturity</div>
                    <div className="text-3xl font-bold text-blue-600 capitalize">{selectedMaturity.overallMaturity}</div>
                    <div className="text-sm text-gray-600">{selectedMaturity.maturityScore}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900">Assessment Period</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedMaturity.assessmentPeriod}</div>
                    <div className="text-sm text-gray-600">Next: {formatDate(selectedMaturity.nextAssessmentDate)}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900">Improvement Targets</div>
                    <div className="text-2xl font-bold text-green-600">{selectedMaturity.improvementTargets.length}</div>
                    <div className="text-sm text-gray-600">Active targets</div>
                  </div>
                </div>

                {/* Maturity Dimensions */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Maturity Dimensions</h3>
                  <div className="space-y-4">
                    {selectedMaturity.dimensions.map((dimension, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{dimension.dimension}</h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm px-2 py-1 rounded border ${getMaturityScoreBg(dimension.score)} ${getMaturityScoreColor(dimension.score)}`}>
                              {dimension.score}%
                            </span>
                            <span className="text-sm text-gray-600 capitalize">
                              {dimension.currentLevel} → {dimension.targetLevel}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{dimension.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-1">Key Practices</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {dimension.keyPractices.map((practice, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span className="text-green-500">✓</span>
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-1">Gaps</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {dimension.gaps.map((gap, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span className="text-red-500">⚠</span>
                                  <span>{gap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benchmark Comparison */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benchmark Comparison</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedMaturity.benchmarkComparison.industry}%</div>
                      <div className="text-sm text-gray-600">Industry</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedMaturity.benchmarkComparison.peers}%</div>
                      <div className="text-sm text-gray-600">Peers</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedMaturity.benchmarkComparison.bestPractice}%</div>
                      <div className="text-sm text-gray-600">Best Practice</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedMaturity.benchmarkComparison.regulatory}%</div>
                      <div className="text-sm text-gray-600">Regulatory</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedMaturity.benchmarkComparison.overall}%</div>
                      <div className="text-sm text-gray-600">Overall</div>
                    </div>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {selectedMaturity.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Weaknesses</h3>
                    <ul className="space-y-2">
                      {selectedMaturity.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-red-500 mt-1">⚠</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Improvement Targets */}
                {selectedMaturity.improvementTargets.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvement Targets</h3>
                    <div className="space-y-3">
                      {selectedMaturity.improvementTargets.map((target) => (
                        <div key={target.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{target.target}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                target.status === 'completed' ? 'bg-green-100 text-green-700' :
                                target.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {target.status.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-600">{target.progress}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{target.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Priority:</span> {target.priority}
                            </div>
                            <div>
                              <span className="font-medium">Target Date:</span> {formatDate(target.targetDate)}
                            </div>
                            <div>
                              <span className="font-medium">Responsible:</span> {target.responsible}
                            </div>
                            <div>
                              <span className="font-medium">Progress:</span> {target.progress}%
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
