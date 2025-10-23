// Centralized environment configuration
// This ensures consistent environment variable handling across the application

export interface EnvironmentConfig {
  apiUrl: string;
  nextAuthUrl: string;
  nextAuthSecret: string;
  nodeEnv: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// Environment variable getters with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side: only use NEXT_PUBLIC_ prefixed variables
    return process.env[`NEXT_PUBLIC_${key}`] || fallback;
  }
  // Server-side: can use all environment variables
  return process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || fallback;
};

// Environment configuration
export const env: EnvironmentConfig = {
  // API Configuration
  apiUrl: getEnvVar('API_URL', 'http://localhost:3001') + '/api',
  
  // NextAuth Configuration
  nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET', 'your-secret-key-here'),
  
  // Environment detection
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  
  // Convenience flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Validation function to check required environment variables
export const validateEnvironment = (): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = [];
  
  // Required for all environments
  if (!env.apiUrl) missingVars.push('NEXT_PUBLIC_API_URL');
  if (!env.nextAuthSecret) missingVars.push('NEXTAUTH_SECRET');
  
  // Production-specific requirements
  if (env.isProduction) {
    if (env.nextAuthUrl === 'http://localhost:3000') {
      missingVars.push('NEXTAUTH_URL (should not be localhost in production)');
    }
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Log environment configuration (only in development)
if (env.isDevelopment && typeof window !== 'undefined') {
  console.log('🔧 Environment Configuration:', {
    apiUrl: env.apiUrl,
    nextAuthUrl: env.nextAuthUrl,
    nodeEnv: env.nodeEnv,
  });
}
