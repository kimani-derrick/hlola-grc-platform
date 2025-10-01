import type { Metadata } from 'next';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardContent from '../../components/DashboardContent';
import ProtectedRoute from '../../components/ProtectedRoute';
import { EntityProvider } from '../../context/EntityContext';

export const metadata: Metadata = {
  title: 'Dashboard - hlola GRC Platform',
  description: 'Your comprehensive compliance, risk, and governance dashboard.',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <EntityProvider>
        <DashboardLayout>
          <DashboardContent />
        </DashboardLayout>
      </EntityProvider>
    </ProtectedRoute>
  );
}
