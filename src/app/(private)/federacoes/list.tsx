'use client';

import { DataList } from "@/components/ui/data-list";
import { DeleteAction } from "@/components/ui/data-list/actions/delete-action";
import { DetailsAction } from "@/components/ui/data-list/actions/details-action";
import { EditAction } from "@/components/ui/data-list/actions/edit-action";

export function FederationList () {
  const baseUrl = '/federacoes';

  return (
    <DataList
      caption="Listagem de federações"
      lineKey="id"
      baseUrl={baseUrl}
      emptyMessage={
        { description: 'Nenhuma federação encontrada' }
      }
      table={[
        {
          header: 'Sigla - UF',
          key: ['initials', 'uf'],
          classname: 'w-36 font-medium',
        },
        {
          header: 'Nome',
          key: 'name',
          classname: 'hidden md:table-cell',
        },
        {
          header: 'Presidente',
          key: 'presidentName',
          classname: 'hidden lg:table-cell',
          emptyValue: '-'
        },
      ]}
      action={(item) => <>
        <DetailsAction href={`${baseUrl}/${item.id}`} />
        <EditAction href={`${baseUrl}/${item.id}/editar`} />
        <DeleteAction id={item.id} />
      </>}
    />
  )
}