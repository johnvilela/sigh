import { ModuleLayout } from '@/components/ui/module-layout';
import { DataList } from '@/components/ui/data-list';
import { federationService } from '@/lib/modules/federation/federation-service';
import { teamService } from '@/lib/modules/team/team-service';
import { USER_ROLE } from '@/generated/prisma';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';
import { partnerProjectService } from '@/lib/modules/partner-project/partner-project-service';
import { deletePartnerProjectAction } from '@/lib/modules/partner-project/partner-project-actions';

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
      <DataList
        data={partnerProjects}
        caption="Listagem de projetos"
        lineKey="id"
        filterUrl="/projetos-parceiros"
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
          {
            label: 'Clube',
            key: 'teamId',
            type: 'select',
            options: teams,
          },
        ]}
        headerBtn={{
          label: 'Novo projeto',
          href: '/projetos-parceiros/novo',
        }}
        tableSettings={[
          {
            name: 'Nome',
            key: 'name',
            lineClassname: 'font-medium',
          },
          { name: 'Periodo', key: ['initialDate', 'finalDate'], format: 'DATE', headerClassname: 'hidden md:table-cell', emptyValue: '-' },
          { name: 'Participantes', key: 'totalPractitioners', headerClassname: 'hidden lg:table-cell', emptyValue: '-' },
          {
            name: 'Relacionado',
            headerClassname: 'hidden lg:table-cell',
            customFc: 'RELATED'
          },
        ]}
        actions={[
          {
            type: 'EDIT',
            roles: [USER_ROLE.ADMIN, USER_ROLE.ADMINTEAM],
            blockBy: 'ROLE',
            blockRelation: 'FEDERATION',
            blockRelationId: 'id',
            editUrl: '/projetos-parceiros',
          },
          {
            type: 'DELETE',
            roles: [USER_ROLE.ADMIN],
            blockBy: 'ROLE',
            blockRelation: 'FEDERATION',
            action: deletePartnerProjectAction
          },
          {
            type: 'VIEW',
            detailsUrl: '/projetos-parceiros',
          },
        ]}
      />
    </ModuleLayout>
  );
}
