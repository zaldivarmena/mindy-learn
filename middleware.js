import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes - explicitly listing routes to protect
const isProtectedRoute = createRouteMatcher([
  '/dashboard', // Base dashboard route
  '/dashboard/courses',
  '/dashboard/settings',
  '/dashboard/billing',
  '/create',
  '/course(.*)'  // All course routes
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}