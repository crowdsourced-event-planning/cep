"use client";

import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Set initial state
    setLoggedIn(isAuthenticated());

    // Tambahkan event listener untuk mendeteksi perubahan login
    const handleAuthChange = () => {
      setLoggedIn(isAuthenticated());
    };

    window.addEventListener("authChanged", handleAuthChange);

    // Cleanup event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Hapus token dari cookie
    setLoggedIn(false);
    router.push("/login");

    // Trigger event authChanged
    window.dispatchEvent(new Event("authChanged"));
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo dan Teks */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.webp" // Path ke logo di folder public
            alt="Collabora Logo"
            width={40} // Lebar logo
            height={40} // Tinggi logo
            className="rounded-full" // Opsional: Tambahkan styling
          />
          <span className="text-2xl font-bold text-blue-600">Collabora</span>
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium hover:text-blue-600 transition-colors ${
                pathname === link.href ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!loggedIn ? (
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
                className="ml-2 font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
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
                className={`font-medium py-2 hover:text-blue-600 transition-colors ${
                  pathname === link.href ? "text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!loggedIn ? (
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
