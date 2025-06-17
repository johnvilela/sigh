'use client'
import { useSearchParams } from "next/navigation";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../pagination";

export interface DataListPaginationProps {
  baseUrl: string;
  total: number;
  pageSize?: number;
}

export function DataListPagination ({ baseUrl, pageSize = 20, total }: DataListPaginationProps) {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page') || '1');
  const totalPages = Math.ceil(total / pageSize);

  let pagesList: Array<{ label: number; url: string }> = []

  if (currentPage === 1) {
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pagesList.push({ label: i, url: `${baseUrl}?page=${i}` });
    }
  } else {
    pagesList = [
      { label: Number(currentPage) - 1, url: `${baseUrl}?page=${currentPage - 1}` },
      { label: Number(currentPage), url: `${baseUrl}?page=${currentPage}` },
      { label: Math.min(Number(currentPage) + 1, totalPages), url: `${baseUrl}?page=${Math.min(currentPage + 1, totalPages)}` },
    ]
  }

  return (
    <div className='mt-4'>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`${baseUrl}?page=${currentPage - 1}`} />
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
            <PaginationNext href={`${baseUrl}?page=${currentPage + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}