'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ParkSubmission } from '@/types/park-submission';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, getSessionTokens } = useAuth();
  const [submissions, setSubmissions] = useState<ParkSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<ParkSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
      return;
    }

    // Check if user is admin (you should verify this with user metadata)
    if (user) {
      const userMetadata = user.user_metadata as { role?: string } | undefined;
      if (userMetadata?.role !== 'admin') {
        router.push('/');
        return;
      }
    }
  }, [user, loading, router]);

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

  const fetchSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const headers = await buildAuthHeaders();
      const response = await fetch(`/api/admin/submissions?status=${filter}`, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch submissions');
      }

      setSubmissions(data.submissions || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch submissions';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filter, buildAuthHeaders]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user, fetchSubmissions]);

  const handleApprove = async (submissionId: string) => {
    if (!confirm('Are you sure you want to approve this submission?')) return;

    setActionLoading(true);
    try {
      const headers = await buildAuthHeaders({ json: true });
      const response = await fetch('/api/admin/submissions/approve', {
        method: 'POST',
        headers,
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve submission');
      }

      alert('Submission approved successfully!');
      fetchSubmissions();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve submission';
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const headers = await buildAuthHeaders({ json: true });
      const response = await fetch('/api/admin/submissions/reject', {
        method: 'POST',
        headers,
        body: JSON.stringify({ submissionId, reason: rejectionReason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject submission');
      }

      alert('Submission rejected');
      setSelectedSubmission(null);
      setRejectionReason('');
      fetchSubmissions();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject submission';
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Review and manage park submissions</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Submissions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} submissions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{submission.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                          submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {submission.status.toUpperCase()}
                        </span>
                        {submission.listingType === 'featured' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{submission.businessType}</p>
                      <p className="text-sm text-gray-500">{submission.city}, {submission.state}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-700"><strong>Email:</strong> {submission.email || 'N/A'}</p>
                      <p className="text-gray-700"><strong>Phone:</strong> {submission.phone || 'N/A'}</p>
                      <p className="text-gray-700"><strong>Website:</strong> {submission.website || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-700"><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
                      <p className="text-gray-700"><strong>Photos:</strong> {submission.photos?.length || 0}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700"><strong>Description:</strong></p>
                    <p className="text-sm text-gray-600 mt-1">{submission.description}</p>
                  </div>

                  {submission.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {submission.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {submission.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Submission</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting &ldquo;{selectedSubmission.name}&rdquo;
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              placeholder="Explain why this submission is being rejected..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedSubmission.id)}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
