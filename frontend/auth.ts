import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async jwt({ token, account }) {
            // On initial sign-in, send the Google ID token to our backend
            if (account) {
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
                    const res = await fetch(`${backendUrl}/api/v1/auth/google`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: account.id_token }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        token.backendToken = data.access_token;
                    }
                } catch (error) {
                    console.error("Failed to authenticate with backend:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Expose backend JWT to the client-side session
            (session as any).backendToken = token.backendToken;
            return session;
        },

        async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Call your FastAPI Backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/sync`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            // SECURITY: Add the secret key we discussed earlier!
            'x-internal-token': process.env.INTERNAL_API_KEY || "MY_SUPER_SECRET_INTERNAL_KEY"
          },
          body: JSON.stringify({
            email: user.email,
            full_name: user.name,
            // provider_id might be on 'account' depending on the provider
            provider_id: account?.providerAccountId || user.id 
          }),
        });

        if (!response.ok) {
          console.error("Backend Sync Failed:", await response.text());
          return false; // Prevent login if backend sync fails
        }
        
        return true;

      } catch (error) {
        console.error("Backend Sync Error:", error);
        return false;
      }
    },
    },
});
