"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "@/lib/auth-client";

export default function GetStartedButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setLoggedIn(authStatus);

      if (authStatus) {
        const user = getCurrentUser();
        setUserRole(user?.role || null);
      }
    };

    checkAuth();

    // Listen for auth changes (like role updates)
    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  const upgradeToCreator = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/upgrade-role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update local user role
        setUserRole("creator");

        // Trigger event for other components to update
        window.dispatchEvent(new Event("authChanged"));

        // Redirect to event creation page
        router.push("/event/create");
      } else {
        const error = await response.json();
        console.error("Failed to upgrade role:", error);
        alert("Failed to upgrade your role. Please try again.");
      }
    } catch (error) {
      console.error("Error upgrading role:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!loggedIn) {
      router.push("/register");
    } else if (userRole === "creator") {
      // Already a creator, go directly to create event page
      router.push("/event/create");
    } else {
      // User is a viewer, upgrade to creator first
      upgradeToCreator();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-75"
    >
      {!loggedIn
        ? "Get Started"
        : loading
        ? "Processing..."
        : userRole === "creator"
        ? "Create Event"
        : "Create Event"}
    </button>
  );
}
