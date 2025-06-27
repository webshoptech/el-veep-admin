'use client';

import Sidebar from '@/app/components/Sidebar';
import { useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex bg-white h-screen overflow-auto">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
            <div className="flex flex-col flex-1 lg:pl-70">
                <main className="py-10 px-4 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
