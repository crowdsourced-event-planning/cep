"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on login and register pages
  const hideNavbarPaths = ["/login", "/register"];

  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}
