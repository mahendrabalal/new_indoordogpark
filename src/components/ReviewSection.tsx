'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface Review {
  id: string;
  rating: number;
  title?: string;
  content?: string; // Changed from 'comment' to 'content' to match database
  helpful_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
  user?: {
    email: string;
    user_metadata?: Record<string, unknown>;
  };
}

interface ReviewSectionProps {
  parkId: string;
}

export default function ReviewSection({ parkId }: ReviewSectionProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      // Include user's review if they're logged in
      const includeUserReview = user ? 'true' : 'false';
      const response = await fetch(`/api/reviews?parkId=${parkId}&includeUserReview=${includeUserReview}`, {
        credentials: 'include', // Include auth cookies
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
        setUserReview(data.userReview || null);

        // If user has an existing review, pre-fill the form
        if (data.userReview) {
          setReviewForm({
            rating: data.userReview.rating || 5,
            title: data.userReview.title || '',
            comment: data.userReview.content || data.userReview.comment || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [parkId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This is crucial for sending auth cookies
        body: JSON.stringify({
          parkId,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
        }),
      });

      if (response.ok) {
        // Refresh reviews to get updated data
        await fetchReviews();
        // Show success toast
        showSuccess(
          userReview
            ? 'Your review has been updated successfully!'
            : 'Thank you! Your review has been submitted and is pending approval.',
          5000
        );
        // Reset form and close
        setReviewForm({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to submit review:', errorData);
        showError(errorData.error || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulVote = async (reviewId: string, isHelpful: boolean) => {
    if (!user) {
      showError('Please log in to vote on reviews');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include auth cookies
        body: JSON.stringify({ isHelpful }),
      });

      if (response.ok) {
        fetchReviews(); // Refresh to update helpful counts
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`}
        style={{ color: i < rating ? '#f59e0b' : '#d1d5db' }}
      ></i>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserDisplayName = (review: Review) => {
    // Handle cases where user data might not be available or structured as expected
    if (review.user && typeof review.user === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userObj = review.user as any;
      if (userObj.user_metadata?.display_name) {
        return userObj.user_metadata.display_name;
      }
      if (userObj.email) {
        const email = userObj.email;
        return email.split('@')[0];
      }
    }
    return 'Anonymous';
  };

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <div className="flex justify-between items-baseline flex-wrap gap-4">
          <h2>Reviews & Ratings</h2>
          <span className="google-attribution-label">Powered by Google</span>
        </div>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="stars">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="total-reviews">({totalReviews} reviews)</span>
          </div>
          {user && (
            <button
              className="write-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              <i className="bi bi-pencil"></i> {userReview ? 'Edit Your Review' : 'Write a Review'}
            </button>
          )}
        </div>
      </div>

      {showReviewForm && (
        <div className="review-form">
          <h3>{userReview ? 'Edit Your Review' : 'Share Your Experience'}</h3>
          {userReview && userReview.status === 'pending' && (
            <div className="review-status-notice" style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              color: '#856404'
            }}>
              <i className="bi bi-info-circle"></i> Your review is pending approval and will be visible once approved.
            </div>
          )}
          {userReview && userReview.status === 'rejected' && (
            <div className="review-status-notice" style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#f8d7da',
              border: '1px solid #dc3545',
              borderRadius: '4px',
              color: '#721c24'
            }}>
              <i className="bi bi-exclamation-triangle"></i> Your previous review was not approved. You can submit a new review.
            </div>
          )}
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Rating *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  >
                    <i className="bi bi-star-fill"></i>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                placeholder="Summarize your experience"
              />
            </div>
            <div className="form-group">
              <label>Review</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Tell others about your visit"
                rows={4}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading-reviews">
          <i className="bi bi-hourglass-split"></i> Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{getUserDisplayName(review)}</span>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="review-date">{formatDate(review.created_at)}</span>
              </div>
              {review.title && <h4 className="review-title">{review.title}</h4>}
              {review.content && <p className="review-comment">{review.content}</p>}
              <div className="review-actions">
                <span className="helpful-count">{review.helpful_count} people found this helpful</span>
                {user && (
                  <div className="helpful-buttons">
                    <button
                      className="helpful-btn"
                      onClick={() => handleHelpfulVote(review.id, true)}
                    >
                      <i className="bi bi-hand-thumbs-up"></i> Helpful
                    </button>
                    <button
                      className="not-helpful-btn"
                      onClick={() => handleHelpfulVote(review.id, false)}
                    >
                      <i className="bi bi-hand-thumbs-down"></i> Not Helpful
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}