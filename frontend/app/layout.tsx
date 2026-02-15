import type { Metadata } from "next";
import { Geist, Geist_Mono, Kodchasan } from "next/font/google"; // Import Kodchasan
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configure Kodchasan
const kodchasan = Kodchasan({
  variable: "--font-kodchasan",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Load necessary weights
});

export const metadata: Metadata = {
  title: "Neuro Adaptive AI Assistant",
  description: "AI-powered adaptive learning assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // Add kodchasan.variable to the class list
        className={`${geistSans.variable} ${geistMono.variable} ${kodchasan.variable} antialiased font-sans`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}