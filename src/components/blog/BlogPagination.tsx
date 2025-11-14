import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { WPPaginationInfo } from '@/types/wordpress';

interface BlogPaginationProps {
  pagination: WPPaginationInfo;
  basePath?: string;
  className?: string;
  query?: Record<string, string | number | undefined>;
}

export default function BlogPagination({
  pagination,
  basePath = '/blog',
  className = '',
  query = {},
}: BlogPaginationProps) {
  const { currentPage, totalPages, total } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    params.set('page', page.toString());
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const getVisiblePages = () => {
    const pages = [];
    const showAround = 2;

    // Always show first page
    pages.push(1);

    // Show pages around current page
    for (let i = Math.max(2, currentPage - showAround); i <= Math.min(totalPages - 1, currentPage + showAround); i++) {
      pages.push(i);
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{(currentPage - 1) * pagination.perPage + 1}</span> to{' '}
        <span className="font-medium">
          {Math.min(currentPage * pagination.perPage, total)}
        </span>{' '}
        of <span className="font-medium">{total}</span> results
      </div>

      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Link
          href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            currentPage > 1
              ? 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-disabled={currentPage <= 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>

        {/* Page numbers */}
        <div className="hidden md:flex space-x-1">
          {visiblePages.map((pageNum, index) => {
            const prevPage = visiblePages[index - 1];
            const showEllipsis = prevPage && pageNum - prevPage > 1;

            return (
              <div key={pageNum} className="flex items-center space-x-1">
                {showEllipsis && (
                  <span className="px-3 py-2 text-sm text-gray-500">...</span>
                )}
                <Link
                  href={getPageUrl(pageNum)}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pageNum === currentPage
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Next button */}
        <Link
          href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            currentPage < totalPages
              ? 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}