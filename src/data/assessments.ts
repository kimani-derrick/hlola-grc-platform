import {
  PrivacyImpactAssessment,
  DataSubjectRightsAssessment,
  VendorPrivacyAssessment,
  BreachRiskAssessment,
  PrivacyMaturityAssessment,
  AssessmentTemplate,
  AssessmentStats,
  AssessmentStatus,
  AssessmentType,
  RiskFactor,
  MitigationMeasure,
  StakeholderReview,
  ProcessingStep,
  BusinessImpact,
  TechnicalImpact,
  MaturityDimension,
  BenchmarkComparison,
  ImprovementTarget
} from '../types/assessments';

// Privacy Impact Assessments
export const privacyImpactAssessments: PrivacyImpactAssessment[] = [
  {
    id: 'pia1',
    title: 'Customer Database Processing - Marketing Campaigns',
    type: 'pia',
    status: 'completed',
    framework: 'EU GDPR',
    frameworkIcon: '🇪🇺',
    createdDate: '2024-01-10',
    lastModified: '2024-01-15',
    dueDate: '2024-01-20',
    assignedTo: 'Privacy Officer',
    priority: 'high',
    description: 'Assessment of privacy risks for customer data processing in marketing campaigns',
    tags: ['marketing', 'customer-data', 'consent'],
    processingActivity: 'Marketing campaign personalization using customer purchase history and preferences',
    dataCategories: ['Contact Information', 'Purchase History', 'Behavioral Data', 'Preferences'],
    dataSubjects: ['Existing Customers', 'Prospects', 'Newsletter Subscribers'],
    legalBasis: 'Consent (Article 6(1)(a))',
    retentionPeriod: '3 years from last interaction',
    dataSharing: true,
    crossBorderTransfer: true,
    riskScore: 6.5,
    riskFactors: [
      {
        id: 'rf1',
        factor: 'Large-scale processing',
        description: 'Processing personal data of 50,000+ individuals',
        likelihood: 'high',
        impact: 'medium',
        riskScore: 6,
        mitigation: 'Implement data minimization and purpose limitation',
        residualRisk: 'low'
      },
      {
        id: 'rf2',
        factor: 'Cross-border data transfer',
        description: 'Data transferred to third-party marketing platform in US',
        likelihood: 'medium',
        impact: 'high',
        riskScore: 7,
        mitigation: 'Standard Contractual Clauses and adequacy decision',
        residualRisk: 'low'
      }
    ],
    mitigationMeasures: [
      {
        id: 'mm1',
        measure: 'Data minimization',
        description: 'Only collect necessary data for campaign personalization',
        implementationStatus: 'completed',
        effectiveness: 'high',
        cost: 'low',
        timeline: '1 week',
        responsible: 'Data Team'
      },
      {
        id: 'mm2',
        measure: 'Consent management system',
        description: 'Implement granular consent collection and management',
        implementationStatus: 'in-progress',
        effectiveness: 'high',
        cost: 'medium',
        timeline: '4 weeks',
        responsible: 'Tech Team'
      }
    ],
    stakeholderReview: [
      {
        id: 'sr1',
        stakeholder: 'Legal Team',
        role: 'Legal Review',
        reviewDate: '2024-01-12',
        comments: 'Legal basis is appropriate, ensure consent is freely given',
        approval: 'approved',
        recommendations: ['Review consent language', 'Update privacy notice']
      },
      {
        id: 'sr2',
        stakeholder: 'Data Protection Officer',
        role: 'DPO Review',
        reviewDate: '2024-01-14',
        comments: 'Risk assessment is comprehensive, mitigation measures are adequate',
        approval: 'approved',
        recommendations: ['Monitor implementation', 'Regular review required']
      }
    ],
    approvalStatus: 'approved',
    approvedBy: 'Data Protection Officer',
    approvedDate: '2024-01-15',
    nextReviewDate: '2024-07-15'
  },
  {
    id: 'pia2',
    title: 'Employee Health Data - Wellness Program',
    type: 'pia',
    status: 'in-progress',
    framework: 'Kenya Data Protection Act 2019',
    frameworkIcon: '🇰🇪',
    createdDate: '2024-01-20',
    lastModified: '2024-01-25',
    dueDate: '2024-02-05',
    assignedTo: 'HR Team',
    priority: 'high',
    description: 'Assessment of health data processing for employee wellness initiatives',
    tags: ['health-data', 'employees', 'wellness'],
    processingActivity: 'Collection and analysis of employee health data for wellness program',
    dataCategories: ['Health Information', 'Biometric Data', 'Fitness Data', 'Medical Records'],
    dataSubjects: ['Employees', 'Dependents'],
    legalBasis: 'Vital interests (Article 6(1)(d)) and Consent',
    retentionPeriod: '5 years from employment termination',
    dataSharing: false,
    crossBorderTransfer: false,
    riskScore: 8.2,
    riskFactors: [
      {
        id: 'rf3',
        factor: 'Special category data',
        description: 'Processing health data requires additional safeguards',
        likelihood: 'high',
        impact: 'high',
        riskScore: 9,
        mitigation: 'Explicit consent and additional technical safeguards',
        residualRisk: 'medium'
      }
    ],
    mitigationMeasures: [
      {
        id: 'mm3',
        measure: 'Explicit consent',
        description: 'Obtain explicit consent for health data processing',
        implementationStatus: 'in-progress',
        effectiveness: 'high',
        cost: 'low',
        timeline: '2 weeks',
        responsible: 'HR Team'
      }
    ],
    stakeholderReview: [],
    approvalStatus: 'pending',
    nextReviewDate: '2024-08-20'
  }
];

// Data Subject Rights Assessments
export const dataSubjectRightsAssessments: DataSubjectRightsAssessment[] = [
  {
    id: 'dsr1',
    title: 'Data Access Request - Customer #12345',
    type: 'dsr',
    status: 'completed',
    framework: 'EU GDPR',
    frameworkIcon: '🇪🇺',
    createdDate: '2024-01-15',
    lastModified: '2024-01-18',
    dueDate: '2024-01-29',
    assignedTo: 'DSR Team',
    priority: 'high',
    description: 'Customer request for access to all personal data held',
    tags: ['access-request', 'customer', 'urgent'],
    requestType: 'access',
    dataSubject: 'john.doe@email.com',
    requestDate: '2024-01-15',
    responseDeadline: '2024-01-29',
    complexity: 'moderate',
    dataVolume: 'medium',
    verificationRequired: true,
    thirdPartyInvolved: true,
    processingSteps: [
      {
        id: 'ps1',
        step: 'Identity verification',
        description: 'Verify customer identity using provided documents',
        responsible: 'DSR Team',
        status: 'completed',
        completedDate: '2024-01-16',
        notes: 'Identity verified via email and phone'
      },
      {
        id: 'ps2',
        step: 'Data collection',
        description: 'Collect all personal data from various systems',
        responsible: 'Data Team',
        status: 'completed',
        completedDate: '2024-01-17',
        notes: 'Data collected from CRM, marketing, and support systems'
      },
      {
        id: 'ps3',
        step: 'Data review',
        description: 'Review collected data for accuracy and completeness',
        responsible: 'Privacy Officer',
        status: 'completed',
        completedDate: '2024-01-18',
        notes: 'All data reviewed and formatted for customer'
      }
    ],
    responseTime: 72, // 3 days
    resolutionStatus: 'completed',
    satisfactionScore: 4.5,
    followUpRequired: false
  },
  {
    id: 'dsr2',
    title: 'Data Erasure Request - Former Employee',
    type: 'dsr',
    status: 'in-progress',
    framework: 'Kenya Data Protection Act 2019',
    frameworkIcon: '🇰🇪',
    createdDate: '2024-01-22',
    lastModified: '2024-01-25',
    dueDate: '2024-02-05',
    assignedTo: 'HR Team',
    priority: 'medium',
    description: 'Former employee requesting deletion of personal data',
    tags: ['erasure', 'employee', 'hr'],
    requestType: 'erasure',
    dataSubject: 'former.employee@company.com',
    requestDate: '2024-01-22',
    responseDeadline: '2024-02-05',
    complexity: 'complex',
    dataVolume: 'large',
    verificationRequired: true,
    thirdPartyInvolved: true,
    processingSteps: [
      {
        id: 'ps4',
        step: 'Legal basis review',
        description: 'Review legal basis for data retention',
        responsible: 'Legal Team',
        status: 'in-progress',
        notes: 'Checking employment law requirements'
      }
    ],
    responseTime: 0,
    resolutionStatus: 'in-progress',
    followUpRequired: true
  }
];

// Vendor Privacy Assessments
export const vendorPrivacyAssessments: VendorPrivacyAssessment[] = [
  {
    id: 'vpa1',
    title: 'Cloud Storage Provider Assessment',
    type: 'vendor',
    status: 'completed',
    framework: 'EU GDPR',
    frameworkIcon: '🇪🇺',
    createdDate: '2024-01-05',
    lastModified: '2024-01-10',
    assignedTo: 'Procurement Team',
    priority: 'high',
    description: 'Assessment of cloud storage provider for data processing compliance',
    tags: ['cloud', 'storage', 'infrastructure'],
    vendorName: 'CloudTech Solutions Ltd',
    vendorType: 'processor',
    serviceDescription: 'Cloud storage and backup services for customer data',
    dataCategories: ['Customer Data', 'Transaction Data', 'Support Data'],
    dataProcessingPurposes: ['Storage', 'Backup', 'Disaster Recovery'],
    dataSharingScope: 'internal',
    dpaStatus: 'signed',
    dpaExpiryDate: '2025-01-05',
    certificationStatus: 'certified',
    certifications: ['ISO 27001', 'SOC 2 Type II', 'GDPR Compliant'],
    riskScore: 4.2,
    riskFactors: [
      {
        id: 'rf4',
        factor: 'Data location',
        description: 'Data stored in multiple geographic locations',
        likelihood: 'medium',
        impact: 'medium',
        riskScore: 4,
        mitigation: 'Data residency controls and encryption',
        residualRisk: 'low'
      }
    ],
    complianceScore: 85,
    lastAuditDate: '2023-12-15',
    nextAuditDate: '2024-06-15',
    contractValue: 50000,
    contractCurrency: 'USD',
    terminationClause: true,
    dataReturnClause: true,
    breachNotificationClause: true
  },
  {
    id: 'vpa2',
    title: 'Marketing Automation Platform Assessment',
    type: 'vendor',
    status: 'in-progress',
    framework: 'EU GDPR',
    frameworkIcon: '🇪🇺',
    createdDate: '2024-01-18',
    lastModified: '2024-01-25',
    assignedTo: 'Marketing Team',
    priority: 'medium',
    description: 'Assessment of marketing automation platform for customer data processing',
    tags: ['marketing', 'automation', 'customer-data'],
    vendorName: 'MarketPro Inc',
    vendorType: 'processor',
    serviceDescription: 'Email marketing and customer segmentation platform',
    dataCategories: ['Email Addresses', 'Behavioral Data', 'Preferences'],
    dataProcessingPurposes: ['Marketing', 'Analytics', 'Personalization'],
    dataSharingScope: 'external',
    dpaStatus: 'pending',
    certificationStatus: 'not-certified',
    certifications: [],
    riskScore: 6.8,
    riskFactors: [
      {
        id: 'rf5',
        factor: 'Data processing scope',
        description: 'Broad access to customer data for personalization',
        likelihood: 'high',
        impact: 'medium',
        riskScore: 7,
        mitigation: 'Data minimization and access controls',
        residualRisk: 'medium'
      }
    ],
    complianceScore: 65,
    lastAuditDate: '2023-10-20',
    nextAuditDate: '2024-04-20',
    contractValue: 25000,
    contractCurrency: 'USD',
    terminationClause: true,
    dataReturnClause: true,
    breachNotificationClause: true
  }
];

// Breach Risk Assessments
export const breachRiskAssessments: BreachRiskAssessment[] = [
  {
    id: 'bra1',
    title: 'Customer Database Breach Scenario',
    type: 'breach-risk',
    status: 'completed',
    framework: 'EU GDPR',
    frameworkIcon: '🇪🇺',
    createdDate: '2024-01-12',
    lastModified: '2024-01-15',
    assignedTo: 'Security Team',
    priority: 'critical',
    description: 'Assessment of potential customer database breach impact and response',
    tags: ['breach', 'customer-data', 'security'],
    breachScenario: 'Unauthorized access to customer database through SQL injection',
    likelihood: 'medium',
    impact: 'high',
    riskScore: 7.5,
    dataCategories: ['Personal Information', 'Financial Data', 'Contact Details'],
    affectedDataSubjects: 50000,
    notificationRequired: true,
    notificationDeadline: '2024-01-15',
    regulatoryNotification: true,
    affectedRegulators: ['ICO (UK)', 'CNIL (France)', 'DPC (Ireland)'],
    businessImpact: {
      financial: 8,
      operational: 7,
      reputational: 9,
      regulatory: 8,
      total: 8
    },
    technicalImpact: {
      dataIntegrity: 'high',
      systemAvailability: 'medium',
      dataConfidentiality: 'high',
      systemPerformance: 'low',
      total: 'high'
    },
    containmentMeasures: [
      'Immediate system isolation',
      'Password reset for all affected accounts',
      'Database access review and restriction',
      'Security patch deployment'
    ],
    recoveryTime: 24,
    lessonsLearned: [
      'Need for regular security testing',
      'Improved access monitoring required',
      'Staff training on security protocols'
    ],
    preventionMeasures: [
      'Implement Web Application Firewall',
      'Regular penetration testing',
      'Enhanced monitoring and alerting',
      'Security awareness training'
    ]
  }
];

// Privacy Maturity Assessments
export const privacyMaturityAssessments: PrivacyMaturityAssessment[] = [
  {
    id: 'pma1',
    title: 'Q4 2023 Privacy Program Maturity Assessment',
    type: 'maturity',
    status: 'completed',
    framework: 'All Frameworks',
    frameworkIcon: '🌐',
    createdDate: '2024-01-01',
    lastModified: '2024-01-05',
    assignedTo: 'Privacy Officer',
    priority: 'high',
    description: 'Comprehensive assessment of privacy program maturity across all dimensions',
    tags: ['maturity', 'program', 'comprehensive'],
    assessmentPeriod: 'Q4 2023',
    overallMaturity: 'defined',
    maturityScore: 72,
    dimensions: [
      {
        dimension: 'Governance',
        currentLevel: 'defined',
        targetLevel: 'quantified',
        score: 75,
        description: 'Privacy governance structure and accountability',
        keyPractices: [
          'Privacy policy established',
          'DPO appointed',
          'Privacy committee formed',
          'Regular privacy reviews'
        ],
        gaps: [
          'Metrics not fully defined',
          'ROI measurement needed'
        ],
        recommendations: [
          'Implement privacy metrics dashboard',
          'Develop ROI measurement framework'
        ]
      },
      {
        dimension: 'Risk Management',
        currentLevel: 'managed',
        targetLevel: 'defined',
        score: 68,
        description: 'Privacy risk identification and mitigation',
        keyPractices: [
          'Risk register maintained',
          'Regular risk assessments',
          'Mitigation plans in place'
        ],
        gaps: [
          'Risk appetite not defined',
          'Risk monitoring automated'
        ],
        recommendations: [
          'Define privacy risk appetite',
          'Implement automated risk monitoring'
        ]
      },
      {
        dimension: 'Data Management',
        currentLevel: 'defined',
        targetLevel: 'quantified',
        score: 78,
        description: 'Data inventory and lifecycle management',
        keyPractices: [
          'Data inventory complete',
          'Data classification in place',
          'Retention schedules defined'
        ],
        gaps: [
          'Data quality metrics needed',
          'Automated data discovery'
        ],
        recommendations: [
          'Implement data quality metrics',
          'Deploy automated data discovery tools'
        ]
      }
    ],
    benchmarkComparison: {
      industry: 65,
      peers: 70,
      bestPractice: 85,
      regulatory: 75,
      overall: 72
    },
    strengths: [
      'Strong governance structure',
      'Comprehensive data inventory',
      'Active DPO engagement',
      'Regular training program'
    ],
    weaknesses: [
      'Limited metrics and measurement',
      'Manual processes in some areas',
      'Third-party risk management needs improvement'
    ],
    recommendations: [
      'Implement privacy metrics dashboard',
      'Automate manual processes',
      'Enhance vendor risk management',
      'Develop privacy by design methodology'
    ],
    nextAssessmentDate: '2024-04-01',
    improvementTargets: [
      {
        id: 'it1',
        target: 'Implement privacy metrics dashboard',
        description: 'Deploy comprehensive privacy metrics and reporting',
        priority: 'high',
        targetDate: '2024-03-31',
        responsible: 'Privacy Officer',
        status: 'in-progress',
        progress: 45
      },
      {
        id: 'it2',
        target: 'Automate data discovery',
        description: 'Deploy automated tools for data discovery and classification',
        priority: 'medium',
        targetDate: '2024-06-30',
        responsible: 'Data Team',
        status: 'not-started',
        progress: 0
      }
    ],
    executiveSummary: 'Privacy program shows strong foundation with defined processes and governance. Key focus areas include metrics implementation, process automation, and enhanced vendor management to reach quantified maturity level.'
  }
];

// Assessment Templates
export const assessmentTemplates: AssessmentTemplate[] = [
  {
    id: 't1',
    name: 'GDPR PIA Template',
    type: 'pia',
    framework: 'EU GDPR',
    description: 'Standard template for GDPR Privacy Impact Assessments',
    sections: [
      {
        id: 's1',
        title: 'Processing Activity Description',
        description: 'Detailed description of the data processing activity',
        order: 1,
        required: true,
        questions: ['q1', 'q2', 'q3']
      },
      {
        id: 's2',
        title: 'Risk Assessment',
        description: 'Identification and assessment of privacy risks',
        order: 2,
        required: true,
        questions: ['q4', 'q5', 'q6']
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What personal data will be processed?',
        type: 'text',
        required: true,
        scoring: {
          method: 'weighted',
          maxScore: 10
        }
      },
      {
        id: 'q2',
        question: 'What is the legal basis for processing?',
        type: 'multiple-choice',
        required: true,
        options: ['Consent', 'Contract', 'Legal obligation', 'Vital interests', 'Public task', 'Legitimate interests'],
        scoring: {
          method: 'points',
          maxScore: 10
        }
      }
    ],
    scoringMethod: 'weighted',
    approvalRequired: true,
    reviewCycle: 12,
    isDefault: true,
    createdBy: 'Privacy Officer',
    createdDate: '2024-01-01',
    lastModified: '2024-01-01',
    version: '1.0'
  }
];

// Assessment Statistics
export function calculateAssessmentStats(): AssessmentStats {
  const allAssessments = [
    ...privacyImpactAssessments,
    ...dataSubjectRightsAssessments,
    ...vendorPrivacyAssessments,
    ...breachRiskAssessments,
    ...privacyMaturityAssessments
  ];

  const byStatus = allAssessments.reduce((acc, assessment) => {
    acc[assessment.status] = (acc[assessment.status] || 0) + 1;
    return acc;
  }, {} as { [key in AssessmentStatus]: number });

  const byType = allAssessments.reduce((acc, assessment) => {
    acc[assessment.type] = (acc[assessment.type] || 0) + 1;
    return acc;
  }, {} as { [key in AssessmentType]: number });

  const byPriority = allAssessments.reduce((acc, assessment) => {
    acc[assessment.priority] = (acc[assessment.priority] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const now = new Date();
  const overdue = allAssessments.filter(a => 
    a.dueDate && new Date(a.dueDate) < now && a.status !== 'completed'
  ).length;

  const dueThisWeek = allAssessments.filter(a => {
    if (!a.dueDate) return false;
    const dueDate = new Date(a.dueDate);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= now && dueDate <= weekFromNow;
  }).length;

  const completedThisMonth = allAssessments.filter(a => {
    if (a.status !== 'completed') return false;
    const completedDate = new Date(a.lastModified);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return completedDate >= monthAgo;
  }).length;

  return {
    total: allAssessments.length,
    byStatus,
    byType,
    byPriority,
    overdue,
    dueThisWeek,
    completedThisMonth,
    averageCompletionTime: 14 // Mock data
  };
}
