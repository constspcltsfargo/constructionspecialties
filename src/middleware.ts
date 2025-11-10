export { auth as middleware } from "@/lib/auth"

export const config = {
  // Match all paths except for static assets, API routes, and internal Next.js paths
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
