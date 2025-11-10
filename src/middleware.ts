
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a mock session cookie for the Firestore-based login prototype.
  const session = request.cookies.get('mockSession');

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // In a real app, you would validate the session token here against a server-side session store.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
