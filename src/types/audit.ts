export interface AuditReadinessScore {
  overall: number;
  documentation: number;
  controls: number;
  evidence: number;
  teamReadiness: number;
  riskManagement: number;
}

export interface FrameworkAuditPackage {
  frameworkId: string;
  frameworkName: string;
  frameworkIcon: string;
  region: string;
  compliance: number;
  auditReadiness: number;
  lastAuditDate?: string;
  nextAuditDate?: string;
  controlsImplemented: number;
  totalControls: number;
  evidenceCollected: number;
  totalEvidence: number;
  documentsAvailable: number;
  tasksCompleted: number;
  totalTasks: number;
  gaps: AuditGap[];
  strengths: string[];
  recommendations: string[];
  regulatoryRequirements: RegulatoryRequirement[];
  certificationStatus?: 'certified' | 'pending' | 'expired' | 'not-applicable';
  certificationExpiry?: string;
}

export interface AuditGap {
  id: string;
  category: 'documentation' | 'technical' | 'procedural' | 'evidence';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  remediation: string;
  estimatedEffort: string;
  dueDate?: string;
  assignedTo?: string;
  status: 'open' | 'in-progress' | 'resolved';
  framework?: string;
  frameworkIcon?: string;
}

export interface RegulatoryRequirement {
  id: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  evidence: string[];
  notes: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  framework: string;
  control: string;
  uploadDate: string;
  lastReviewed?: string;
  reviewedBy?: string;
  status: 'approved' | 'pending-review' | 'rejected' | 'outdated';
  fileSize: string;
  description: string;
}

export interface ComplianceHistory {
  date: string;
  framework: string;
  complianceScore: number;
  milestone: string;
  type: 'achievement' | 'audit' | 'update' | 'gap-closed';
}

export interface AuditReport {
  id: string;
  title: string;
  type: 'full-audit' | 'framework-specific' | 'executive-summary' | 'gap-analysis';
  generatedDate: string;
  frameworks: string[];
  pageCount: number;
  includesEvidence: boolean;
  format: 'pdf' | 'docx' | 'excel';
  confidenceLevel: 'high' | 'medium' | 'low';
  summary: string;
}

export interface RegulatorViewMetrics {
  overallReadiness: number;
  frameworksCertified: number;
  totalFrameworks: number;
  controlImplementationRate: number;
  evidenceCompletenessScore: number;
  documentationScore: number;
  lastAuditDate: string;
  upcomingAudits: number;
  openGaps: number;
  criticalGaps: number;
  averageGapResolutionTime: number; // in days
  complianceTrend: 'improving' | 'stable' | 'declining';
}

export interface AuditTimeline {
  date: string;
  event: string;
  framework: string;
  type: 'audit' | 'certification' | 'milestone' | 'gap-identified' | 'gap-resolved';
  status: 'completed' | 'in-progress' | 'scheduled';
  details: string;
  documents?: string[];
}

export interface ExportOptions {
  includeExecutiveSummary: boolean;
  includeFrameworkDetails: boolean;
  includeControlMatrices: boolean;
  includeEvidence: boolean;
  includeGapAnalysis: boolean;
  includeTimeline: boolean;
  includeRecommendations: boolean;
  format: 'pdf' | 'docx' | 'excel' | 'zip';
  frameworks: string[];
}

