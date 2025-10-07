export interface FrameworkProgress {
  id: string;
  name: string;
  region: string;
  icon: string;
  compliance: number;
  totalControls: number;
  completedControls: number;
  inProgressControls: number;
  notStartedControls: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalEvidence: number;
  evidenceCollected: number;
  evidencePending: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
  daysRemaining: number;
  assignedTeams: string[];
  lastActivity: string;
  trend: 'up' | 'down' | 'stable';
  priority: 'high' | 'medium' | 'low';
}

export interface ControlProgress {
  id: string;
  title: string;
  framework: string;
  frameworkIcon: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'needs-review';
  priority: 'high' | 'medium' | 'low';
  category: string;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  assignee: string;
  dueDate: string;
  daysOverdue: number;
  evidenceCount: number;
  lastUpdated: string;
  estimatedHours: number;
  actualHours: number;
}

export interface TaskProgress {
  id: string;
  title: string;
  description: string;
  control: string;
  framework: string;
  frameworkIcon: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  category: string;
  assignee: string;
  dueDate: string;
  completedDate?: string;
  daysOverdue: number;
  estimatedHours: number;
  actualHours: number;
  evidenceAttached: boolean;
  blockers?: string[];
}

export interface ReportStats {
  totalFrameworks: number;
  activeFrameworks: number;
  overallCompliance: number;
  totalControls: number;
  completedControls: number;
  inProgressControls: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasksCount: number;
  totalEvidence: number;
  evidenceCollected: number;
  highRiskItems: number;
  upcomingDeadlines: number;
}

export interface ComplianceTrend {
  date: string;
  compliance: number;
  controlsCompleted: number;
  tasksCompleted: number;
}

export interface ReportFilters {
  selectedFramework: string;
  selectedStatus: string;
  selectedPriority: string;
  selectedCategory: string;
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  searchQuery: string;
}

export interface TeamPerformance {
  teamName: string;
  assignedTasks: number;
  completedTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  overdueItems: number;
}

export interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  affectedItems: string[];
  priority: 'high' | 'medium' | 'low';
}

