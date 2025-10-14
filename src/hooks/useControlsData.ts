import { useState, useEffect } from 'react';
import { useActiveFrameworks } from '../context/ActiveFrameworksContext';
import { apiService } from '../services/api';
import { Control } from '../components/controls/ControlCard';

// Helper function to map API control data to our Control interface
const mapApiControlToControl = (apiControl: any, frameworkName: string, frameworkId: string): Control => {
  // Ensure we have valid status and priority values
  const validStatuses: Control['status'][] = ['completed', 'in-progress', 'not-started', 'needs-review'];
  const validPriorities: Control['priority'][] = ['high', 'medium', 'low'];
  
  const status = validStatuses.includes(apiControl.status) ? apiControl.status : 'not-started';
  const priority = validPriorities.includes(apiControl.priority) ? apiControl.priority : 'medium';
  
  return {
    id: apiControl.id || apiControl.control_id || '',
    title: apiControl.title || apiControl.control_id || 'Control',
    description: apiControl.description || '',
    country: apiControl.country || 'Unknown',
    framework: frameworkName,
    frameworkId: frameworkId,
    status: status,
    priority: priority,
    category: apiControl.category || 'General',
    dueDate: apiControl.due_date || apiControl.dueDate,
    assignee: apiControl.assignee || apiControl.responsible,
    completionRate: apiControl.completion_rate || apiControl.completionRate || 0,
    estimatedHours: apiControl.estimated_hours || apiControl.estimatedHours,
    businessImpact: apiControl.business_impact || apiControl.businessImpact,
    reference: apiControl.reference || apiControl.article,
    control_id: apiControl.control_id,
    legal_requirements: apiControl.legal_requirements,
    implementation_guidance: apiControl.implementation_guidance,
    evidence_requirements: apiControl.evidence_requirements
  };
};

export function useControlsData() {
  const { activeFrameworkIds } = useActiveFrameworks();
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frameworks, setFrameworks] = useState<any[]>([]);

  // Load controls for active frameworks
  useEffect(() => {
    const loadActiveFrameworkControls = async () => {
      if (activeFrameworkIds.length === 0) {
        setControls([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // First, get all frameworks to map IDs to names
        const frameworksRes = await apiService.getFrameworks();
        if (frameworksRes.success) {
          setFrameworks(frameworksRes.data || []);
        }

        // Load controls for each active framework
        const allControls: Control[] = [];
        for (const frameworkId of activeFrameworkIds) {
          const res = await apiService.getControlsByFramework(frameworkId);
          if (res.success && res.data) {
            const framework = frameworksRes.data?.find((f: any) => f.id === frameworkId);
            const frameworkName = framework?.name || 'Unknown Framework';
            
            const mappedControls = res.data.map((apiControl: any) => 
              mapApiControlToControl(apiControl, frameworkName, frameworkId)
            );
            allControls.push(...mappedControls);
          }
        }
        
        setControls(allControls);
      } catch (err: any) {
        setError(err.message || 'Failed to load controls');
        console.error('Error loading controls:', err);
      } finally {
        setLoading(false);
      }
    };

    loadActiveFrameworkControls();
  }, [activeFrameworkIds]);

  // Get unique countries and frameworks from loaded controls
  const countries = [...new Set(controls.map(c => c.country))];
  const frameworksList = [...new Set(controls.map(c => c.framework))];

  // Calculate stats based on tasks across all controls (like dashboard)
  const [controlStats, setControlStats] = useState<{
    completedTasks: number;
    inProgressTasks: number;
    overallProgress: number;
  }>({
    completedTasks: 0,
    inProgressTasks: 0,
    overallProgress: 0
  });

  // Fetch task stats for all controls
  useEffect(() => {
    const calculateControlStats = async () => {
      if (controls.length === 0) {
        setControlStats({
          completedTasks: 0,
          inProgressTasks: 0,
          overallProgress: 0
        });
        return;
      }

      try {
        let totalCompletedTasks = 0;
        let totalInProgressTasks = 0;
        let totalTasks = 0;

        // For each control, get its task stats
        for (const control of controls) {
          try {
            // Fetch tasks for this control
            const tasksRes = await apiService.getTasksByControl(control.id);
            if (tasksRes.success && tasksRes.data) {
              const tasks = tasksRes.data || [];
              const completedTasks = tasks.filter((task: any) => task.status === 'completed').length;
              const inProgressTasks = tasks.filter((task: any) => task.status === 'in-progress').length;
              const controlTotalTasks = tasks.length;

              totalCompletedTasks += completedTasks;
              totalInProgressTasks += inProgressTasks;
              totalTasks += controlTotalTasks;
            }
          } catch (error) {
            console.error(`Error fetching tasks for control ${control.id}:`, error);
          }
        }

        const overallProgress = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

        console.log('🔍 DEBUG - Control Stats Calculation (Task-based):');
        console.log('Total Tasks:', totalTasks);
        console.log('Completed Tasks:', totalCompletedTasks);
        console.log('In Progress Tasks:', totalInProgressTasks);
        console.log('Overall Progress:', overallProgress);

        setControlStats({
          completedTasks: totalCompletedTasks,
          inProgressTasks: totalInProgressTasks,
          overallProgress
        });
      } catch (error) {
        console.error('Error calculating control stats:', error);
        setControlStats({
          completedTasks: 0,
          inProgressTasks: 0,
          overallProgress: 0
        });
      }
    };

    calculateControlStats();
  }, [controls]);

  return {
    controls,
    frameworks,
    countries,
    frameworksList,
    loading,
    error,
    completedControls: controlStats.completedTasks, // Now shows completed tasks, not completed controls
    inProgressControls: controlStats.inProgressTasks, // Now shows in-progress tasks, not in-progress controls
    overallProgress: controlStats.overallProgress
  };
}
