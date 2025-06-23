import { RestrictUserForm } from "@/components/forms/restrict-user-form";
import { ModuleLayout } from "@/components/ui/module-layout";
import { federationService } from "@/lib/modules/federation/federation-service";
import { teamService } from "@/lib/modules/team/team-service";
import { userService } from "@/lib/modules/user/user-service";

export default async function EditRestrictUsersPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await userService().findOne({ id, includeFederation: true, includeTeam: true });
  const federations = await federationService().getAllSmall();
  const teams = await teamService().getAllSmall();

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Usuários', href: '/restrito/usuarios' },
        { label: user?.name || 'User', href: `/restrito/usuarios/${id}` },
      ]}
    >
      <RestrictUserForm user={user} federations={federations || undefined} teams={teams} isEditing />
    </ModuleLayout>
  )
}
