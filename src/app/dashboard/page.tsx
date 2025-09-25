import type { Metadata } from 'next';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardContent from '../../components/DashboardContent';
import ProtectedRoute from '../../components/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Dashboard - hlola GRC Platform',
  description: 'Your comprehensive compliance, risk, and governance dashboard.',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
