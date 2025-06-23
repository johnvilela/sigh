import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ModuleLayout } from "@/components/ui/module-layout";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { partnerProjectService } from "@/lib/modules/partner-project/partner-project-service";
import dayjs from "dayjs";
import { MapPin, Phone, Users } from "lucide-react";

export default async function PartnerProjectDetailsPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partnerProject = await partnerProjectService().getById({ id, includeFederation: true, includeTeam: true });

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Projetos parceiros', href: '/projetos-parceiros' },
        { label: partnerProject?.name || 'Projeto', href: `/projetos-parceiros/${id}` },
      ]}
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <Heading variant='h2'>{partnerProject?.name}</Heading>
          <Text variant='small'>{dayjs(partnerProject?.initialDate).format('DD/MM/YYYY')} - {dayjs(partnerProject?.finalDate).format('DD/MM/YYYY')}</Text>
          <Text className="mb-0">{partnerProject?.description}</Text>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <Heading variant='h4' className="flex gap-2"><Users /> Dados de participantes</Heading>
          <Text>
            Idade: {partnerProject?.ageGroupStart} - {partnerProject?.ageGroupEnd} <br />
            Feminino: {partnerProject?.femalePractitioners} <br />
            Masculino: {partnerProject?.malePractitioners}
          </Text>
          <Separator className="my-4" />
          <Heading variant='h4' className="flex gap-2"><Phone />Contato</Heading>
          <Text>{partnerProject?.contactName}: {partnerProject?.contactPhone}</Text>
          <Separator className="my-4" />
          <Heading variant='h4' className="flex gap-2"><MapPin />Endereço</Heading>
          <Text>{partnerProject?.address?.city}, {partnerProject?.address?.uf} - {partnerProject?.address?.complement}</Text>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}