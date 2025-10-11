// Authentication utilities for storing and retrieving tokens

export const storeAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    sessionStorage.setItem('authToken', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try localStorage first
  const token = localStorage.getItem('authToken');
  if (token) return token;
  
  // Try sessionStorage as fallback
  const sessionToken = sessionStorage.getItem('authToken');
  if (sessionToken) return sessionToken;
  
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

