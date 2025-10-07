import {
  BaseAssessment,
  AssessmentType,
  AssessmentStatus,
  RiskLevel,
  MaturityLevel,
  AssessmentFilters
} from '../types/assessments';

export function filterAssessments(
  assessments: BaseAssessment[],
  filters: AssessmentFilters
): BaseAssessment[] {
  return assessments.filter(assessment => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        assessment.title.toLowerCase().includes(query) ||
        assessment.description.toLowerCase().includes(query) ||
        assessment.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.selectedType !== 'all' && assessment.type !== filters.selectedType) {
      return false;
    }

    // Status filter
    if (filters.selectedStatus !== 'all' && assessment.status !== filters.selectedStatus) {
      return false;
    }

    // Framework filter
    if (filters.selectedFramework !== 'all' && assessment.framework !== filters.selectedFramework) {
      return false;
    }

    // Priority filter
    if (filters.selectedPriority !== 'all' && assessment.priority !== filters.selectedPriority) {
      return false;
    }

    // Assigned to filter
    if (filters.assignedTo !== 'all' && assessment.assignedTo !== filters.assignedTo) {
      return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const assessmentDate = new Date(assessment.createdDate);
      const now = new Date();
      const daysAgo = getDaysAgo(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      if (assessmentDate < cutoffDate) return false;
    }

    return true;
  });
}

export function getDaysAgo(dateRange: string): number {
  switch (dateRange) {
    case 'week': return 7;
    case 'month': return 30;
    case 'quarter': return 90;
    case 'year': return 365;
    default: return 0;
  }
}

export function getStatusColor(status: AssessmentStatus): string {
  switch (status) {
    case 'completed':
      return 'text-green-700 bg-green-100 border-green-300';
    case 'in-progress':
      return 'text-blue-700 bg-blue-100 border-blue-300';
    case 'pending-review':
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'approved':
      return 'text-green-700 bg-green-100 border-green-300';
    case 'rejected':
      return 'text-red-700 bg-red-100 border-red-300';
    case 'draft':
      return 'text-gray-700 bg-gray-100 border-gray-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'text-red-700 bg-red-100 border-red-300';
    case 'high':
      return 'text-orange-700 bg-orange-100 border-orange-300';
    case 'medium':
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'low':
      return 'text-blue-700 bg-blue-100 border-blue-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function getRiskLevelColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'critical':
      return 'text-red-700 bg-red-100 border-red-300';
    case 'high':
      return 'text-orange-700 bg-orange-100 border-orange-300';
    case 'medium':
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'low':
      return 'text-green-700 bg-green-100 border-green-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function getMaturityLevelColor(maturityLevel: MaturityLevel): string {
  switch (maturityLevel) {
    case 'optimizing':
      return 'text-green-700 bg-green-100 border-green-300';
    case 'quantified':
      return 'text-blue-700 bg-blue-100 border-blue-300';
    case 'defined':
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'managed':
      return 'text-orange-700 bg-orange-100 border-orange-300';
    case 'initial':
      return 'text-red-700 bg-red-100 border-red-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function getAssessmentTypeIcon(type: AssessmentType): string {
  switch (type) {
    case 'pia':
      return '📊';
    case 'dsr':
      return '👥';
    case 'vendor':
      return '🏢';
    case 'breach-risk':
      return '⚠️';
    case 'maturity':
      return '📈';
    default:
      return '📋';
  }
}

export function getAssessmentTypeLabel(type: AssessmentType): string {
  switch (type) {
    case 'pia':
      return 'Privacy Impact Assessment';
    case 'dsr':
      return 'Data Subject Rights Assessment';
    case 'vendor':
      return 'Vendor Privacy Assessment';
    case 'breach-risk':
      return 'Breach Risk Assessment';
    case 'maturity':
      return 'Privacy Maturity Assessment';
    default:
      return 'Assessment';
  }
}

export function getRiskScoreColor(score: number): string {
  if (score >= 8) return 'text-red-600';
  if (score >= 6) return 'text-orange-600';
  if (score >= 4) return 'text-yellow-600';
  return 'text-green-600';
}

export function getRiskScoreBg(score: number): string {
  if (score >= 8) return 'bg-red-50 border-red-200';
  if (score >= 6) return 'bg-orange-50 border-orange-200';
  if (score >= 4) return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-200';
}

export function getMaturityScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  if (score >= 20) return 'text-orange-600';
  return 'text-red-600';
}

export function getMaturityScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 60) return 'bg-blue-50 border-blue-200';
  if (score >= 40) return 'bg-yellow-50 border-yellow-200';
  if (score >= 20) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDaysUntilDate(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isDateOverdue(dateString: string): boolean {
  return getDaysUntilDate(dateString) < 0;
}

export function isDueSoon(dateString: string, daysThreshold: number = 7): boolean {
  const daysUntil = getDaysUntilDate(dateString);
  return daysUntil >= 0 && daysUntil <= daysThreshold;
}

export function getDueDateColor(dateString: string): string {
  if (isDateOverdue(dateString)) return 'text-red-600';
  if (isDueSoon(dateString)) return 'text-orange-600';
  return 'text-gray-600';
}

export function getDueDateBg(dateString: string): string {
  if (isDateOverdue(dateString)) return 'bg-red-50 border-red-200';
  if (isDueSoon(dateString)) return 'bg-orange-50 border-orange-200';
  return 'bg-gray-50 border-gray-200';
}

export function sortAssessments(
  assessments: BaseAssessment[],
  sortBy: 'title' | 'createdDate' | 'dueDate' | 'priority' | 'status'
): BaseAssessment[] {
  const sorted = [...assessments];
  
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'createdDate':
      return sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    case 'priority':
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'status':
      const statusOrder = { 
        'in-progress': 0, 
        'pending-review': 1, 
        'draft': 2, 
        'approved': 3, 
        'completed': 4, 
        'rejected': 5 
      };
      return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    default:
      return sorted;
  }
}

export function getUniqueFrameworks(assessments: BaseAssessment[]): string[] {
  return Array.from(new Set(assessments.map(a => a.framework))).sort();
}

export function getUniqueAssignees(assessments: BaseAssessment[]): string[] {
  return Array.from(new Set(assessments.map(a => a.assignedTo))).sort();
}

export function getAssessmentProgress(assessment: BaseAssessment): number {
  switch (assessment.status) {
    case 'draft': return 10;
    case 'in-progress': return 50;
    case 'pending-review': return 75;
    case 'approved': return 90;
    case 'completed': return 100;
    case 'rejected': return 0;
    default: return 0;
  }
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 40) return 'bg-yellow-500';
  if (progress >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}

export function calculateRiskScore(likelihood: RiskLevel, impact: RiskLevel): number {
  const likelihoodScores = { low: 1, medium: 2, high: 3, critical: 4 };
  const impactScores = { low: 1, medium: 2, high: 3, critical: 4 };
  
  return likelihoodScores[likelihood] * impactScores[impact];
}

export function getRiskScoreLabel(score: number): string {
  if (score >= 12) return 'Critical';
  if (score >= 9) return 'High';
  if (score >= 6) return 'Medium';
  if (score >= 3) return 'Low';
  return 'Very Low';
}

export function getMaturityScoreLabel(score: number): string {
  if (score >= 80) return 'Optimizing';
  if (score >= 60) return 'Quantified';
  if (score >= 40) return 'Defined';
  if (score >= 20) return 'Managed';
  return 'Initial';
}

export function getComplianceScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getComplianceScoreBg(score: number): string {
  if (score >= 90) return 'bg-green-50 border-green-200';
  if (score >= 75) return 'bg-blue-50 border-blue-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  if (score >= 40) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}
