'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex bg-[#F9F9F9] h-screen">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:pl-70">
        {/* Page Content */}
        <main className="py-10 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
