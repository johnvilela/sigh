import { TeamForm } from '@/components/forms/team-form';
import { ModuleLayout } from '@/components/ui/module-layout';
import { federationService } from '@/lib/modules/federation/federation-service';
import { teamService } from '@/lib/modules/team/team-service';

export default async function EditTeamPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const federations = await federationService().getAllSmall();
  const team = await teamService().getById({ id });

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Clubes', href: '/clubes' },
        { label: team!.initials!, href: `/clubes/${team!.id}` },
        { label: 'Editar', href: `/clubes/${team!.id}/editar` },
      ]}
    >
      <TeamForm federations={federations} team={team || undefined} isEditing />
    </ModuleLayout>
  );
}