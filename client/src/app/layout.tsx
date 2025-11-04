"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Style
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "flowbite";

// Components
import AuthProvider from "@/utils/providers/authProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Init Query Client.
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    document.title = "Blockchain Vehicle Registration System";
    document.documentElement.className = "dark";
  }, []);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-4 min-h-screen`}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
