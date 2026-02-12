"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    margin: "0 20px",
                    padding: "48px 40px",
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 32px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                }}
            >
                {/* Logo / Icon */}
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        margin: "0 auto 24px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                    }}
                >
                    🧠
                </div>

                {/* Title */}
                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#ffffff",
                        margin: "0 0 8px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Welcome Back
                </h1>
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "15px",
                        color: "rgba(255, 255, 255, 0.5)",
                        margin: "0 0 40px",
                        lineHeight: 1.5,
                    }}
                >
                    Sign in to your Neuro Adaptive AI Assistant
                </p>

                {/* Google Sign-In Button */}
                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    id="google-signin-btn"
                    style={{
                        width: "100%",
                        padding: "14px 24px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        transition: "all 0.2s ease",
                        fontFamily: "inherit",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {/* Google Logo SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "32px 0",
                        gap: "16px",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "rgba(255, 255, 255, 0.1)",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, 0.3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                        }}
                    >
                        Powered by AI
                    </span>
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "rgba(255, 255, 255, 0.1)",
                        }}
                    />
                </div>

                {/* Footer Info */}
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "rgba(255, 255, 255, 0.3)",
                        margin: 0,
                        lineHeight: 1.6,
                    }}
                >
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
