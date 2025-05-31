import { ModuleLayout } from '@/components/ui/module-layout';
import { DataList } from '@/components/ui/data-list';
import { federationService } from '@/lib/modules/federation/federation-service';
import { teamService } from '@/lib/modules/team/team-service';
import { USER_ROLE } from '@/generated/prisma';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';
import { deleteTeamAction } from '@/lib/modules/team/team-actions';

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
      <DataList
        data={teams}
        caption="Listagem de clubes"
        lineKey="id"
        filterUrl="/clubes"
        user={user!}
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
        ]}
        headerBtn={{
          label: 'Novo clube',
          href: '/clubes/novo',
        }}
        tableSettings={[
          {
            name: 'Sigla - Nome',
            key: ['initials', 'name'],
            lineClassname: 'font-medium',
          },
          { name: 'Federação', key: 'federation.initials', headerClassname: 'hidden md:table-cell', emptyValue: '-' },
          { name: 'Presidente', key: 'presidentName', headerClassname: 'hidden lg:table-cell', emptyValue: '-' },
        ]}
        actions={[
          {
            type: 'EDIT',
            roles: [USER_ROLE.ADMIN, USER_ROLE.ADMINTEAM],
            blockBy: 'ROLE',
            blockRelation: 'FEDERATION',
            blockRelationId: 'id',
            editUrl: '/clubes',
          },
          {
            type: 'DELETE',
            roles: [USER_ROLE.ADMIN],
            blockBy: 'ROLE',
            blockRelation: 'FEDERATION',
            action: deleteTeamAction
          },
          {
            type: 'VIEW',
            detailsUrl: '/clubes',
          },
        ]}
      />
    </ModuleLayout>
  );
}
