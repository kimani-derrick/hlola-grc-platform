import { Priority } from '../types/frameworks';

export const getComplianceColor = (compliance: number) => {
  if (compliance >= 80) return 'text-green-600';
  if (compliance >= 60) return 'text-yellow-600';
  if (compliance >= 40) return 'text-orange-600';
  return 'text-red-600';
};

export const getComplianceBg = (compliance: number) => {
  if (compliance >= 80) return 'bg-green-500';
  if (compliance >= 60) return 'bg-yellow-500';
  if (compliance >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getRiskLevelColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'critical': return 'text-red-700 bg-red-100 border-red-200';
    case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
    case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    case 'low': return 'text-green-700 bg-green-100 border-green-200';
    default: return 'text-gray-700 bg-gray-100 border-gray-200';
  }
};

export const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-700 bg-green-100';
    case 'in-progress': return 'text-blue-700 bg-blue-100';
    case 'overdue': return 'text-red-700 bg-red-100';
    case 'pending': return 'text-gray-700 bg-gray-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

export const statusConfig = {
  active: { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' },
  draft: { color: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500' },
  inactive: { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500' },
  pending: { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' }
};
