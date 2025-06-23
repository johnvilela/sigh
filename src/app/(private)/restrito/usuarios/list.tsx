
'use client';

import { DataList } from "@/components/ui/data-list";
import { CopyLinkAction } from "@/components/ui/data-list/actions/copy-link-action";
import { DeleteAction } from "@/components/ui/data-list/actions/delete-action";
import { DetailsAction } from "@/components/ui/data-list/actions/details-action";
import { EditAction } from "@/components/ui/data-list/actions/edit-action";
import { formatRelationshipName, FormatRelationshipNameParam } from "@/lib/utils/format-relationship-name";

export function UsersList () {
  const baseUrl = '/restrito/usuarios';

  return (
    <DataList
      caption="Listagem de usuários do sistema"
      lineKey="id"
      baseUrl="/clubes"
      emptyMessage={
        { description: 'Nenhum usuário encontrada' }
      }
      table={[
        {
          header: 'Nome',
          key: 'name',
          classname: 'font-medium',
        },
        {
          header: 'Tipo',
          key: 'role',
          format: 'USER_ROLE',
          classname: 'hidden md:table-cell',
          emptyValue: '-'
        },
        {
          header: 'E-mail',
          key: 'email',
          classname: 'hidden md:table-cell',
        },
        {
          header: 'Relacionado',
          key: 'id',
          classname: 'hidden md:table-cell',
          render: (item) => {
            const label = formatRelationshipName(item as unknown as FormatRelationshipNameParam)

            return <span>{label}</span>;
          }
        }
      ]}
      action={(item) => <>
        {item.newPasswordId && (<CopyLinkAction id={item.newPasswordId as string} />)}
        <DetailsAction href={`${baseUrl}/${item.id}`} />
        <EditAction href={`${baseUrl}/${item.id}/editar`} />
        <DeleteAction id={item.id} />
      </>}
    />
  )
}