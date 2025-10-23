export type Framework = {
  id: string;
  name: string;
  description: string;
  version?: string;
  region: string;
  country?: string;
  category: string;
  type: string;
  icon?: string;
  color: string;
  compliance_deadline?: string;
  priority: string;
  risk_level: string;
  status: string;
  requirements_count: number;
  actual_controls_count?: number;
  actual_tasks_count?: number;
  applicable_countries: string[];
  industry_scope: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_fine_amount: string;
  max_fine_currency: string;
};

export type Control = {
  id: string;
  framework_id: string;
  control_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: string;
  implementation_level?: string;
  status: string;
  tasksCount?: number;
  complianceScore?: number;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  control_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  frequency: string;
  estimated_hours: number;
  status: string;
  dueDate?: string;
  progress?: number;
  created_at: string;
  updated_at: string;
};

export type Stats = {
  totalFrameworks: number;
  totalControls: number;
  totalTasks: number;
  activeFrameworks: number;
  pendingTasks: number;
};

export type BreadcrumbItem = string;
