import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  color: 'red' | 'orange' | 'blue';
  type: 'audit_gap' | 'task' | 'document';
}

interface PriorityAction {
  id: string;
  title: string;
  dueDate: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  color: 'red' | 'orange' | 'blue';
}

interface ActivitiesData {
  recentActivities: ActivityItem[];
  priorityActions: PriorityAction[];
  loading: boolean;
  error: string | null;
}

export function useActivitiesData(organizationId: string | undefined): ActivitiesData {
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [priorityActions, setPriorityActions] = useState<PriorityAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchActivitiesData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from multiple APIs in parallel
        const [auditGapsResponse, tasksResponse, documentsResponse, highPriorityTasksResponse, mediumAuditGapsResponse] = await Promise.all([
          apiService.makeRequest(`/audit-gaps?organizationId=${organizationId}&limit=3`),
          apiService.makeRequest(`/tasks?limit=3`),
          apiService.makeRequest(`/documents?organizationId=${organizationId}&limit=3`),
          apiService.makeRequest(`/tasks?priority=high&status=pending&limit=3`),
          apiService.makeRequest(`/audit-gaps?organizationId=${organizationId}&severity=medium&status=open&limit=3`)
        ]);

        // Process Recent Activities
        const activities: ActivityItem[] = [];

        // Add audit gaps
        if (auditGapsResponse.success && auditGapsResponse.data) {
          const auditGaps = auditGapsResponse.data.map((gap: any) => ({
            id: gap.id,
            title: gap.title,
            timestamp: gap.created_at,
            color: gap.severity === 'critical' ? 'red' : gap.severity === 'high' ? 'orange' : 'blue',
            type: 'audit_gap' as const
          }));
          activities.push(...auditGaps);
        }

        // Add tasks
        if (tasksResponse.success && tasksResponse.tasks) {
          const tasks = tasksResponse.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            timestamp: task.updated_at || task.created_at,
            color: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'blue',
            type: 'task' as const
          }));
          activities.push(...tasks);
        }

        // Add documents
        if (documentsResponse.success && documentsResponse.documents) {
          const documents = documentsResponse.documents.map((doc: any) => ({
            id: doc.id,
            title: `${doc.uploader_first_name} uploaded ${doc.name}`,
            timestamp: doc.created_at,
            color: 'blue' as const,
            type: 'document' as const
          }));
          activities.push(...documents);
        }

        // Sort by timestamp and take the 3 most recent
        const sortedActivities = activities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3);

        setRecentActivities(sortedActivities);

        // Process Priority Actions
        const actions: PriorityAction[] = [];

        // Add high priority tasks
        if (highPriorityTasksResponse.success && highPriorityTasksResponse.tasks) {
          const highPriorityTasks = highPriorityTasksResponse.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString() : 'ASAP',
            priority: 'HIGH' as const,
            color: 'red' as const
          }));
          actions.push(...highPriorityTasks);
        }

        // Add medium audit gaps
        if (mediumAuditGapsResponse.success && mediumAuditGapsResponse.data) {
          const mediumGaps = mediumAuditGapsResponse.data.map((gap: any) => ({
            id: gap.id,
            title: gap.title,
            dueDate: 'ASAP',
            priority: 'MEDIUM' as const,
            color: 'orange' as const
          }));
          actions.push(...mediumGaps);
        }

        // Take the first 3 priority actions
        setPriorityActions(actions.slice(0, 3));

      } catch (err) {
        console.error('Error fetching activities data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activities data');
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesData();
  }, [organizationId]);

  return {
    recentActivities,
    priorityActions,
    loading,
    error
  };
}
