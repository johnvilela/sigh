import { PartnerProjectForm } from '@/components/forms/partner-project-form';
import { ModuleLayout } from '@/components/ui/module-layout';
import { partnerProjectService } from '@/lib/modules/partner-project/partner-project-service';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';

export default async function EditPartnerProjectPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partnerProject = await partnerProjectService().getById({ id, includeFederation: true, includeTeam: true });
  const user = await getLoggedUserAction();

  const transformedPartnerProject = partnerProject ? {
    ...partnerProject,
    address: partnerProject.address ? {
      city: partnerProject.address.city || '',
      uf: partnerProject.address.uf || '',
      complement: partnerProject.address.complement || ''
    } : undefined
  } : undefined;

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Projetos parceiros', href: '/projetos-parceiros' },
        { label: partnerProject?.name || 'Projeto', href: `/projetos-parceiros/${id}` },
        { label: 'Editar', href: `/projetos-parceiros/${id}/editar` },
      ]}
    >
      <PartnerProjectForm user={user!} partnerProject={transformedPartnerProject} isEditing />
    </ModuleLayout>
  );
}