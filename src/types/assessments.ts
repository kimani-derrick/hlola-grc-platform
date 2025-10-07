export type AssessmentType = 'pia' | 'dsr' | 'vendor' | 'breach-risk' | 'maturity';
export type AssessmentStatus = 'draft' | 'in-progress' | 'pending-review' | 'approved' | 'rejected' | 'completed';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type MaturityLevel = 'initial' | 'managed' | 'defined' | 'quantified' | 'optimizing';

export interface BaseAssessment {
  id: string;
  title: string;
  type: AssessmentType;
  status: AssessmentStatus;
  framework: string;
  frameworkIcon: string;
  createdDate: string;
  lastModified: string;
  dueDate?: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  tags: string[];
}

export interface PrivacyImpactAssessment extends BaseAssessment {
  type: 'pia';
  processingActivity: string;
  dataCategories: string[];
  dataSubjects: string[];
  legalBasis: string;
  retentionPeriod: string;
  dataSharing: boolean;
  crossBorderTransfer: boolean;
  riskScore: number;
  riskFactors: RiskFactor[];
  mitigationMeasures: MitigationMeasure[];
  stakeholderReview: StakeholderReview[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  nextReviewDate: string;
}

export interface DataSubjectRightsAssessment extends BaseAssessment {
  type: 'dsr';
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection' | 'restriction';
  dataSubject: string;
  requestDate: string;
  responseDeadline: string;
  complexity: 'simple' | 'moderate' | 'complex';
  dataVolume: 'small' | 'medium' | 'large';
  verificationRequired: boolean;
  thirdPartyInvolved: boolean;
  processingSteps: ProcessingStep[];
  responseTime: number; // in hours
  resolutionStatus: 'pending' | 'in-progress' | 'completed' | 'rejected';
  satisfactionScore?: number;
  followUpRequired: boolean;
}

export interface VendorPrivacyAssessment extends BaseAssessment {
  type: 'vendor';
  vendorName: string;
  vendorType: 'processor' | 'controller' | 'joint-controller';
  serviceDescription: string;
  dataCategories: string[];
  dataProcessingPurposes: string[];
  dataSharingScope: 'internal' | 'external' | 'public';
  dpaStatus: 'signed' | 'pending' | 'expired' | 'not-required';
  dpaExpiryDate?: string;
  certificationStatus: 'certified' | 'pending' | 'not-certified';
  certifications: string[];
  riskScore: number;
  riskFactors: RiskFactor[];
  complianceScore: number;
  lastAuditDate?: string;
  nextAuditDate?: string;
  contractValue: number;
  contractCurrency: string;
  terminationClause: boolean;
  dataReturnClause: boolean;
  breachNotificationClause: boolean;
}

export interface BreachRiskAssessment extends BaseAssessment {
  type: 'breach-risk';
  breachScenario: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
  dataCategories: string[];
  affectedDataSubjects: number;
  notificationRequired: boolean;
  notificationDeadline?: string;
  regulatoryNotification: boolean;
  affectedRegulators: string[];
  businessImpact: BusinessImpact;
  technicalImpact: TechnicalImpact;
  containmentMeasures: string[];
  recoveryTime: number; // in hours
  lessonsLearned: string[];
  preventionMeasures: string[];
}

export interface PrivacyMaturityAssessment extends BaseAssessment {
  type: 'maturity';
  assessmentPeriod: string;
  overallMaturity: MaturityLevel;
  maturityScore: number;
  dimensions: MaturityDimension[];
  benchmarkComparison: BenchmarkComparison;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextAssessmentDate: string;
  improvementTargets: ImprovementTarget[];
  executiveSummary: string;
}

export interface RiskFactor {
  id: string;
  factor: string;
  description: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
  mitigation: string;
  residualRisk: RiskLevel;
}

export interface MitigationMeasure {
  id: string;
  measure: string;
  description: string;
  implementationStatus: 'not-started' | 'in-progress' | 'completed';
  effectiveness: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  timeline: string;
  responsible: string;
}

export interface StakeholderReview {
  id: string;
  stakeholder: string;
  role: string;
  reviewDate: string;
  comments: string;
  approval: 'pending' | 'approved' | 'rejected';
  recommendations: string[];
}

export interface ProcessingStep {
  id: string;
  step: string;
  description: string;
  responsible: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedDate?: string;
  notes: string;
}

export interface BusinessImpact {
  financial: number;
  operational: number;
  reputational: number;
  regulatory: number;
  total: number;
}

export interface TechnicalImpact {
  dataIntegrity: RiskLevel;
  systemAvailability: RiskLevel;
  dataConfidentiality: RiskLevel;
  systemPerformance: RiskLevel;
  total: RiskLevel;
}

export interface MaturityDimension {
  dimension: string;
  currentLevel: MaturityLevel;
  targetLevel: MaturityLevel;
  score: number;
  description: string;
  keyPractices: string[];
  gaps: string[];
  recommendations: string[];
}

export interface BenchmarkComparison {
  industry: number;
  peers: number;
  bestPractice: number;
  regulatory: number;
  overall: number;
}

export interface ImprovementTarget {
  id: string;
  target: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetDate: string;
  responsible: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  type: AssessmentType;
  framework: string;
  description: string;
  sections: AssessmentSection[];
  questions: AssessmentQuestion[];
  scoringMethod: 'weighted' | 'simple' | 'matrix';
  approvalRequired: boolean;
  reviewCycle: number; // in months
  isDefault: boolean;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  version: string;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  order: number;
  required: boolean;
  questions: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no' | 'file-upload';
  required: boolean;
  options?: string[];
  scoring?: QuestionScoring;
  validation?: QuestionValidation;
}

export interface QuestionScoring {
  method: 'weighted' | 'points' | 'percentage';
  weights?: { [key: string]: number };
  points?: { [key: string]: number };
  maxScore: number;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  requiredFiles?: string[];
  maxFileSize?: number;
}

export interface AssessmentStats {
  total: number;
  byStatus: { [key in AssessmentStatus]: number };
  byType: { [key in AssessmentType]: number };
  byPriority: { [key: string]: number };
  overdue: number;
  dueThisWeek: number;
  completedThisMonth: number;
  averageCompletionTime: number; // in days
}

export interface AssessmentFilters {
  searchQuery: string;
  selectedType: string;
  selectedStatus: string;
  selectedFramework: string;
  selectedPriority: string;
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  assignedTo: string;
}
