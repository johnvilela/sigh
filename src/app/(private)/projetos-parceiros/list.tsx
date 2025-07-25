
'use client';

import { DataList } from "@/components/ui/data-list";
import { DeleteAction } from "@/components/ui/data-list/actions/delete-action";
import { DetailsAction } from "@/components/ui/data-list/actions/details-action";
import { EditAction } from "@/components/ui/data-list/actions/edit-action";
import { formatRelationshipName, FormatRelationshipNameParam } from "@/lib/utils/format-relationship-name";

export function ProjectPartnersList () {
  const baseUrl = '/projetos-parceiros';

  return (
    <DataList
      caption="Listagem de projetos parceiros"
      lineKey="id"
      baseUrl={baseUrl}
      emptyMessage={
        { description: 'Nenhum projeto encontrado' }
      }
      table={[
        {
          header: 'Nome',
          key: 'name',
          classname: 'font-medium',
        },
        {
          header: 'Periodo',
          key: ['initialDate', 'finalDate'],
          format: 'DATE',
          classname: 'hidden md:table-cell',
          emptyValue: '-'
        },
        {
          header: 'Participantes',
          key: 'totalPractitioners',
          classname: 'hidden lg:table-cell',
          emptyValue: '-'
        },
        {
          header: 'Relacionado',
          key: 'id',
          classname: 'hidden lg:table-cell',
          render: (item) => {
            const label = formatRelationshipName(item as unknown as FormatRelationshipNameParam)

            return <span>{label}</span>;
          }
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