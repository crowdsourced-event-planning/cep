"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return (
    !!localStorage.getItem("token") || document.cookie.includes("access_token=")
  );
}

export default function ButtonCreateWorkbook({
  eventId,
  mode = "normal", // "normal" | "first"
}: {
  eventId: string;
  mode?: "normal" | "first";
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setChecked(true);
    const checkAuth = () => setLoggedIn(isAuthenticated());
    window.addEventListener("authChanged", checkAuth);
    return () => window.removeEventListener("authChanged", checkAuth);
  }, []);

  if (!checked) return null;

  if (loggedIn) {
    return (
      <Button
        size="sm"
        className={mode === "first" ? "mt-4" : ""}
        onClick={() => router.push(`/event/${eventId}/workbook/create`)}
      >
        {mode === "first" ? "Create First Workbook" : "Create Workbook"}
      </Button>
    );
  }

  // Belum login
  if (mode === "first" || mode === "normal") {
    return (
      <Button
        size="sm"
        variant="secondary"
        className={mode === "first" ? "mt-4 w-full" : ""}
        onClick={() => router.push("/login")}
      >
        Silakan Login untuk Membuat Workbook
      </Button>
    );
  }

  return null;
}
