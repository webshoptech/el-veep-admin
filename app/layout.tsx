"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Manage sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en ">
      <body className={`${inter.className} antialiased `}>
        <div className="flex bg-white">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <div className="flex flex-col flex-1 lg:pl-72">
            {/* Header */}
            <Header setSidebarOpen={setSidebarOpen} />

            {/* Page Content */}
            <main className="py-10 px-4 sm:px-6 lg:px-8 ">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
