import { FrameworkProgress, ControlProgress, TaskProgress, ReportFilters } from '../types/reports';

export function filterFrameworks(
  frameworks: FrameworkProgress[],
  filters: ReportFilters
): FrameworkProgress[] {
  return frameworks.filter(framework => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        framework.name.toLowerCase().includes(query) ||
        framework.region.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Priority filter
    if (filters.selectedPriority !== 'all' && framework.priority !== filters.selectedPriority) {
      return false;
    }

    // Risk level as status filter
    if (filters.selectedStatus !== 'all' && framework.riskLevel !== filters.selectedStatus) {
      return false;
    }

    return true;
  });
}

export function filterControls(
  controls: ControlProgress[],
  filters: ReportFilters
): ControlProgress[] {
  return controls.filter(control => {
    // Framework filter
    if (filters.selectedFramework !== 'all' && control.framework !== filters.selectedFramework) {
      return false;
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        control.title.toLowerCase().includes(query) ||
        control.category.toLowerCase().includes(query) ||
        control.assignee.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.selectedStatus !== 'all' && control.status !== filters.selectedStatus) {
      return false;
    }

    // Priority filter
    if (filters.selectedPriority !== 'all' && control.priority !== filters.selectedPriority) {
      return false;
    }

    // Category filter
    if (filters.selectedCategory !== 'all' && control.category !== filters.selectedCategory) {
      return false;
    }

    return true;
  });
}

export function filterTasks(
  tasks: TaskProgress[],
  filters: ReportFilters
): TaskProgress[] {
  return tasks.filter(task => {
    // Framework filter
    if (filters.selectedFramework !== 'all' && task.framework !== filters.selectedFramework) {
      return false;
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query) ||
        task.control.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.selectedStatus !== 'all' && task.status !== filters.selectedStatus) {
      return false;
    }

    // Priority filter
    if (filters.selectedPriority !== 'all' && task.priority !== filters.selectedPriority) {
      return false;
    }

    // Category filter
    if (filters.selectedCategory !== 'all' && task.category !== filters.selectedCategory) {
      return false;
    }

    return true;
  });
}

export function sortFrameworks(
  frameworks: FrameworkProgress[],
  sortBy: 'compliance' | 'deadline' | 'risk' | 'name'
): FrameworkProgress[] {
  const sorted = [...frameworks];
  
  switch (sortBy) {
    case 'compliance':
      return sorted.sort((a, b) => a.compliance - b.compliance);
    case 'deadline':
      return sorted.sort((a, b) => a.daysRemaining - b.daysRemaining);
    case 'risk':
      const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return sorted.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export function sortControls(
  controls: ControlProgress[],
  sortBy: 'completion' | 'dueDate' | 'priority' | 'overdue'
): ControlProgress[] {
  const sorted = [...controls];
  
  switch (sortBy) {
    case 'completion':
      return sorted.sort((a, b) => a.completionRate - b.completionRate);
    case 'dueDate':
      return sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    case 'priority':
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'overdue':
      return sorted.sort((a, b) => b.daysOverdue - a.daysOverdue);
    default:
      return sorted;
  }
}

export function sortTasks(
  tasks: TaskProgress[],
  sortBy: 'dueDate' | 'priority' | 'status' | 'overdue'
): TaskProgress[] {
  const sorted = [...tasks];
  
  switch (sortBy) {
    case 'dueDate':
      return sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    case 'priority':
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'status':
      const statusOrder = { blocked: 0, 'in-progress': 1, pending: 2, completed: 3 };
      return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    case 'overdue':
      return sorted.sort((a, b) => b.daysOverdue - a.daysOverdue);
    default:
      return sorted;
  }
}

export function getUniqueFrameworks(controls: ControlProgress[]): string[] {
  return Array.from(new Set(controls.map(c => c.framework))).sort();
}

export function getUniqueCategories(controls: ControlProgress[]): string[] {
  return Array.from(new Set(controls.map(c => c.category))).sort();
}

export function calculateCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getRiskLevelColor(riskLevel: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (riskLevel) {
    case 'critical':
      return 'bg-red-600';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'not-started':
      return 'bg-gray-400';
    case 'needs-review':
      return 'bg-purple-500';
    case 'blocked':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '↗';
    case 'down':
      return '↘';
    case 'stable':
      return '→';
    default:
      return '→';
  }
}

export function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
}

export function formatDaysRemaining(days: number): string {
  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return '1 day remaining';
  } else if (days <= 30) {
    return `${days} days remaining`;
  } else {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month remaining' : `${months} months remaining`;
  }
}

export function getInsightIcon(type: 'warning' | 'success' | 'info' | 'critical'): string {
  switch (type) {
    case 'critical':
      return '🚨';
    case 'warning':
      return '⚠️';
    case 'success':
      return '✅';
    case 'info':
      return 'ℹ️';
    default:
      return 'ℹ️';
  }
}

export function getInsightColor(type: 'warning' | 'success' | 'info' | 'critical'): string {
  switch (type) {
    case 'critical':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}

