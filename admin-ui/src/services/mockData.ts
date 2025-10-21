import { Framework, Control, Task, Stats } from '@/types';

export const mockFrameworks = [
  {
    id: '1',
    name: 'GDPR',
    description: 'General Data Protection Regulation',
    region: 'Europe',
    category: 'privacy',
    type: 'regulation',
    priority: 'high',
    risk_level: 'critical',
    status: 'active',
    requirements_count: 12,
    created_at: '2024-01-15',
    color: '#4F46E5'
  },
  {
    id: '2',
    name: 'Kenya DPA',
    description: 'Kenya Data Protection Act',
    region: 'Africa',
    category: 'privacy',
    type: 'regulation',
    priority: 'high',
    riskLevel: 'high',
    status: 'active',
    controlsCount: 8,
    tasksCount: 24,
    createdAt: '2024-02-01',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'ISO 27001',
    description: 'Information Security Management System',
    region: 'Global',
    category: 'security',
    type: 'standard',
    priority: 'medium',
    riskLevel: 'high',
    status: 'active',
    controlsCount: 15,
    tasksCount: 67,
    createdAt: '2024-01-20',
    color: '#F59E0B'
  }
];

export const mockControls = [
  // GDPR Controls
  {
    id: '1',
    frameworkId: '1',
    code: 'A.5.1.1',
    title: 'Information Security Policies',
    category: 'governance',
    priority: 'high',
    riskLevel: 'high',
    status: 'active',
    tasksCount: 3,
    frameworkName: 'GDPR'
  },
  {
    id: '2',
    frameworkId: '1',
    code: 'A.5.1.2',
    title: 'Review of Information Security Policies',
    category: 'governance',
    priority: 'medium',
    riskLevel: 'medium',
    status: 'active',
    tasksCount: 2,
    frameworkName: 'GDPR'
  },
  {
    id: '3',
    frameworkId: '1',
    code: 'A.6.1.1',
    title: 'Data Protection Impact Assessment',
    category: 'privacy',
    priority: 'high',
    riskLevel: 'high',
    status: 'active',
    tasksCount: 4,
    frameworkName: 'GDPR'
  },
  // Kenya DPA Controls
  {
    id: '4',
    frameworkId: '2',
    code: 'KDPA.1.1',
    title: 'Data Subject Rights Management',
    category: 'privacy',
    priority: 'high',
    riskLevel: 'high',
    status: 'active',
    tasksCount: 5,
    frameworkName: 'Kenya DPA'
  },
  {
    id: '5',
    frameworkId: '2',
    code: 'KDPA.2.1',
    title: 'Data Breach Notification',
    category: 'incident',
    priority: 'high',
    risk_level: 'critical',
    status: 'active',
    tasksCount: 3,
    frameworkName: 'Kenya DPA'
  },
  // ISO 27001 Controls
  {
    id: '6',
    frameworkId: '3',
    code: 'A.5.1.1',
    title: 'Information Security Policies',
    category: 'governance',
    priority: 'high',
    riskLevel: 'high',
    status: 'active',
    tasksCount: 6,
    frameworkName: 'ISO 27001'
  },
  {
    id: '7',
    frameworkId: '3',
    code: 'A.8.1.1',
    title: 'Asset Management',
    category: 'asset',
    priority: 'medium',
    riskLevel: 'medium',
    status: 'active',
    tasksCount: 4,
    frameworkName: 'ISO 27001'
  }
];

export const mockTasks = [
  // Tasks for Control A.5.1.1 (GDPR)
  {
    id: '1',
    controlId: '1',
    title: 'Review current policy',
    description: 'Conduct annual review of information security policy',
    category: 'policy',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-12-31',
    estimatedHours: 8,
    controlCode: 'A.5.1.1',
    frameworkName: 'GDPR'
  },
  {
    id: '2',
    controlId: '1',
    title: 'Update policy template',
    description: 'Update the policy template with latest requirements',
    category: 'policy',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2025-11-15',
    estimatedHours: 4,
    controlCode: 'A.5.1.1',
    frameworkName: 'GDPR'
  },
  {
    id: '3',
    controlId: '1',
    title: 'Policy approval workflow',
    description: 'Implement automated policy approval workflow',
    category: 'process',
    priority: 'medium',
    status: 'pending',
    dueDate: '2025-10-30',
    estimatedHours: 6,
    controlCode: 'A.5.1.1',
    frameworkName: 'GDPR'
  },
  // Tasks for Control A.5.1.2 (GDPR)
  {
    id: '4',
    controlId: '2',
    title: 'Schedule policy review',
    description: 'Schedule quarterly policy review meetings',
    category: 'governance',
    priority: 'medium',
    status: 'completed',
    dueDate: '2025-09-30',
    estimatedHours: 2,
    controlCode: 'A.5.1.2',
    frameworkName: 'GDPR'
  },
  {
    id: '5',
    controlId: '2',
    title: 'Review documentation',
    description: 'Review all policy documentation for compliance',
    category: 'compliance',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-11-20',
    estimatedHours: 12,
    controlCode: 'A.5.1.2',
    frameworkName: 'GDPR'
  },
  // Tasks for Control KDPA.1.1 (Kenya DPA)
  {
    id: '6',
    controlId: '4',
    title: 'Data subject rights portal',
    description: 'Develop self-service portal for data subject rights',
    category: 'development',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-12-15',
    estimatedHours: 40,
    controlCode: 'KDPA.1.1',
    frameworkName: 'Kenya DPA'
  },
  {
    id: '7',
    controlId: '4',
    title: 'Rights request handling',
    description: 'Implement automated rights request handling process',
    category: 'process',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-11-30',
    estimatedHours: 24,
    controlCode: 'KDPA.1.1',
    frameworkName: 'Kenya DPA'
  }
];

export const stats = {
  totalFrameworks: 3,
  totalControls: 35,
  totalTasks: 136,
  activeFrameworks: 3,
  pendingTasks: 89,
  completedTasks: 47
};
