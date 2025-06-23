import { ModuleLayout } from "@/components/ui/module-layout";
import { DataListContextProvider } from "@/contexts/data-list-context";
import { USER_ROLE } from "@/generated/prisma";
import { federationService } from "@/lib/modules/federation/federation-service";
import { teamService } from "@/lib/modules/team/team-service";
import { deleteUserAction, getLoggedUserAction } from "@/lib/modules/user/user-actions";
import { userService } from "@/lib/modules/user/user-service";
import { UsersList } from "./list";
import { DataListToolbar } from "@/components/ui/data-list/data-list-toolbar";

export default async function RestrictUsersPage ({ searchParams }: { searchParams: Promise<{ name?: string, federationId?: string, teamId?: string }> }) {
  const { name, federationId, teamId } = await searchParams;
  const user = await getLoggedUserAction();

  const federations = (await federationService().getAllSmall())
    .map((fed) => ({ value: fed.id!, label: fed.name! }))
  const teams = (await teamService().getAllSmall())
    .map((team) => ({ value: team.id!, label: team.name! }))

  const users = await userService().findAll({
    role: [USER_ROLE.ADMIN, USER_ROLE.ADMINFEDERATION, USER_ROLE.ADMINTEAM, USER_ROLE.GOD],
    includeFederation: true,
    includeTeam: true,
    filters: {
      name,
      federationId,
      teamId,
    }
  });

  return (
    <ModuleLayout breadcrumbItems={[{ label: 'Usuários do sistema', href: '/restrito/usuarios' }]}>
      <DataListContextProvider
        user={user!}
        data={users}
        baseUrl="/restrito/usuarios"
        deleteFc={deleteUserAction}
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
            label: 'Novo usuário',
            href: '/restrito/usuarios/novo',
          }}
        />
        <UsersList />
      </DataListContextProvider>
    </ModuleLayout>
  );
}