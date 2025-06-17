/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { DataList } from "@/components/ui/data-list";
import { DeleteAction } from "@/components/ui/data-list/actions/delete-action";
import { DetailsAction } from "@/components/ui/data-list/actions/details-action";
import { EditAction } from "@/components/ui/data-list/actions/edit-action";
import { USER_ROLE } from "@/generated/prisma";

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
            if (item?.federation) {
              // @ts-ignore
              return <span>{item.federation.name}</span>;
            }

            if (item.team) {
              // @ts-ignore
              return <span>{item.team.name}</span>;
            }

            if (item?.role === USER_ROLE.GOD) return <span>-</span>;

            return <span>CBHG</span>;
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