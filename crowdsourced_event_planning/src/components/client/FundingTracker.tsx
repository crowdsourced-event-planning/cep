"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils/format";
import { ref, onChildAdded } from "firebase/database";
import { database } from "@/lib/firebase";

interface FundingTrackerProps {
  eventId: string;
  targetAmount: number;
}

export default function FundingTracker({
  eventId,
  targetAmount,
}: FundingTrackerProps) {
  const [currentFunding, setCurrentFunding] = useState(0);
  const [fundingPercentage, setFundingPercentage] = useState(0);

  // Fetch currentFunding dari API
  const fetchCurrentFunding = useCallback(async () => {
    try {
      const response = await fetch(`/api/funding?eventId=${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch funding");
      const data = await response.json();
      setCurrentFunding(data.currentFunding || 0);
    } catch (err) {
      console.error("Error fetching funding:", err);
    }
  }, [eventId]);

  useEffect(() => {
    fetchCurrentFunding();
  }, [fetchCurrentFunding]);

  // Listen for real-time donation updates
  useEffect(() => {
    if (!eventId) return;
    const notifRef = ref(database, `event_notifications/${eventId}`);
    const unsub = onChildAdded(notifRef, () => {
      fetchCurrentFunding(); // fetch ulang data funding
    });
    return () => unsub();
  }, [eventId, fetchCurrentFunding]);

  // Animate progress bar
  useEffect(() => {
    const percent =
      targetAmount > 0
        ? Math.min((currentFunding / targetAmount) * 100, 100)
        : 0;
    setFundingPercentage(percent);
  }, [currentFunding, targetAmount]);

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Funding Progress
        </h3>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-green-600">
          {formatCurrency(currentFunding)}
        </span>
        <span className="text-sm text-gray-500">
          {fundingPercentage.toFixed(1)}%
        </span>
      </div>
      {/* Animated Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-600 h-4 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${fundingPercentage}%`,
            minWidth: fundingPercentage > 0 ? "2rem" : 0,
          }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Raised: {formatCurrency(currentFunding)}</span>
        <span>Goal: {formatCurrency(targetAmount)}</span>
      </div>
    </div>
  );
}
