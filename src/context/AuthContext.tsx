'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { apiFetch, apiFetchWithAuth } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId?: string;
  entityId?: string;
  department?: string;
  jobTitle?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with backend
          const response = await apiFetchWithAuth('/auth/profile');
          
          if (response.ok) {
            const data = response.data;
            if (data.success && data.user) {
              setUser({
                id: data.user.id,
                name: `${data.user.firstName} ${data.user.lastName}`,
                email: data.user.email,
                role: data.user.role,
                organizationId: data.user.organizationId,
                entityId: data.user.entityId,
                department: data.user.department,
                jobTitle: data.user.jobTitle,
              });
            }
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use our backend API directly instead of NextAuth
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = response.data;

        if (data.success && data.token && data.user) {
          // Store token for API calls
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', data.token);
            sessionStorage.setItem('authToken', data.token);
          }
          
          // Set user state
          setUser({
            id: data.user.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            email: data.user.email,
            role: data.user.role,
            organizationId: data.user.organizationId,
            entityId: data.user.entityId,
            department: data.user.department,
            jobTitle: data.user.jobTitle,
          });
          
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Clear our stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
    
    // Also sign out from NextAuth
    signOut({ redirect: false });
    
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
