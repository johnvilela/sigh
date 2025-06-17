import { ModuleLayout } from '@/components/ui/module-layout';
import { federationService } from '@/lib/modules/federation/federation-service';
import { teamService } from '@/lib/modules/team/team-service';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';
import { deleteTeamAction } from '@/lib/modules/team/team-actions';
import { DataListContextProvider } from '@/contexts/data-list-context';
import { DataListToolbar } from '@/components/ui/data-list/data-list-toolbar';
import { TeamList } from './list';


export default async function TeamsPage ({ searchParams }: { searchParams: Promise<{ name?: string, federationId?: string }> }) {
  const { name, federationId } = await searchParams;

  const federations = (await federationService().getAllSmall())
    .map((fed) => ({ value: fed.id!, label: fed.name! }))
    .filter((fed) => fed.label != 'CBHG');
  const teams = await teamService().getAll({
    includeFederation: true,
    filter: {
      name,
      federationId
    },
  });
  const user = await getLoggedUserAction();

  return (
    <ModuleLayout breadcrumbItems={[{ label: 'Clubes', href: '/clubes' }]}>
      <DataListContextProvider
        user={user!}
        data={teams} 
        baseUrl="/clubes"
        deleteFc={deleteTeamAction}
      >
        <DataListToolbar
          filters={[
            {
              label: 'Buscar por nome',
              key: 'name',
              type: 'text',
            },
            {
              label: 'Federação',
              key: 'federationId',
              type: 'select',
              options: federations,
            }
          ]}
          createBtn={{
            label: 'Novo clube',
            href: '/clubes/novo',
          }}
        />
        <TeamList />
      </DataListContextProvider>
    </ModuleLayout>
  );
}
