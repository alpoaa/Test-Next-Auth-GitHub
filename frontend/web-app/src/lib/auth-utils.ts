import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Server-side helper to ensure user is authenticated
 * Use in Server Components and Route Handlers
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }
    return session;
}

/**
 * Get current session (returns null if not authenticated)
 * Safe for use in Server Components and Route Handlers
 */
export async function getSession() {
    return await auth();
}

/**
 * Check if user is authenticated via specific provider
 * Useful for conditional UI based on auth method
 */
export async function isAuthenticatedWith(provider: "github" | "credentials") {
    const session = await auth();
    return (session as any)?.provider === provider;
}

/**
 * Get the backend access token for API calls
 * Only available when authenticated via credentials provider
 */
export async function getBackendAccessToken() {
    const session = await auth();
    return (session as any)?.accessToken || null;
}
