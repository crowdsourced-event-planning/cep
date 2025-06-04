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
  // { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  // Handle create event navigation
  const handleCreateEventClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/login?callbackUrl=/create");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const loggedIn = isAuthenticated;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo dan Teks */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.webp"
            alt="Collabora Logo"
            width={40}
            height={40}
            className="rounded-full"
            style={{ height: "auto" }}
          />
          <span className="text-2xl font-bold text-blue-600">Collabora</span>
        </Link>
        {/* Desktop Menu */}{" "}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={
                link.href === "/create" ? handleCreateEventClick : undefined
              }
              className={`font-medium hover:text-blue-600 transition-colors ${
                pathname === link.href ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}{" "}
          {!isAuthenticated ? (
            <Link
              href="/login"
              className={`font-medium hover:text-blue-600 transition-colors ${
                pathname === "/login" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className={`font-medium hover:text-blue-600 transition-colors ${
                  pathname === "/profile" ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
          {loggedIn && user?._id && (
            <PanitiaRequestNotification userId={user._id} />
          )}
          {loggedIn && user?._id && <TopupButtonWithModal />}
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
                className={`font-medium py-2 hover:text-blue-600 transition-colors ${
                  pathname === link.href ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className={`font-medium py-2 hover:text-blue-600 transition-colors ${
                  pathname === "/login" ? "text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <>
                {/* Ganti Link Topup dengan TopupButtonWithModal */}
                {loggedIn && user?._id && <TopupButtonWithModal />}
                <Link
                  href="/profile"
                  className={`font-medium py-2 hover:text-blue-600 transition-colors ${
                    pathname === "/profile" ? "text-blue-600" : "text-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="font-medium py-2 text-red-500 hover:text-red-700 transition-colors text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
