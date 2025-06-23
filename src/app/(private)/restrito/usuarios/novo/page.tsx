import { RestrictUserForm } from '@/components/forms/restrict-user-form';
import { ModuleLayout } from '@/components/ui/module-layout';
import { federationService } from '@/lib/modules/federation/federation-service';
import { teamService } from '@/lib/modules/team/team-service';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';

export default async function NewRestrictUserPage () {
  await getLoggedUserAction();
  const federations = await federationService().getAllSmall();
  const teams = await teamService().getAllSmall();

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Usuários do sistema', href: '/restrito/usuarios' },
        { label: 'Novo usuário', href: '/restrito/usuarios/novo' },
      ]}
    >
      <RestrictUserForm federations={federations || undefined} teams={teams} />
    </ModuleLayout>
  );
}