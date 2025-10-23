// Common types for the application

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  total: number;
  limit: number | null;
  offset: number;
}

export interface Framework {
  id: string;
  framework_id?: string;
  frameworkId?: string;
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
  applicable_countries: string[];
  industry_scope: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_fine_amount: string;
  max_fine_currency: string;
}

export interface Control {
  id: string;
  control_id: string;
  framework_id: string;
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
}

export interface Task {
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
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  entityId?: string;
  organizationId?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Generic object type for flexible data
export type GenericObject = Record<string, unknown>;

// Empty object type for components that don't need props
export type EmptyProps = Record<string, never>;
