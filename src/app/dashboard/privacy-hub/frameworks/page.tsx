'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { formatDate } from '../../../../utils/dateUtils';

// Framework status types
type FrameworkStatus = 'active' | 'draft' | 'inactive' | 'pending';
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
type Priority = 'high' | 'medium' | 'low';

interface ComplianceTask {
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

interface BusinessImpact {
  penaltyAmount: string;
  penaltyCurrency: string;
  businessBenefits: string[];
  marketAccess: string[];
  competitiveAdvantages: string[];
}

interface Framework {
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

const frameworks: Framework[] = [
  {
    id: '1',
    name: 'Kenya',
    description: 'Data Protection Act 2019 - Essential for all Kenyan businesses. Avoid KSh 5 million fines and build customer trust.',
    status: 'active',
    compliance: 87,
    controls: 34,
    lastUpdated: '2024-01-15',
    region: 'Kenya',
    category: 'Privacy',
    icon: '🇰🇪',
    color: 'bg-red-600',
    businessImpact: {
      penaltyAmount: '5,000,000',
      penaltyCurrency: 'KSh',
      businessBenefits: [
        'Build customer trust and confidence',
        'Access to government contracts',
        'Enhanced business reputation',
        'Competitive advantage in local market'
      ],
      marketAccess: [
        'Government procurement opportunities',
        'Financial services partnerships',
        'Healthcare sector contracts'
      ],
      competitiveAdvantages: [
        'First-mover advantage in compliance',
        'Reduced legal risks',
        'Better customer data handling'
      ]
    },
    tasks: [
      {
        id: 'k1',
        title: 'Appoint Data Protection Officer',
        description: 'Designate a qualified individual responsible for data protection compliance',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-01',
        estimatedHours: 8,
        category: 'Governance',
        completed: true
      },
      {
        id: 'k2',
        title: 'Conduct Data Protection Impact Assessment',
        description: 'Assess risks to personal data processing activities',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-15',
        estimatedHours: 16,
        category: 'Assessment',
        completed: false
      },
      {
        id: 'k3',
        title: 'Implement Data Subject Rights Procedures',
        description: 'Create processes for handling data subject requests',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-03-01',
        estimatedHours: 12,
        category: 'Rights Management',
        completed: false
      },
      {
        id: 'k4',
        title: 'Update Privacy Policy',
        description: 'Revise privacy policy to comply with DPA 2019 requirements',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-02-28',
        estimatedHours: 6,
        category: 'Documentation',
        completed: false
      }
    ],
    complianceDeadline: '2024-06-30',
    priority: 'high',
    riskLevel: 'high',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '2',
    name: 'Ghana',
    description: 'Data Protection Act 2012 - Required for all Ghanaian companies handling personal data. Protect your business reputation.',
    status: 'active',
    compliance: 76,
    controls: 29,
    lastUpdated: '2024-01-12',
    region: 'Ghana',
    category: 'Privacy',
    icon: '🇬🇭',
    color: 'bg-yellow-600',
    businessImpact: {
      penaltyAmount: '500,000',
      penaltyCurrency: 'GHS',
      businessBenefits: [
        'Enhanced business credibility',
        'Access to regional markets',
        'Improved customer confidence',
        'Regulatory compliance advantage'
      ],
      marketAccess: [
        'West African market access',
        'Financial services licensing',
        'Government partnerships'
      ],
      competitiveAdvantages: [
        'Early compliance adoption',
        'Reduced regulatory scrutiny',
        'Better data governance'
      ]
    },
    tasks: [
      {
        id: 'g1',
        title: 'Register with Data Protection Commission',
        description: 'Complete registration with Ghana Data Protection Commission',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-01',
        estimatedHours: 4,
        category: 'Registration',
        completed: true
      },
      {
        id: 'g2',
        title: 'Implement Data Security Measures',
        description: 'Establish technical and organizational security measures',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-20',
        estimatedHours: 20,
        category: 'Security',
        completed: false
      }
    ],
    complianceDeadline: '2024-05-15',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '3',
    name: 'Nigeria',
    description: 'Nigeria Data Protection Act 2023 - Mandatory for Nigerian businesses. Avoid ₦10 billion penalties and regulatory issues.',
    status: 'active',
    compliance: 82,
    controls: 38,
    lastUpdated: '2024-01-10',
    region: 'Nigeria',
    category: 'Privacy',
    icon: '🇳🇬',
    color: 'bg-green-600',
    businessImpact: {
      penaltyAmount: '10,000,000,000',
      penaltyCurrency: '₦',
      businessBenefits: [
        'Avoid massive regulatory penalties',
        'Access to largest African market',
        'Enhanced business reputation',
        'Competitive advantage in Nigeria'
      ],
      marketAccess: [
        'Nigerian government contracts',
        'Financial services sector',
        'Tech industry partnerships'
      ],
      competitiveAdvantages: [
        'First-mover compliance advantage',
        'Reduced legal exposure',
        'Better market positioning'
      ]
    },
    tasks: [
      {
        id: 'n1',
        title: 'Register with NDPC',
        description: 'Register with Nigeria Data Protection Commission',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-01',
        estimatedHours: 6,
        category: 'Registration',
        completed: true
      },
      {
        id: 'n2',
        title: 'Conduct Privacy Impact Assessment',
        description: 'Complete comprehensive privacy impact assessment',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-03-01',
        estimatedHours: 24,
        category: 'Assessment',
        completed: false
      }
    ],
    complianceDeadline: '2024-08-31',
    priority: 'high',
    riskLevel: 'critical',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '4',
    name: 'South Africa',
    description: 'Protection of Personal Information Act (POPIA) - Required for all SA businesses. Avoid R10 million fines.',
    status: 'active',
    compliance: 91,
    controls: 47,
    lastUpdated: '2024-01-08',
    region: 'South Africa',
    category: 'Privacy',
    icon: '🇿🇦',
    color: 'bg-blue-600',
    businessImpact: {
      penaltyAmount: '10,000,000',
      penaltyCurrency: 'R',
      businessBenefits: ['Avoid regulatory fines', 'Enhanced credibility', 'Market access'],
      marketAccess: ['Government contracts', 'Financial services'],
      competitiveAdvantages: ['Compliance advantage', 'Reduced risks']
    },
    tasks: [
      {
        id: 'sa1',
        title: 'POPIA Compliance Assessment',
        description: 'Complete comprehensive POPIA compliance review',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-01',
        estimatedHours: 16,
        category: 'Assessment',
        completed: true
      }
    ],
    complianceDeadline: '2024-07-01',
    priority: 'high',
    riskLevel: 'high',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '5',
    name: 'Uganda',
    description: 'Data Protection and Privacy Act 2019 - Essential for Ugandan operations. Build trust with local customers.',
    status: 'draft',
    compliance: 43,
    controls: 31,
    lastUpdated: '2024-01-05',
    region: 'Uganda',
    category: 'Privacy',
    icon: '🇺🇬',
    color: 'bg-purple-600',
    businessImpact: {
      penaltyAmount: '2,000,000',
      penaltyCurrency: 'UGX',
      businessBenefits: ['Customer trust', 'Market access', 'Compliance advantage'],
      marketAccess: ['Local partnerships', 'Government contracts'],
      competitiveAdvantages: ['Early compliance', 'Reduced risks']
    },
    tasks: [
      {
        id: 'u1',
        title: 'Data Protection Officer Appointment',
        description: 'Appoint qualified Data Protection Officer',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-03-15',
        estimatedHours: 8,
        category: 'Governance',
        completed: false
      }
    ],
    complianceDeadline: '2024-09-30',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '6',
    name: 'Ethiopia',
    description: 'Data Protection Proclamation (Draft) - Prepare for Ethiopia\'s emerging data protection framework. Stay ahead of regulations.',
    status: 'pending',
    compliance: 12,
    controls: 28,
    lastUpdated: '2024-01-03',
    region: 'Ethiopia',
    category: 'Privacy',
    icon: '🇪🇹',
    color: 'bg-orange-600',
    businessImpact: {
      penaltyAmount: 'TBD',
      penaltyCurrency: 'ETB',
      businessBenefits: ['Early compliance', 'Market preparation', 'Competitive advantage'],
      marketAccess: ['Future market access', 'Government readiness'],
      competitiveAdvantages: ['First-mover advantage', 'Regulatory readiness']
    },
    tasks: [
      {
        id: 'e1',
        title: 'Monitor Regulatory Updates',
        description: 'Track Ethiopia data protection law developments',
        status: 'pending',
        priority: 'low',
        dueDate: '2024-12-31',
        estimatedHours: 4,
        category: 'Monitoring',
        completed: false
      }
    ],
    complianceDeadline: 'TBD',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '7',
    name: 'Rwanda',
    description: 'Law on Data Protection and Privacy 2021 - Required for businesses in Rwanda. Access East African markets confidently.',
    status: 'active',
    compliance: 68,
    controls: 32,
    lastUpdated: '2024-01-01',
    region: 'Rwanda',
    category: 'Privacy',
    icon: '🇷🇼',
    color: 'bg-teal-600',
    businessImpact: {
      penaltyAmount: '5,000,000',
      penaltyCurrency: 'RWF',
      businessBenefits: ['East African market access', 'Government contracts', 'Enhanced credibility'],
      marketAccess: ['EAC market access', 'Government partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Reduced barriers']
    },
    tasks: [
      {
        id: 'r1',
        title: 'Data Protection Impact Assessment',
        description: 'Complete DPIA for high-risk processing',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-28',
        estimatedHours: 12,
        category: 'Assessment',
        completed: false
      }
    ],
    complianceDeadline: '2024-06-30',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '8',
    name: 'Tanzania',
    description: 'Personal Data Protection Act 2022 - Essential for Tanzanian businesses. Protect customer data and avoid penalties.',
    status: 'draft',
    compliance: 35,
    controls: 30,
    lastUpdated: '2023-12-28',
    region: 'Tanzania',
    category: 'Privacy',
    icon: '🇹🇿',
    color: 'bg-indigo-600',
    businessImpact: {
      penaltyAmount: '1,000,000',
      penaltyCurrency: 'TZS',
      businessBenefits: ['Customer protection', 'Market access', 'Compliance readiness'],
      marketAccess: ['Local market access', 'Government contracts'],
      competitiveAdvantages: ['Early compliance', 'Risk reduction']
    },
    tasks: [
      {
        id: 't1',
        title: 'Privacy Policy Update',
        description: 'Update privacy policy for PDPA compliance',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-04-01',
        estimatedHours: 8,
        category: 'Documentation',
        completed: false
      }
    ],
    complianceDeadline: '2024-10-31',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '9',
    name: 'Morocco',
    description: 'Law 09-08 on Personal Data Protection - Required for Moroccan operations. Access North African markets with confidence.',
    status: 'active',
    compliance: 73,
    controls: 33,
    lastUpdated: '2023-12-25',
    region: 'Morocco',
    category: 'Privacy',
    icon: '🇲🇦',
    color: 'bg-red-700',
    businessImpact: {
      penaltyAmount: '300,000',
      penaltyCurrency: 'MAD',
      businessBenefits: ['North African market access', 'EU adequacy', 'Enhanced credibility'],
      marketAccess: ['EU market access', 'Government contracts'],
      competitiveAdvantages: ['EU adequacy advantage', 'Regional compliance']
    },
    tasks: [
      {
        id: 'm1',
        title: 'Data Processing Records',
        description: 'Maintain comprehensive processing records',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-01',
        estimatedHours: 6,
        category: 'Documentation',
        completed: true
      }
    ],
    complianceDeadline: '2024-05-31',
    priority: 'high',
    riskLevel: 'high',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '10',
    name: 'Egypt',
    description: 'Personal Data Protection Law 2020 - Essential for Egyptian businesses. Demonstrate professional data governance.',
    status: 'active',
    compliance: 64,
    controls: 36,
    lastUpdated: '2023-12-20',
    region: 'Egypt',
    category: 'Privacy',
    icon: '🇪🇬',
    color: 'bg-yellow-700',
    businessImpact: {
      penaltyAmount: '2,000,000',
      penaltyCurrency: 'EGP',
      businessBenefits: ['Professional credibility', 'Market access', 'Compliance advantage'],
      marketAccess: ['Government contracts', 'Financial services'],
      competitiveAdvantages: ['Professional image', 'Reduced risks']
    },
    tasks: [
      {
        id: 'eg1',
        title: 'Data Subject Rights Implementation',
        description: 'Implement data subject rights procedures',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-03-15',
        estimatedHours: 16,
        category: 'Rights Management',
        completed: false
      }
    ],
    complianceDeadline: '2024-07-31',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '11',
    name: 'Mauritius',
    description: 'Data Protection Act 2017 - Required for Mauritian businesses. Build trust as a regional financial hub.',
    status: 'active',
    compliance: 79,
    controls: 35,
    lastUpdated: '2023-12-15',
    region: 'Mauritius',
    category: 'Privacy',
    icon: '🇲🇺',
    color: 'bg-cyan-600',
    businessImpact: {
      penaltyAmount: '200,000',
      penaltyCurrency: 'MUR',
      businessBenefits: ['Financial hub credibility', 'International trust', 'Market access'],
      marketAccess: ['Financial services', 'International partnerships'],
      competitiveAdvantages: ['Financial hub advantage', 'International compliance']
    },
    tasks: [
      {
        id: 'mu1',
        title: 'Data Breach Notification Procedures',
        description: 'Establish data breach notification processes',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-01',
        estimatedHours: 8,
        category: 'Security',
        completed: true
      }
    ],
    complianceDeadline: '2024-06-30',
    priority: 'high',
    riskLevel: 'high',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '12',
    name: 'Botswana',
    description: 'Data Protection Act 2018 - Essential for Botswanan operations. Enhance business credibility and customer trust.',
    status: 'draft',
    compliance: 51,
    controls: 27,
    lastUpdated: '2023-12-10',
    region: 'Botswana',
    category: 'Privacy',
    icon: '🇧🇼',
    color: 'bg-gray-600',
    businessImpact: {
      penaltyAmount: '500,000',
      penaltyCurrency: 'BWP',
      businessBenefits: ['Customer trust', 'Market credibility', 'Compliance advantage'],
      marketAccess: ['Local market access', 'Government contracts'],
      competitiveAdvantages: ['Early compliance', 'Risk reduction']
    },
    tasks: [
      {
        id: 'b1',
        title: 'Data Protection Officer Training',
        description: 'Train designated DPO on Botswana requirements',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-04-30',
        estimatedHours: 12,
        category: 'Training',
        completed: false
      }
    ],
    complianceDeadline: '2024-11-30',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '13',
    name: 'GDPR',
    description: 'General Data Protection Regulation - EU\'s comprehensive data protection law. Essential for businesses operating in or serving EU customers.',
    status: 'active',
    compliance: 0,
    controls: 99,
    lastUpdated: '2024-01-01',
    region: 'European Union',
    category: 'Privacy',
    icon: '🇪🇺',
    color: 'bg-blue-600',
    businessImpact: {
      penaltyAmount: '20,000,000',
      penaltyCurrency: 'EUR',
      businessBenefits: ['EU market access', 'Enhanced data protection', 'Global compliance standard'],
      marketAccess: ['EU market access', 'International partnerships'],
      competitiveAdvantages: ['Gold standard compliance', 'Global recognition', 'Enhanced trust']
    },
    tasks: [
      {
        id: 'gdpr1',
        title: 'Data Protection Impact Assessment',
        description: 'Conduct DPIA for high-risk processing activities',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-03-01',
        estimatedHours: 24,
        category: 'Assessment',
        completed: false
      }
    ],
    complianceDeadline: '2024-12-31',
    priority: 'high',
    riskLevel: 'critical',
    type: 'Other',
    requirements: 99
  },
  {
    id: '14',
    name: 'ISO 27701',
    description: 'ISO/IEC 27701 - Privacy Information Management System. International standard for privacy information management.',
    status: 'active',
    compliance: 27.1,
    controls: 134,
    lastUpdated: '2024-01-01',
    region: 'International',
    category: 'Privacy',
    icon: '🌍',
    color: 'bg-green-600',
    businessImpact: {
      penaltyAmount: 'N/A',
      penaltyCurrency: 'Certification',
      businessBenefits: ['International certification', 'Enhanced privacy management', 'Competitive advantage'],
      marketAccess: ['Global market access', 'Enterprise partnerships'],
      competitiveAdvantages: ['ISO certification', 'Privacy excellence', 'International recognition']
    },
    tasks: [
      {
        id: 'iso1',
        title: 'Privacy Management System Implementation',
        description: 'Implement comprehensive privacy management system',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-06-30',
        estimatedHours: 40,
        category: 'Implementation',
        completed: false
      }
    ],
    complianceDeadline: '2024-12-31',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Standards',
    requirements: 134
  },
  {
    id: '15',
    name: 'NIST Privacy Framework',
    description: 'NIST Privacy Framework - Voluntary framework for improving privacy through enterprise risk management.',
    status: 'active',
    compliance: 31.8,
    controls: 187,
    lastUpdated: '2024-01-01',
    region: 'United States',
    category: 'Privacy',
    icon: '🇺🇸',
    color: 'bg-indigo-600',
    businessImpact: {
      penaltyAmount: 'N/A',
      penaltyCurrency: 'Framework',
      businessBenefits: ['Risk management', 'Privacy best practices', 'Regulatory alignment'],
      marketAccess: ['US market access', 'Government contracts'],
      competitiveAdvantages: ['NIST alignment', 'Risk management excellence', 'Regulatory readiness']
    },
    tasks: [
      {
        id: 'nist1',
        title: 'Privacy Risk Assessment',
        description: 'Conduct comprehensive privacy risk assessment',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-05-31',
        estimatedHours: 32,
        category: 'Assessment',
        completed: false
      }
    ],
    complianceDeadline: '2024-12-31',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Standards',
    requirements: 187
  }
];

const statusConfig = {
  active: { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' },
  draft: { color: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500' },
  inactive: { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500' },
  pending: { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' }
};

export default function FrameworksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'impact' | 'timeline'>('overview');
  const [selectedFilter, setSelectedFilter] = useState<'Legal' | 'Other'>('Legal');
  const [selectedEntity, setSelectedEntity] = useState<string>('Entity 2');
  const [activeFrameworkTab, setActiveFrameworkTab] = useState<'active' | 'library'>('library');
  const [activeFrameworks, setActiveFrameworks] = useState<string[]>(['1']); // Kenya is default active

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || framework.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || framework.status === selectedStatus;
    
    // Apply different filters based on tab
    let matchesFilter = true;
    if (activeFrameworkTab === 'active') {
      // In active tab, only show frameworks that are in activeFrameworks array
      matchesFilter = activeFrameworks.includes(framework.id);
    } else {
      // In library tab, apply Legal/Other filter
      matchesFilter = selectedFilter === 'Legal' ? 
        (framework.type === 'Legal') : 
        (framework.type === 'Other' || framework.type === 'Standards');
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFilter;
  });

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 80) return 'text-green-600';
    if (compliance >= 60) return 'text-yellow-600';
    if (compliance >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getComplianceBg = (compliance: number) => {
    if (compliance >= 80) return 'bg-green-500';
    if (compliance >= 60) return 'bg-yellow-500';
    if (compliance >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTaskStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'in-progress': return 'text-blue-700 bg-blue-100';
      case 'overdue': return 'text-red-700 bg-red-100';
      case 'pending': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const toggleTaskCompletion = (frameworkId: string, taskId: string) => {
    // This would typically update the backend
    console.log(`Toggling task ${taskId} for framework ${frameworkId}`);
  };

  const addFrameworkToActive = (frameworkId: string) => {
    if (!activeFrameworks.includes(frameworkId)) {
      setActiveFrameworks([...activeFrameworks, frameworkId]);
      // Show success feedback (you could add a toast notification here)
      console.log(`Framework ${frameworkId} added to active frameworks`);
    }
  };

  const removeFrameworkFromActive = (frameworkId: string) => {
    setActiveFrameworks(activeFrameworks.filter(id => id !== frameworkId));
  };

  const isFrameworkActive = (frameworkId: string) => {
    return activeFrameworks.includes(frameworkId);
  };

  // Get frameworks based on current tab
  const getDisplayFrameworks = () => {
    if (activeFrameworkTab === 'active') {
      return frameworks.filter(framework => activeFrameworks.includes(framework.id));
    }
    return frameworks;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section with Hlola Gradient */}
        <div className="bg-hlola-gradient-strong px-6 py-8 rounded-3xl mx-4 mt-4">
          <div className="max-w-7xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.581 9.67-8.5 11.317C4.581 16.67 1 12.225 1 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Privacy Hub</h1>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white/90 backdrop-blur-sm">
                      &gt; Frameworks
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">4</span>
                  </div>
                </div>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <button className="glass-button text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manage Frameworks
                </button>
              </div>
            </div>

            {/* Entity Selection - Subtle */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-sm text-white/80">Entity:</span>
              </div>
              <div className="relative">
                <select 
                  className="px-3 py-2 pr-8 rounded-lg glass-input text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[140px] appearance-none"
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                >
                  <option value="Test Entity" className="text-gray-900">Test Entity</option>
                  <option value="Entity 2" className="text-gray-900">Entity 2</option>
                  <option value="Entity 3" className="text-gray-900">Entity 3</option>
                </select>
                <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button className="text-white/80 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search frameworks..."
                  className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedFilter('Legal')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'Legal'
                      ? 'bg-white/25 text-white backdrop-blur-sm'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Legal
                </button>
                <button
                  onClick={() => setSelectedFilter('Other')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'Other'
                      ? 'bg-white/25 text-white backdrop-blur-sm'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Other
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Privacy Frameworks Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Frameworks</h2>
            </div>
            
            {/* Framework Tabs */}
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveFrameworkTab('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFrameworkTab === 'active'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Active Frameworks
              </button>
              <button
                onClick={() => setActiveFrameworkTab('library')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFrameworkTab === 'library'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Frameworks Library
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-center">
                Browse the frameworks library to find and implement privacy frameworks.
              </p>
            </div>

            {/* Framework Category Filters - Only show in Library tab */}
            {activeFrameworkTab === 'library' && (
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setSelectedFilter('Legal')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'Legal'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  African Legal Frameworks
                </button>
                <button
                  onClick={() => setSelectedFilter('Other')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'Other'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Other Frameworks
                </button>
              </div>
            )}

            {/* Conditional Content: Grid or Detail View */}
            {!selectedFramework ? (
              /* Frameworks Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFrameworks.map((framework) => (
              <div
                key={framework.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{framework.icon}</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        framework.type === 'Legal' ? 'text-blue-600 bg-blue-100' :
                        framework.type === 'Standards' ? 'text-blue-600 bg-blue-100' :
                        'text-gray-600 bg-gray-100'
                      }`}>
                        {framework.type}
                      </span>
                      {activeFrameworkTab === 'library' && isFrameworkActive(framework.id) && (
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-3">{framework.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance</span>
                      <span className="text-sm font-semibold text-red-600">{framework.compliance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${framework.compliance}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Requirements {framework.requirements}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setSelectedFramework(framework)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    {activeFrameworkTab === 'library' && (
                      isFrameworkActive(framework.id) ? (
                        <button 
                          disabled
                          className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center cursor-not-allowed"
                          title="Already Added to Active Frameworks"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      ) : (
                        <button 
                          onClick={() => addFrameworkToActive(framework.id)}
                          className="w-10 h-10 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                          title="Add to Active Frameworks"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
              </div>
            ) : (
          /* Embedded Detail View */
          <div className="bg-white rounded-xl shadow-sm border">
            {/* Header with Back Button */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedFramework(null)}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Back to frameworks"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className={`w-12 h-12 ${selectedFramework.color} rounded-xl flex items-center justify-center text-white text-xl mr-4`}>
                    {selectedFramework.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedFramework.name}</h2>
                    <p className="text-gray-600">{selectedFramework.region}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedFramework.riskLevel)}`}>
                        {selectedFramework.riskLevel.toUpperCase()} RISK
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedFramework.priority)}`}>
                        {selectedFramework.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'tasks', label: 'Tasks', icon: '✅' },
                  { id: 'impact', label: 'Impact', icon: '💰' },
                  { id: 'timeline', label: 'Timeline', icon: '📅' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-[#26558e] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Compliance Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getComplianceColor(selectedFramework.compliance)} mb-2`}>
                          {selectedFramework.compliance}%
                        </div>
                        <div className="text-sm text-gray-600">Overall Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getComplianceBg(selectedFramework.compliance)}`}
                            style={{ width: `${selectedFramework.compliance}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">{selectedFramework.controls}</div>
                        <div className="text-sm text-gray-600">Total Controls</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {selectedFramework.tasks.filter(t => t.completed).length}
                        </div>
                        <div className="text-sm text-gray-600">Tasks Completed</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Framework</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedFramework.description}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Compliance Deadline</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedFramework.complianceDeadline === 'TBD' ? 'TBD' : formatDate(selectedFramework.complianceDeadline)}
                      </div>
                      <div className="text-sm text-gray-600">Last Updated: {formatDate(selectedFramework.lastUpdated)}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Estimated Effort</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedFramework.tasks.reduce((sum, task) => sum + task.estimatedHours, 0)} hours
                      </div>
                      <div className="text-sm text-gray-600">Total estimated time to complete</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Compliance Tasks</h3>
                    <div className="text-sm text-gray-600">
                      {selectedFramework.tasks.filter(t => t.completed).length} of {selectedFramework.tasks.length} completed
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedFramework.tasks.map((task) => (
                      <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(selectedFramework.id, task.id)}
                                className="w-5 h-5 text-[#26558e] border-gray-300 rounded focus:ring-[#26558e]"
                              />
                              <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {task.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                                {task.status.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{task.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Due: {formatDate(task.dueDate)}</span>
                              <span>•</span>
                              <span>{task.estimatedHours}h estimated</span>
                              <span>•</span>
                              <span className="px-2 py-1 bg-gray-100 rounded-md">{task.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'impact' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Business Impact Analysis</h3>
                  
                  {/* Penalty Information */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-red-900">Non-Compliance Penalties</h4>
                    </div>
                    <div className="text-3xl font-bold text-red-900 mb-2">
                      {selectedFramework.businessImpact.penaltyAmount} {selectedFramework.businessImpact.penaltyCurrency}
                    </div>
                    <p className="text-red-700">Maximum penalty for non-compliance with {selectedFramework.name} data protection requirements</p>
                  </div>

                  {/* Business Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Business Benefits</h4>
                      <ul className="space-y-2">
                        {selectedFramework.businessImpact.businessBenefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-green-700">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Market Access</h4>
                      <ul className="space-y-2">
                        {selectedFramework.businessImpact.marketAccess.map((access, index) => (
                          <li key={index} className="flex items-center gap-2 text-blue-700">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {access}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <h4 className="font-semibold text-purple-900 mb-3">Competitive Advantages</h4>
                      <ul className="space-y-2">
                        {selectedFramework.businessImpact.competitiveAdvantages.map((advantage, index) => (
                          <li key={index} className="flex items-center gap-2 text-purple-700">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Compliance Timeline</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="space-y-4">
                      {selectedFramework.tasks
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map((task, index) => (
                          <div key={task.id} className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {task.title}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                                  {task.status.replace('-', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <div className="text-sm text-gray-500 mt-1">
                                Due: {formatDate(task.dueDate)} • {task.estimatedHours}h estimated
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-[#26558e] text-white px-6 py-3 rounded-lg hover:bg-[#1e4470] transition-colors font-medium">
                  Start Compliance Process
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Generate Report
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Get Help
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedFramework && filteredFrameworks.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeFrameworkTab === 'active' ? 'No active frameworks' : 'No frameworks found'}
            </h3>
            <p className="text-gray-600">
              {activeFrameworkTab === 'active' 
                ? 'Add frameworks from the library to get started with compliance.' 
                : 'Try adjusting your search or filters to find frameworks.'
              }
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
