'use client';

import { useState } from 'react';

// Audit status types
type AuditStatus = 'planning' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
type AuditType = 'internal' | 'external' | 'regulatory' | 'certification';
type AuditPriority = 'low' | 'medium' | 'high' | 'critical';

interface AuditItem {
  id: string;
  title: string;
  type: AuditType;
  status: AuditStatus;
  priority: AuditPriority;
  framework: string;
  auditor: string;
  startDate: string;
  endDate: string;
  progress: number;
  findings: number;
  criticalFindings: number;
  description: string;
  nextMilestone: string;
  estimatedCompletion: string;
}

const auditData: AuditItem[] = [
  {
    id: '1',
    title: 'GDPR Compliance Audit 2024',
    type: 'regulatory',
    status: 'in-progress',
    priority: 'high',
    framework: 'GDPR',
    auditor: 'External Auditor - PwC',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    progress: 65,
    findings: 12,
    criticalFindings: 2,
    description: 'Comprehensive GDPR compliance assessment focusing on data processing activities, consent management, and data subject rights.',
    nextMilestone: 'Technical controls review',
    estimatedCompletion: '2024-03-15'
  },
  {
    id: '2',
    title: 'SOC 2 Type II Audit',
    type: 'certification',
    status: 'planning',
    priority: 'high',
    framework: 'SOC 2',
    auditor: 'Deloitte',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    progress: 25,
    findings: 0,
    criticalFindings: 0,
    description: 'SOC 2 Type II audit for security, availability, and confidentiality controls over a 12-month period.',
    nextMilestone: 'Scoping meeting',
    estimatedCompletion: '2024-05-31'
  },
  {
    id: '3',
    title: 'POPIA Internal Assessment',
    type: 'internal',
    status: 'completed',
    priority: 'medium',
    framework: 'POPIA',
    auditor: 'Internal Audit Team',
    startDate: '2023-11-01',
    endDate: '2023-12-15',
    progress: 100,
    findings: 8,
    criticalFindings: 1,
    description: 'Internal assessment of POPIA compliance for South African operations.',
    nextMilestone: 'Follow-up review',
    estimatedCompletion: '2024-01-30'
  },
  {
    id: '4',
    title: 'ISO 27001 Surveillance Audit',
    type: 'certification',
    status: 'overdue',
    priority: 'critical',
    framework: 'ISO 27001',
    auditor: 'BSI Group',
    startDate: '2023-12-01',
    endDate: '2024-01-15',
    progress: 80,
    findings: 15,
    criticalFindings: 3,
    description: 'Annual surveillance audit for ISO 27001 certification maintenance.',
    nextMilestone: 'Corrective actions',
    estimatedCompletion: 'Overdue'
  },
  {
    id: '5',
    title: 'Nigeria NDPR Compliance Review',
    type: 'regulatory',
    status: 'planning',
    priority: 'medium',
    framework: 'NDPR',
    auditor: 'Local Compliance Partner',
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    progress: 10,
    findings: 0,
    criticalFindings: 0,
    description: 'Compliance review for Nigerian Data Protection Regulation requirements.',
    nextMilestone: 'Risk assessment',
    estimatedCompletion: '2024-04-30'
  }
];

const statusConfig = {
  'planning': { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500', label: 'Planning' },
  'in-progress': { color: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500', label: 'In Progress' },
  'completed': { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500', label: 'Completed' },
  'overdue': { color: 'text-red-700', bg: 'bg-red-100', dot: 'bg-red-500', label: 'Overdue' },
  'cancelled': { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500', label: 'Cancelled' }
};

const priorityConfig = {
  'low': { color: 'text-gray-600', bg: 'bg-gray-100' },
  'medium': { color: 'text-blue-600', bg: 'bg-blue-100' },
  'high': { color: 'text-orange-600', bg: 'bg-orange-100' },
  'critical': { color: 'text-red-600', bg: 'bg-red-100' }
};

const typeConfig = {
  'internal': { icon: '🏢', label: 'Internal', color: 'bg-blue-500' },
  'external': { icon: '🔍', label: 'External', color: 'bg-green-500' },
  'regulatory': { icon: '⚖️', label: 'Regulatory', color: 'bg-red-500' },
  'certification': { icon: '📋', label: 'Certification', color: 'bg-purple-500' }
};

export default function AuditSection() {
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<AuditItem | null>(null);

  const filteredAudits = auditData.filter(audit => {
    const matchesSearch = audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audit.framework.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || audit.status === selectedStatus;
    const matchesType = selectedType === 'all' || audit.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getProgressColor = (progress: number, status: AuditStatus) => {
    if (status === 'overdue') return 'bg-red-500';
    if (status === 'completed') return 'bg-green-500';
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getFindingsColor = (critical: number, total: number) => {
    if (critical > 0) return 'text-red-600';
    if (total > 10) return 'text-orange-600';
    if (total > 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Calculate summary statistics
  const stats = {
    total: auditData.length,
    active: auditData.filter(a => a.status === 'in-progress').length,
    overdue: auditData.filter(a => a.status === 'overdue').length,
    completed: auditData.filter(a => a.status === 'completed').length,
    totalFindings: auditData.reduce((sum, a) => sum + a.findings, 0),
    criticalFindings: auditData.reduce((sum, a) => sum + a.criticalFindings, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Center</h1>
          <p className="text-gray-600 mt-2">Manage compliance audits, assessments, and certifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#26558e] text-white px-6 py-3 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Audit
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Audits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
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
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Findings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFindings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalFindings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search audits..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Type Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="regulatory">Regulatory</option>
              <option value="certification">Certification</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedView('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'grid' 
                  ? 'bg-white text-[#26558e] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'list' 
                  ? 'bg-white text-[#26558e] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Grid/List */}
      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAudits.map((audit) => (
            <div
              key={audit.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAudit(audit)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${typeConfig[audit.type].color} rounded-xl flex items-center justify-center text-white text-xl mr-3`}>
                      {typeConfig[audit.type].icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{audit.title}</h3>
                      <p className="text-sm text-gray-500">{audit.framework}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[audit.status].bg} ${statusConfig[audit.status].color}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[audit.status].dot}`}></span>
                    {statusConfig[audit.status].label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{audit.description}</p>

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{audit.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(audit.progress, audit.status)}`}
                      style={{ width: `${audit.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Findings */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getFindingsColor(audit.criticalFindings, audit.findings)}`}>
                        {audit.findings}
                      </div>
                      <div className="text-xs text-gray-500">Findings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{audit.criticalFindings}</div>
                      <div className="text-xs text-gray-500">Critical</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Due</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(audit.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Priority Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[audit.priority].bg} ${priorityConfig[audit.priority].color}`}>
                    {audit.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Findings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAudit(audit)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${typeConfig[audit.type].color} rounded-lg flex items-center justify-center text-white text-sm mr-3`}>
                          {typeConfig[audit.type].icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{audit.title}</div>
                          <div className="text-sm text-gray-500">{audit.framework}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{typeConfig[audit.type].label}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[audit.status].bg} ${statusConfig[audit.status].color}`}>
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[audit.status].dot}`}></span>
                        {statusConfig[audit.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(audit.progress, audit.status)}`}
                            style={{ width: `${audit.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{audit.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getFindingsColor(audit.criticalFindings, audit.findings)}`}>
                          {audit.findings}
                        </span>
                        {audit.criticalFindings > 0 && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
                            {audit.criticalFindings} critical
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(audit.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[audit.priority].bg} ${priorityConfig[audit.priority].color}`}>
                        {audit.priority.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAudits.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audits found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find audits.</p>
        </div>
      )}

      {/* Audit Details Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-16 h-16 ${typeConfig[selectedAudit.type].color} rounded-xl flex items-center justify-center text-white text-2xl mr-4`}>
                    {typeConfig[selectedAudit.type].icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedAudit.title}</h2>
                    <p className="text-gray-600">{selectedAudit.framework} • {selectedAudit.auditor}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAudit(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status and Priority */}
              <div className="flex items-center gap-4 mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedAudit.status].bg} ${statusConfig[selectedAudit.status].color}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${statusConfig[selectedAudit.status].dot}`}></span>
                  {statusConfig[selectedAudit.status].label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[selectedAudit.priority].bg} ${priorityConfig[selectedAudit.priority].color}`}>
                  {selectedAudit.priority.toUpperCase()} PRIORITY
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{selectedAudit.description}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedAudit.progress}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(selectedAudit.progress, selectedAudit.status)}`}
                      style={{ width: `${selectedAudit.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Findings</div>
                  <div className={`text-2xl font-bold ${getFindingsColor(selectedAudit.criticalFindings, selectedAudit.findings)}`}>
                    {selectedAudit.findings}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Critical Findings</div>
                  <div className="text-2xl font-bold text-red-600">{selectedAudit.criticalFindings}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Days Remaining</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.max(0, Math.ceil((new Date(selectedAudit.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Start Date</div>
                    <div className="text-lg font-medium text-gray-900">
                      {new Date(selectedAudit.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">End Date</div>
                    <div className="text-lg font-medium text-gray-900">
                      {new Date(selectedAudit.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Milestone</div>
                    <div className="text-lg font-medium text-gray-900">{selectedAudit.nextMilestone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Estimated Completion</div>
                    <div className="text-lg font-medium text-gray-900">{selectedAudit.estimatedCompletion}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-[#26558e] text-white px-4 py-2 rounded-lg hover:bg-[#1e4470] transition-colors">
                  View Details
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Generate Report
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
