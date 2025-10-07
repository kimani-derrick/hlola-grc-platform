import {
  AuditReadinessScore,
  FrameworkAuditPackage,
  AuditGap,
  RegulatoryRequirement,
  EvidenceItem,
  ComplianceHistory,
  AuditReport,
  RegulatorViewMetrics,
  AuditTimeline
} from '../types/audit';

// Audit Readiness Scores
export const auditReadinessScore: AuditReadinessScore = {
  overall: 85,
  documentation: 92,
  controls: 84,
  evidence: 78,
  teamReadiness: 88,
  riskManagement: 82
};

// Framework Audit Packages
export const frameworkAuditPackages: FrameworkAuditPackage[] = [
  {
    frameworkId: '1',
    frameworkName: 'Kenya Data Protection Act 2019',
    frameworkIcon: '🇰🇪',
    region: 'Kenya',
    compliance: 87,
    auditReadiness: 90,
    lastAuditDate: '2023-09-15',
    nextAuditDate: '2024-09-15',
    controlsImplemented: 22,
    totalControls: 34,
    evidenceCollected: 38,
    totalEvidence: 45,
    documentsAvailable: 28,
    tasksCompleted: 52,
    totalTasks: 68,
    gaps: [
      {
        id: 'g1',
        category: 'evidence',
        severity: 'medium',
        title: 'Missing DPIA documentation for 3 processing activities',
        description: 'Data Protection Impact Assessments not completed for all high-risk processing',
        impact: 'May result in regulatory inquiry during audit',
        remediation: 'Complete DPIAs for remaining processing activities',
        estimatedEffort: '2 weeks',
        dueDate: '2024-03-01',
        assignedTo: 'Compliance Team',
        status: 'in-progress'
      },
      {
        id: 'g2',
        category: 'procedural',
        severity: 'low',
        title: 'Data breach simulation exercise pending',
        description: 'Annual breach response drill not yet conducted',
        impact: 'Limited impact on compliance, demonstrates preparedness',
        remediation: 'Schedule and conduct breach response simulation',
        estimatedEffort: '1 week',
        dueDate: '2024-02-28',
        assignedTo: 'Security Team',
        status: 'open'
      }
    ],
    strengths: [
      'DPO appointed with clear responsibilities',
      'Privacy policy comprehensive and publicly accessible',
      'Strong consent management system in place',
      'Regular staff training conducted',
      'Data subject rights procedures well documented'
    ],
    recommendations: [
      'Complete pending DPIA assessments',
      'Conduct regular internal audits quarterly',
      'Update data retention schedules',
      'Enhance vendor data processing agreements'
    ],
    regulatoryRequirements: [
      {
        id: 'r1',
        requirement: 'Appointment of Data Protection Officer',
        status: 'compliant',
        evidence: ['DPO Appointment Letter', 'DPO Training Certificate', 'DPO Contact Details Published'],
        notes: 'DPO appointed January 2023, registered with Commissioner'
      },
      {
        id: 'r2',
        requirement: 'Registration with Data Protection Commissioner',
        status: 'compliant',
        evidence: ['Registration Certificate', 'Annual Compliance Report'],
        notes: 'Registration valid until December 2024'
      },
      {
        id: 'r3',
        requirement: 'Data Protection Impact Assessments',
        status: 'partial',
        evidence: ['DPIA Template', 'Completed DPIAs for 8 activities'],
        notes: '3 additional DPIAs in progress'
      }
    ],
    certificationStatus: 'not-applicable'
  },
  {
    frameworkId: '2',
    frameworkName: 'Ghana Data Protection Act 2012',
    frameworkIcon: '🇬🇭',
    region: 'Ghana',
    compliance: 76,
    auditReadiness: 78,
    lastAuditDate: '2023-06-20',
    nextAuditDate: '2024-06-20',
    controlsImplemented: 18,
    totalControls: 29,
    evidenceCollected: 28,
    totalEvidence: 38,
    documentsAvailable: 22,
    tasksCompleted: 40,
    totalTasks: 58,
    gaps: [
      {
        id: 'g3',
        category: 'documentation',
        severity: 'high',
        title: 'Data processing register incomplete',
        description: 'Processing activities register missing several operations',
        impact: 'Non-compliance with transparency requirements',
        remediation: 'Complete comprehensive data processing register',
        estimatedEffort: '3 weeks',
        dueDate: '2024-02-15',
        assignedTo: 'Compliance Team',
        status: 'in-progress'
      },
      {
        id: 'g4',
        category: 'technical',
        severity: 'medium',
        title: 'Data subject access request automation needed',
        description: 'Manual DSAR process inefficient for scale',
        impact: 'Risk of delayed responses to data subject requests',
        remediation: 'Implement DSAR management system',
        estimatedEffort: '6 weeks',
        dueDate: '2024-03-31',
        assignedTo: 'Tech Team',
        status: 'open'
      }
    ],
    strengths: [
      'Strong data security controls',
      'Regular employee privacy training',
      'Clear privacy notices',
      'Incident response plan established'
    ],
    recommendations: [
      'Complete data processing register',
      'Implement DSAR automation',
      'Conduct third-party security assessments',
      'Review and update privacy policies annually'
    ],
    regulatoryRequirements: [
      {
        id: 'r4',
        requirement: 'Data Controller Registration',
        status: 'compliant',
        evidence: ['DPC Registration Certificate'],
        notes: 'Registered with Data Protection Commission Ghana'
      },
      {
        id: 'r5',
        requirement: 'Data Processing Records',
        status: 'partial',
        evidence: ['Processing Activities Register Draft'],
        notes: 'Register being updated to include all activities'
      }
    ],
    certificationStatus: 'not-applicable'
  },
  {
    frameworkId: '3',
    frameworkName: 'Nigeria Data Protection Act 2023',
    frameworkIcon: '🇳🇬',
    region: 'Nigeria',
    compliance: 82,
    auditReadiness: 85,
    lastAuditDate: '2023-11-10',
    nextAuditDate: '2024-11-10',
    controlsImplemented: 28,
    totalControls: 42,
    evidenceCollected: 44,
    totalEvidence: 56,
    documentsAvailable: 36,
    tasksCompleted: 62,
    totalTasks: 84,
    gaps: [
      {
        id: 'g5',
        category: 'evidence',
        severity: 'medium',
        title: 'Cross-border transfer safeguards documentation',
        description: 'Transfer impact assessments not documented for all international transfers',
        impact: 'May affect international data transfer legitimacy',
        remediation: 'Document all transfer mechanisms and safeguards',
        estimatedEffort: '2 weeks',
        dueDate: '2024-02-20',
        assignedTo: 'Legal Team',
        status: 'in-progress'
      }
    ],
    strengths: [
      'Comprehensive data protection policies',
      'Strong technical security measures',
      'Regular compliance audits',
      'Effective data breach response capability',
      'Good vendor management framework'
    ],
    recommendations: [
      'Document cross-border transfer safeguards',
      'Enhance data lifecycle management',
      'Implement privacy by design methodology',
      'Conduct regular penetration testing'
    ],
    regulatoryRequirements: [
      {
        id: 'r6',
        requirement: 'Data Protection Compliance Organization',
        status: 'compliant',
        evidence: ['DPCO Designation Letter', 'DPCO Training Records'],
        notes: 'DPCO appointed and functional'
      },
      {
        id: 'r7',
        requirement: 'Data Protection Audit',
        status: 'compliant',
        evidence: ['Annual Audit Report 2023', 'Audit Findings Resolution'],
        notes: 'Last audit completed November 2023'
      }
    ],
    certificationStatus: 'not-applicable'
  },
  {
    frameworkId: '4',
    frameworkName: 'South Africa POPIA',
    frameworkIcon: '🇿🇦',
    region: 'South Africa',
    compliance: 68,
    auditReadiness: 72,
    nextAuditDate: '2024-07-01',
    controlsImplemented: 20,
    totalControls: 36,
    evidenceCollected: 30,
    totalEvidence: 48,
    documentsAvailable: 24,
    tasksCompleted: 44,
    totalTasks: 72,
    gaps: [
      {
        id: 'g6',
        category: 'documentation',
        severity: 'critical',
        title: 'Information Officer registration pending',
        description: 'Information Officer not yet registered with regulator',
        impact: 'Critical compliance requirement',
        remediation: 'Complete and submit registration immediately',
        estimatedEffort: '1 week',
        dueDate: '2024-02-05',
        assignedTo: 'Legal Team',
        status: 'in-progress'
      },
      {
        id: 'g7',
        category: 'procedural',
        severity: 'high',
        title: 'Processing purpose definitions incomplete',
        description: 'Not all processing purposes clearly defined and documented',
        impact: 'Affects lawfulness of processing',
        remediation: 'Define and document all processing purposes',
        estimatedEffort: '2 weeks',
        dueDate: '2024-02-15',
        assignedTo: 'Compliance Team',
        status: 'open'
      },
      {
        id: 'g8',
        category: 'evidence',
        severity: 'medium',
        title: 'Consent records management',
        description: 'Consent records not centrally managed',
        impact: 'Difficulty demonstrating valid consent',
        remediation: 'Implement consent management system',
        estimatedEffort: '4 weeks',
        dueDate: '2024-03-15',
        assignedTo: 'Tech Team',
        status: 'open'
      }
    ],
    strengths: [
      'Information Officer appointed',
      'Privacy policy developed',
      'Basic security measures in place',
      'Staff awareness program initiated'
    ],
    recommendations: [
      'Complete Information Officer registration urgently',
      'Define all processing purposes clearly',
      'Implement consent management system',
      'Conduct comprehensive POPIA training',
      'Establish regular compliance monitoring'
    ],
    regulatoryRequirements: [
      {
        id: 'r8',
        requirement: 'Information Officer Appointment',
        status: 'partial',
        evidence: ['IO Appointment Letter'],
        notes: 'Appointed but registration pending'
      },
      {
        id: 'r9',
        requirement: 'Processing Conditions Compliance',
        status: 'partial',
        evidence: ['Draft Processing Purposes Document'],
        notes: 'Being finalized'
      }
    ],
    certificationStatus: 'not-applicable'
  },
  {
    frameworkId: '5',
    frameworkName: 'EU GDPR',
    frameworkIcon: '🇪🇺',
    region: 'Europe',
    compliance: 92,
    auditReadiness: 95,
    lastAuditDate: '2023-05-15',
    nextAuditDate: '2024-05-15',
    controlsImplemented: 40,
    totalControls: 48,
    evidenceCollected: 64,
    totalEvidence: 72,
    documentsAvailable: 58,
    tasksCompleted: 84,
    totalTasks: 96,
    gaps: [
      {
        id: 'g9',
        category: 'technical',
        severity: 'low',
        title: 'Data anonymization enhancement',
        description: 'Current anonymization techniques could be strengthened',
        impact: 'Minor - current measures adequate but could be improved',
        remediation: 'Implement advanced anonymization techniques',
        estimatedEffort: '3 weeks',
        dueDate: '2024-04-30',
        assignedTo: 'Tech Team',
        status: 'open'
      }
    ],
    strengths: [
      'Exemplary DPO structure and independence',
      'Comprehensive DPIA process',
      'Strong data subject rights management',
      'Excellent security controls',
      'Regular staff training and awareness',
      'Robust vendor management',
      'Effective breach notification procedures'
    ],
    recommendations: [
      'Enhance anonymization techniques',
      'Continue excellence in privacy by design',
      'Share best practices across organization',
      'Maintain current high standards'
    ],
    regulatoryRequirements: [
      {
        id: 'r10',
        requirement: 'DPO Appointment',
        status: 'compliant',
        evidence: ['DPO Appointment', 'DPO Independence Documentation', 'DPO Resources Allocation'],
        notes: 'DPO fully functional with adequate resources'
      },
      {
        id: 'r11',
        requirement: 'DPIA for High-Risk Processing',
        status: 'compliant',
        evidence: ['DPIA Register', 'Completed DPIAs', 'DPIA Consultation Records'],
        notes: 'All high-risk processing activities assessed'
      },
      {
        id: 'r12',
        requirement: 'Data Subject Rights Procedures',
        status: 'compliant',
        evidence: ['DSR Process Documentation', 'DSR Response Logs', 'DSR Training Materials'],
        notes: 'Comprehensive procedures in place'
      }
    ],
    certificationStatus: 'certified',
    certificationExpiry: '2025-05-15'
  },
  {
    frameworkId: '6',
    frameworkName: 'ISO 27001',
    frameworkIcon: '🌐',
    region: 'International',
    compliance: 58,
    auditReadiness: 62,
    lastAuditDate: '2023-08-20',
    nextAuditDate: '2024-08-20',
    controlsImplemented: 52,
    totalControls: 114,
    evidenceCollected: 88,
    totalEvidence: 152,
    documentsAvailable: 74,
    tasksCompleted: 120,
    totalTasks: 228,
    gaps: [
      {
        id: 'g10',
        category: 'documentation',
        severity: 'critical',
        title: 'Risk assessment documentation incomplete',
        description: 'Several identified risks not formally assessed and documented',
        impact: 'Core ISO 27001 requirement',
        remediation: 'Complete formal risk assessment for all identified risks',
        estimatedEffort: '4 weeks',
        dueDate: '2024-02-29',
        assignedTo: 'Security Team',
        status: 'in-progress'
      },
      {
        id: 'g11',
        category: 'technical',
        severity: 'high',
        title: 'Access control reviews',
        description: 'User access reviews not conducted quarterly as required',
        impact: 'Potential unauthorized access',
        remediation: 'Establish quarterly access review process',
        estimatedEffort: '2 weeks',
        dueDate: '2024-02-15',
        assignedTo: 'IT Team',
        status: 'open'
      },
      {
        id: 'g12',
        category: 'procedural',
        severity: 'high',
        title: 'Incident response testing',
        description: 'Security incident response procedures not regularly tested',
        impact: 'Uncertain effectiveness during real incidents',
        remediation: 'Conduct quarterly incident response simulations',
        estimatedEffort: '1 week per quarter',
        dueDate: '2024-03-31',
        assignedTo: 'Security Team',
        status: 'open'
      },
      {
        id: 'g13',
        category: 'evidence',
        severity: 'medium',
        title: 'Security awareness training records',
        description: 'Training attendance records not systematically maintained',
        impact: 'Difficulty proving security awareness compliance',
        remediation: 'Implement training management system',
        estimatedEffort: '3 weeks',
        dueDate: '2024-03-15',
        assignedTo: 'HR Team',
        status: 'open'
      }
    ],
    strengths: [
      'ISMS framework established',
      'Security policies documented',
      'Physical security controls strong',
      'Network security monitoring in place',
      'Backup and recovery procedures defined'
    ],
    recommendations: [
      'Prioritize risk assessment completion',
      'Implement systematic access review process',
      'Establish regular security testing schedule',
      'Enhance security awareness program',
      'Conduct internal audits monthly',
      'Consider external consultant support'
    ],
    regulatoryRequirements: [
      {
        id: 'r13',
        requirement: 'Information Security Policy',
        status: 'compliant',
        evidence: ['ISMS Policy', 'Policy Approval Records', 'Policy Communication'],
        notes: 'Comprehensive policy suite in place'
      },
      {
        id: 'r14',
        requirement: 'Risk Assessment',
        status: 'partial',
        evidence: ['Risk Assessment Methodology', 'Partial Risk Register'],
        notes: 'Methodology defined, assessment in progress'
      },
      {
        id: 'r15',
        requirement: 'Access Control',
        status: 'partial',
        evidence: ['Access Control Policy', 'Initial Access Reviews'],
        notes: 'Policy in place, regular reviews needed'
      }
    ],
    certificationStatus: 'pending'
  }
];

// Evidence Items
export const evidenceItems: EvidenceItem[] = [
  {
    id: 'e1',
    name: 'DPO Appointment Letter - Kenya',
    type: 'certificate',
    framework: 'Kenya Data Protection Act 2019',
    control: 'DPO Appointment',
    uploadDate: '2023-01-15',
    lastReviewed: '2024-01-10',
    reviewedBy: 'Compliance Manager',
    status: 'approved',
    fileSize: '2.4 MB',
    description: 'Official appointment letter for Data Protection Officer with roles and responsibilities'
  },
  {
    id: 'e2',
    name: 'Data Processing Register',
    type: 'policy',
    framework: 'Kenya Data Protection Act 2019',
    control: 'Processing Activities Documentation',
    uploadDate: '2023-02-20',
    lastReviewed: '2024-01-15',
    reviewedBy: 'Legal Team',
    status: 'approved',
    fileSize: '5.8 MB',
    description: 'Comprehensive register of all data processing activities'
  },
  {
    id: 'e3',
    name: 'DPIA - Customer Database',
    type: 'assessment',
    framework: 'Kenya Data Protection Act 2019',
    control: 'Data Protection Impact Assessment',
    uploadDate: '2023-04-10',
    lastReviewed: '2024-01-08',
    reviewedBy: 'Privacy Officer',
    status: 'approved',
    fileSize: '3.2 MB',
    description: 'Data Protection Impact Assessment for customer database processing'
  },
  {
    id: 'e4',
    name: 'Privacy Policy - Public',
    type: 'policy',
    framework: 'All Frameworks',
    control: 'Transparency and Notice',
    uploadDate: '2023-01-20',
    lastReviewed: '2024-01-12',
    reviewedBy: 'Legal Team',
    status: 'approved',
    fileSize: '1.8 MB',
    description: 'Public-facing privacy policy covering all data processing'
  },
  {
    id: 'e5',
    name: 'Security Training Completion Records Q4 2023',
    type: 'training-record',
    framework: 'ISO 27001',
    control: 'Security Awareness Training',
    uploadDate: '2024-01-05',
    status: 'pending-review',
    fileSize: '4.2 MB',
    description: 'Training attendance and completion records for Q4 2023'
  },
  {
    id: 'e6',
    name: 'Breach Response Plan',
    type: 'procedure',
    framework: 'All Frameworks',
    control: 'Incident Response',
    uploadDate: '2023-03-15',
    lastReviewed: '2023-12-20',
    reviewedBy: 'Security Team',
    status: 'approved',
    fileSize: '2.1 MB',
    description: 'Comprehensive data breach response and notification procedures'
  },
  {
    id: 'e7',
    name: 'Vendor Data Processing Agreements',
    type: 'policy',
    framework: 'EU GDPR',
    control: 'Third Party Management',
    uploadDate: '2023-05-20',
    lastReviewed: '2024-01-05',
    reviewedBy: 'Legal Team',
    status: 'approved',
    fileSize: '8.4 MB',
    description: 'Data processing agreements with all third-party vendors'
  },
  {
    id: 'e8',
    name: 'Access Control Review Report',
    type: 'audit-report',
    framework: 'ISO 27001',
    control: 'Access Management',
    uploadDate: '2024-01-10',
    status: 'pending-review',
    fileSize: '1.9 MB',
    description: 'Quarterly user access review and certification'
  }
];

// Compliance History
export const complianceHistory: ComplianceHistory[] = [
  {
    date: '2024-01-15',
    framework: 'Kenya DPA',
    complianceScore: 87,
    milestone: 'Completed all DPIAs for high-risk processing',
    type: 'achievement'
  },
  {
    date: '2024-01-10',
    framework: 'EU GDPR',
    complianceScore: 92,
    milestone: 'GDPR certification renewed',
    type: 'audit'
  },
  {
    date: '2023-12-20',
    framework: 'Nigeria NDPA',
    complianceScore: 82,
    milestone: 'Cross-border transfer framework implemented',
    type: 'achievement'
  },
  {
    date: '2023-12-15',
    framework: 'ISO 27001',
    complianceScore: 58,
    milestone: 'Internal security audit completed',
    type: 'audit'
  },
  {
    date: '2023-11-30',
    framework: 'Ghana DPA',
    complianceScore: 76,
    milestone: 'Data processing register updated',
    type: 'update'
  },
  {
    date: '2023-11-20',
    framework: 'Kenya DPA',
    complianceScore: 85,
    milestone: 'Resolved critical gap in consent management',
    type: 'gap-closed'
  },
  {
    date: '2023-11-10',
    framework: 'Nigeria NDPA',
    complianceScore: 80,
    milestone: 'Annual NDPA compliance audit',
    type: 'audit'
  },
  {
    date: '2023-10-25',
    framework: 'South Africa POPIA',
    complianceScore: 68,
    milestone: 'Information Officer appointed',
    type: 'achievement'
  },
  {
    date: '2023-10-15',
    framework: 'All Frameworks',
    complianceScore: 78,
    milestone: 'Company-wide privacy training completed',
    type: 'achievement'
  },
  {
    date: '2023-09-30',
    framework: 'EU GDPR',
    complianceScore: 90,
    milestone: 'Enhanced data subject rights procedures',
    type: 'update'
  }
];

// Audit Timeline
export const auditTimeline: AuditTimeline[] = [
  {
    date: '2024-05-15',
    event: 'EU GDPR Certification Audit',
    framework: 'EU GDPR',
    type: 'audit',
    status: 'scheduled',
    details: 'Annual certification audit scheduled with external auditor',
    documents: ['Audit Plan', 'Pre-Audit Questionnaire']
  },
  {
    date: '2024-02-28',
    event: 'Internal Compliance Review',
    framework: 'All Frameworks',
    type: 'milestone',
    status: 'scheduled',
    details: 'Quarterly internal compliance review across all frameworks',
    documents: ['Review Checklist']
  },
  {
    date: '2024-01-15',
    event: 'DPIA Completion Milestone',
    framework: 'Kenya DPA',
    type: 'milestone',
    status: 'completed',
    details: 'All high-risk processing DPIAs completed and approved',
    documents: ['DPIA Register', 'Completed DPIAs']
  },
  {
    date: '2024-01-10',
    event: 'GDPR Certification Renewed',
    framework: 'EU GDPR',
    type: 'certification',
    status: 'completed',
    details: 'Successfully renewed GDPR certification for another year',
    documents: ['Certificate', 'Audit Report']
  },
  {
    date: '2023-12-15',
    event: 'ISO 27001 Internal Audit',
    framework: 'ISO 27001',
    type: 'audit',
    status: 'completed',
    details: 'Internal security audit identified 12 findings',
    documents: ['Audit Report', 'Findings Register']
  },
  {
    date: '2023-11-20',
    event: 'Consent Management Gap Resolved',
    framework: 'Kenya DPA',
    type: 'gap-resolved',
    status: 'completed',
    details: 'Implemented automated consent management system',
    documents: ['Gap Closure Report', 'Implementation Evidence']
  },
  {
    date: '2023-11-10',
    event: 'Nigeria NDPA Annual Audit',
    framework: 'Nigeria NDPA',
    type: 'audit',
    status: 'completed',
    details: 'External regulatory audit completed successfully',
    documents: ['Audit Report', 'Compliance Certificate']
  },
  {
    date: '2023-09-15',
    event: 'Kenya DPA External Audit',
    framework: 'Kenya DPA',
    type: 'audit',
    status: 'completed',
    details: 'External compliance audit with positive findings',
    documents: ['Audit Report', 'Certificate of Compliance']
  }
];

// Sample Generated Reports
export const generatedReports: AuditReport[] = [
  {
    id: 'r1',
    title: 'Comprehensive Compliance Audit Report - Q4 2023',
    type: 'full-audit',
    generatedDate: '2024-01-15',
    frameworks: ['All Frameworks'],
    pageCount: 124,
    includesEvidence: true,
    format: 'pdf',
    confidenceLevel: 'high',
    summary: 'Complete audit package covering all active frameworks with evidence attachments'
  },
  {
    id: 'r2',
    title: 'Kenya Data Protection Act Compliance Report',
    type: 'framework-specific',
    generatedDate: '2024-01-12',
    frameworks: ['Kenya DPA'],
    pageCount: 45,
    includesEvidence: true,
    format: 'pdf',
    confidenceLevel: 'high',
    summary: 'Detailed Kenya DPA compliance report with control matrices and evidence'
  },
  {
    id: 'r3',
    title: 'Executive Compliance Summary',
    type: 'executive-summary',
    generatedDate: '2024-01-10',
    frameworks: ['All Frameworks'],
    pageCount: 12,
    includesEvidence: false,
    format: 'pdf',
    confidenceLevel: 'high',
    summary: 'High-level executive summary of compliance posture across all frameworks'
  },
  {
    id: 'r4',
    title: 'Gap Analysis Report - ISO 27001',
    type: 'gap-analysis',
    generatedDate: '2023-12-20',
    frameworks: ['ISO 27001'],
    pageCount: 28,
    includesEvidence: false,
    format: 'pdf',
    confidenceLevel: 'medium',
    summary: 'Detailed gap analysis for ISO 27001 with remediation roadmap'
  }
];

// Regulator View Metrics
export const regulatorMetrics: RegulatorViewMetrics = {
  overallReadiness: 85,
  frameworksCertified: 1,
  totalFrameworks: 6,
  controlImplementationRate: 68,
  evidenceCompletenessScore: 78,
  documentationScore: 92,
  lastAuditDate: '2024-01-10',
  upcomingAudits: 2,
  openGaps: 13,
  criticalGaps: 2,
  averageGapResolutionTime: 21,
  complianceTrend: 'improving'
};

// Utility function to calculate overall audit readiness
export function calculateAuditReadiness(): AuditReadinessScore {
  return auditReadinessScore;
}

// Utility function to get gap statistics
export function getGapStatistics() {
  const allGaps = frameworkAuditPackages.flatMap(pkg => pkg.gaps);
  return {
    total: allGaps.length,
    critical: allGaps.filter(g => g.severity === 'critical').length,
    high: allGaps.filter(g => g.severity === 'high').length,
    medium: allGaps.filter(g => g.severity === 'medium').length,
    low: allGaps.filter(g => g.severity === 'low').length,
    open: allGaps.filter(g => g.status === 'open').length,
    inProgress: allGaps.filter(g => g.status === 'in-progress').length,
    resolved: allGaps.filter(g => g.status === 'resolved').length
  };
}

