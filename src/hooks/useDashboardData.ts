import { useState, useEffect, useMemo } from 'react';
import { apiService, DashboardData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEntity } from '../context/EntityContext';
import { useActiveFrameworks } from '../context/ActiveFrameworksContext';

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
  uploadedDocuments: number; // Just uploaded documents
  requiredDocuments: number;
  uploadPercentage: number;
  assignedFrameworks: number;
  totalAvailableFrameworks: number;
  frameworkCoverage: number;
  criticalIssues: number;
  riskExposure: number;
  complianceScore: number;
  totalControls: number;
  completedControls: number;
  inProgressControls: number;
  notStartedControls: number;
  controlsCompletionRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function useDashboardData(organizationId?: string) {
  const { user, isLoading: authLoading } = useAuth();
  const { selectedEntity } = useEntity();
  const { activeFrameworkIds, setActiveFrameworkIds } = useActiveFrameworks();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load assigned frameworks for the current entity
  useEffect(() => {
    const refreshAssignedFrameworks = async () => {
      try {
        if (!selectedEntity?.id) return;
        const resp: any = await apiService.getEntityFrameworks(selectedEntity.id);
        if (resp.success) {
          const list = Array.isArray(resp.data) ? resp.data : [];
          const ids = list.map((f: any) => f.framework_id || f.frameworkId || f.id).filter(Boolean);
          setActiveFrameworkIds(ids);
        }
      } catch (error) {
        console.error('Error loading assigned frameworks:', error);
      }
    };

    refreshAssignedFrameworks();
  }, [selectedEntity?.id, setActiveFrameworkIds]);

  // Create a stable reference for active framework IDs to avoid useEffect dependency issues
  const stableActiveFrameworkIds = useMemo(() => activeFrameworkIds, [activeFrameworkIds.join(',')]);

  const fetchDashboardData = async () => {
    // Use provided organizationId or user's organizationId
    const orgId = organizationId || user?.organizationId;
    if (!orgId || !selectedEntity) {
      // Do not error or set demo data; wait for auth/user/entity to be ready
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel using simple APIs
      const [
        allTasksResponse,
        documentsResponse,
        auditGapsResponse,
        allFrameworksResponse,
        entityFrameworksResponse,
      ] = await Promise.all([
        apiService.getAllTasks(orgId),
        apiService.getDocuments(orgId),
        apiService.getAuditGaps(orgId),
        apiService.getFrameworks(), // Get all available frameworks
        apiService.getEntityFrameworks(selectedEntity.id), // Get assigned frameworks for the entity
      ]);

      // Process the data from tasks API
      const allTasks = (allTasksResponse.data as any)?.tasks || [];
      const documents = (documentsResponse.data as any)?.documents || [];
      const auditGaps = auditGapsResponse.data || [];
      const allFrameworks = allFrameworksResponse.data || [];
      const assignedFrameworks = entityFrameworksResponse.data || [];
      
      // Fetch controls for active frameworks (same approach as controls page)
      const allControls: any[] = [];
      if (stableActiveFrameworkIds && stableActiveFrameworkIds.length > 0) {
        for (const frameworkId of stableActiveFrameworkIds) {
          try {
            const controlsRes = await apiService.getControlsByFramework(frameworkId);
            if (controlsRes.success && controlsRes.data) {
              allControls.push(...controlsRes.data);
            }
          } catch (error) {
            console.error(`Error fetching controls for framework ${frameworkId}:`, error);
          }
        }
      }
      const controls = allControls;

      // DEBUG: Log the raw API responses
      console.log('🔍 DEBUG - API Responses:');
      console.log('All Tasks:', allTasks.length, 'tasks');
      console.log('Documents:', documents);
      console.log('Audit Gaps:', auditGaps);
      console.log('Active Framework IDs:', stableActiveFrameworkIds);
      console.log('Assigned Frameworks:', assignedFrameworks);
      console.log('Controls Data:', controls);
      console.log('Controls Count:', controls.length);

      // Calculate metrics from actual task data (not stats API)
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter((task: any) => task.status === 'completed').length;
      const pendingTasks = allTasks.filter((task: any) => task.status === 'pending').length;
      const inProgressTasks = allTasks.filter((task: any) => task.status === 'in-progress').length;
      const overdueTasks = allTasks.filter((task: any) => {
        if (task.status === 'completed') return false;
        const dueDate = new Date(task.due_date);
        const now = new Date();
        return dueDate < now;
      }).length;
      // Calculate completion rate from tasks data
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      // DEBUG: Log completion rate calculation
      console.log('🔍 DEBUG - Completion Rate Calculation:');
      console.log('Total Tasks:', totalTasks);
      console.log('Completed Tasks:', completedTasks);
      console.log('Calculated Completion Rate:', completionRate);

      // Count evidence: only uploaded documents (not tasks)
      const uploadedDocuments = documents.length;
      const requiredDocuments = totalTasks; // Assuming each task requires evidence
      const uploadPercentage = requiredDocuments > 0 ? (uploadedDocuments / requiredDocuments) * 100 : 0;

      // DEBUG: Log evidence calculation
      console.log('🔍 DEBUG - Evidence Calculation:');
      console.log('Uploaded Documents:', uploadedDocuments);
      console.log('Documents Array Length:', documents.length);
      console.log('Required Documents:', requiredDocuments);
      console.log('Upload Percentage:', uploadPercentage);

      const assignedFrameworksCount = assignedFrameworks.length || 0; // Use length of assigned frameworks array
      const totalAvailableFrameworks = allFrameworks.length || 60; // Use length of all frameworks array
      const frameworkCoverage = totalAvailableFrameworks > 0 ? (assignedFrameworksCount / totalAvailableFrameworks) * 100 : 0;

      // DEBUG: Log framework coverage calculation
      console.log('🔍 DEBUG - Framework Coverage Calculation:');
      console.log('Assigned Frameworks:', assignedFrameworksCount);
      console.log('Total Available Frameworks:', totalAvailableFrameworks);
      console.log('Framework Coverage:', frameworkCoverage);

      const criticalIssues = auditGaps.filter((gap: any) => gap.severity === 'critical').length;
      
      // Calculate risk exposure based on assigned frameworks only
      const frameworks: any[] = assignedFrameworks || [];
      const riskExposure = calculateRiskExposure(frameworks);
      
      // DEBUG: Log risk exposure calculation
      console.log('🔍 DEBUG - Risk Exposure Calculation:');
      console.log('Frameworks:', frameworks.map((f: any) => ({ name: f.name, riskLevel: f.riskLevel })));
      console.log('Calculated Risk Exposure:', riskExposure);
      
      const complianceScore = Math.round(completionRate); // Use completion rate as compliance score

      // DEBUG: Log the calculated compliance score
      console.log('🔍 DEBUG - Compliance Score Calculation:');
      console.log('Raw completionRate:', completionRate);
      console.log('Final complianceScore:', complianceScore);
      
      // Calculate controls metrics (same approach as controls page - task-based metrics)
      const totalControls = Array.isArray(controls) ? controls.length : 0;
      
      // Calculate task-based metrics across all controls (same as controls page)
      let completedTasksAcrossControls = 0;
      let inProgressTasksAcrossControls = 0;
      let totalTasksAcrossControls = 0;
      
      if (Array.isArray(controls) && controls.length > 0) {
        // For each control, get its task stats (same logic as useControlsData)
        for (const control of controls) {
          try {
            const tasksRes = await apiService.getTasksByControl(control.id);
            if (tasksRes.success && tasksRes.data) {
              const tasks = tasksRes.data || [];
              const completedTasks = tasks.filter((task: any) => task.status === 'completed').length;
              const inProgressTasks = tasks.filter((task: any) => task.status === 'in-progress').length;
              const controlTotalTasks = tasks.length;

              completedTasksAcrossControls += completedTasks;
              inProgressTasksAcrossControls += inProgressTasks;
              totalTasksAcrossControls += controlTotalTasks;
            }
          } catch (error) {
            console.error(`Error fetching tasks for control ${control.id}:`, error);
          }
        }
      }
      
      const completedControls = completedTasksAcrossControls; // Use completed tasks as "completed controls"
      const inProgressControls = inProgressTasksAcrossControls; // Use in-progress tasks as "in-progress controls"
      const notStartedControls = totalTasksAcrossControls - completedTasksAcrossControls - inProgressTasksAcrossControls;
      const controlsCompletionRate = totalTasksAcrossControls > 0 ? (completedTasksAcrossControls / totalTasksAcrossControls) * 100 : 0;

      // DEBUG: Log controls calculation
      console.log('🔍 DEBUG - Controls Calculation (Task-based):');
      console.log('Total Controls:', totalControls);
      console.log('Total Tasks Across Controls:', totalTasksAcrossControls);
      console.log('Completed Tasks (as Controls):', completedControls);
      console.log('In Progress Tasks (as Controls):', inProgressControls);
      console.log('Not Started Tasks (as Controls):', notStartedControls);
      console.log('Controls Completion Rate:', controlsCompletionRate);

      // Determine risk level based on compliance score and critical issues
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (complianceScore < 50 || criticalIssues > 5) {
        riskLevel = 'critical';
      } else if (complianceScore < 70 || criticalIssues > 2) {
        riskLevel = 'high';
      } else if (complianceScore < 85 || criticalIssues > 0) {
        riskLevel = 'medium';
      }

      const nextData: DashboardMetrics = {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        completionRate,
        uploadedDocuments: uploadedDocuments, // Just the uploaded documents
        requiredDocuments,
        uploadPercentage,
        assignedFrameworks: assignedFrameworksCount,
        totalAvailableFrameworks,
        frameworkCoverage,
        criticalIssues,
        riskExposure,
        complianceScore,
        totalControls,
        completedControls,
        inProgressControls,
        notStartedControls,
        controlsCompletionRate,
        riskLevel,
      };

      setData(nextData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      // Do not inject demo data. Keep previous data if any; otherwise leave null.
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth and entity to finish loading
    if (authLoading || !selectedEntity) return;

    const orgId = organizationId || user?.organizationId;
    if (!orgId) {
      setIsLoading(false);
      setError('No organization ID available');
      return;
    }

    fetchDashboardData();
  }, [authLoading, organizationId, user?.organizationId, selectedEntity, stableActiveFrameworkIds]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}
