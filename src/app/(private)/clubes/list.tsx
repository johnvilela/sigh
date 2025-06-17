'use client';

import { DataList } from "@/components/ui/data-list";
import { DeleteAction } from "@/components/ui/data-list/actions/delete-action";
import { DetailsAction } from "@/components/ui/data-list/actions/details-action";
import { EditAction } from "@/components/ui/data-list/actions/edit-action";

export function TeamList () {
  const baseUrl = '/clubes';

  return (
    <DataList
      caption="Listagem de clubes"
      lineKey="id"
      baseUrl="/clubes"
      emptyMessage={
        { description: 'Nenhum clube encontrada' }
      }
      table={[
        {
          header: 'Sigla - Nome',
          key: ['initials', 'name'],
          classname: 'font-medium',
        },
        {
          header: 'Federação',
          key: 'federation.initials',
          classname: 'hidden md:table-cell',
          emptyValue: '-'
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