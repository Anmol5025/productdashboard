import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  total: number;
  skip: number;
  limit: number;
  onPageChange: (newSkip: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export function Pagination({ total, skip, limit, onPageChange, onLimitChange }: PaginationProps) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const startItem = skip + 1;
  const endItem = Math.min(skip + limit, total);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg mt-4 shadow">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(skip - limit)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(skip + limit)}
          disabled={currentPage === totalPages || total === 0}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{total === 0 ? 0 : startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="limit" className="text-sm text-gray-700">Page size:</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(skip - limit)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => onPageChange(skip + limit)}
              disabled={currentPage === totalPages || total === 0}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
