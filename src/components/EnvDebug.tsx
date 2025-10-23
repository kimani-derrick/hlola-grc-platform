'use client';

import { env } from '../config/environment';

export default function EnvDebug() {
  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      background: 'red', 
      color: 'white', 
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</div>
      <div>env.apiUrl: {env.apiUrl}</div>
      <div>NODE_ENV: {process.env.NODE_ENV}</div>
    </div>
  );
}
