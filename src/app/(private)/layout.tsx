import { AppLayout } from '@/components/ui/app-layout.tsx';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ValidateSessionAction } from '@/lib/modules/session/session-actions';

export default async function PrivateLayout ({ children }: { children: React.ReactNode }) {
  await ValidateSessionAction();

  return (
    <SidebarProvider>
      <AppLayout />
      <main className="p-8 w-full">{children}</main>
    </SidebarProvider>
  );
}
