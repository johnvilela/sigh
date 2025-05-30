import { DataList } from "@/components/ui/data-list";
import { ModuleLayout } from "@/components/ui/module-layout";
import { USER_ROLE } from "@/generated/prisma";
import { FederationService } from "@/lib/modules/federation/federation-service";
import { GetLoggedUserAction } from "@/lib/modules/user/user-actions";

export default async function FederationsPage ({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const { name } = await searchParams;
  const user = await GetLoggedUserAction();

  const federations = await FederationService().getAll({ name });

  return (
    <ModuleLayout breadcrumbItems={[{ label: 'Federações', href: '/app/federacoes' }]}>
      <DataList
        data={federations}
        caption="Listagem de federações"
        lineKey="id"
        filterUrl="/federacoes"
        customError={
          { description: 'Nenhuma federação encontrada' }
        }
        filters={[
          {
            label: 'Buscar por nome',
            key: 'name',
            type: 'text',
          },
        ]}
        user={user!}
        headerBtn={{
          label: 'Nova federação',
          href: '/federacoes/novo',
        }}
        tableSettings={[
          {
            name: 'Sigla - UF',
            key: ['initials', 'uf'],
            headerClassname: 'w-36',
            lineClassname: 'font-medium',
          },
          { name: 'Nome', key: 'name', headerClassname: 'hidden md:table-cell' },
          { name: 'Presidente', key: 'presidentName', headerClassname: 'hidden lg:table-cell', emptyValue: '-' },
        ]}
        actions={[
          {
            type: 'EDIT',
            roles: [USER_ROLE.ADMIN, USER_ROLE.ADMINFEDERATION],
            blockBy: 'ROLE',
            blockRelation: 'FEDERATION',
            blockRelationId: 'id',
            editUrl: '/federacoes',
          },
          {
            type: 'DELETE',
            roles: [USER_ROLE.ADMIN],
            blockBy: 'ROLE',
            blockRelation: 'FEDERATION',
          },
          {
            type: 'VIEW',
            detailsUrl: '/federacoes',
          },
        ]}
      />
    </ModuleLayout>
  )
}