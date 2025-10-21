'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../services/api';

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = apiService.getToken();
      
      if (!token) {
        setAdmin(null);
        setToken(null);
        return;
      }

      // Verify token with server
      const response = await apiService.getCurrentAdmin();
      
      if (response.success && response.data) {
        setAdmin(response.data);
        setToken(token);
      } else {
        // Token is invalid, clear it
        apiService.removeToken();
        setAdmin(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiService.removeToken();
      setAdmin(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data?.token && response.data?.admin) {
        const { token: newToken, admin: adminData } = response.data;
        
        // Store token and admin data
        apiService.setToken(newToken);
        setToken(newToken);
        setAdmin(adminData);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.removeToken();
    setAdmin(null);
    setToken(null);
    router.push('/');
  };

  const value: AuthContextType = {
    admin,
    token,
    isAuthenticated: !!admin && !!token,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
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
