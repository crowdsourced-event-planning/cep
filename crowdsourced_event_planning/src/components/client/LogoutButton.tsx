"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`w-full md:w-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition cursor-pointer ${className}`}
    >
      Logout
    </button>
  );
}
