'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import {
  frameworkAuditPackages,
  evidenceItems,
  complianceHistory,
  generatedReports,
  regulatorMetrics,
  auditTimeline,
  calculateAuditReadiness,
  getGapStatistics
} from '../../../../data/audit';
import {
  filterFrameworkPackages,
  filterGaps,
  filterEvidence,
  getReadinessColor,
  getReadinessBg,
  getComplianceColor,
  getComplianceBarColor,
  getSeverityColor,
  getGapStatusColor,
  getEvidenceStatusColor,
  getCertificationStatusColor,
  getTrendColor,
  getTrendIcon,
  calculateImplementationPercentage,
  getConfidenceLevelColor,
  getConfidenceLevelIcon,
  formatDate,
  getDaysUntilDate,
  isDateOverdue,
  getCategoryIcon,
  getRequirementStatusColor,
  getUniqueRegions
} from '../../../../utils/auditUtils';
import { ExportOptions } from '../../../../types/audit';

export default function AuditCenterPage() {
  const [activeTab, setActiveTab] = useState<'readiness' | 'frameworks' | 'evidence' | 'timeline' | 'reports'>('readiness');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedGapSeverity, setSelectedGapSeverity] = useState('all');
  const [selectedGapStatus, setSelectedGapStatus] = useState('all');
  const [selectedEvidenceStatus, setSelectedEvidenceStatus] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const readinessScore = calculateAuditReadiness();
  const gapStats = getGapStatistics();
  const uniqueRegions = getUniqueRegions(frameworkAuditPackages);
  
  const filteredPackages = useMemo(() => 
    filterFrameworkPackages(frameworkAuditPackages, searchQuery, selectedRegion),
    [searchQuery, selectedRegion]
  );

  const allGaps = frameworkAuditPackages.flatMap(pkg => 
    pkg.gaps.map(gap => ({ ...gap, framework: pkg.frameworkName, frameworkIcon: pkg.frameworkIcon }))
  );

  const filteredGaps = useMemo(() =>
    filterGaps(allGaps, selectedGapSeverity, selectedGapStatus, searchQuery),
    [selectedGapSeverity, selectedGapStatus, searchQuery]
  );

  const filteredEvidence = useMemo(() =>
    filterEvidence(evidenceItems, selectedFramework, selectedEvidenceStatus, searchQuery),
    [selectedFramework, selectedEvidenceStatus, searchQuery]
  );

  const packageDetails = selectedPackage ? frameworkAuditPackages.find(p => p.frameworkId === selectedPackage) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Center</h1>
            <p className="text-gray-600 mt-2">Comprehensive audit readiness and compliance documentation for regulatory confidence</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Audit Package
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share with Auditor
            </button>
          </div>
        </div>

        {/* Regulator Confidence Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🛡️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Readiness Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Overall Readiness</div>
                  <div className={`text-3xl font-bold ${getReadinessColor(regulatorMetrics.overallReadiness)}`}>
                    {regulatorMetrics.overallReadiness}%
                  </div>
                  <div className={`text-xs mt-1 flex items-center gap-1 ${getTrendColor(regulatorMetrics.complianceTrend)}`}>
                    <span>{getTrendIcon(regulatorMetrics.complianceTrend)}</span>
                    <span className="capitalize">{regulatorMetrics.complianceTrend}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Documentation Score</div>
                  <div className={`text-3xl font-bold ${getReadinessColor(regulatorMetrics.documentationScore)}`}>
                    {regulatorMetrics.documentationScore}%
                  </div>
                  <div className="text-xs text-green-600 mt-1">Excellent</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Control Implementation</div>
                  <div className={`text-3xl font-bold ${getReadinessColor(regulatorMetrics.controlImplementationRate)}`}>
                    {regulatorMetrics.controlImplementationRate}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Good Progress</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Evidence Completeness</div>
                  <div className={`text-3xl font-bold ${getReadinessColor(regulatorMetrics.evidenceCompletenessScore)}`}>
                    {regulatorMetrics.evidenceCompletenessScore}%
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Strong</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Active Frameworks</div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">{regulatorMetrics.totalFrameworks}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{regulatorMetrics.frameworksCertified} Certified</div>
            <div className="text-xs text-gray-500 mt-1">
              {regulatorMetrics.totalFrameworks - regulatorMetrics.frameworksCertified} in progress
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Evidence Items</div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{evidenceItems.filter(e => e.status === 'approved').length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {evidenceItems.filter(e => e.status === 'pending-review').length} pending review
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Open Gaps</div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-lg">{gapStats.open + gapStats.inProgress}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{gapStats.critical}</div>
            <div className="text-xs text-red-600 mt-1">Critical priority</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Last Audit</div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900">{formatDate(regulatorMetrics.lastAuditDate)}</div>
            <div className="text-xs text-gray-500 mt-1">
              {regulatorMetrics.upcomingAudits} upcoming
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg. Gap Resolution</div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{regulatorMetrics.averageGapResolutionTime}</div>
            <div className="text-xs text-gray-500 mt-1">days average</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('readiness')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'readiness'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  🛡️ Audit Readiness
                </span>
              </button>
              <button
                onClick={() => setActiveTab('frameworks')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'frameworks'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  📋 Framework Packages ({frameworkAuditPackages.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('evidence')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'evidence'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  📎 Evidence Repository ({evidenceItems.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'timeline'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  📅 Compliance Timeline
                </span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'reports'
                    ? 'border-[#26558e] text-[#26558e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  📄 Generated Reports ({generatedReports.length})
                </span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Audit Readiness Tab */}
            {activeTab === 'readiness' && (
              <div className="space-y-6">
                {/* Readiness Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Documentation', score: readinessScore.documentation, icon: '📄' },
                    { label: 'Controls', score: readinessScore.controls, icon: '🎯' },
                    { label: 'Evidence', score: readinessScore.evidence, icon: '📎' },
                    { label: 'Team Readiness', score: readinessScore.teamReadiness, icon: '👥' },
                    { label: 'Risk Management', score: readinessScore.riskManagement, icon: '⚠️' },
                    { label: 'Overall', score: readinessScore.overall, icon: '🛡️' }
                  ].map((item, index) => (
                    <div key={index} className={`p-6 rounded-lg border ${getReadinessBg(item.score)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl">{item.icon}</div>
                        <div className={`text-4xl font-bold ${getReadinessColor(item.score)}`}>
                          {item.score}%
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">{item.label}</div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getComplianceBarColor(item.score)}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gaps Overview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Identified Gaps</h3>
                    <div className="flex gap-2">
                      <select
                        value={selectedGapSeverity}
                        onChange={(e) => setSelectedGapSeverity(e.target.value)}
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg"
                      >
                        <option value="all">All Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <select
                        value={selectedGapStatus}
                        onChange={(e) => setSelectedGapStatus(e.target.value)}
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredGaps.map((gap) => (
                      <div key={gap.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{gap.frameworkIcon}</span>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(gap.severity)}`}>
                                {gap.severity.toUpperCase()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getGapStatusColor(gap.status)}`}>
                                {gap.status.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                {getCategoryIcon(gap.category)} {gap.category}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900">{gap.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{gap.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Impact</div>
                            <div className="text-sm text-gray-900">{gap.impact}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Remediation</div>
                            <div className="text-sm text-gray-900">{gap.remediation}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Estimated Effort</div>
                            <div className="text-sm font-medium text-gray-900">{gap.estimatedEffort}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Assigned To / Due Date</div>
                            <div className="text-sm text-gray-900">
                              {gap.assignedTo} • {gap.dueDate ? formatDate(gap.dueDate) : 'Not set'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Framework Packages Tab */}
            {activeTab === 'frameworks' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search frameworks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Regions</option>
                    {uniqueRegions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Framework Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPackages.map((pkg) => (
                    <div key={pkg.frameworkId} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="text-4xl">{pkg.frameworkIcon}</div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{pkg.frameworkName}</h3>
                            <p className="text-sm text-gray-600">{pkg.region}</p>
                          </div>
                        </div>
                        {pkg.certificationStatus && (
                          <span className={`text-xs px-2 py-1 rounded border ${getCertificationStatusColor(pkg.certificationStatus)}`}>
                            {pkg.certificationStatus.replace('-', ' ').toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{pkg.compliance}%</div>
                          <div className="text-xs text-gray-600">Compliance</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{pkg.auditReadiness}%</div>
                          <div className="text-xs text-gray-600">Audit Readiness</div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-gray-900">{pkg.controlsImplemented}/{pkg.totalControls}</div>
                          <div className="text-gray-600">Controls</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-gray-900">{pkg.evidenceCollected}/{pkg.totalEvidence}</div>
                          <div className="text-gray-600">Evidence</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-gray-900">{pkg.tasksCompleted}/{pkg.totalTasks}</div>
                          <div className="text-gray-600">Tasks</div>
                        </div>
                      </div>

                      {/* Gaps Summary */}
                      {pkg.gaps.length > 0 && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-yellow-900">{pkg.gaps.length} Open Gaps:</span>
                            <span className="text-yellow-700">
                              {pkg.gaps.filter(g => g.severity === 'critical').length} Critical,
                              {' '}{pkg.gaps.filter(g => g.severity === 'high').length} High
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPackage(pkg.frameworkId)}
                          className="flex-1 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors text-sm"
                        >
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Repository Tab */}
            {activeTab === 'evidence' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search evidence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  />
                  <select
                    value={selectedFramework}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Frameworks</option>
                    {frameworkAuditPackages.map((pkg) => (
                      <option key={pkg.frameworkId} value={pkg.frameworkName}>{pkg.frameworkName}</option>
                    ))}
                  </select>
                  <select
                    value={selectedEvidenceStatus}
                    onChange={(e) => setSelectedEvidenceStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending-review">Pending Review</option>
                    <option value="rejected">Rejected</option>
                    <option value="outdated">Outdated</option>
                  </select>
                </div>

                {/* Evidence Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Evidence</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Framework</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Control</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Upload Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEvidence.map((evidence) => (
                        <tr key={evidence.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{evidence.name}</div>
                              <div className="text-xs text-gray-500">{evidence.type} • {evidence.fileSize}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{evidence.framework}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{evidence.control}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{formatDate(evidence.uploadDate)}</td>
                          <td className="px-4 py-4">
                            <span className={`text-xs px-2 py-1 rounded ${getEvidenceStatusColor(evidence.status)}`}>
                              {evidence.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button className="text-sm text-[#26558e] hover:underline">View</button>
                              <button className="text-sm text-[#26558e] hover:underline">Download</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                  
                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {auditTimeline.map((item, index) => (
                      <div key={index} className="relative flex gap-6 items-start">
                        {/* Timeline Dot */}
                        <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          item.status === 'completed' ? 'bg-green-100' :
                          item.status === 'in-progress' ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}>
                          {item.type === 'audit' && <span className="text-xl">📋</span>}
                          {item.type === 'certification' && <span className="text-xl">🏆</span>}
                          {item.type === 'milestone' && <span className="text-xl">🎯</span>}
                          {item.type === 'gap-identified' && <span className="text-xl">⚠️</span>}
                          {item.type === 'gap-resolved' && <span className="text-xl">✅</span>}
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.event}</h4>
                              <p className="text-sm text-gray-600 mt-1">{item.framework}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">{formatDate(item.date)}</div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.status.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{item.details}</p>
                          {item.documents && item.documents.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {item.documents.map((doc, i) => (
                                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  📄 {doc}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Pre-Generated Audit Reports</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Comprehensive audit packages ready to share with regulators and auditors
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedReports.map((report) => (
                    <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {report.type.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getConfidenceLevelColor(report.confidenceLevel)}`}>
                              {getConfidenceLevelIcon(report.confidenceLevel)} {report.confidenceLevel.toUpperCase()} CONFIDENCE
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {report.format.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{report.summary}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>📄 {report.pageCount} pages</span>
                            <span>📅 {formatDate(report.generatedDate)}</span>
                            {report.includesEvidence && <span>📎 With Evidence</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors text-sm">
                          Download
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Preview
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Generate New Report */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Generate Custom Report</h3>
                      <p className="text-sm text-gray-600">
                        Create a tailored audit package for specific frameworks or requirements
                      </p>
                    </div>
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="px-6 py-3 bg-[#26558e] text-white rounded-lg hover:bg-[#1e4470] transition-colors"
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Package Details Modal */}
        {packageDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{packageDetails.frameworkIcon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{packageDetails.frameworkName}</h2>
                      <p className="text-gray-600">{packageDetails.region}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{packageDetails.compliance}%</div>
                    <div className="text-sm text-gray-600">Compliance</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{packageDetails.auditReadiness}%</div>
                    <div className="text-sm text-gray-600">Audit Readiness</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {packageDetails.controlsImplemented}/{packageDetails.totalControls}
                    </div>
                    <div className="text-sm text-gray-600">Controls</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">
                      {packageDetails.evidenceCollected}/{packageDetails.totalEvidence}
                    </div>
                    <div className="text-sm text-gray-600">Evidence</div>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Strengths</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {packageDetails.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regulatory Requirements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Regulatory Requirements</h3>
                  <div className="space-y-3">
                    {packageDetails.regulatoryRequirements.map((req) => (
                      <div key={req.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{req.requirement}</h4>
                          <span className={`text-xs px-2 py-1 rounded border ${getRequirementStatusColor(req.status)}`}>
                            {req.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{req.notes}</p>
                        <div className="flex flex-wrap gap-1">
                          {req.evidence.map((ev, i) => (
                            <span key={i} className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200">
                              📎 {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <div className="space-y-2">
                    {packageDetails.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-lg">
                        <span className="text-blue-600 mt-0.5">→</span>
                        <span className="text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#26558e] text-white px-4 py-3 rounded-lg hover:bg-[#1e4470] transition-colors">
                    Download Full Package
                  </button>
                  <button className="flex-1 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    Share with Auditor
                  </button>
                  <button className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate Audit Package</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Select the components to include in your comprehensive audit package
                </p>

                <div className="space-y-3">
                  {[
                    'Executive Summary',
                    'Framework Details',
                    'Control Matrices',
                    'Evidence Attachments',
                    'Gap Analysis',
                    'Compliance Timeline',
                    'Recommendations'
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#26558e]" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>PDF (Recommended)</option>
                    <option>Microsoft Word (DOCX)</option>
                    <option>Microsoft Excel (XLSX)</option>
                    <option>ZIP Archive (All Formats)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 bg-[#26558e] text-white px-4 py-3 rounded-lg hover:bg-[#1e4470] transition-colors"
                  >
                    Generate Package
                  </button>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
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
