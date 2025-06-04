import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar";
import SocketInitializer from "@/components/SocketInitializer";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { initializeDatabase } from "@/lib/db-init";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

// Initialize the database collections
initializeDatabase().catch(console.error);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collabora - Crowdsourced Event Planning Platform",
  description:
    "Foster collaboration, transparency, and trust among creators, investors, volunteers, and viewers through crowdsourced event planning.",
  keywords: "event planning, crowdsourcing, collaboration, funding, volunteers",
  openGraph: {
    title: "Collabora - Crowdsourced Event Planning Platform",
    description:
      "Foster collaboration, transparency, and trust among creators, investors, volunteers, and viewers through crowdsourced event planning.",
    type: "website",
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketInitializer />
        <AuthProvider>
          <ConditionalNavbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
