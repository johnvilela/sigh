import { TeamForm } from '@/components/forms/team-form';
import { ModuleLayout } from '@/components/ui/module-layout';
import { federationService } from '@/lib/modules/federation/federation-service';

export default async function NewTeamPage () {
  const federations = await federationService().getAllSmall();

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Clubes', href: '/clubes' },
        { label: 'Novo clube', href: '/clubes/novo' },
      ]}
    >
      <TeamForm federations={federations} />
    </ModuleLayout>
  );
}