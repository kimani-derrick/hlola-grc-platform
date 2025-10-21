export type Framework = {
  id: string;
  name: string;
  description: string;
  region: string;
  category: string;
  type: string;
  priority: string;
  riskLevel: string;
  status: string;
  controlsCount: number;
  tasksCount: number;
  createdAt: string;
  color: string;
};

export type Control = {
  id: string;
  frameworkId: string;
  code: string;
  title: string;
  category: string;
  priority: string;
  riskLevel: string;
  status: string;
  tasksCount: number;
  frameworkName: string;
};

export type Task = {
  id: string;
  controlId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dueDate: string;
  estimatedHours: number;
  controlCode: string;
  frameworkName: string;
};

export type Stats = {
  totalFrameworks: number;
  totalControls: number;
  totalTasks: number;
  activeFrameworks: number;
  pendingTasks: number;
  completedTasks: number;
};

export type BreadcrumbItem = string;
