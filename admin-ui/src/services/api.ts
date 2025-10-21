const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
      const data = await response.json();

      if (!response.ok) {
        console.error('API request failed:', data);
        return {
          success: false,
          error: data.error || 'Request failed',
          message: data.message || 'An error occurred',
        };
      }

      console.log('API request successful:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
      return {
        success: false,
        error: 'Network error',
        message: `Unable to connect to the server: ${error.message}`,
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentAdmin(): Promise<ApiResponse<LoginResponse['admin']>> {
    return this.makeRequest<LoginResponse['admin']>('/api/admin/auth/me');
  }

  async changePassword(passwords: ChangePasswordRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/admin/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  }

  // Token management
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new ApiService();
