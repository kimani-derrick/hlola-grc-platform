'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { 
  frameworksProgress, 
  controlsProgress, 
  tasksProgress, 
  complianceTrends,
  teamPerformance,
  insights,
  calculateReportStats 
} from '../../../../data/reports';
import { ReportFilters } from '../../../../types/reports';
import {
  filterFrameworks,
  filterControls,
  filterTasks,
  getUniqueFrameworks,
  getUniqueCategories,
  getRiskLevelColor,
  getStatusColor,
  getPriorityColor,
  getTrendIcon,
  getTrendColor,
  formatDaysRemaining,
  getInsightIcon,
  getInsightColor
} from '../../../../utils/reportUtils';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'frameworks' | 'controls' | 'tasks' | 'insights'>('overview');
  const [filters, setFilters] = useState<ReportFilters>({
    selectedFramework: 'all',
    selectedStatus: 'all',
    selectedPriority: 'all',
    selectedCategory: 'all',
    dateRange: 'all',
    searchQuery: ''
  });

  const stats = calculateReportStats();
  const filteredFrameworks = useMemo(() => filterFrameworks(frameworksProgress, filters), [filters]);
  const filteredControls = useMemo(() => filterControls(controlsProgress, filters), [filters]);
  const filteredTasks = useMemo(() => filterTasks(tasksProgress, filters), [filters]);
  
  const uniqueFrameworks = getUniqueFrameworks(controlsProgress);
  const uniqueCategories = getUniqueCategories(controlsProgress);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your compliance progress across all frameworks</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Compliance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.overallCompliance}%</p>
                <p className="text-sm text-green-600 mt-1">↗ +12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Frameworks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeFrameworks}/{stats.totalFrameworks}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.totalControls} total controls</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedTasks}/{stats.totalTasks}</p>
                <p className="text-sm text-yellow-600 mt-1">{stats.overdueTasksCount} overdue</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evidence Collected</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.evidenceCollected}/{stats.totalEvidence}</p>
                <p className="text-sm text-gray-600 mt-1">{Math.round((stats.evidenceCollected / stats.totalEvidence) * 100)}% complete</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('frameworks')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'frameworks'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Frameworks ({frameworksProgress.length})
              </button>
              <button
                onClick={() => setActiveTab('controls')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'controls'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Controls ({stats.totalControls})
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'tasks'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tasks ({stats.totalTasks})
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'insights'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  Insights
                  {insights.filter(i => i.priority === 'high').length > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      {insights.filter(i => i.priority === 'high').length}
                    </span>
                  )}
                </span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Risk Alert Banner */}
                {stats.highRiskItems > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🚨</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900">High Risk Items Detected</h3>
                        <p className="text-red-700 text-sm mt-1">
                          {stats.highRiskItems} frameworks have high or critical risk levels. Immediate attention required.
                        </p>
                      </div>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        View Details →
                      </button>
                    </div>
                  </div>
                )}

                {/* Compliance Trend Chart */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Trend (Last 3 Months)</h3>
                  <div className="space-y-2">
                    {complianceTrends.map((trend, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-24">{new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${trend.compliance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">{trend.compliance}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamPerformance.map((team) => (
                      <div key={team.teamName} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{team.teamName}</h4>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            team.completionRate >= 80 ? 'bg-green-100 text-green-700' :
                            team.completionRate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {team.completionRate}%
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tasks:</span>
                            <span className="font-medium">{team.completedTasks}/{team.assignedTasks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Avg. Time:</span>
                            <span className="font-medium">{team.averageCompletionTime} days</span>
                          </div>
                          {team.overdueItems > 0 && (
                            <div className="flex justify-between">
                              <span className="text-red-600">Overdue:</span>
                              <span className="font-medium text-red-600">{team.overdueItems}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-green-900">{stats.completedControls}</div>
                    <div className="text-sm text-green-700">Controls Completed</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <div className="text-3xl mb-2">🔄</div>
                    <div className="text-2xl font-bold text-blue-900">{stats.inProgressControls}</div>
                    <div className="text-sm text-blue-700">Controls In Progress</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                    <div className="text-3xl mb-2">⏰</div>
                    <div className="text-2xl font-bold text-yellow-900">{stats.upcomingDeadlines}</div>
                    <div className="text-sm text-yellow-700">Deadlines in 90 Days</div>
                  </div>
                </div>
              </div>
            )}

            {/* Frameworks Tab */}
            {activeTab === 'frameworks' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex gap-3 items-center mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search frameworks..."
                      value={filters.searchQuery}
                      onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filters.selectedPriority}
                    onChange={(e) => setFilters({ ...filters, selectedPriority: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Frameworks List */}
                <div className="space-y-4">
                  {filteredFrameworks.map((framework) => (
                    <div key={framework.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{framework.icon}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{framework.region}</p>
                            <div className="flex gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(framework.priority)}`}>
                                {framework.priority.toUpperCase()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full text-white ${getRiskLevelColor(framework.riskLevel)}`}>
                                {framework.riskLevel.toUpperCase()} RISK
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">{framework.compliance}%</div>
                          <div className={`text-sm mt-1 ${getTrendColor(framework.trend)}`}>
                            {getTrendIcon(framework.trend)} {framework.trend}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${framework.compliance}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-600">Controls</div>
                          <div className="text-lg font-semibold text-gray-900">{framework.completedControls}/{framework.totalControls}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Tasks</div>
                          <div className="text-lg font-semibold text-gray-900">{framework.completedTasks}/{framework.totalTasks}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Evidence</div>
                          <div className="text-lg font-semibold text-gray-900">{framework.evidenceCollected}/{framework.totalEvidence}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Deadline</div>
                          <div className={`text-sm font-semibold ${framework.daysRemaining <= 30 ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDaysRemaining(framework.daysRemaining)}
                          </div>
                        </div>
                      </div>

                      {/* Assigned Teams */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Teams:</span>
                        <div className="flex flex-wrap gap-1">
                          {framework.assignedTeams.map((team, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {team}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls Tab */}
            {activeTab === 'controls' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Search controls..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  />
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
                    value={filters.selectedStatus}
                    onChange={(e) => setFilters({ ...filters, selectedStatus: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="not-started">Not Started</option>
                    <option value="needs-review">Needs Review</option>
                  </select>
                  <select
                    value={filters.selectedPriority}
                    onChange={(e) => setFilters({ ...filters, selectedPriority: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={filters.selectedCategory}
                    onChange={(e) => setFilters({ ...filters, selectedCategory: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Controls List */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Control</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Framework</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Progress</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tasks</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Evidence</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assignee</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredControls.map((control) => (
                        <tr key={control.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(control.priority)}`}>
                                {control.priority.charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <div className="font-medium text-gray-900">{control.title}</div>
                                <div className="text-xs text-gray-500">{control.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{control.frameworkIcon}</span>
                              <span className="text-sm text-gray-600">{control.framework.split(' ')[0]}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(control.status)}`}>
                              {control.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                <div
                                  className={`h-2 rounded-full ${getStatusColor(control.status)}`}
                                  style={{ width: `${control.completionRate}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">{control.completionRate}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">{control.completedTasks}/{control.totalTasks}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{control.evidenceCount}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{control.assignee}</td>
                          <td className="px-4 py-4 text-sm">
                            <div className={control.daysOverdue > 0 ? 'text-red-600' : 'text-gray-900'}>
                              {new Date(control.dueDate).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  />
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
                    value={filters.selectedStatus}
                    onChange={(e) => setFilters({ ...filters, selectedStatus: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <select
                    value={filters.selectedPriority}
                    onChange={(e) => setFilters({ ...filters, selectedPriority: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={filters.selectedCategory}
                    onChange={(e) => setFilters({ ...filters, selectedCategory: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{task.frameworkIcon}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                            {task.evidenceAttached && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                📎 Evidence
                              </span>
                            )}
                            {task.daysOverdue > 0 && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                ⚠️ {task.daysOverdue} days overdue
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span>Control: {task.control}</span>
                            <span>•</span>
                            <span>Assignee: {task.assignee}</span>
                            <span>•</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            {task.completedDate && (
                              <>
                                <span>•</span>
                                <span className="text-green-600">Completed: {new Date(task.completedDate).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          {task.blockers && task.blockers.length > 0 && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                              <div className="text-xs text-red-700 font-medium">Blockers:</div>
                              <ul className="text-xs text-red-600 mt-1 list-disc list-inside">
                                {task.blockers.map((blocker, index) => (
                                  <li key={index}>{blocker}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Hours</div>
                          <div className="text-lg font-semibold text-gray-900">{task.actualHours}/{task.estimatedHours}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h3 className="font-semibold text-blue-900">AI-Powered Insights</h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Our system analyzes your compliance data to provide actionable recommendations and identify potential risks.
                      </p>
                    </div>
                  </div>
                </div>

                {insights.map((insight) => (
                  <div key={insight.id} className={`border rounded-lg p-6 ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(insight.priority)}`}>
                            {insight.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{insight.description}</p>
                        <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
                          <div className="text-sm font-medium text-gray-900 mb-1">💡 Recommendation:</div>
                          <p className="text-sm text-gray-700">{insight.recommendation}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {insight.affectedItems.map((item, index) => (
                            <span key={index} className="text-xs bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

