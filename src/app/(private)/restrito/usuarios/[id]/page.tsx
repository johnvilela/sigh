import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ModuleLayout } from "@/components/ui/module-layout";
import { Text } from "@/components/ui/text";
import { userService } from "@/lib/modules/user/user-service";
import { formatRelationshipName, FormatRelationshipNameParam } from "@/lib/utils/format-relationship-name";

export default async function RestrictUsersDetailsPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await userService().findOne({ id, includeFederation: true, includeTeam: true });

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Usuários', href: '/restrito/usuarios' },
        { label: user?.name || 'User', href: `/restrito/usuarios/${id}` },
      ]}
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <Heading variant='h2'>{user?.name}</Heading>
          <Text variant='small'>{user.email} - {formatRelationshipName(user as unknown as FormatRelationshipNameParam)}</Text>
        </CardHeader>
        <CardContent>
          <Heading variant='h3'>Histórico</Heading>
          <Text>Nenhum log de histórico ainda</Text>
        </CardContent>
      </Card>
    </ModuleLayout>
  )
}