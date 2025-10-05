// Framework status types
export type FrameworkStatus = 'active' | 'draft' | 'inactive' | 'pending';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type Priority = 'high' | 'medium' | 'low';

export interface ComplianceTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  estimatedHours: number;
  category: string;
  completed: boolean;
}

export interface BusinessImpact {
  penaltyAmount: string;
  penaltyCurrency: string;
  businessBenefits: string[];
  marketAccess: string[];
  competitiveAdvantages: string[];
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  status: FrameworkStatus;
  compliance: number;
  controls: number;
  lastUpdated: string;
  region: string;
  category: 'Privacy' | 'Security' | 'Compliance' | 'Risk';
  icon: string;
  color: string;
  businessImpact: BusinessImpact;
  tasks: ComplianceTask[];
  complianceDeadline: string;
  priority: Priority;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  type: 'Legal' | 'Other' | 'Standards';
  requirements: number;
}

export interface ControlDetail {
  id: string;
  title: string;
  subtitle: string;
  article: string;
  description: string;
  detailedDescription: string;
  requirements: string[];
  implementation: string[];
  compliance: {
    status: string;
    progress: number;
    lastUpdated: string;
    nextReview: string;
  };
  evidence: string[];
}
