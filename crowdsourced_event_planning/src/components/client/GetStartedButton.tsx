"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-client";

export default function GetStartedButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const handleClick = () => {
    if (loggedIn) {
      router.push("/event/create"); // Arahkan ke halaman Create Event jika sudah login
    } else {
      router.push("/register"); // Arahkan ke halaman Register jika belum login
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
    >
      {loggedIn ? "Create Event" : "Get Started"}
    </button>
  );
}
