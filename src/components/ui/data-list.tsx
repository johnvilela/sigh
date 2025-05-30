'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Button } from './button';
import { Eye, Pencil, Trash, Search, CircleX, AlertCircle } from 'lucide-react';
import { Input } from './input';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from './badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { User, USER_ROLE } from '@/generated/prisma';
import { checkUserRole } from '@/lib/utils/check-user-role';
import { getValue } from '@/lib/utils/get-value';
import { formatDictionary } from '@/lib/utils/format-dictionary';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
import { ActionResponseType } from '@/lib/utils/action-response-builder';

interface DataListProps {
  user: User;
  data: Record<string | number | symbol, unknown>[];
  lineKey: string;
  caption: string;
  filterUrl: string;
  alert?: {
    title: string;
    description: string;
  }
  filters?: Array<{
    label: string;
    key: string;
    filterKey?: string;
    type: 'text' | 'select';
    options?: Array<{ label: string; value: string }>;
  }>;
  headerBtn?: {
    label: string;
    href: string;
  };
  paginationSettings?: {
    total: number;
    currentPage: number;
    pageSize: number;
  },
  tableSettings: Array<{
    name: string;
    headerClassname?: string;
    lineClassname?: string;
    key: string | string[];
    format?: keyof typeof formatDictionary;
    renderType?: 'BADGE';
    emptyValue?: string;
  }>;
  actions?: Array<{
    type: 'DELETE' | 'EDIT' | 'VIEW';
    detailsUrl?: string;
    editUrl?: string;
    deleteUrl?: string;
    blockBy?: 'ROLE' | 'RELATED';
    blockRelation?: 'FEDERATION' | 'TEAM';
    blockRelationId?: string;
    roles?: USER_ROLE[];
    action?: (id: string) => Promise<ActionResponseType>;
  }>;
  customError?: {
    title?: string;
    description?: string;
  }
}

export function DataList ({
  user,
  data,
  caption,
  lineKey,
  filterUrl,
  filters,
  tableSettings,
  paginationSettings,
  actions = [],
  headerBtn,
  alert,
  customError,
}: DataListProps) {
  const [filter, setFilter] = useState<Record<string, string>>({});
  const [optimisticDelete, setOptimisticDelete] = useState<Array<string>>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  function renderBadge (value: string, variant: 'default' | 'alert' | 'secondary' | 'destructive') {
    return <Badge variant={variant}>{value}</Badge>;
  }

  function renderByRelation (
    data: Record<string | number | symbol, unknown>,
    roles: USER_ROLE[],
    blockByRelation?: string,
    blockByRelationId?: string,
  ) {
    if (!checkUserRole(roles, user)) return false;

    const federationId = getValue(user, 'federationId', null);
    const teamId = getValue(user, 'teamId', null);
    const relationId = getValue(data, blockByRelationId!, null);

    if (
      (blockByRelation === 'FEDERATION' && federationId !== relationId) ||
      (blockByRelation === 'TEAM' && teamId !== relationId)
    ) {
      return false;
    }

    return true;
  }

  function canRenderAction (
    data: Record<string | number | symbol, unknown>,
    roles?: USER_ROLE[],
    blockBy?: string,
    blockByRelation?: string,
    blockByRelationId?: string,
  ) {
    if (blockBy === 'ROLE' && roles) {
      return checkUserRole(roles, user);
    }

    if (blockBy === 'RELATED' && roles) {
      return renderByRelation(data, roles, blockByRelation, blockByRelationId);
    }

    return true;
  }

  function mountValueByArray (
    arr: string[],
    obj: Record<string | number | symbol, unknown>,
    formatter?: keyof typeof formatDictionary,
    emptyValue?: string,
  ) {
    if (!arr.length) return emptyValue;

    return arr.reduce((acc, key, index) => {
      const value = getValue(obj, key, '');
      const formattedValue = !!formatter ? formatDictionary[formatter](value) : value;

      if (index === 0) {
        return formattedValue;
      }

      return `${acc} - ${formattedValue}`;
    }, '');
  }

  function renderSingleValue ({
    value,
    formatter,
    emptyValue,
    renderType,
  }: {
    value: string;
    formatter?: keyof typeof formatDictionary;
    emptyValue?: string;
    renderType?: 'BADGE';
  }) {
    if (!value) return emptyValue;

    if (renderType === 'BADGE') {
      let variant = 'default';

      switch (value) {
        case 'INACTIVE':
          variant = 'destructive';
          break;
        case 'PENDING':
          variant = 'alert';
          break;
        case 'ACTIVE':
        default:
          break;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return renderBadge(!!formatter ? formatDictionary[formatter](value as any) : value, variant as any);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!formatter ? formatDictionary[formatter](value as any) : value;
  }

  function search (page = 1) {
    let query = Object.keys(filter)
      .map((key) => {
        if (filter[key]) {
          return `${key}=${filter[key]}`;
        }
      })
      .join('&');

    const pageFilter = page > 1 ? `page=${page}` : '';

    query += query ? `&${pageFilter}` : pageFilter;

    router.push(`${filterUrl}?${query}`);
  }

  function clearFilters () {
    setFilter({});
    router.push(filterUrl);
  }

  useEffect(() => {
    const filterObj = Object.fromEntries(searchParams.entries());

    setFilter(filterObj);
  }, [searchParams]);

  let itemId = '';
  let itemAction: ((id: string) => Promise<ActionResponseType>) | undefined;

  async function deleteItem () {
    if (!itemId || !itemAction) return;

    const res = await itemAction(itemId)

    if (res.status === 'success' && itemId) setOptimisticDelete((old) => [...old, itemId]);
  }

  function paginationComponent () {
    if (paginationSettings) {
      const currentPage = Number(paginationSettings.currentPage || 1);
      const totalPages = Math.ceil(paginationSettings.total / paginationSettings.pageSize);
      let pagesList: Array<{ label: number; url: string }> = []

      if (currentPage === 1) {
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
          pagesList.push({ label: i, url: `${filterUrl}?page=${i}` });
        }
      } else {
        pagesList = [
          { label: Number(currentPage) - 1, url: `${filterUrl}?page=${currentPage - 1}` },
          { label: Number(currentPage), url: `${filterUrl}?page=${currentPage}` },
          { label: Math.min(Number(currentPage) + 1, totalPages), url: `${filterUrl}?page=${Math.min(currentPage + 1, totalPages)}` },
        ]
      }

      return (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`${filterUrl}?page=${currentPage - 1}`} />
              </PaginationItem>
            )}
            {pagesList.map((p) => (
              <PaginationItem key={p.url}>
                <PaginationLink href={p.url} isActive={currentPage === p.label}>{p.label}</PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext href={`${filterUrl}?page=${currentPage + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
    }
  }

  return (
    <AlertDialog>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-8">
        <div className="flex flex-1 gap-2">
          {filters &&
            filters.map((f) => {
              if (f.type === 'text') {
                return (
                  <Input
                    key={f.key}
                    placeholder={f.label}
                    value={filter[f.key] || ''}
                    onChange={(e) =>
                      setFilter((old) => ({
                        ...old,
                        [f.key]: e.target.value,
                      }))
                    }
                  />
                );
              }

              return (
                <Select
                  key={f.key}
                  value={filter[f.key] || ''}
                  onValueChange={(value) =>
                    setFilter((old) => ({
                      ...old,
                      [f.key]: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue defaultChecked placeholder={f.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options!.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })}

          <div>
            <Button size="icon" variant="outline" onClick={() => search()}>
              <Search />
            </Button>
          </div>
          {Object.keys(filter).length > 0 &&
            <div>
              <Button size="icon" variant="destructiveOutline" onClick={clearFilters}>
                <CircleX />
              </Button>
            </div>
          }
        </div>
        {headerBtn && (
          <div>
            <Button asChild>
              <Link href={headerBtn.href}>{headerBtn.label}</Link>
            </Button>
          </div>
        )}
      </div>
      {data.length > 0 ? <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {tableSettings.map((header) => (
              <TableHead className={header.headerClassname} key={header.name}>
                {header.name}
              </TableHead>
            ))}
            <TableHead className="w-40"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.filter((obj) => {
            const objId = obj['id'] as string;

            if (optimisticDelete.includes(objId)) return false;

            return obj
          }).map((obj) => (
            <TableRow key={obj[lineKey] as string}>
              {tableSettings.map((line) => (
                <TableCell className={line.lineClassname} key={`${obj[lineKey]}-${line.name}`}>
                  {typeof line.key === 'string'
                    ? renderSingleValue({
                      value: getValue(obj, line.key, ''),
                      formatter: line.format,
                      emptyValue: line.emptyValue,
                      renderType: line.renderType,
                    })
                    : mountValueByArray(line.key, obj, line.format, line.emptyValue)}
                </TableCell>
              ))}
              <TableCell className="text-right w-40">
                {actions.map((action) => {
                  const shouldRenderAction = canRenderAction(
                    obj,
                    action.roles,
                    action.blockBy,
                    action.blockRelation,
                    action.blockRelationId,
                  );

                  if (!shouldRenderAction) return null;

                  if (action.type === 'EDIT') {
                    return (
                      <Button size="icon" variant="ghost" key={action.type}>
                        <Link href={`${action.editUrl!}/${obj.id}/editar`}>
                          <Pencil />
                        </Link>
                      </Button>
                    );
                  }

                  // TODO: adicionar lógica de confirmação de exclusão
                  if (action.type === 'DELETE') {
                    return (
                      <AlertDialogTrigger
                        key={action.type}
                        asChild
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-red-800"
                          onClick={() => {
                            itemId = obj[lineKey] as string;
                            itemAction = action.action;
                          }}
                        >
                          <Trash />
                        </Button>
                      </AlertDialogTrigger>
                    );
                  }

                  if (action.type === 'VIEW') {
                    return (
                      <Button size="icon" variant="ghost" key={action.type}>
                        <Link href={`${action.detailsUrl!}/${obj.id}`}>
                          <Eye />
                        </Link>
                      </Button>
                    );
                  }
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> :
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{customError?.title || 'Atenção'}</AlertTitle>
          <AlertDescription>
            {customError?.description || 'Nenhum registro encontrado.'}
          </AlertDescription>
        </Alert>
      }
      <div className='mt-4'>
        {paginationComponent()}
      </div >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert?.title || 'Desejar apagar?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {alert?.description || 'Essa ação não poderá ser desfeita.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={deleteItem}
          >
            Apagar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ AlertDialog>
  );
}