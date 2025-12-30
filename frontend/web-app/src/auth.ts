import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

const BACKEND_URL = process.env.BACKEND_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            console.log("JWT callback:", { token, user, account, profile });
            // On initial sign-in, populate token with user data
            if (user) {
                token.id = user.id;
                token.provider = account?.provider; // Track which provider (github, credentials, entra, etc)
            }

            // Add provider-specific data
            if (account?.provider === "github") {
                token.githubId = profile?.id;
            } else if (account?.provider === "credentials") {
                // accessToken from backend (credentials provider)
                //token.accessToken = user.accessToken;
            }
            // Entra ID data can be added here in the future

            return token;
        },
        async session({ session, token }) {
            console.log("Session callback:", { session, token });
            // Pass token data to session
            if (session.user) {
                session.user.id = token.id as string;
                (session as any).provider = token.provider;
                (session as any).accessToken = token.accessToken;
            }
            return session;
        }
    },
    providers: [
        GitHub,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "*****" }
            },
            authorize: async (creds) => {
                const response = await fetch(`${BACKEND_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: creds?.email, password: creds?.password })
                })

                if (!response.ok) return null;
                // Expect: { user: { id, email, name }, accessToken: "..." }
                const data = await response.json();
                return { ...data.user, accessToken: data.accessToken }
            }
        })
    ],
    pages: { signIn: "/login" },
    secret: process.env.AUTH_SECRET
})