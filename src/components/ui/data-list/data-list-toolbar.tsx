'use client';

import { Input } from "../input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { Button } from "../button";
import { CircleX, Search } from "lucide-react";
import Link from "next/link";
import { useDataListContext } from "@/contexts/data-list-context";

export interface DataListToolbarProps {
  filters?: Array<{
    label: string;
    key: string;
    filterKey?: string;
    type: 'text' | 'select';
    options?: Array<{ label: string; value: string }>;
  }>;
  createBtn?: {
    label: string;
    href: string;
  };
}

export function DataListToolbar ({ filters, createBtn }: DataListToolbarProps) {
  const { filter, setFilter, search, clearFilters } = useDataListContext();

  return (
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
      {
        createBtn && (
          <div>
            <Button asChild>
              <Link href={createBtn.href}>{createBtn.label}</Link>
            </Button>
          </div>
        )
      }
    </div>
  )
}