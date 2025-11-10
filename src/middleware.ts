
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');

  // For /admin routes, we require a valid session
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      // No session cookie, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // The session cookie's value is the ID token.
      // We send it to a serverless function for verification.
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify-session`, {
        headers: {
          Authorization: `Bearer ${sessionCookie.value}`,
        },
      });

      // If verification fails, redirect to login
      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Session verification error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If visiting /login or /signup and already authenticated, redirect to admin
  if (
    (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') &&
    sessionCookie
  ) {
    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/verify-session`, {
             headers: {
                Authorization: `Bearer ${sessionCookie.value}`,
             },
        });
        if (response.ok) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    } catch (error) {
        // If verification fails, just let them go to the login/signup page.
    }
  }


  return NextResponse.next();
}

export const config = {
  // Match all paths except for static assets and API routes (for session verification itself)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
