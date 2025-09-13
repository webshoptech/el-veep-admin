import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  const pathname = request.nextUrl.pathname;

  const isLogin = pathname === '/login';
  const isChangePassword = pathname === '/change-password';

  let mustChangePassword = false;

  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      mustChangePassword = !user.password_changed_at; // null => true
    } catch {
      // bad cookie, force login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 🚪 No token → force login (except login page itself)
  if (!token && !isLogin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🚪 Token exists but user must change password
  if (token && mustChangePassword) {
    if (!isChangePassword) {
      return NextResponse.redirect(new URL('/change-password', request.url));
    }
    return NextResponse.next();
  }

  // 🚪 Already logged in but trying to go to /login → send home
  if (token && isLogin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
