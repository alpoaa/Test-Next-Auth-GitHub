"use client";

import { useSession } from "next-auth/react";

/**
 * Hook to get current session in Client Components
 * Returns null while loading
 */
export function useAuth() {
    const { data: session, status } = useSession();
    
    return {
        session,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        provider: (session as any)?.provider,
        accessToken: (session as any)?.accessToken,
    };
}

/**
 * Hook to check authentication status
 */
export function useIsAuthenticated() {
    const { data: session, status } = useSession();
    return status === "authenticated";
}
