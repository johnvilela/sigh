'use client';

import { formatDictionary } from "@/lib/utils/format-dictionary";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { classHelper } from "@/lib/utils/class-helper";
import { getValue } from "@/lib/utils/get-value";
import { Alert, AlertDescription, AlertTitle } from "../alert";
import { AlertCircle } from "lucide-react";
import { BaseDataItem, useDataListContext } from "@/contexts/data-list-context";

export interface EmptyMessage {
  title?: string;
  description?: string;
}

export interface TableLine<T extends BaseDataItem> {
  key: string | string[];
  header: string;
  classname?: string;
  format?: keyof typeof formatDictionary;
  emptyValue?: string;
  render?: (value: T) => React.ReactNode;
}

export interface DataListProps<T extends BaseDataItem> {
  lineKey: string;
  baseUrl: string;
  table: Array<TableLine<T>>
  caption?: string;
  emptyMessage?: EmptyMessage;
  action?: (obj: T) => React.ReactNode;
}

export function DataList<T extends BaseDataItem> ({ table, lineKey, caption, emptyMessage, action }: DataListProps<T>) {
  const { data = [] } = useDataListContext()

  function defaultRender (tableLine: TableLine<T>, obj: BaseDataItem) {
    if (tableLine.key && typeof tableLine.key !== 'string') {
      return tableLine.key.reduce((acc, key, index) => {
        const value = getValue(obj, key, '');
        const formattedValue = !!tableLine.format ? formatDictionary[tableLine.format](value) : value;

        if (index === 0) {
          return formattedValue;
        }

        return `${acc} - ${formattedValue}`;
      }, '');
    }

    const value = getValue(obj, tableLine.key!, tableLine.emptyValue)

    return !!tableLine.format ? formatDictionary[tableLine.format](value) : value;
  }

  return (
    <div>
      {data.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{emptyMessage?.title || 'Atenção'}</AlertTitle>
          <AlertDescription>
            {emptyMessage?.description || 'Nenhum registro encontrado.'}
          </AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {table.map((item) => (
                <TableHead className={classHelper(item.classname)} key={item.header}>
                  {item.header}
                </TableHead>
              ))}
              <TableHead className="w-40"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((obj) => (
              <TableRow key={obj[lineKey] as string}>
                {table.map((line) => (
                  <TableCell className={classHelper(line.classname)} key={`${obj[lineKey]}-${line.key}`}>
                    {line.render?.(obj as T) ?? defaultRender(line, obj)}
                  </TableCell>
                ))}
                <TableCell className="text-right w-40">
                  {action ? action(obj as T) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}