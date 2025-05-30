import { FederationForm } from '@/components/forms/federation-form';
import { ModuleLayout } from '@/components/ui/module-layout';

export default function NewFederationPage () {
  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Federações', href: '/federacoes' },
        { label: 'Nova federação', href: '/federacoes/nova' },
      ]}
    >
      <FederationForm />
    </ModuleLayout>
  );
}