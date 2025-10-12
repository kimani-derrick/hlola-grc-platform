// API service for dashboard data
import { getAuthToken } from '../utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
          cache: 'no-cache' as RequestCache,
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

  // Dashboard data
  async getDashboardData(organizationId: string): Promise<ApiResponse<DashboardData>> {
    return this.makeRequest<DashboardData>(`/reports/overview`);
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
      return response;
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
        error: null
      };
    }
    
    return {
      success: false,
      error: 'No frameworks data received',
      data: []
    };
  }

  async getEntityFrameworks(entityId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/entities/${entityId}/frameworks`);
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
}

export const apiService = new ApiService();
