import Link from 'next/link';
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
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((pageNum, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage && pageNum - prevPage > 1;

          return (
            <div key={pageNum} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-2 text-sm text-gray-500">...</span>
              )}
              <Link
                href={getPageUrl(pageNum)}
                className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition ${
                  pageNum === currentPage
                    ? 'bg-[#667eea] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}