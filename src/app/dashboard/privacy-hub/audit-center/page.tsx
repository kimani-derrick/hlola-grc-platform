'use client';

import DashboardLayout from '../../../../components/DashboardLayout';
import AuditSection from '../../../../components/AuditSection';

export default function AuditCenterPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <AuditSection />
      </div>
    </DashboardLayout>
  );
}
