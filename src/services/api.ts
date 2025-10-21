// API service for dashboard data
import { getAuthToken } from '../utils/auth';
import { env } from '../config/environment';

const API_BASE_URL = env.apiUrl;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardData {
  overview: {
    totalEntities: number;
    totalFrameworks: number;
    totalTasks: number;
    totalControls: number;
    totalDocuments: number;
    totalRisks: number;
    avgComplianceScore: number;
    criticalIssues: number;
    riskExposure: number;
  };
  tasks: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  frameworks: {
    assignedFrameworks: number;
    totalAvailableFrameworks: number;
    coveragePercentage: number;
  };
  documents: {
    uploadedDocuments: number;
    requiredDocuments: number;
    uploadPercentage: number;
  };
  compliance: {
    score: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    lastAuditDate?: string;
  };
}

export interface Entity {
  id: string;
  name: string;
  country: string;
  type: 'branch' | 'subsidiary' | 'office';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  complianceScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  lastAuditDate?: string;
  organizationId: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return getAuthToken();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      // Ensure we bypass any browser cache on all API calls
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Handle 304 Not Modified - browser will use cached data
      if (response.status === 304) {
        // For 304 responses, we need to make a fresh request without cache
        const freshConfig = {
          ...config,
          cache: 'reload' as RequestCache,
        };
        const freshResponse = await fetch(`${API_BASE_URL}${endpoint}`, freshConfig);
        const freshData = await freshResponse.json();
        
        if (!freshResponse.ok) {
          return {
            success: false,
            error: freshData.error || freshData.message || 'Request failed',
          };
        }
        
        return {
          success: true,
          data: freshData.data || freshData,
        };
      }
      
      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          // Clear stored tokens
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
          }
          return {
            success: false,
            error: 'Session expired. Please log in again.',
          };
        }
        
        return {
          success: false,
          error: data.error || data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Dashboard data - using simple tasks API instead of complex compliance endpoints
  async getTaskStats(organizationId: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/tasks/stats`);
  }

  async getAllTasks(organizationId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>(`/tasks`);
  }

  // Entities
  async getEntities(organizationId: string): Promise<ApiResponse<Entity[]>> {
    return this.makeRequest<Entity[]>(`/entities`);
  }

  // Tasks
  async getTasks(organizationId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/tasks`);
  }

  // Reports
  async getTasksReport(organizationId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/reports/tasks`);
  }

  async getFrameworksReport(organizationId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/reports/frameworks`);
  }

  // Frameworks
  async getFrameworks(): Promise<ApiResponse<any[]>> {
    const response = await this.makeRequest('/frameworks');
    
    // If the request failed, return the error response as-is
    if (!response.success) {
      return response as ApiResponse<any[]>;
    }
    
    // Backend returns { success, frameworks, pagination }
    // Normalize into ApiResponse<{data: frameworks[]}>
    // Try response.data.frameworks first, then response.frameworks
    const anyResponse: any = response as any;
    const frameworks = anyResponse?.data?.frameworks || anyResponse?.frameworks;

    if (Array.isArray(frameworks)) {
      return {
        success: true,
        data: frameworks,
        error: undefined
      };
    }
    
    return {
      success: false,
      error: 'No frameworks data received',
      data: []
    };
  }

  async getEntityFrameworks(entityId: string): Promise<ApiResponse<any[]>> {
    const response = await this.makeRequest(`/entities/${entityId}/frameworks`);
    if (!response.success) return response as any;
    const anyResp: any = response as any;
    const rows = anyResp?.data?.frameworks || anyResp?.frameworks || anyResp?.data || [];
    return {
      success: true,
      data: rows,
    } as any;
  }

  async downloadDocument(filePath: string): Promise<Response> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    return fetch(`${API_BASE_URL}/documents/${filePath}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async assignFrameworkToEntity(entityId: string, frameworkId: string, payload?: { complianceScore?: number; auditReadinessScore?: number; certificationStatus?: string }): Promise<ApiResponse<any>> {
    const body = {
      complianceScore: payload?.complianceScore ?? 0,
      auditReadinessScore: payload?.auditReadinessScore ?? 0,
      certificationStatus: payload?.certificationStatus ?? 'not-applicable'
    };
    return this.makeRequest(`/entities/${entityId}/frameworks/${frameworkId}`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Controls
  async getControlsByFramework(frameworkId: string): Promise<ApiResponse<any>> {
    const response = await this.makeRequest(`/controls/framework/${frameworkId}`);
    if (!response.success) return response;
    const anyResp: any = response as any;
    const controls = anyResp?.data?.controls || anyResp?.controls || anyResp?.data || [];
    return {
      success: true,
      data: controls,
      error: null
    } as any;
  }


  // Tasks by Framework
  async getTasksByFramework(frameworkId: string, isActive?: boolean): Promise<ApiResponse<any[]>> {
    const queryParam = isActive !== undefined ? `?isActive=${isActive}` : '';
    const response = await this.makeRequest(`/tasks/frameworks/${frameworkId}${queryParam}`);
    if (!response.success) return response as ApiResponse<any[]>;
    const anyResp: any = response as any;
    const tasks = anyResp?.data?.tasks || anyResp?.tasks || anyResp?.data || [];
    return {
      success: true,
      data: tasks,
      error: undefined
    } as ApiResponse<any[]>;
  }

  // Tasks by Control
  async getTasksByControl(controlId: string): Promise<ApiResponse<any[]>> {
    const response = await this.makeRequest(`/tasks/controls/${controlId}`);
    if (!response.success) return response as ApiResponse<any[]>;
    const anyResp: any = response as any;
    const tasks = anyResp?.data?.tasks || anyResp?.tasks || anyResp?.data || [];
    return {
      success: true,
      data: tasks,
      error: undefined
    } as ApiResponse<any[]>;
  }

  async getControlsGroupedByFramework(): Promise<ApiResponse<Array<{ framework_id: string; control_count: number }>>> {
    const response = await this.makeRequest(`/controls/grouped/framework`);
    if (!response.success) return response as any;
    const anyResp: any = response as any;
    const rows = anyResp?.data?.groupedControls || anyResp?.groupedControls || anyResp?.data || [];
    const normalized = Array.isArray(rows)
      ? rows.map((r: any) => ({ framework_id: r.framework_id, control_count: Number(r.control_count) || 0 }))
      : [];
    return { success: true, data: normalized };
  }

  // Documents
  async getDocuments(organizationId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/documents?organizationId=${organizationId}`);
  }

  async getEntityDocuments(entityId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/documents/entities/${entityId}`);
  }

  // Audit gaps
  async getAuditGaps(organizationId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/audit-gaps?organizationId=${organizationId}`);
  }

  // User profile
  async getUserProfile(): Promise<ApiResponse<any>> {
    const response = await this.makeRequest('/auth/profile');
    return response;
  }

  // Comments
  async createComment(commentData: {
    entityId?: string;
    taskId?: string;
    controlId?: string;
    frameworkId?: string;
    parentCommentId?: string;
    content: string;
    commentType?: 'general' | 'update' | 'question' | 'resolution' | 'note';
    isInternal?: boolean;
    isResolved?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async getCommentsByTask(taskId: string): Promise<ApiResponse<any[]>> {
    const response = await this.makeRequest(`/comments/tasks/${taskId}`);
    if (!response.success) return response as ApiResponse<any[]>;
    const anyResp: any = response as any;
    const comments = anyResp?.data?.comments || anyResp?.comments || anyResp?.data || [];
    return {
      success: true,
      data: comments,
      error: undefined
    } as ApiResponse<any[]>;
  }

  async getCommentsByEntity(entityId: string): Promise<ApiResponse<any[]>> {
    const response = await this.makeRequest(`/comments/entities/${entityId}`);
    if (!response.success) return response as ApiResponse<any[]>;
    const anyResp: any = response as any;
    const comments = anyResp?.data?.comments || anyResp?.comments || anyResp?.data || [];
    return {
      success: true,
      data: comments,
      error: undefined
    } as ApiResponse<any[]>;
  }

  async updateComment(commentId: string, updateData: {
    content?: string;
    commentType?: 'general' | 'update' | 'question' | 'resolution' | 'note';
    isInternal?: boolean;
    isResolved?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteComment(commentId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  }

  async getCommentStats(): Promise<ApiResponse<any>> {
    const response = await this.makeRequest('/comments/stats');
    return response;
  }

  // Task Management
  async createTask(taskData: {
    controlId: string;
    title: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
    category?: string;
    assigneeId?: string;
    dueDate?: string;
    estimatedHours?: number;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTaskStatus(taskId: string, status: string, progress?: number, actualHours?: number): Promise<ApiResponse<any>> {
    const body: any = { status };
    if (progress !== undefined) body.progress = progress;
    if (actualHours !== undefined) body.actualHours = actualHours;
    
    return this.makeRequest(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // Document Management
  async uploadDocument(formData: FormData): Promise<ApiResponse<any>> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    return {
      success: response.ok,
      data: data.data || data,
      error: response.ok ? undefined : data.error || data.message
    };
  }

  async getDocumentsByTask(taskId: string): Promise<ApiResponse<any[]>> {
    const response = await this.makeRequest(`/documents/tasks/${taskId}`);
    if (!response.success) return response as ApiResponse<any[]>;
    const anyResp: any = response as any;
    const documents = anyResp?.data?.documents || anyResp?.documents || anyResp?.data || [];
    return {
      success: true,
      data: documents,
      error: undefined
    } as ApiResponse<any[]>;
  }
}

export const apiService = new ApiService();
