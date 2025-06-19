'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LayoutWrapper from './LayoutWrapper';
import toast from 'react-hot-toast';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingToken, setCheckingToken] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;

  if (token) {
    if (parsedUser?.must_change_password === true && pathname !== '/change-password') {
      toast.error("Please change your password");
      router.replace('/change-password');
    } else {
      setHasToken(true);
    }
  } else if (pathname !== '/login') {
    router.replace('/login');
  }

  setCheckingToken(false);
}, [pathname, router]);


  if (checkingToken) return null;

if (pathname === '/login' || pathname === '/change-password') return children;

  if (!hasToken) return null;

  return <LayoutWrapper>{children}</LayoutWrapper>;
}
