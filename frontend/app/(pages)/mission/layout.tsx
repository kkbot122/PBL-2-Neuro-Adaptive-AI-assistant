import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signin");
  }

  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";
  
  // 1. Create a flag outside the try/catch block
  let shouldRedirect = false;

  try {
    const res = await fetch(`${apiUrl}/api/v1/profile/me`, {
      headers: {
        "x-user-email": session.user.email,
        "x-internal-token": process.env.INTERNAL_API_KEY as string,
      },
      cache: "no-store", 
    });

    if (res.ok) {
      const profile = await res.json();
      const raw = profile.raw_scores || {};
      
      const isOnboarded = Object.keys(raw).length > 0 && Object.values(raw).some((v: any) => v > 0);
      
      if (isOnboarded) {
        // 2. Set the flag to true instead of redirecting immediately
        shouldRedirect = true; 
      }
    }
  } catch (error) {
    console.error("Failed to verify onboarding status in layout:", error);
  }

  // 3. THE BOUNCER: Trigger the redirect OUTSIDE the try/catch!
  if (shouldRedirect) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}