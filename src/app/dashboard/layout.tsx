'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { EntityProvider } from '../../context/EntityContext';

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <EntityProvider>
        {children}
      </EntityProvider>
    </ProtectedRoute>
  );
}


