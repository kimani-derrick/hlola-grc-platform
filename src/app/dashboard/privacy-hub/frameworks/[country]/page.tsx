'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../../components/DashboardLayout';
import { formatDate } from '../../../../../utils/dateUtils';

// Control types
type ControlStatus = 'implemented' | 'in-progress' | 'pending' | 'not-applicable';
type ControlPriority = 'high' | 'medium' | 'low';
type EvidenceStatus = 'collected' | 'pending' | 'not-required';

interface Control {
  id: string;
  code: string;
  article: string;
  title: string;
  description: string;
  status: ControlStatus;
  priority: ControlPriority;
  category: string;
  requirements: number;
  tasks: number;
  evidence: number;
  lastUpdated: string;
  responsible: string;
  dueDate?: string;
  evidenceStatus: EvidenceStatus;
}

interface CountryData {
  id: string;
  name: string;
  flag: string;
  legalFramework: string;
  description: string;
  totalRequirements: number;
  totalControls: number;
  totalTasks: number;
  totalEvidence: number;
  compliancePercentage: number;
  lastUpdated: string;
  controls: Control[];
}

// Sample data for Algeria
const algeriaData: CountryData = {
  id: 'algeria',
  name: 'Algeria',
  flag: '🇩🇿',
  legalFramework: 'Data Protection Act',
  description: 'Comprehensive data protection framework ensuring privacy rights and data security for Algerian citizens and residents.',
  totalRequirements: 68,
  totalControls: 54,
  totalTasks: 61,
  totalEvidence: 40,
  compliancePercentage: 78,
  lastUpdated: '2024-01-15',
  controls: [
    {
      id: 'dza-001',
      code: 'DZA-001',
      article: 'Art. 6',
      title: 'Data Protection Principles',
      description: 'Lawful Basis for Processing - Organizations must establish and document lawful basis for all personal data processing activities',
      status: 'implemented',
      priority: 'high',
      category: 'Data Processing',
      requirements: 12,
      tasks: 8,
      evidence: 6,
      lastUpdated: '2024-01-10',
      responsible: 'Data Protection Officer',
      dueDate: '2024-02-15',
      evidenceStatus: 'collected'
    },
    {
      id: 'dza-002',
      code: 'DZA-002',
      article: 'Art. 15',
      title: 'Data Subject Rights',
      description: 'Right to Access - Organizations must provide data subjects with access to their personal data upon request',
      status: 'in-progress',
      priority: 'high',
      category: 'Data Subject Rights',
      requirements: 8,
      tasks: 5,
      evidence: 3,
      lastUpdated: '2024-01-12',
      responsible: 'Legal Team',
      dueDate: '2024-03-01',
      evidenceStatus: 'pending'
    },
    {
      id: 'dza-003',
      code: 'DZA-003',
      article: 'Art. 25',
      title: 'Data Security Measures',
      description: 'Implement appropriate technical and organizational measures to ensure data security and prevent unauthorized access',
      status: 'pending',
      priority: 'high',
      category: 'Security',
      requirements: 15,
      tasks: 12,
      evidence: 8,
      lastUpdated: '2024-01-08',
      responsible: 'IT Security Team',
      dueDate: '2024-04-30',
      evidenceStatus: 'not-required'
    },
    {
      id: 'dza-004',
      code: 'DZA-004',
      article: 'Art. 30',
      title: 'Data Breach Notification',
      description: 'Establish procedures for detecting, reporting, and responding to personal data breaches within required timeframes',
      status: 'implemented',
      priority: 'medium',
      category: 'Incident Response',
      requirements: 6,
      tasks: 4,
      evidence: 5,
      lastUpdated: '2024-01-05',
      responsible: 'Security Team',
      evidenceStatus: 'collected'
    },
    {
      id: 'dza-005',
      code: 'DZA-005',
      article: 'Art. 35',
      title: 'Data Protection Impact Assessment',
      description: 'Conduct DPIAs for high-risk processing activities and maintain records of processing activities',
      status: 'in-progress',
      priority: 'medium',
      category: 'Risk Assessment',
      requirements: 10,
      tasks: 7,
      evidence: 4,
      lastUpdated: '2024-01-14',
      responsible: 'Compliance Team',
      dueDate: '2024-05-15',
      evidenceStatus: 'pending'
    },
    {
      id: 'dza-006',
      code: 'DZA-006',
      article: 'Art. 40',
      title: 'Data Processing Records',
      description: 'Maintain comprehensive records of all data processing activities as required by the Data Protection Act',
      status: 'pending',
      priority: 'low',
      category: 'Documentation',
      requirements: 4,
      tasks: 3,
      evidence: 2,
      lastUpdated: '2024-01-03',
      responsible: 'Data Protection Officer',
      dueDate: '2024-06-30',
      evidenceStatus: 'not-required'
    }
  ]
};

const statusConfig = {
  implemented: { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500', label: 'Implemented' },
  'in-progress': { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500', label: 'In Progress' },
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500', label: 'Pending' },
  'not-applicable': { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500', label: 'Not Applicable' }
};

const priorityConfig = {
  high: { color: 'text-red-700', bg: 'bg-red-100', label: 'High' },
  medium: { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Medium' },
  low: { color: 'text-green-700', bg: 'bg-green-100', label: 'Low' }
};

const evidenceConfig = {
  collected: { color: 'text-green-700', bg: 'bg-green-100', label: 'Collected' },
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Pending' },
  'not-required': { color: 'text-gray-700', bg: 'bg-gray-100', label: 'Not Required' }
};

export default function CountryControlsPage({ params }: { params: { country: string } }) {
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // For now, we'll use Algeria data as example
  // In a real app, you'd fetch this based on the country parameter
  const countryData = algeriaData;

  const filteredControls = countryData.controls.filter(control => {
    const matchesSearch = control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || control.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || control.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getComplianceBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <span>Privacy Hub</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Frameworks</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">{countryData.name} Controls</span>
            </div>

            {/* Country Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{countryData.flag}</div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{countryData.name} Controls</h1>
                  <p className="text-gray-600 mt-1">Manage and track compliance requirements</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Report
                </button>
                <button className="bg-[#26558e] text-white px-6 py-2 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Control
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Legal Framework Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{countryData.totalRequirements}</div>
                <div className="text-sm text-gray-600">Requirements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{countryData.totalControls}</div>
                <div className="text-sm text-gray-600">Controls</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{countryData.totalTasks}</div>
                <div className="text-sm text-gray-600">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{countryData.totalEvidence}</div>
                <div className="text-sm text-gray-600">Evidence</div>
              </div>
            </div>
          </div>

          {/* Framework Overview */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Framework Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{countryData.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Controls</span>
                    <span className="font-semibold text-gray-900">{countryData.totalControls}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tasks</span>
                    <span className="font-semibold text-gray-900">{countryData.totalTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Evidence</span>
                    <span className="font-semibold text-gray-900">{countryData.totalEvidence}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Framework Controls Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Framework Controls</h2>
                <p className="text-gray-600 mt-1">Manage compliance requirements and evidence</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className={`px-3 py-2 ${viewMode === 'table' ? 'bg-[#26558e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setViewMode('table')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V6a2 2 0 012-2h6a2 2 0 012 2v16H4a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                  <button
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#26558e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search controls..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="implemented">Implemented</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="not-applicable">Not Applicable</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Controls Display */}
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredControls.map((control) => (
                      <tr key={control.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{control.code}</div>
                            <div className="text-sm text-gray-500">{control.article}</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">{control.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[control.status].bg} ${statusConfig[control.status].color}`}>
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[control.status].dot}`}></span>
                            {statusConfig[control.status].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[control.priority].bg} ${priorityConfig[control.priority].color}`}>
                            {priorityConfig[control.priority].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {control.requirements}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {control.tasks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${evidenceConfig[control.evidenceStatus].bg} ${evidenceConfig[control.evidenceStatus].color}`}>
                            {evidenceConfig[control.evidenceStatus].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {control.responsible}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-[#26558e] hover:text-[#1e4470]"
                            onClick={() => setSelectedControl(control)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredControls.map((control) => (
                  <div
                    key={control.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">{control.code}</div>
                        <div className="text-sm text-gray-500">{control.article}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mt-1">{control.title}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[control.status].bg} ${statusConfig[control.status].color}`}>
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[control.status].dot}`}></span>
                          {statusConfig[control.status].label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[control.priority].bg} ${priorityConfig[control.priority].color}`}>
                          {priorityConfig[control.priority].label}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{control.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Requirements:</span>
                        <span className="font-medium text-gray-900">{control.requirements}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tasks:</span>
                        <span className="font-medium text-gray-900">{control.tasks}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Evidence:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${evidenceConfig[control.evidenceStatus].bg} ${evidenceConfig[control.evidenceStatus].color}`}>
                          {evidenceConfig[control.evidenceStatus].label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {control.responsible}</span>
                      <button
                        className="text-[#26558e] hover:text-[#1e4470] text-sm font-medium"
                        onClick={() => setSelectedControl(control)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredControls.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No controls found</h3>
                <p className="text-gray-600">Try adjusting your search or filters to find controls.</p>
              </div>
            )}
          </div>
        </div>

        {/* Control Details Modal */}
        {selectedControl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedControl.code}</h2>
                    <p className="text-gray-600">{selectedControl.article} • {selectedControl.title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedControl(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700">{selectedControl.description}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900 mb-2">{selectedControl.requirements}</div>
                        <div className="text-sm text-gray-600">Total requirements for this control</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Control Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedControl.status].bg} ${statusConfig[selectedControl.status].color}`}>
                            {statusConfig[selectedControl.status].label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[selectedControl.priority].bg} ${priorityConfig[selectedControl.priority].color}`}>
                            {priorityConfig[selectedControl.priority].label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="text-gray-900">{selectedControl.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tasks:</span>
                          <span className="text-gray-900">{selectedControl.tasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Evidence:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${evidenceConfig[selectedControl.evidenceStatus].bg} ${evidenceConfig[selectedControl.evidenceStatus].color}`}>
                            {evidenceConfig[selectedControl.evidenceStatus].label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Responsible:</span>
                          <span className="text-gray-900">{selectedControl.responsible}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="text-gray-900">{formatDate(selectedControl.lastUpdated)}</span>
                        </div>
                        {selectedControl.dueDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="text-gray-900">{formatDate(selectedControl.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button className="w-full bg-[#26558e] text-white px-4 py-2 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Control
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Evidence
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


