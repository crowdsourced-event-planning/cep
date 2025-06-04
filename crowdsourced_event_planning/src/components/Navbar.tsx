"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PanitiaRequestNotification from "@/components/client/PanitiaRequestNotification";
import TopupButtonWithModal from "@/components/client/TopupButtonWithModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/create", label: "Create Event" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleCreateEventClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/login?callbackUrl=/create");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Collabora Logo"
            width={40}
            height={40}
            className="rounded-full"
            style={{ height: "auto" }}
          />
          <span className="text-2xl font-bold text-blue-600 fresca">
            Collabora
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={
                link.href === "/create" ? handleCreateEventClick : undefined
              }
              className={`px-3 py-2 rounded font-medium transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Topup Saldo setelah Create Event */}
          {isAuthenticated && <TopupButtonWithModal />}

          {!isAuthenticated ? (
            <Link
              href="/login"
              className={`px-3 py-2 rounded font-medium transition-colors ${
                pathname === "/login"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded font-medium transition-colors ${
                  pathname === "/profile"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                Profile
              </Link>

              {/* Notifikasi tetap di sini jika perlu */}
              {user?._id && <PanitiaRequestNotification userId={user._id} />}
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-blue-600 border-blue-600"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow">
          <div className="flex flex-col px-4 py-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href === "/create") {
                    handleCreateEventClick(e);
                  }
                  setMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Topup Saldo rata kiri */}
            {isAuthenticated && (
              <div>
                <TopupButtonWithModal />
              </div>
            )}

            {!isAuthenticated ? (
              <Link
                href="/login"
                className={`block px-3 py-2 rounded font-medium transition-colors ${
                  pathname === "/login"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className={`block px-3 py-2 rounded font-medium transition-colors  ${
                    pathname === "/profile"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}

            {/* Notifikasi icon di tengah */}
            {isAuthenticated && user && user._id && (
              <div className="flex justify-center mt-4">
                <PanitiaRequestNotification userId={user._id} />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
