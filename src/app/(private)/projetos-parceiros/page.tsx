import { ModuleLayout } from '@/components/ui/module-layout';
import { federationService } from '@/lib/modules/federation/federation-service';
import { teamService } from '@/lib/modules/team/team-service';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';
import { partnerProjectService } from '@/lib/modules/partner-project/partner-project-service';
import { deletePartnerProjectAction } from '@/lib/modules/partner-project/partner-project-actions';
import { DataListContextProvider } from '@/contexts/data-list-context';
import { DataListToolbar } from '@/components/ui/data-list/data-list-toolbar';
import { ProjectPartnersList } from './list';

export default async function PartnerProjectPage ({ searchParams }: { searchParams: Promise<{ name?: string, federationId?: string, teamId?: string }> }) {
  const { name, federationId, teamId } = await searchParams;

  const federations = (await federationService().getAllSmall())
    .map((fed) => ({ value: fed.id!, label: fed.name! }))
    .filter((fed) => fed.label != 'CBHG');
  const teams = (await teamService().getAllSmall())
    .map((team) => ({ value: team.id!, label: team.name! }))
  const partnerProjects = await partnerProjectService().getAll({
    includeFederation: true,
    includeTeam: true,
    filters: {
      name,
      federationId,
      teamId,
    }
  });
  const user = await getLoggedUserAction();

  return (
    <ModuleLayout breadcrumbItems={[{ label: 'Projetos parceiros', href: '/projetos-parceiros' }]}>
      <DataListContextProvider
        user={user!}
        data={partnerProjects}
        baseUrl="/projetos-parceiros"
        deleteFc={deletePartnerProjectAction}
      >
        <DataListToolbar
          filters={[
            {
              label: 'Buscar por nome',
              key: 'name',
              type: 'text',
            },
            {
              label: 'Federacao',
              key: 'federationId',
              type: 'select',
              options: federations,
            },
            {
              label: 'Clube',
              key: 'teamId',
              type: 'select',
              options: teams,
            },
          ]}
          createBtn={{
            label: 'Novo projeto',
            href: '/projetos-parceiros/novo',
          }}
        />
        <ProjectPartnersList />
      </DataListContextProvider>
    </ModuleLayout>
  );
}
