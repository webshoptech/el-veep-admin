'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LayoutWrapper from './LayoutWrapper';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const cookies = document.cookie
            .split('; ')
            .reduce((acc: Record<string, string>, cookie) => {
                const [key, val] = cookie.split('=');
                acc[key] = decodeURIComponent(val);
                return acc;
            }, {});

        const token = cookies['token'];
        const user = cookies['user'];

        if (!token || !user) {
            if (
                pathname !== '/auth/login' &&
                pathname !== '/auth/change-password' &&
                pathname !== '/auth/forget-password' &&
                pathname !== '/auth/confirm-reset-code' &&
                pathname !== '/auth/reset-password'
            ) {
                router.replace('/auth/login');
            }
            setIsAuthenticated(false);
        } else {
            if (pathname === '/auth/login' || pathname === '/auth/forget-password') {
                router.replace('/');
            } else {
                setIsAuthenticated(true);
            }
        }

        setIsChecking(false);
    }, [pathname, router]);

    if (isChecking) return null;
    if (
        !isAuthenticated &&
        pathname !== '/auth/login' &&
        pathname !== '/auth/change-password' &&
        pathname !== '/auth/forget-password' &&
        pathname !== '/auth/confirm-reset-code' &&
        pathname !== '/auth/reset-password'
    )
        return null;

    if (
        pathname === '/auth/login' ||
        pathname === '/auth/change-password' ||
        pathname === '/auth/forget-password' ||
        pathname === '/auth/confirm-reset-code' ||
        pathname === '/auth/reset-password'
    ) {
        return children;
    }

    return <LayoutWrapper>{children}</LayoutWrapper>;
}
