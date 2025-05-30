'use client';

import { Button } from '@/components/ui/button';
import { deleteSessionAction } from '@/lib/modules/session/session-actions';

export default function DashboardPage() {
  return (
    <div>
      <h1>DASHBOARD</h1>
      <Button onClick={() => deleteSessionAction()}>Logout</Button>
    </div>
  );
}
