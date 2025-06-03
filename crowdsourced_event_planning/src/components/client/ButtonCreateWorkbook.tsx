"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-client";

export default function ButtonCreateWorkbook({
  eventSlug,
  mode = "normal",
}: {
  eventSlug: string;
  mode?: "normal" | "first";
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const handleClick = () => {
    if (loggedIn) {
      router.push(`/event/${eventSlug}/workbook/create`);
    } else {
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
    >
      {mode === "first" ? "Create First Workbook" : "Create Workbook"}
    </button>
  );
}
