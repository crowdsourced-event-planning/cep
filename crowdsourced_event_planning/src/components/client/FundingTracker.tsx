"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatDate";

interface Funding {
  _id: string;
  amount: number;
  userId: string;
  eventId: string;
  message: string;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
}

interface FundingTrackerProps {
  eventId: string;
  targetAmount: number;
  currentUserId?: string;
}

export default function FundingTracker({
  eventId,
  targetAmount,
  currentUserId,
}: FundingTrackerProps) {
  const [funding, setFunding] = useState<Funding[]>([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [fundingAmount, setFundingAmount] = useState("");
  const [fundingMessage, setFundingMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchFunding = useCallback(async () => {
    try {
      const response = await fetch(`/api/funding?eventId=${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch funding");

      const data = await response.json();
      setFunding(data);
    } catch (err) {
      console.error("Error fetching funding:", err);
    }
  }, [eventId]);

  const fetchTotalFunding = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/funding?eventId=${eventId}&total=true`
      );
      if (!response.ok) throw new Error("Failed to fetch total funding");

      const data = await response.json();
      setTotalFunding(data.total);
    } catch (err) {
      console.error("Error fetching total funding:", err);
    }
  }, [eventId]);

  useEffect(() => {
    fetchFunding();
    fetchTotalFunding();
  }, [fetchFunding, fetchTotalFunding]);

  const handleFunding = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      setError("Please log in to fund this event");
      return;
    }

    if (!fundingAmount || Number(fundingAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/funding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(fundingAmount),
          userId: currentUserId,
          eventId,
          message: fundingMessage,
          isAnonymous,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit funding");
      }

      const newFunding = await response.json();
      setFunding((prev) => [...prev, newFunding]);
      setTotalFunding((prev) => prev + newFunding.amount);

      // Reset form
      setFundingAmount("");
      setFundingMessage("");
      setIsAnonymous(false);
      setShowFundingModal(false);

      // Show success message (you could replace this with a toast notification)
      alert("Thank you for your contribution!");
    } catch (err) {
      console.error("Error submitting funding:", err);
      setError("Failed to submit funding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fundingPercentage =
    targetAmount > 0 ? Math.min((totalFunding / targetAmount) * 100, 100) : 0;
  const recentFunding = funding
    .filter((f) => f.status === "completed")
    .slice(-5);

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Funding Progress
          </h3>
          {currentUserId && (
            <Button size="sm" onClick={() => setShowFundingModal(true)}>
              Fund This Event
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(totalFunding)}
            </span>
            <span className="text-sm text-gray-500">
              {fundingPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${Math.max(fundingPercentage, 5)}%` }}
            >
              {fundingPercentage > 10 && (
                <span className="text-white text-xs font-medium">
                  {fundingPercentage.toFixed(0)}%
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Raised: {formatCurrency(totalFunding)}</span>
            <span>Goal: {formatCurrency(targetAmount)}</span>
          </div>
        </div>
      </div>

      {/* Recent Contributions */}
      {recentFunding.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Contributions
          </h3>

          <div className="space-y-3">
            {recentFunding.map((contribution) => (
              <div
                key={contribution._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">
                      {contribution.isAnonymous
                        ? "?"
                        : contribution.userId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {contribution.isAnonymous
                        ? "Anonymous"
                        : contribution.userId}
                    </div>
                    {contribution.message && (
                      <div className="text-xs text-gray-600">
                        {contribution.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-green-600 font-medium">
                  {formatCurrency(contribution.amount)}
                </div>
              </div>
            ))}
          </div>

          {funding.length > recentFunding.length && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all {funding.length} contributions
              </button>
            </div>
          )}
        </div>
      )}

      {/* Funding Modal */}
      {showFundingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Fund This Event</h3>
              <button
                onClick={() => setShowFundingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFunding} className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  value={fundingMessage}
                  onChange={(e) => setFundingMessage(e.target.value)}
                  placeholder="Leave a message of support..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="anonymous"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Contribute anonymously
                </label>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowFundingModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Processing..." : "Contribute"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
