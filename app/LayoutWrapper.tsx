'use client';

import Sidebar from '@/app/components/Sidebar';
import { useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex bg-white/95 h-screen overflow-hidden">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
            <div className="flex flex-col flex-1 h-full overflow-y-auto transition-all duration-300 lg:pl-70">
                <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
