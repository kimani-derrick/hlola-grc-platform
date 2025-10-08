'use client';

import Link from 'next/link';

interface AuditOverviewProps {
  className?: string;
}

// Sample audit data for overview
const auditOverviewData = {
  totalAudits: 5,
  activeAudits: 2,
  overdueAudits: 1,
  completedThisMonth: 1,
  upcomingDeadlines: [
    { id: 1, title: 'GDPR Compliance Audit', dueDate: '2024-03-15', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'SOC 2 Type II Audit', dueDate: '2024-05-31', status: 'planning', priority: 'high' },
    { id: 3, title: 'Nigeria NDPR Review', dueDate: '2024-04-30', status: 'planning', priority: 'medium' }
  ],
  criticalFindings: 6,
  recentActivity: [
    { id: 1, action: 'New finding identified in GDPR audit', time: '2 hours ago', type: 'warning' },
    { id: 2, action: 'ISO 27001 audit corrective actions overdue', time: '1 day ago', type: 'critical' },
    { id: 3, action: 'POPIA internal assessment completed', time: '3 days ago', type: 'success' }
  ]
};

export default function AuditOverview({ className = '' }: AuditOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'planning': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Overview</h2>
          <p className="text-gray-600 mt-1">Monitor compliance audits and assessments</p>
        </div>
        <Link 
          href="/dashboard/privacy-hub/audit-center"
          className="bg-[#26558e] text-white px-4 py-2 rounded-lg hover:bg-[#1e4470] transition-colors text-sm font-medium"
        >
          View All Audits
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-600" style={{ fontWeight: 'bold' }}>Total Audits</p>
              <p className="text-2xl font-bold text-gray-900">{auditOverviewData.totalAudits}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-600" style={{ fontWeight: 'bold' }}>Active</p>
              <p className="text-2xl font-bold text-gray-900">{auditOverviewData.activeAudits}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-600" style={{ fontWeight: 'bold' }}>Overdue</p>
              <p className="text-2xl font-bold text-red-600">{auditOverviewData.overdueAudits}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-600" style={{ fontWeight: 'bold' }}>Critical Findings</p>
              <p className="text-2xl font-bold text-orange-600">{auditOverviewData.criticalFindings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <span className="text-sm text-gray-500">Next 90 days</span>
          </div>
          <div className="space-y-4">
            {auditOverviewData.upcomingDeadlines.map((audit) => (
              <div key={audit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{audit.title}</p>
                    <span className={`text-xs font-medium ${getPriorityColor(audit.priority)}`}>
                      {audit.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">Due: {audit.dueDate}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                      {audit.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/privacy-hub/audit-center"
              className="text-sm text-[#26558e] hover:text-[#1e4470] font-medium"
            >
              View all audits →
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {auditOverviewData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getActivityTypeColor(activity.type)}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/privacy-hub/audit-center"
              className="text-sm text-[#26558e] hover:text-[#1e4470] font-medium"
            >
              View activity log →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
