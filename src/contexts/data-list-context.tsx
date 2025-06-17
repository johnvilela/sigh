'use client'

import { User } from "@/generated/prisma";
import { ActionResponseType } from "@/lib/utils/action-response-builder";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface BaseDataItem {
  id: string;
  [key: string]: unknown;
}

export interface DataListContextData {
  user: User;
  data: Array<BaseDataItem>;
  filter: Record<string, string>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  deleteItem: (id: string) => Promise<void>;
  clearFilters: () => void;
  search: (page?: number) => void;
}

export interface DataListContextProviderProps {
  children: React.ReactNode;
  data: Array<BaseDataItem>;
  baseUrl: string;
  user: User;
  deleteFc: (id: string) => Promise<ActionResponseType>;
}

const DataListContext = createContext({} as DataListContextData);

export function DataListContextProvider ({ children, data, deleteFc, baseUrl, user }: DataListContextProviderProps) {
  const [optimisticDelete, setOptimisticDelete] = useState<string[]>([]);
  const [filter, setFilter] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  async function deleteItem (id: string) {
    if (id) return;

    const res = await deleteFc(id);

    if (res.status === 'success' && id) setOptimisticDelete((old) => [...old, id]);
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

    router.push(`${baseUrl}?${query}`);
  }

  function clearFilters () {
    setFilter({});
    router.push(baseUrl);
  }

  useEffect(() => {
    const filterObj = Object.fromEntries(searchParams.entries());

    setFilter(filterObj);
  }, [searchParams]);

  const filteredData = data.filter(item => !optimisticDelete.includes(item.id));

  return (
    <DataListContext.Provider value={{
      user,
      data: filteredData,
      filter,
      setFilter,
      deleteItem,
      clearFilters,
      search
    }}>
      {children}
    </DataListContext.Provider>
  );
}

export function useDataListContext (): DataListContextData {
  const context = useContext(DataListContext);

  if (!context) {
    throw new Error("useDataListContext must be used within a DataListContextProvider");
  }

  return context;
}

