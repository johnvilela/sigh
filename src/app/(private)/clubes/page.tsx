import { ModuleLayout } from '@/components/ui/module-layout';
import { DataList } from '@/components/ui/data-list';
import { FederationService } from '@/lib/modules/federation/federation-service';
import { teamService } from '@/lib/modules/team/team-service';
import { USER_ROLE } from '@/generated/prisma';
import { GetLoggedUserAction } from '@/lib/modules/user/user-actions';

export default async function TeamsPage ({ searchParams }: { searchParams: { name?: string } }) {
  const federations = (await FederationService().getAllSmall())
    .map((fed) => ({ value: fed.id!, label: fed.name! }))
    .filter((fed) => fed.label != 'CBHG');
  const teams = await teamService().getAll({
    includeFederation: true,
    filter: searchParams,
  });
  const user = await GetLoggedUserAction();

  return (
    <ModuleLayout breadcrumbItems={[{ label: 'Clubes', href: '/app/clubes' }]}>
      <DataList
        data={teams}
        caption="Listagem de clubes"
        lineKey="id"
        filterUrl="/app/clubes"
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
          href: '/app/clube/novo',
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
            blockBy: 'RELATED',
            blockRelation: 'FEDERATION',
            blockRelationId: 'id',
            editUrl: '/app/clubes',
          },
          {
            type: 'DELETE',
            roles: [USER_ROLE.ADMIN],
            blockBy: 'ROLE',
            blockRelation: 'FEDERATION',
          },
          {
            type: 'VIEW',
            detailsUrl: '/app/clubes',
          },
        ]}
      />
    </ModuleLayout>
  );
}
