// Central API configuration utility
import { env } from '../config/environment';

export const API_BASE_URL = env.apiUrl;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

export const apiFetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  return apiFetch(endpoint, config);
};
