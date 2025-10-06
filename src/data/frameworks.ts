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
      },
      {
        id: 'g3',
        title: 'Data Subject Rights Implementation',
        description: 'Implement procedures for handling data subject requests',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-03-31',
        estimatedHours: 12,
        category: 'Rights Management',
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
  },
  {
    id: '16',
    name: 'Senegal',
    description: 'Loi sur la Protection des Données Personnelles 2016 - Essential for Senegalese businesses. Build trust in West African markets.',
    status: 'active',
    compliance: 58,
    controls: 28,
    lastUpdated: '2024-01-20',
    region: 'Senegal',
    category: 'Privacy',
    icon: '🇸🇳',
    color: 'bg-green-500',
    businessImpact: {
      penaltyAmount: '100,000,000',
      penaltyCurrency: 'XOF',
      businessBenefits: ['West African market access', 'Enhanced credibility', 'Customer trust'],
      marketAccess: ['WAEMU market access', 'Government contracts', 'Financial services'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Reduced risks']
    },
    tasks: [
      {
        id: 'sn1',
        title: 'Data Protection Authority Registration',
        description: 'Register with Commission de Protection des Données Personnelles',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-03-31',
        estimatedHours: 6,
        category: 'Registration',
        completed: false
      }
    ],
    complianceDeadline: '2024-08-31',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '17',
    name: 'Ivory Coast',
    description: 'Loi sur la Protection des Données Personnelles 2013 - Required for Ivorian operations. Access West African markets confidently.',
    status: 'active',
    compliance: 45,
    controls: 26,
    lastUpdated: '2024-01-18',
    region: 'Ivory Coast',
    category: 'Privacy',
    icon: '🇨🇮',
    color: 'bg-orange-500',
    businessImpact: {
      penaltyAmount: '50,000,000',
      penaltyCurrency: 'XOF',
      businessBenefits: ['WAEMU compliance', 'Market credibility', 'Customer protection'],
      marketAccess: ['West African market', 'Government partnerships', 'Financial sector'],
      competitiveAdvantages: ['Regional advantage', 'Compliance readiness', 'Risk mitigation']
    },
    tasks: [
      {
        id: 'ci1',
        title: 'Data Processing Inventory',
        description: 'Create comprehensive inventory of data processing activities',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-04-15',
        estimatedHours: 12,
        category: 'Documentation',
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
    id: '18',
    name: 'Burkina Faso',
    description: 'Loi sur la Protection des Données Personnelles 2004 - Essential for Burkinabé businesses. Strengthen data governance.',
    status: 'active',
    compliance: 38,
    controls: 24,
    lastUpdated: '2024-01-16',
    region: 'Burkina Faso',
    category: 'Privacy',
    icon: '🇧🇫',
    color: 'bg-yellow-600',
    businessImpact: {
      penaltyAmount: '25,000,000',
      penaltyCurrency: 'XOF',
      businessBenefits: ['Data governance', 'Customer trust', 'Market access'],
      marketAccess: ['WAEMU market', 'Government contracts', 'Local partnerships'],
      competitiveAdvantages: ['Early compliance', 'Risk reduction', 'Professional image']
    },
    tasks: [
      {
        id: 'bf1',
        title: 'Privacy Policy Development',
        description: 'Develop comprehensive privacy policy for DPA compliance',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-05-31',
        estimatedHours: 8,
        category: 'Documentation',
        completed: false
      }
    ],
    complianceDeadline: '2024-10-31',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '19',
    name: 'Mali',
    description: 'Loi sur la Protection des Données Personnelles 2013 - Required for Malian businesses. Build trust in Sahel region.',
    status: 'active',
    compliance: 42,
    controls: 25,
    lastUpdated: '2024-01-14',
    region: 'Mali',
    category: 'Privacy',
    icon: '🇲🇱',
    color: 'bg-red-500',
    businessImpact: {
      penaltyAmount: '30,000,000',
      penaltyCurrency: 'XOF',
      businessBenefits: ['Sahel region access', 'Customer confidence', 'Compliance advantage'],
      marketAccess: ['WAEMU market', 'Government contracts', 'Regional partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Risk mitigation']
    },
    tasks: [
      {
        id: 'ml1',
        title: 'Data Security Implementation',
        description: 'Implement technical and organizational security measures',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-06-30',
        estimatedHours: 16,
        category: 'Security',
        completed: false
      }
    ],
    complianceDeadline: '2024-11-30',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '20',
    name: 'Niger',
    description: 'Loi sur la Protection des Données Personnelles 2017 - Essential for Nigerien operations. Enhance data protection standards.',
    status: 'active',
    compliance: 35,
    controls: 23,
    lastUpdated: '2024-01-12',
    region: 'Niger',
    category: 'Privacy',
    icon: '🇳🇪',
    color: 'bg-orange-600',
    businessImpact: {
      penaltyAmount: '20,000,000',
      penaltyCurrency: 'XOF',
      businessBenefits: ['Data protection standards', 'Customer trust', 'Market access'],
      marketAccess: ['WAEMU market', 'Government contracts', 'Local partnerships'],
      competitiveAdvantages: ['Compliance readiness', 'Risk reduction', 'Professional credibility']
    },
    tasks: [
      {
        id: 'ne1',
        title: 'Data Protection Officer Appointment',
        description: 'Appoint qualified Data Protection Officer',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-07-31',
        estimatedHours: 8,
        category: 'Governance',
        completed: false
      }
    ],
    complianceDeadline: '2024-12-31',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '21',
    name: 'Chad',
    description: 'Loi sur la Protection des Données Personnelles 2015 - Required for Chadian businesses. Strengthen data governance framework.',
    status: 'active',
    compliance: 28,
    controls: 22,
    lastUpdated: '2024-01-10',
    region: 'Chad',
    category: 'Privacy',
    icon: '🇹🇩',
    color: 'bg-blue-600',
    businessImpact: {
      penaltyAmount: '15,000,000',
      penaltyCurrency: 'XAF',
      businessBenefits: ['Data governance', 'Customer confidence', 'Compliance advantage'],
      marketAccess: ['CEMAC market', 'Government contracts', 'Regional partnerships'],
      competitiveAdvantages: ['Early compliance', 'Risk mitigation', 'Professional image']
    },
    tasks: [
      {
        id: 'td1',
        title: 'Privacy Impact Assessment',
        description: 'Conduct privacy impact assessment for high-risk processing',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-08-31',
        estimatedHours: 12,
        category: 'Assessment',
        completed: false
      }
    ],
    complianceDeadline: '2025-01-31',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '22',
    name: 'Cameroon',
    description: 'Loi sur la Protection des Données Personnelles 2010 - Essential for Cameroonian businesses. Access CEMAC markets confidently.',
    status: 'active',
    compliance: 52,
    controls: 29,
    lastUpdated: '2024-01-08',
    region: 'Cameroon',
    category: 'Privacy',
    icon: '🇨🇲',
    color: 'bg-green-600',
    businessImpact: {
      penaltyAmount: '10,000,000',
      penaltyCurrency: 'XAF',
      businessBenefits: ['CEMAC market access', 'Enhanced credibility', 'Customer trust'],
      marketAccess: ['CEMAC market', 'Government contracts', 'Financial services'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Reduced risks']
    },
    tasks: [
      {
        id: 'cm1',
        title: 'Data Processing Records',
        description: 'Maintain comprehensive data processing records',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-03-31',
        estimatedHours: 10,
        category: 'Documentation',
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
    id: '23',
    name: 'Central African Republic',
    description: 'Loi sur la Protection des Données Personnelles 2013 - Required for CAR operations. Build data protection framework.',
    status: 'active',
    compliance: 25,
    controls: 20,
    lastUpdated: '2024-01-06',
    region: 'Central African Republic',
    category: 'Privacy',
    icon: '🇨🇫',
    color: 'bg-blue-500',
    businessImpact: {
      penaltyAmount: '5,000,000',
      penaltyCurrency: 'XAF',
      businessBenefits: ['Data protection framework', 'Customer confidence', 'Market access'],
      marketAccess: ['CEMAC market', 'Government contracts', 'Local partnerships'],
      competitiveAdvantages: ['Compliance readiness', 'Risk reduction', 'Professional credibility']
    },
    tasks: [
      {
        id: 'cf1',
        title: 'Privacy Policy Implementation',
        description: 'Implement comprehensive privacy policy',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-10-31',
        estimatedHours: 8,
        category: 'Documentation',
        completed: false
      }
    ],
    complianceDeadline: '2025-02-28',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '24',
    name: 'Equatorial Guinea',
    description: 'Ley de Protección de Datos Personales 2011 - Essential for Equatorial Guinean businesses. Access CEMAC markets.',
    status: 'active',
    compliance: 48,
    controls: 27,
    lastUpdated: '2024-01-04',
    region: 'Equatorial Guinea',
    category: 'Privacy',
    icon: '🇬🇶',
    color: 'bg-red-600',
    businessImpact: {
      penaltyAmount: '8,000,000',
      penaltyCurrency: 'XAF',
      businessBenefits: ['CEMAC market access', 'Enhanced credibility', 'Customer trust'],
      marketAccess: ['CEMAC market', 'Government contracts', 'Oil sector partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Reduced risks']
    },
    tasks: [
      {
        id: 'gq1',
        title: 'Data Subject Rights Implementation',
        description: 'Implement data subject rights procedures',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-04-30',
        estimatedHours: 14,
        category: 'Rights Management',
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
    id: '25',
    name: 'Gabon',
    description: 'Loi sur la Protection des Données Personnelles 2011 - Required for Gabonese businesses. Strengthen data governance.',
    status: 'active',
    compliance: 41,
    controls: 25,
    lastUpdated: '2024-01-02',
    region: 'Gabon',
    category: 'Privacy',
    icon: '🇬🇦',
    color: 'bg-green-500',
    businessImpact: {
      penaltyAmount: '12,000,000',
      penaltyCurrency: 'XAF',
      businessBenefits: ['Data governance', 'Customer confidence', 'Market access'],
      marketAccess: ['CEMAC market', 'Government contracts', 'Oil sector partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Risk mitigation']
    },
    tasks: [
      {
        id: 'ga1',
        title: 'Data Breach Notification Procedures',
        description: 'Establish data breach notification processes',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-11-30',
        estimatedHours: 10,
        category: 'Security',
        completed: false
      }
    ],
    complianceDeadline: '2025-01-31',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '26',
    name: 'Algeria',
    description: 'Loi sur la Protection des Données Personnelles 2018 - Essential for Algerian businesses. Access North African markets confidently.',
    status: 'active',
    compliance: 44,
    controls: 31,
    lastUpdated: '2024-01-30',
    region: 'Algeria',
    category: 'Privacy',
    icon: '🇩🇿',
    color: 'bg-green-700',
    businessImpact: {
      penaltyAmount: '1,000,000',
      penaltyCurrency: 'DZD',
      businessBenefits: ['North African market access', 'Enhanced credibility', 'Customer trust'],
      marketAccess: ['Maghreb market', 'Government contracts', 'Energy sector partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Reduced risks']
    },
    tasks: [
      {
        id: 'dz1',
        title: 'Data Protection Authority Notification',
        description: 'Notify Autorité de Protection des Données Personnelles',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-04-30',
        estimatedHours: 6,
        category: 'Registration',
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
    id: '27',
    name: 'Tunisia',
    description: 'Loi sur la Protection des Données Personnelles 2004 - Required for Tunisian businesses. Build trust in North African markets.',
    status: 'active',
    compliance: 61,
    controls: 33,
    lastUpdated: '2024-01-28',
    region: 'Tunisia',
    category: 'Privacy',
    icon: '🇹🇳',
    color: 'bg-red-500',
    businessImpact: {
      penaltyAmount: '200,000',
      penaltyCurrency: 'TND',
      businessBenefits: ['North African market access', 'EU adequacy preparation', 'Enhanced credibility'],
      marketAccess: ['Maghreb market', 'EU market access', 'Government contracts'],
      competitiveAdvantages: ['EU adequacy advantage', 'Regional compliance', 'Early adoption']
    },
    tasks: [
      {
        id: 'tn1',
        title: 'Data Processing Impact Assessment',
        description: 'Conduct DPIA for high-risk processing activities',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-05-31',
        estimatedHours: 16,
        category: 'Assessment',
        completed: false
      }
    ],
    complianceDeadline: '2024-08-31',
    priority: 'high',
    riskLevel: 'high',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '28',
    name: 'Libya',
    description: 'Draft Data Protection Law - Prepare for Libya\'s emerging data protection framework. Stay ahead of regulations.',
    status: 'pending',
    compliance: 15,
    controls: 18,
    lastUpdated: '2024-01-26',
    region: 'Libya',
    category: 'Privacy',
    icon: '🇱🇾',
    color: 'bg-green-600',
    businessImpact: {
      penaltyAmount: 'TBD',
      penaltyCurrency: 'LYD',
      businessBenefits: ['Early compliance', 'Market preparation', 'Competitive advantage'],
      marketAccess: ['Future market access', 'Government readiness', 'Oil sector partnerships'],
      competitiveAdvantages: ['First-mover advantage', 'Regulatory readiness', 'Professional image']
    },
    tasks: [
      {
        id: 'ly1',
        title: 'Monitor Regulatory Updates',
        description: 'Track Libya data protection law developments',
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
    id: '29',
    name: 'Sudan',
    description: 'Draft Data Protection Law - Prepare for Sudan\'s emerging data protection framework. Build compliance readiness.',
    status: 'pending',
    compliance: 12,
    controls: 16,
    lastUpdated: '2024-01-24',
    region: 'Sudan',
    category: 'Privacy',
    icon: '🇸🇩',
    color: 'bg-red-600',
    businessImpact: {
      penaltyAmount: 'TBD',
      penaltyCurrency: 'SDG',
      businessBenefits: ['Early compliance', 'Market preparation', 'Competitive advantage'],
      marketAccess: ['Future market access', 'Government readiness', 'Regional partnerships'],
      competitiveAdvantages: ['First-mover advantage', 'Regulatory readiness', 'Professional credibility']
    },
    tasks: [
      {
        id: 'sd1',
        title: 'Regulatory Monitoring',
        description: 'Monitor Sudan data protection law developments',
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
    id: '30',
    name: 'Zambia',
    description: 'Data Protection Act 2021 - Essential for Zambian businesses. Build trust in Southern African markets.',
    status: 'active',
    compliance: 39,
    controls: 26,
    lastUpdated: '2024-01-22',
    region: 'Zambia',
    category: 'Privacy',
    icon: '🇿🇲',
    color: 'bg-green-500',
    businessImpact: {
      penaltyAmount: '500,000',
      penaltyCurrency: 'ZMW',
      businessBenefits: ['Southern African market access', 'Enhanced credibility', 'Customer trust'],
      marketAccess: ['SADC market', 'Government contracts', 'Mining sector partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Reduced risks']
    },
    tasks: [
      {
        id: 'zm1',
        title: 'Data Protection Officer Appointment',
        description: 'Appoint qualified Data Protection Officer',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-06-30',
        estimatedHours: 8,
        category: 'Governance',
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
    id: '31',
    name: 'Zimbabwe',
    description: 'Data Protection Act 2021 - Required for Zimbabwean businesses. Strengthen data governance framework.',
    status: 'active',
    compliance: 33,
    controls: 24,
    lastUpdated: '2024-01-20',
    region: 'Zimbabwe',
    category: 'Privacy',
    icon: '🇿🇼',
    color: 'bg-yellow-500',
    businessImpact: {
      penaltyAmount: '200,000',
      penaltyCurrency: 'USD',
      businessBenefits: ['Data governance', 'Customer confidence', 'Market access'],
      marketAccess: ['SADC market', 'Government contracts', 'Mining sector partnerships'],
      competitiveAdvantages: ['Compliance readiness', 'Risk reduction', 'Professional image']
    },
    tasks: [
      {
        id: 'zw1',
        title: 'Privacy Policy Development',
        description: 'Develop comprehensive privacy policy for DPA compliance',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-07-31',
        estimatedHours: 10,
        category: 'Documentation',
        completed: false
      }
    ],
    complianceDeadline: '2024-11-30',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '32',
    name: 'Malawi',
    description: 'Data Protection Act 2021 - Essential for Malawian operations. Enhance data protection standards.',
    status: 'active',
    compliance: 29,
    controls: 22,
    lastUpdated: '2024-01-18',
    region: 'Malawi',
    category: 'Privacy',
    icon: '🇲🇼',
    color: 'bg-red-500',
    businessImpact: {
      penaltyAmount: '100,000',
      penaltyCurrency: 'MWK',
      businessBenefits: ['Data protection standards', 'Customer trust', 'Market access'],
      marketAccess: ['SADC market', 'Government contracts', 'Agricultural partnerships'],
      competitiveAdvantages: ['Compliance readiness', 'Risk reduction', 'Professional credibility']
    },
    tasks: [
      {
        id: 'mw1',
        title: 'Data Security Implementation',
        description: 'Implement technical and organizational security measures',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-08-31',
        estimatedHours: 14,
        category: 'Security',
        completed: false
      }
    ],
    complianceDeadline: '2024-12-31',
    priority: 'low',
    riskLevel: 'low',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '33',
    name: 'Mozambique',
    description: 'Lei de Proteção de Dados Pessoais 2021 - Required for Mozambican businesses. Access SADC markets confidently.',
    status: 'active',
    compliance: 36,
    controls: 25,
    lastUpdated: '2024-01-16',
    region: 'Mozambique',
    category: 'Privacy',
    icon: '🇲🇿',
    color: 'bg-green-600',
    businessImpact: {
      penaltyAmount: '150,000',
      penaltyCurrency: 'MZN',
      businessBenefits: ['SADC market access', 'Enhanced credibility', 'Customer trust'],
      marketAccess: ['SADC market', 'Government contracts', 'Energy sector partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Reduced risks']
    },
    tasks: [
      {
        id: 'mz1',
        title: 'Data Processing Records',
        description: 'Maintain comprehensive data processing records',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-05-31',
        estimatedHours: 12,
        category: 'Documentation',
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
    id: '34',
    name: 'Angola',
    description: 'Lei de Proteção de Dados Pessoais 2020 - Essential for Angolan businesses. Build trust in Southern African markets.',
    status: 'active',
    compliance: 42,
    controls: 28,
    lastUpdated: '2024-01-14',
    region: 'Angola',
    category: 'Privacy',
    icon: '🇦🇴',
    color: 'bg-red-500',
    businessImpact: {
      penaltyAmount: '300,000',
      penaltyCurrency: 'AOA',
      businessBenefits: ['Southern African market access', 'Enhanced credibility', 'Customer trust'],
      marketAccess: ['SADC market', 'Government contracts', 'Oil sector partnerships'],
      competitiveAdvantages: ['Regional compliance', 'Early adoption', 'Reduced risks']
    },
    tasks: [
      {
        id: 'ao1',
        title: 'Data Subject Rights Implementation',
        description: 'Implement data subject rights procedures',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-04-30',
        estimatedHours: 16,
        category: 'Rights Management',
        completed: false
      }
    ],
    complianceDeadline: '2024-08-31',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
  },
  {
    id: '35',
    name: 'Namibia',
    description: 'Data Protection Act 2019 - Required for Namibian businesses. Strengthen data governance framework.',
    status: 'active',
    compliance: 47,
    controls: 27,
    lastUpdated: '2024-01-12',
    region: 'Namibia',
    category: 'Privacy',
    icon: '🇳🇦',
    color: 'bg-blue-600',
    businessImpact: {
      penaltyAmount: '200,000',
      penaltyCurrency: 'NAD',
      businessBenefits: ['Data governance', 'Customer confidence', 'Market access'],
      marketAccess: ['SADC market', 'Government contracts', 'Mining sector partnerships'],
      competitiveAdvantages: ['Compliance readiness', 'Risk reduction', 'Professional image']
    },
    tasks: [
      {
        id: 'na1',
        title: 'Data Breach Notification Procedures',
        description: 'Establish data breach notification processes',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-07-31',
        estimatedHours: 10,
        category: 'Security',
        completed: false
      }
    ],
    complianceDeadline: '2024-10-31',
    priority: 'medium',
    riskLevel: 'medium',
    type: 'Legal',
    requirements: 2
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
