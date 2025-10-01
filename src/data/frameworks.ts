import { Framework, ControlDetail } from '../types/frameworks';

export const frameworks: Framework[] = [
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

export const controlDetails: Record<string, ControlDetail> = {
  'DZA-001': {
    id: 'DZA-001',
    title: 'Data Protection Principles',
    subtitle: 'Lawful Basis for Processing',
    article: 'Art. 6',
    description: 'Organizations must establish and document lawful basis for all personal data processing activities',
    detailedDescription: 'This control requires organizations to identify and document the legal basis for processing personal data. The lawful bases include consent, contract performance, legal obligation, vital interests, public task, and legitimate interests. Organizations must maintain records of the lawful basis for each processing activity and be able to demonstrate compliance.',
    requirements: [
      'Identify the lawful basis for each processing activity',
      'Document the lawful basis in privacy notices',
      'Maintain records of lawful basis decisions',
      'Review and update lawful basis regularly',
      'Ensure data subjects are informed of the lawful basis'
    ],
    implementation: [
      'Conduct a data mapping exercise to identify all processing activities',
      'Assess each processing activity against the six lawful bases',
      'Document the chosen lawful basis with justification',
      'Update privacy notices to include lawful basis information',
      'Implement regular review processes for lawful basis decisions'
    ],
    compliance: {
      status: 'In Progress',
      progress: 65,
      lastUpdated: '2024-01-15',
      nextReview: '2024-04-15'
    },
    evidence: [
      'Data Processing Impact Assessment (DPIA)',
      'Privacy Policy Documentation',
      'Lawful Basis Decision Records',
      'Data Subject Consent Forms',
      'Processing Activity Register'
    ]
  },
  'DZA-002': {
    id: 'DZA-002',
    title: 'Data Subject Rights',
    subtitle: 'Right to Access',
    article: 'Art. 15',
    description: 'Organizations must provide data subjects with access to their personal data upon request',
    detailedDescription: 'This control ensures that data subjects can obtain confirmation of whether their personal data is being processed, access to their personal data, and information about the processing activities. Organizations must respond to access requests within one month and provide the information in a commonly used electronic format.',
    requirements: [
      'Establish procedures for handling data subject access requests',
      'Verify the identity of the data subject making the request',
      'Provide comprehensive information about data processing',
      'Respond to requests within the specified timeframe',
      'Maintain records of access requests and responses'
    ],
    implementation: [
      'Create a dedicated data subject rights portal',
      'Implement identity verification procedures',
      'Develop automated response systems where possible',
      'Train staff on handling access requests',
      'Establish escalation procedures for complex requests'
    ],
    compliance: {
      status: 'Not Started',
      progress: 20,
      lastUpdated: '2024-01-10',
      nextReview: '2024-03-10'
    },
    evidence: [
      'Data Subject Rights Policy',
      'Access Request Handling Procedures',
      'Identity Verification Documentation',
      'Response Templates and Forms',
      'Training Records for Staff'
    ]
  }
};
