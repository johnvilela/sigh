import { FederationForm } from '@/components/forms/federation-form';
import { ModuleLayout } from '@/components/ui/module-layout';
import { federationService } from '@/lib/modules/federation/federation-service';

export default async function EditFederationPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const federation = await federationService().getById({ id });

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Federações', href: '/federacoes' },
        { label: federation!.initials!, href: `/federacoes/${federation!.id}` },
        { label: 'Editar', href: `/federacoes/${federation!.id}/editar` },
      ]}
    >
      <FederationForm federation={federation || undefined} isEditing />
    </ModuleLayout>
  );
}