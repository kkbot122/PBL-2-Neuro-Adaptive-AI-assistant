import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isOnSignin = req.nextUrl.pathname.startsWith("/signin");

    if (isOnDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (isOnSignin && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*", "/signin"],
};
