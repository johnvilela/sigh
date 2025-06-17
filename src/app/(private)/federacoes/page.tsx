import { DataListToolbar } from "@/components/ui/data-list/data-list-toolbar";
import { ModuleLayout } from "@/components/ui/module-layout";
import { DataListContextProvider } from "@/contexts/data-list-context";
import { deleteFederationAction } from "@/lib/modules/federation/federation-actions";
import { federationService } from "@/lib/modules/federation/federation-service";
import { getLoggedUserAction } from "@/lib/modules/user/user-actions";
import { FederationList } from "./list";

export default async function FederationsPage ({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const { name } = await searchParams;
  const user = await getLoggedUserAction();

  const federations = await federationService().getAll({ name });

  return (
    <ModuleLayout breadcrumbItems={[{ label: 'Federações', href: '/app/federacoes' }]}>
      <DataListContextProvider user={user!} data={federations} baseUrl="/federacoes" deleteFc={deleteFederationAction}>
        <DataListToolbar
          filters={[
            {
              label: 'Buscar por nome',
              key: 'name',
              type: 'text',
            },
          ]}
          createBtn={{
            label: 'Nova federação',
            href: '/federacoes/novo',
          }}
        />
        <FederationList />
      </DataListContextProvider>
    </ModuleLayout>
  )
}