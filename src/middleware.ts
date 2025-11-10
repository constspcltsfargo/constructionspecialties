export { auth as middleware } from "@/lib/auth"

export const config = {
  // The matcher is updated to exclude the /api route path.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
