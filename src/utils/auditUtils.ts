import { FrameworkAuditPackage, AuditGap, EvidenceItem } from '../types/audit';

export function filterFrameworkPackages(
  packages: FrameworkAuditPackage[],
  searchQuery: string,
  selectedRegion: string
): FrameworkAuditPackage[] {
  return packages.filter(pkg => {
    const matchesSearch = !searchQuery ||
      pkg.frameworkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'all' || pkg.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });
}

export function filterGaps(
  gaps: AuditGap[],
  severity: string,
  status: string,
  searchQuery: string
): AuditGap[] {
  return gaps.filter(gap => {
    const matchesSeverity = severity === 'all' || gap.severity === severity;
    const matchesStatus = status === 'all' || gap.status === status;
    const matchesSearch = !searchQuery ||
      gap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gap.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });
}

export function filterEvidence(
  items: EvidenceItem[],
  framework: string,
  status: string,
  searchQuery: string
): EvidenceItem[] {
  return items.filter(item => {
    const matchesFramework = framework === 'all' || item.framework === framework || item.framework === 'All Frameworks';
    const matchesStatus = status === 'all' || item.status === status;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFramework && matchesStatus && matchesSearch;
  });
}

export function getReadinessColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getReadinessBg(score: number): string {
  if (score >= 90) return 'bg-green-50 border-green-200';
  if (score >= 75) return 'bg-blue-50 border-blue-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

export function getComplianceColor(compliance: number): string {
  if (compliance >= 90) return 'text-green-600';
  if (compliance >= 75) return 'text-blue-600';
  if (compliance >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getComplianceBarColor(compliance: number): string {
  if (compliance >= 90) return 'bg-green-500';
  if (compliance >= 75) return 'bg-blue-500';
  if (compliance >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function getSeverityColor(severity: 'critical' | 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'critical':
      return 'text-red-700 bg-red-100 border-red-300';
    case 'high':
      return 'text-orange-700 bg-orange-100 border-orange-300';
    case 'medium':
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'low':
      return 'text-blue-700 bg-blue-100 border-blue-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function getGapStatusColor(status: 'open' | 'in-progress' | 'resolved'): string {
  switch (status) {
    case 'resolved':
      return 'text-green-700 bg-green-100';
    case 'in-progress':
      return 'text-blue-700 bg-blue-100';
    case 'open':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
}

export function getEvidenceStatusColor(status: 'approved' | 'pending-review' | 'rejected' | 'outdated'): string {
  switch (status) {
    case 'approved':
      return 'text-green-700 bg-green-100';
    case 'pending-review':
      return 'text-yellow-700 bg-yellow-100';
    case 'rejected':
      return 'text-red-700 bg-red-100';
    case 'outdated':
      return 'text-orange-700 bg-orange-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
}

export function getCertificationStatusColor(status?: 'certified' | 'pending' | 'expired' | 'not-applicable'): string {
  switch (status) {
    case 'certified':
      return 'text-green-700 bg-green-100 border-green-300';
    case 'pending':
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'expired':
      return 'text-red-700 bg-red-100 border-red-300';
    case 'not-applicable':
      return 'text-gray-700 bg-gray-100 border-gray-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function getTrendColor(trend: 'improving' | 'stable' | 'declining'): string {
  switch (trend) {
    case 'improving':
      return 'text-green-600';
    case 'stable':
      return 'text-gray-600';
    case 'declining':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getTrendIcon(trend: 'improving' | 'stable' | 'declining'): string {
  switch (trend) {
    case 'improving':
      return '↗';
    case 'stable':
      return '→';
    case 'declining':
      return '↘';
    default:
      return '→';
  }
}

export function calculateImplementationPercentage(implemented: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((implemented / total) * 100);
}

export function formatFileSize(sizeStr: string): string {
  return sizeStr;
}

export function getConfidenceLevelColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return 'text-green-700 bg-green-100';
    case 'medium':
      return 'text-yellow-700 bg-yellow-100';
    case 'low':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
}

export function getConfidenceLevelIcon(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return '✓';
    case 'medium':
      return '~';
    case 'low':
      return '!';
    default:
      return '-';
  }
}

export function sortFrameworkPackages(
  packages: FrameworkAuditPackage[],
  sortBy: 'readiness' | 'compliance' | 'name'
): FrameworkAuditPackage[] {
  const sorted = [...packages];
  
  switch (sortBy) {
    case 'readiness':
      return sorted.sort((a, b) => b.auditReadiness - a.auditReadiness);
    case 'compliance':
      return sorted.sort((a, b) => b.compliance - a.compliance);
    case 'name':
      return sorted.sort((a, b) => a.frameworkName.localeCompare(b.frameworkName));
    default:
      return sorted;
  }
}

export function getUniqueRegions(packages: FrameworkAuditPackage[]): string[] {
  return Array.from(new Set(packages.map(p => p.region))).sort();
}

export function calculateOverallReadiness(packages: FrameworkAuditPackage[]): number {
  if (packages.length === 0) return 0;
  const total = packages.reduce((sum, pkg) => sum + pkg.auditReadiness, 0);
  return Math.round(total / packages.length);
}

export function calculateOverallCompliance(packages: FrameworkAuditPackage[]): number {
  if (packages.length === 0) return 0;
  const total = packages.reduce((sum, pkg) => sum + pkg.compliance, 0);
  return Math.round(total / packages.length);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getDaysUntilDate(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isDateOverdue(dateString: string): boolean {
  return getDaysUntilDate(dateString) < 0;
}

export function getCategoryIcon(category: 'documentation' | 'technical' | 'procedural' | 'evidence'): string {
  switch (category) {
    case 'documentation':
      return '📄';
    case 'technical':
      return '⚙️';
    case 'procedural':
      return '📋';
    case 'evidence':
      return '📎';
    default:
      return '📌';
  }
}

export function getRequirementStatusColor(status: 'compliant' | 'partial' | 'non-compliant'): string {
  switch (status) {
    case 'compliant':
      return 'text-green-700 bg-green-100 border-green-300';
    case 'partial':
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'non-compliant':
      return 'text-red-700 bg-red-100 border-red-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function generateExportFileName(type: string, frameworks: string[]): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const frameworkSuffix = frameworks.length === 1 ? `-${frameworks[0].replace(/\s+/g, '-')}` : '-All-Frameworks';
  return `Audit-Report-${type}${frameworkSuffix}-${timestamp}`;
}

