'use client';

import { ModuleLayout } from '@/components/ui/module-layout';

export default function DashboardPage() {
  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Dashboard', href: '/dashboard' },
      ]}
    >
      <h1>DASHBOARD</h1>
    </ModuleLayout>
  );
}
