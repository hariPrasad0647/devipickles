"use client";

import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

function Star({ filled, onClick }) {
  return filled ? (
    <FaStar className="text-yellow-400 cursor-pointer" onClick={onClick} />
  ) : (
    <FaRegStar className="text-gray-300 cursor-pointer" onClick={onClick} />
  );
}

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [canReview, setCanReview] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        try {
          const u = JSON.parse(userRaw);
          setCurrentUserId(u?._id || u?.id || null);
        } catch (err) {
          setCurrentUserId(null);
        }
      }
    } catch (err) {
      console.error("[Reviews] auth read error:", err);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Check eligibility when logged-in status changes
  useEffect(() => {
    if (isLoggedIn) {
      checkCanReview();
    } else {
      setCanReview(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, productId]);

  // Auto-refresh reviews when user completes purchase (localStorage changes)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchReviews();
      if (isLoggedIn) {
        checkCanReview();
      }
    };
    window?.addEventListener?.("storage", handleStorageChange);
    return () => window?.removeEventListener?.("storage", handleStorageChange);
  }, [isLoggedIn, productId]);

  // Check if user can review (optional pre-check endpoint)
  async function checkCanReview() {
    if (!isLoggedIn) {
      setCanReview(false);
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      // Try optional pre-check endpoint
      const res = await fetch(
        `${API_BASE}/api/v1/reviews/can-review?productId=${encodeURIComponent(productId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setCanReview(data?.canReview ?? true);
      } else {
        // If endpoint doesn't exist, assume can review (check will happen on POST)
        setCanReview(true);
      }
    } catch (err) {
      // Endpoint may not exist; allow attempt
      setCanReview(true);
    }
  }

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/reviews?productId=${encodeURIComponent(
        productId
      )}&limit=50&offset=0`);
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setReviews(data.reviews || []);
      } else {
        console.warn("[Reviews] fetch failed:", data?.message || res.status);
      }
    } catch (err) {
      console.error("[Reviews] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  function computeSummary() {
    if (!reviews || reviews.length === 0) return { avg: 0, total: 0 };
    const total = reviews.length;
    const sum = reviews.reduce((s, r) => s + (r.stars || 0), 0);
    return { avg: +(sum / total).toFixed(1), total };
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (submitting) return;
    if (stars < 1 || stars > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login to add a review.");
        setSubmitting(false);
        return;
      }

      const body = { productId, stars, text };
      const res = await fetch(`${API_BASE}/api/v1/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);
      if (res.status === 403) {
        toast.error("You must purchase this product to leave a review.");
        return;
      }
      if (res.status === 400) {
        toast.error(data?.message || "You have already reviewed this product.");
        return;
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `Failed to submit review (status ${res.status})`);
      }

      // prepend new review
      const newReview = data.review;
      setReviews((prev) => [newReview, ...(prev || [])]);
      setStars(5);
      setText("");
      toast.success("Review submitted");
    } catch (err) {
      console.error("[Reviews] submit error:", err);
      toast.error("Unable to submit review. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    // replaced by dialog-based flow
    requestDelete(id);
  }

  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function requestDelete(id) {
    const candidate = (reviews || []).find((r) => r._id === id) || { _id: id };
    setDeleteCandidate(candidate);
  }

  async function performDelete() {
    if (!deleteCandidate) return;
    const id = deleteCandidate._id;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login to delete review.");
        return;
      }
      const res = await fetch(`${API_BASE}/api/v1/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        const msg = data?.message || `Failed to delete (status ${res.status})`;
        throw new Error(msg);
      }
      setReviews((prev) => (prev || []).filter((r) => r._id !== id));
      toast.success("Review deleted");
      setDeleteCandidate(null);
    } catch (err) {
      console.error("[Reviews] delete error:", err);
      toast.error(err?.message || "Unable to delete review. Please try again later.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const { avg, total } = computeSummary();

  return (
    <section className="bg-white rounded-2xl border border-[#f3d0b5] p-6 md:p-8 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-semibold">{avg || 0}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-sm">
                  {i < Math.round(avg) ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-300" />
                  )}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500">({total} reviews)</div>
          </div>
        </div>
        <button
          type="button"
          onClick={fetchReviews}
          disabled={loading}
          className="text-xs font-semibold px-3 py-1 rounded-full border border-[#f34332] text-[#f34332] hover:bg-[#fef0eb] disabled:opacity-60"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Add review form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStars(i + 1)}
                  className="p-1"
                  aria-label={`Rate ${i + 1} stars`}
                >
                  <Star filled={i < stars} />
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500">{stars} / 5</div>
          </div>
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write your review (optional)"
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#f34332]/60"
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#f34332] text-white px-4 py-2 text-sm font-semibold hover:bg-[#d73526] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Add review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm text-gray-600">Log in to add a review.</div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {loading && <div className="text-sm text-gray-500">Loading reviews…</div>}
        {!loading && reviews.length === 0 && (
          <div className="text-sm text-gray-500">No reviews yet. Be the first to review!</div>
        )}

        {!loading && reviews.map((r) => (
          <div key={r._id} className="border rounded-2xl p-4 bg-[#fffaf5]">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-sm">{r.userName || r.user?.name || "Anonymous"}</div>
                <div className="text-[11px] text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < (r.stars || 0) ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
                {r.user?._id && currentUserId && r.user._id === currentUserId && (
                  <button
                    onClick={() => requestDelete(r._id)}
                    className="text-red-500 p-1 rounded-full"
                    aria-label="Delete review"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
            {r.text && <div className="mt-3 text-sm text-[#5b3a29]">{r.text}</div>}
          </div>
        ))}
      </div>
      {/* Delete confirmation modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteCandidate(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-semibold">Delete review</h3>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-full border bg-white text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={performDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-sm disabled:opacity-60"
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
