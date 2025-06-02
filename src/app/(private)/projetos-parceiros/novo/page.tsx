import { PartnerProjectForm } from '@/components/forms/partner-project-form';
import { ModuleLayout } from '@/components/ui/module-layout';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';

export default async function NewPartnerProjectPage () {
  const user = await getLoggedUserAction();

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Projetos parceiros', href: '/projetos-parceiros' },
        { label: 'Novo projeto', href: '/projetos-parceiros/novo' },
      ]}
    >
      <PartnerProjectForm user={user!} />
    </ModuleLayout>
  );
}