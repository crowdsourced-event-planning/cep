"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-client";
import Button from "@/components/ui/Button";

export default function GetStartedButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      setLoggedIn(isAuthenticated());
    };

    checkAuth();

    window.addEventListener("authChanged", checkAuth);
    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  const handleClick = () => {
    if (!loggedIn) {
      router.push("/register");
    } else {
      router.push("/event/create");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-white !text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
    >
      {!loggedIn ? "Get Started" : "Create Event"}
    </Button>
  );
}
