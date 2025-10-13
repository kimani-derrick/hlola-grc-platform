import React from 'react';

export type ControlStatus = 'completed' | 'in-progress' | 'not-started' | 'needs-review';
export type ControlPriority = 'high' | 'medium' | 'low';

export interface Control {
  id: string;
  title: string;
  description: string;
  country: string;
  framework: string;
  frameworkId: string;
  status: ControlStatus;
  priority: ControlPriority;
  category: string;
  dueDate?: string;
  assignee?: string;
  completionRate: number;
  estimatedHours?: number;
  businessImpact?: string;
  reference?: string;
  control_id?: string;
  legal_requirements?: string;
  implementation_guidance?: string;
  evidence_requirements?: string[];
}

interface ControlCardProps {
  control: Control;
  onClick: () => void;
}

const statusConfig = {
  'completed': { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' },
  'in-progress': { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' },
  'not-started': { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500' },
  'needs-review': { color: 'text-orange-700', bg: 'bg-orange-100', dot: 'bg-orange-500' }
};

const getStatusConfig = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig] || statusConfig['not-started'];
};

const priorityConfig = {
  'high': { color: 'text-red-700', bg: 'bg-red-100' },
  'medium': { color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'low': { color: 'text-green-700', bg: 'bg-green-100' }
};

const getPriorityConfig = (priority: string) => {
  return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
};

const getProgressColor = (rate: number) => {
  if (rate === 100) return 'bg-green-500';
  if (rate >= 50) return 'bg-blue-500';
  if (rate > 0) return 'bg-yellow-500';
  return 'bg-gray-300';
};

export default function ControlCard({ control, onClick }: ControlCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{control.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(control.status).bg} ${getStatusConfig(control.status).color}`}>
                <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusConfig(control.status).dot}`}></span>
                {(control.status || 'not-started').charAt(0).toUpperCase() + (control.status || 'not-started').slice(1).replace('-', ' ')}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityConfig(control.priority).bg} ${getPriorityConfig(control.priority).color}`}>
                {(control.priority || 'medium').toUpperCase()} PRIORITY
              </span>
            </div>
            <p className="text-gray-600 mb-3">{control.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {control.country}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {control.framework}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {control.category}
              </span>
              {control.assignee && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {control.assignee}
                </span>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{control.completionRate}%</div>
              <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(control.completionRate)}`}
                  style={{ width: `${control.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
