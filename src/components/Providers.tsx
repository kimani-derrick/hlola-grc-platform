'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../context/AuthContext';
import { ActiveFrameworksProvider } from '../context/ActiveFrameworksContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ActiveFrameworksProvider>
          {children}
        </ActiveFrameworksProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

