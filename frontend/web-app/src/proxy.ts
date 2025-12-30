import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
** Public routes: accessible to all users always.
*/
const PUBLIC_ROUTE_PREFIXES = [
    "/login",
    "/register"
];

/*
** Protected routes: only accessible to authenticated users.
** Includes route prefixes to handle subroutes also (e.g., /docs/getting-started, /support/tickets/123).
*/
const PROTECTED_ROUTE_PREFIXES = [
    "/",           // Home and all unmatched routes are protected by default.
    "/docs",       // /docs and all subroutes: /docs/*, /docs/*/*, etc.
    "/support"     // /support and all subroutes: /support/*, /support/*/*, etc.
];

/*
** Check if a pathname matches any of the route prefixes.
*/
const isRouteInList = (pathname: string, routePrefixes: string[]): boolean => {
    return routePrefixes.some(prefix => 
        pathname === prefix || pathname.startsWith(prefix + "/")
    );
}

/*
 * Proxy-based authentication handler.
 * Routes unauthenticated users away from protected areas.
 * Routes authenticated users away from public auth pages.
 */
export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.auth?.user;

    // If user is not authenticated and trying to access a protected route.
    if (!isAuthenticated && isRouteInList(pathname, PROTECTED_ROUTE_PREFIXES)) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access public auth routes, redirect to home.
    if (isAuthenticated && isRouteInList(pathname, PUBLIC_ROUTE_PREFIXES)) {
        const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/";
        return NextResponse.redirect(new URL(callbackUrl, req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Apply proxy to all routes except API endpoints and static assets
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};