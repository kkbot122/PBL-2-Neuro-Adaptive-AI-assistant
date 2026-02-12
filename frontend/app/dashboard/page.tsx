"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);

    if (status === "loading") {
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
                        width: "48px",
                        height: "48px",
                        border: "3px solid rgba(255,255,255,0.1)",
                        borderTopColor: "#667eea",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                color: "#ffffff",
            }}
        >
            {/* Top Navigation Bar */}
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 32px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(16px)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                        }}
                    >
                        🧠
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em" }}>
                        Neuro AI
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {session.user?.image && (
                        <img
                            src={session.user.image}
                            alt="Profile"
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                border: "2px solid rgba(255,255,255,0.1)",
                            }}
                        />
                    )}
                    <button
                        onClick={() => signOut({ callbackUrl: "/signin" })}
                        id="signout-btn"
                        style={{
                            padding: "8px 20px",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            background: "rgba(255, 255, 255, 0.06)",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            fontFamily: "inherit",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px" }}>
                {/* Welcome Section */}
                <div style={{ marginBottom: "48px" }}>
                    <h1
                        style={{
                            fontSize: "36px",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            margin: "0 0 8px",
                        }}
                    >
                        Welcome back,{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {session.user?.name?.split(" ")[0] || "User"}
                        </span>
                    </h1>
                    <p
                        style={{
                            fontSize: "16px",
                            color: "rgba(255, 255, 255, 0.45)",
                            margin: 0,
                        }}
                    >
                        Your adaptive learning journey continues here.
                    </p>
                </div>

                {/* Stats Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px",
                        marginBottom: "40px",
                    }}
                >
                    {[
                        {
                            title: "Learning Sessions",
                            value: "0",
                            subtitle: "Start your first session",
                            color: "#667eea",
                            icon: "📚",
                        },
                        {
                            title: "Cognitive Profile",
                            value: "Not Set",
                            subtitle: "Complete the assessment",
                            color: "#764ba2",
                            icon: "🎯",
                        },
                        {
                            title: "Adaptive Score",
                            value: "—",
                            subtitle: "Builds over time",
                            color: "#f093fb",
                            icon: "📊",
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "28px",
                                borderRadius: "18px",
                                background: "rgba(255, 255, 255, 0.04)",
                                border: "1px solid rgba(255, 255, 255, 0.06)",
                                backdropFilter: "blur(12px)",
                                transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                                e.currentTarget.style.borderColor = `${stat.color}33`;
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "16px",
                                }}
                            >
                                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                                    {stat.title}
                                </span>
                                <span style={{ fontSize: "24px" }}>{stat.icon}</span>
                            </div>
                            <div style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: stat.color }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "6px" }}>
                                {stat.subtitle}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Profile Card */}
                <div
                    style={{
                        padding: "32px",
                        borderRadius: "18px",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            margin: "0 0 24px",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Your Profile
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {session.user?.image && (
                            <img
                                src={session.user.image}
                                alt="Profile"
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "16px",
                                    border: "2px solid rgba(255,255,255,0.1)",
                                }}
                            />
                        )}
                        <div>
                            <div style={{ fontSize: "18px", fontWeight: 600 }}>
                                {session.user?.name || "User"}
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "rgba(255, 255, 255, 0.4)",
                                    marginTop: "4px",
                                }}
                            >
                                {session.user?.email}
                            </div>
                            <div
                                style={{
                                    display: "inline-block",
                                    marginTop: "10px",
                                    padding: "4px 12px",
                                    borderRadius: "8px",
                                    background: "rgba(102, 126, 234, 0.15)",
                                    color: "#667eea",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                }}
                            >
                                Google Account
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
