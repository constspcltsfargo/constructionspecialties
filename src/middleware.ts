
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is now much simpler. It no longer needs to verify session cookies
// as the client-side authentication state is the source of truth.
// Route protection is handled inside the /admin layout itself.

export function middleware(request: NextRequest) {
  // We can let the request through. The client-side `AdminLayout` will handle
  // redirecting unauthenticated users.
  return NextResponse.next();
}

export const config = {
  // Match all paths except for static assets and internal Next.js paths
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
