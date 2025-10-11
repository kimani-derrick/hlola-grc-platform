import { useState, useEffect } from 'react';
import { apiService, DashboardData } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Function to calculate risk exposure based on framework risk levels
function calculateRiskExposure(frameworks: any[]): number {
  if (!frameworks || frameworks.length === 0) return 0;
  
  // Define potential fine amounts by risk level (in KES)
  const fineAmounts = {
    low: 500000,      // 500K KES
    medium: 2000000,  // 2M KES
    high: 5000000,    // 5M KES
    critical: 10000000 // 10M KES
  };
  
  let totalExposure = 0;
  const uniqueFrameworks = new Set();
  
  frameworks.forEach(framework => {
    // Avoid counting duplicate frameworks
    const frameworkKey = `${framework.name}-${framework.riskLevel}`;
    if (!uniqueFrameworks.has(frameworkKey)) {
      uniqueFrameworks.add(frameworkKey);
      const riskLevel = framework.riskLevel || 'medium';
      totalExposure += fineAmounts[riskLevel as keyof typeof fineAmounts] || fineAmounts.medium;
    }
  });
  
  return totalExposure;
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  uploadedDocuments: number;
  requiredDocuments: number;
  uploadPercentage: number;
  assignedFrameworks: number;
  totalAvailableFrameworks: number;
  frameworkCoverage: number;
  criticalIssues: number;
  riskExposure: number;
  complianceScore: number;
  totalControls: number; // Add missing totalControls
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function useDashboardData(organizationId?: string) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    // Use provided organizationId, user's organizationId, or fallback to known test org
    const orgId = organizationId || user?.organizationId || '35903f74-76d2-481d-bfc2-5861f7af0608';
    
    if (!orgId) {
      setError('No organization ID available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [
        overviewResponse,
        tasksResponse,
        frameworksResponse,
        documentsResponse,
        auditGapsResponse,
        allFrameworksResponse,
      ] = await Promise.all([
        apiService.getDashboardData(orgId),
        apiService.getTasksReport(orgId),
        apiService.getFrameworksReport(orgId),
        apiService.getDocuments(orgId),
        apiService.getAuditGaps(orgId),
        apiService.getFrameworks(), // Get all available frameworks
      ]);

      // Process the data
      const overview = overviewResponse.data?.overview || {};
      const tasks = tasksResponse.data?.summary || {};
      const frameworksSummary = frameworksResponse.data?.summary || {};
      const documents = documentsResponse.data || [];
      const auditGaps = auditGapsResponse.data || [];
      const allFrameworks = allFrameworksResponse.data || [];

      // DEBUG: Log the raw API responses
      console.log('🔍 DEBUG - API Responses:');
      console.log('Overview:', overview);
      console.log('Tasks:', tasks);
      console.log('Frameworks Summary:', frameworksSummary);
      console.log('Documents:', documents);
      console.log('Audit Gaps:', auditGaps);

      // Calculate metrics
      const totalTasks = tasks.totalTasks || 0;
      const completedTasks = tasks.completedTasks || 0;
      const pendingTasks = tasks.pendingTasks || 0;
      const inProgressTasks = tasks.inProgressTasks || 0;
      const overdueTasks = tasks.overdueTasks || 0;
      // Calculate completion rate from tasks data
      const completionRate = tasks.totalTasks > 0 ? (tasks.completedTasks / tasks.totalTasks) * 100 : 0;
      
      // DEBUG: Log completion rate calculation
      console.log('🔍 DEBUG - Completion Rate Calculation:');
      console.log('Total Tasks:', tasks.totalTasks);
      console.log('Completed Tasks:', tasks.completedTasks);
      console.log('Calculated Completion Rate:', completionRate);

      const uploadedDocuments = documents.length;
      const requiredDocuments = totalTasks; // Assuming each task requires a document
      const uploadPercentage = requiredDocuments > 0 ? (uploadedDocuments / requiredDocuments) * 100 : 0;

      const assignedFrameworks = overview.totalFrameworks || 0; // Use totalFrameworks from overview (assigned frameworks)
      const totalAvailableFrameworks = allFrameworks.length || 60; // Use length of all frameworks array
      const frameworkCoverage = totalAvailableFrameworks > 0 ? (assignedFrameworks / totalAvailableFrameworks) * 100 : 0;

      const criticalIssues = auditGaps.filter((gap: any) => gap.severity === 'critical').length;
      
      // Calculate risk exposure based on assigned frameworks
      const frameworks = frameworksResponse.data?.frameworks || [];
      const riskExposure = calculateRiskExposure(frameworks);
      
      // DEBUG: Log risk exposure calculation
      console.log('🔍 DEBUG - Risk Exposure Calculation:');
      console.log('Frameworks:', frameworks.map(f => ({ name: f.name, riskLevel: f.riskLevel })));
      console.log('Calculated Risk Exposure:', riskExposure);
      
      const complianceScore = overview.avgComplianceScore || 0;

      // DEBUG: Log the calculated compliance score
      console.log('🔍 DEBUG - Compliance Score Calculation:');
      console.log('Raw avgComplianceScore:', overview.avgComplianceScore);
      console.log('Final complianceScore:', complianceScore);
      
      // Determine risk level based on compliance score and critical issues
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (complianceScore < 50 || criticalIssues > 5) {
        riskLevel = 'critical';
      } else if (complianceScore < 70 || criticalIssues > 2) {
        riskLevel = 'high';
      } else if (complianceScore < 85 || criticalIssues > 0) {
        riskLevel = 'medium';
      }

      setData({
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        completionRate,
        uploadedDocuments,
        requiredDocuments,
        uploadPercentage,
        assignedFrameworks,
        totalAvailableFrameworks,
        frameworkCoverage,
        criticalIssues,
        riskExposure,
        complianceScore,
        totalControls: overview.totalControls || 0, // Add missing totalControls
        riskLevel,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      
      // Fallback to mock data
      setData({
        totalTasks: 38,
        completedTasks: 15,
        pendingTasks: 18,
        inProgressTasks: 5,
        overdueTasks: 3,
        completionRate: 39,
        uploadedDocuments: 12,
        requiredDocuments: 38,
        uploadPercentage: 32,
        assignedFrameworks: 2,
        totalAvailableFrameworks: 10,
        frameworkCoverage: 20,
        criticalIssues: 11,
        riskExposure: 7000000,
        complianceScore: 65,
        riskLevel: 'critical',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [organizationId, user?.organizationId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}
