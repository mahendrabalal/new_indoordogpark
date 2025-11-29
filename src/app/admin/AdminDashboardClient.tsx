'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ParkSubmission } from '@/types/park-submission';

type DashboardFilter = 'all' | 'pending' | 'approved' | 'rejected';
type ActionType = 'approve' | 'reject' | 'delete';
type DashboardTab = 'submissions' | 'reviews';

interface Review {
  id: string;
  park_id: string;
  park_slug?: string;
  user_id: string;
  rating: number;
  title?: string;
  content?: string;
  comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

interface DashboardMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ToastState {
  id: number;
  type: 'success' | 'error';
  title: string;
  message?: string;
}

const STATUS_LABELS: Record<DashboardFilter, string> = {
  all: 'All',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const STATUS_BADGE_STYLES: Record<'pending' | 'approved' | 'rejected', string> = {
  pending: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 ring-1 ring-rose-200',
};

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

function formatStatus(status: ParkSubmission['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusBadgeClasses(status: ParkSubmission['status']) {
  return STATUS_BADGE_STYLES[status] ?? STATUS_BADGE_STYLES.pending;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const { user, loading, getSessionTokens } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('submissions');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<DashboardFilter>('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZE_OPTIONS[number]>(PAGE_SIZE_OPTIONS[0]);
  const [submissions, setSubmissions] = useState<ParkSubmission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<DashboardMeta>({
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [approveTarget, setApproveTarget] = useState<ParkSubmission | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ParkSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ParkSubmission | null>(null);
  const [approveReviewTarget, setApproveReviewTarget] = useState<Review | null>(null);
  const [rejectReviewTarget, setRejectReviewTarget] = useState<Review | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionState, setActionState] = useState<{ id: string | null; type: ActionType | null }>({
    id: null,
    type: null,
  });
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef(0);

  // Client-side authorization check - defense in depth
  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!user) {
      router.push('/login?redirect=/admin');
      return;
    }

    // Check admin role from user metadata
    const userMetadata = user.user_metadata as { role?: string } | undefined;
    const hasAdminRole = userMetadata?.role === 'admin';

    // If not admin, redirect to 403 page
    if (!hasAdminRole) {
      router.push('/403');
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [user, loading, router]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((toastState: Omit<ToastState, 'id'>) => {
    const nextId = toastIdRef.current + 1;
    toastIdRef.current = nextId;
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ ...toastState, id: nextId });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((current) => (current?.id === nextId ? null : current));
    }, 4000);
  }, []);

  const buildAuthHeaders = useCallback(
    async (options?: { json?: boolean }) => {
      const { accessToken, refreshToken } = await getSessionTokens();
      const headers: Record<string, string> = {};

      if (options?.json) {
        headers['Content-Type'] = 'application/json';
      }
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      if (refreshToken) {
        headers['x-refresh-token'] = refreshToken;
      }

      return headers;
    },
    [getSessionTokens]
  );

  const fetchSubmissions = useCallback(
    async (signal?: AbortSignal) => {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const headers = await buildAuthHeaders();
        const params = new URLSearchParams({
          status: filter,
          page: String(page),
          pageSize: String(pageSize),
        });

        const response = await fetch(`/api/admin/submissions?${params.toString()}`, {
          headers,
          signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch submissions');
        }

        if (data.meta) {
          const safeTotalPages = Math.max(1, Number(data.meta.totalPages) || 1);
          if (page > safeTotalPages) {
            setPage(safeTotalPages);
            return;
          }
          setMeta({
            total: Number(data.meta.total) || 0,
            page: Number(data.meta.page) || page,
            pageSize: Number(data.meta.pageSize) || pageSize,
            totalPages: safeTotalPages,
          });
        }

        setSubmissions(data.submissions || []);
      } catch (err) {
        if (signal?.aborted) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to fetch submissions';
        setError(message);
        showToast({
          type: 'error',
          title: 'Unable to load submissions',
          message,
        });
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [buildAuthHeaders, filter, page, pageSize, showToast, user]
  );

  const fetchReviews = useCallback(
    async (signal?: AbortSignal) => {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const headers = await buildAuthHeaders();
        const params = new URLSearchParams({
          status: filter,
          page: String(page),
          pageSize: String(pageSize),
        });

        const response = await fetch(`/api/admin/reviews?${params.toString()}`, {
          headers,
          signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch reviews');
        }

        if (data.meta) {
          const safeTotalPages = Math.max(1, Number(data.meta.totalPages) || 1);
          if (page > safeTotalPages) {
            setPage(safeTotalPages);
            return;
          }
          setMeta({
            total: Number(data.meta.total) || 0,
            page: Number(data.meta.page) || page,
            pageSize: Number(data.meta.pageSize) || pageSize,
            totalPages: safeTotalPages,
          });
        }

        setReviews(data.reviews || []);
      } catch (err) {
        if (signal?.aborted) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
        setError(message);
        showToast({
          type: 'error',
          title: 'Unable to load reviews',
          message,
        });
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [buildAuthHeaders, filter, page, pageSize, showToast, user]
  );

  useEffect(() => {
    const controller = new AbortController();
    if (activeTab === 'submissions') {
      fetchSubmissions(controller.signal);
    } else {
      fetchReviews(controller.signal);
    }

    return () => {
      controller.abort();
    };
  }, [activeTab, filter, page, pageSize, fetchSubmissions, fetchReviews]);

  const resetActionState = useCallback(() => {
    setActionState({ id: null, type: null });
  }, []);

  const executeReviewAction = useCallback(
    async (config: { reviewId: string; type: 'approve' | 'reject' }) => {
      try {
        setActionState({ id: config.reviewId, type: config.type });

        const headers = await buildAuthHeaders({ json: true });
        const endpoint = config.type === 'approve' 
          ? '/api/admin/reviews/approve' 
          : '/api/admin/reviews/reject';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ reviewId: config.reviewId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to ${config.type} review`);
        }

        showToast({
          type: 'success',
          title: `Review ${config.type === 'approve' ? 'approved' : 'rejected'} successfully`,
        });

        // Refresh reviews
        await fetchReviews();
      } catch (err) {
        const message = err instanceof Error ? err.message : `Failed to ${config.type} review`;
        showToast({
          type: 'error',
          title: `Unable to ${config.type} review`,
          message,
        });
      } finally {
        resetActionState();
        setApproveReviewTarget(null);
        setRejectReviewTarget(null);
      }
    },
    [buildAuthHeaders, fetchReviews, resetActionState, showToast]
  );

  const executeSubmissionAction = useCallback(
    async (config: { submissionId: string; type: ActionType; payload?: Record<string, unknown> }) => {
      try {
        setActionState({ id: config.submissionId, type: config.type });

        const isDelete = config.type === 'delete';
        const headers = await buildAuthHeaders(isDelete ? undefined : { json: true });

        let endpoint: string;
        let method: 'POST' | 'DELETE' = 'POST';

        if (config.type === 'approve') {
          endpoint = '/api/admin/submissions/approve';
        } else if (config.type === 'reject') {
          endpoint = '/api/admin/submissions/reject';
        } else {
          endpoint = `/api/admin/submissions/${config.submissionId}`;
          method = 'DELETE';
        }

        const requestInit: RequestInit = {
          method,
          headers,
        };

        if (!isDelete) {
          requestInit.body = JSON.stringify({
            submissionId: config.submissionId,
            ...config.payload,
          });
        }

        const response = await fetch(endpoint, requestInit);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to ${config.type} submission`);
        }

        const successCopy =
          config.type === 'approve'
            ? {
                title: 'Submission approved',
                message: 'The park submission is now marked as approved.',
              }
            : config.type === 'reject'
            ? {
                title: 'Submission rejected',
                message: 'The submitter will be notified about the rejection.',
              }
            : {
                title: 'Submission deleted',
                message: 'The park listing has been removed from the directory.',
              };

        showToast({
          type: 'success',
          ...successCopy,
        });

        await fetchSubmissions();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Action failed';
        showToast({
          type: 'error',
          title: 'Action failed',
          message,
        });
      } finally {
        resetActionState();
        setApproveTarget(null);
        setRejectTarget(null);
        setDeleteTarget(null);
        setRejectionReason('');
      }
    },
    [buildAuthHeaders, fetchSubmissions, resetActionState, showToast]
  );

  const handleFilterChange = useCallback((nextFilter: DashboardFilter) => {
    setFilter(nextFilter);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value as typeof PAGE_SIZE_OPTIONS[number]);
    setPage(1);
  }, []);

  const isActionLoading = useCallback(
    (submissionId: string, type: ActionType) =>
      actionState.id === submissionId && actionState.type === type,
    [actionState.id, actionState.type]
  );

  const paginationSummary = useMemo(() => {
    if (meta.total === 0) {
      return `No ${activeTab === 'submissions' ? 'submissions' : 'reviews'} to display`;
    }
    const items = activeTab === 'submissions' ? submissions : reviews;
    const start = (page - 1) * meta.pageSize + 1;
    const end = start + items.length - 1;
    return `Showing ${start}-${end} of ${meta.total}`;
  }, [activeTab, meta.pageSize, meta.total, page, submissions, reviews]);

  // Show loading state while checking authorization
  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" aria-hidden="true" />
          <p className="mt-4 text-gray-600">Verifying access...</p>
          <span className="sr-only">Checking admin permissions</span>
        </div>
      </div>
    );
  }

  // If not authorized, don't render the dashboard (redirect will happen)
  if (!isAuthorized || !user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {toast && (
        <div
          role="status"
          aria-live="assertive"
          className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4 sm:px-6"
        >
          <div
            className={`pointer-events-auto max-w-sm rounded-xl px-4 py-3 shadow-lg ring-1 ring-black/5 ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">
            {activeTab === 'submissions' 
              ? 'Review and manage park submissions with confidence.' 
              : 'Review and manage user reviews with confidence.'}
          </p>
        </header>

        {/* Tab Switcher */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('submissions');
                setPage(1);
                setFilter('pending');
              }}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'submissions'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Park Submissions
            </button>
            <button
              onClick={() => {
                setActiveTab('reviews');
                setPage(1);
                setFilter('pending');
              }}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(STATUS_LABELS) as DashboardFilter[]).map((status) => {
              const isActive = filter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleFilterChange(status)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
                    isActive ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <div className="inline-flex items-center gap-2">
              <span className="font-medium text-gray-700">Results per page</span>
              <select
                value={pageSize}
                onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <span className="hidden sm:inline text-gray-400" aria-hidden>
              |
            </span>
            <span className="font-medium text-gray-700">{paginationSummary}</span>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">{error}</p>
              <button
                type="button"
                onClick={() => activeTab === 'submissions' ? fetchSubmissions() : fetchReviews()}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          {isLoading ? (
            <div className="rounded-xl border border-dashed border-purple-200 bg-white/60 p-12 text-center shadow-inner">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600" />
              <p className="mt-4 text-sm font-medium text-gray-600">
                Fetching the latest {activeTab === 'submissions' ? 'submissions' : 'reviews'}…
              </p>
            </div>
          ) : activeTab === 'submissions' ? (
            submissions.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">No submissions</h2>
              <p className="mt-2 text-sm text-gray-600">
                  We didn&apos;t find any {filter === 'all' ? '' : `${filter} `}submissions for now. Try a different filter or
                adjust the pagination.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => {
                const photoCount = submission.photos?.length ?? 0;
                const isPending = submission.status === 'pending';
                return (
                  <article
                    key={submission.id}
                    className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="p-6">
                      <header className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-bold text-gray-900">{submission.name}</h3>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusBadgeClasses(submission.status)}`}
                            >
                              {formatStatus(submission.status)}
                            </span>
                            {submission.listingType === 'featured' && (
                              <>
                                {submission.stripeSubscriptionId ? (
                                  <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                                    Featured
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                                    Featured (Unpaid)
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-medium text-gray-600">{submission.businessType}</p>
                          <p className="text-sm text-gray-500">
                            {submission.city}, {submission.state}
                          </p>
                        </div>
                        <dl className="grid min-w-[220px] grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                          <div>
                            <dt className="font-semibold text-gray-700">Submitted</dt>
                            <dd>{new Date(submission.createdAt).toLocaleString()}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-gray-700">Photos</dt>
                            <dd>{photoCount}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-gray-700">Email</dt>
                            <dd className="truncate">{submission.email || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-gray-700">Phone</dt>
                            <dd>{submission.phone || 'N/A'}</dd>
                          </div>
                        </dl>
                      </header>

                      <section className="grid gap-4 text-sm text-gray-700 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <div>
                          <p className="font-semibold text-gray-800">Description</p>
                          <p className="mt-2 leading-relaxed text-gray-600">
                            {submission.description || 'No description provided.'}
                          </p>
                        </div>
                        <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4">
                          <h4 className="text-sm font-semibold text-gray-800">Quick details</h4>
                          <p className="text-sm text-gray-600 break-words">
                            <span className="font-medium text-gray-700">Website:</span>{' '}
                            {submission.website ? (
                              <a
                                href={submission.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-600 hover:text-purple-700"
                              >
                                {submission.website}
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </p>
                          {submission.listingType === 'featured' && !submission.stripeSubscriptionId && (
                            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
                              <p className="text-sm font-semibold text-amber-800">⚠️ Payment Not Received</p>
                              <p className="mt-1 text-xs text-amber-700">
                                This featured listing was submitted but payment was not completed. The listing should be downgraded to free or payment should be collected.
                              </p>
                            </div>
                          )}
                          {submission.listingType === 'featured' && submission.stripeSubscriptionId && (
                            <div className="mt-3 text-xs text-gray-600">
                              <p><span className="font-medium text-gray-700">Stripe Subscription:</span> {submission.stripeSubscriptionId}</p>
                              {submission.subscriptionStatus && (
                                <p className="mt-1"><span className="font-medium text-gray-700">Status:</span> {submission.subscriptionStatus}</p>
                              )}
                            </div>
                          )}
                          {submission.rejectionReason && (
                            <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                              <span className="font-semibold">Rejection reason:</span> {submission.rejectionReason}
                            </p>
                          )}
                        </div>
                      </section>

                      <footer className="mt-6 border-t border-gray-100 pt-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => setApproveTarget(submission)}
                                disabled={isActionLoading(submission.id, 'approve')}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                              >
                                {isActionLoading(submission.id, 'approve') ? 'Approving…' : 'Approve'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectTarget(submission);
                                  setRejectionReason('');
                                }}
                                disabled={isActionLoading(submission.id, 'reject')}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                              >
                                {isActionLoading(submission.id, 'reject') ? 'Preparing…' : 'Reject'}
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(submission)}
                            disabled={isActionLoading(submission.id, 'delete')}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            {isActionLoading(submission.id, 'delete') ? 'Deleting…' : 'Delete listing'}
                          </button>
                        </div>
                      </footer>
                    </div>
                  </article>
                );
              })}
            </div>
          )
          ) : (
            reviews.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">No reviews</h2>
                <p className="mt-2 text-sm text-gray-600">
                  We didn&apos;t find any {filter === 'all' ? '' : `${filter} `}reviews for now. Try a different filter or
                  adjust the pagination.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => {
                  const isPending = review.status === 'pending';
                  const reviewContent = review.content || review.comment || '';
                  const renderStars = (rating: number) => {
                    return Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < rating ? 'bi-star-fill text-yellow-400' : 'bi-star text-gray-300'}`}
                      />
                    ));
                  };

                  return (
                    <article
                      key={review.id}
                      className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="p-6">
                        <header className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-sm font-medium text-gray-600">({review.rating}/5)</span>
                              </div>
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusBadgeClasses(review.status)}`}
                              >
                                {formatStatus(review.status)}
                              </span>
                            </div>
                            {review.title && (
                              <h3 className="mt-2 text-xl font-bold text-gray-900">{review.title}</h3>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                              Park ID: {review.park_id}
                            </p>
                          </div>
                          <dl className="grid min-w-[220px] grid-cols-1 gap-y-2 text-sm text-gray-600">
                            <div>
                              <dt className="font-semibold text-gray-700">Submitted</dt>
                              <dd>{new Date(review.created_at).toLocaleString()}</dd>
                            </div>
                            {review.updated_at && (
                              <div>
                                <dt className="font-semibold text-gray-700">Updated</dt>
                                <dd>{new Date(review.updated_at).toLocaleString()}</dd>
                              </div>
                            )}
                          </dl>
                        </header>

                        <section className="mb-4">
                          <p className="font-semibold text-gray-800 mb-2">Review Content</p>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {reviewContent || 'No content provided.'}
                          </p>
                        </section>

                        <footer className="mt-6 border-t border-gray-100 pt-4">
                          <div className="flex flex-col gap-3 sm:flex-row">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setApproveReviewTarget(review)}
                                  disabled={isActionLoading(review.id, 'approve')}
                                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                  {isActionLoading(review.id, 'approve') ? 'Approving…' : 'Approve'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectReviewTarget(review)}
                                  disabled={isActionLoading(review.id, 'reject')}
                                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                  {isActionLoading(review.id, 'reject') ? 'Rejecting…' : 'Reject'}
                                </button>
                              </>
                            )}
                          </div>
                        </footer>
                      </div>
                    </article>
                  );
                })}
              </div>
            )
          )}
        </div>

        <nav
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
          aria-label="Pagination"
        >
          <p className="text-sm font-medium text-gray-600">{paginationSummary}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Prev
            </button>
            <span className="text-sm font-medium text-gray-600">
              Page {page} of {meta.totalPages || 1}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(meta.totalPages || 1, current + 1))}
              disabled={page >= meta.totalPages}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </nav>
      </div>

      {/* Approve confirmation */}
      {approveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900">Approve submission</h3>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to approve <span className="font-semibold">{approveTarget.name}</span>? This park
              will become visible to your users immediately.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setApproveTarget(null)}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  executeSubmissionAction({
                    submissionId: approveTarget.id,
                    type: 'approve',
                  })
                }
                disabled={isActionLoading(approveTarget.id, 'approve')}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isActionLoading(approveTarget.id, 'approve') ? 'Approving…' : 'Confirm approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900">Reject submission</h3>
            <p className="mt-3 text-sm text-gray-600">
              Provide a short explanation for rejecting{' '}
              <span className="font-semibold">{rejectTarget.name}</span>. The submitter will see this message.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              rows={4}
              className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Explain why this submission is being rejected..."
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectionReason('');
                }}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  executeSubmissionAction({
                    submissionId: rejectTarget.id,
                    type: 'reject',
                    payload: { reason: rejectionReason.trim() },
                  })
                }
                disabled={rejectionReason.trim().length === 0 || isActionLoading(rejectTarget.id, 'reject')}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isActionLoading(rejectTarget.id, 'reject') ? 'Rejecting…' : 'Confirm rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900">Delete submission</h3>
            <p className="mt-3 text-sm text-gray-600">
              This will permanently remove <span className="font-semibold">{deleteTarget.name}</span> from your admin
              dashboard and the public directory.
            </p>
            <p className="mt-2 text-sm text-rose-600">
              This action cannot be undone. Any uploaded photos associated with this submission will also be deleted.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  executeSubmissionAction({
                    submissionId: deleteTarget.id,
                    type: 'delete',
                  })
                }
                disabled={isActionLoading(deleteTarget.id, 'delete')}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isActionLoading(deleteTarget.id, 'delete') ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve review confirmation */}
      {approveReviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900">Approve review</h3>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to approve this review? It will become visible to all users immediately.
            </p>
            {approveReviewTarget.title && (
              <p className="mt-2 text-sm font-medium text-gray-800">
                &quot;{approveReviewTarget.title}&quot;
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setApproveReviewTarget(null)}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  executeReviewAction({
                    reviewId: approveReviewTarget.id,
                    type: 'approve',
                  })
                }
                disabled={isActionLoading(approveReviewTarget.id, 'approve')}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isActionLoading(approveReviewTarget.id, 'approve') ? 'Approving…' : 'Approve review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject review confirmation */}
      {rejectReviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900">Reject review</h3>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to reject this review? The reviewer will be able to see that their review was not approved.
            </p>
            {rejectReviewTarget.title && (
              <p className="mt-2 text-sm font-medium text-gray-800">
                &quot;{rejectReviewTarget.title}&quot;
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setRejectReviewTarget(null)}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  executeReviewAction({
                    reviewId: rejectReviewTarget.id,
                    type: 'reject',
                  })
                }
                disabled={isActionLoading(rejectReviewTarget.id, 'reject')}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isActionLoading(rejectReviewTarget.id, 'reject') ? 'Rejecting…' : 'Reject review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

