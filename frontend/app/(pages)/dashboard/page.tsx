// frontend/app/(pages)/dashboard/page.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  LogOut,
  BookOpen,
  Target,
  Activity,
  User as UserIcon,
  Plus,
} from "lucide-react";

// Helper to format "THE_VISUALIZER" into "Visualizer"
const formatArchetype = (archetype: string) => {
  if (!archetype) return "Unknown";
  const clean = archetype.replace("THE_", "");
  return clean.charAt(0) + clean.slice(1).toLowerCase();
};

export default async function DashboardPage() {
  // 1. Authenticate on the server
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signin");
  }

  // 2. Fetch the user's profile securely
  const apiUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://backend:8000";
  const res = await fetch(`${apiUrl}/api/v1/profile/me`, {
    headers: {
      "x-user-email": session.user.email,
      "x-internal-token": process.env.INTERNAL_API_KEY as string,
    },
    cache: "no-store", // Ensure we always get the latest profile
  });

  if (!res.ok) {
    redirect("/mission");
  }

  const profile = await res.json();
  const raw = profile.raw_scores || {};

  // 3. Gatekeeper: If they have no scores, force them to calibrate!
  const isOnboarded =
    Object.keys(raw).length > 0 && Object.values(raw).some((v: any) => v > 0);
  if (!isOnboarded) {
    redirect("/mission");
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-black font-[family-name:var(--font-kodchasan)] pb-28">
      {/* NAVBAR */}
      <nav className="w-full bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight hidden md:block">
            NeuroLearn
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-yellow-100 px-3 py-1.5 rounded-lg border-2 border-black">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-black"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full border border-black flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
            <span className="font-bold text-sm hidden md:block">
              {session.user?.name?.split(" ")[0]}
            </span>
          </div>

          {/* Server Action Sign Out Form */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/signin" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#ff5252] border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none"
            >
              <LogOut className="w-4 h-4" strokeWidth={3} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-12">
          <div className="inline-block bg-[#CBF3F0] border-2 border-black px-3 py-1 text-sm font-bold mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            👋 Ready to learn?
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome back,
            <span className="underline decoration-wavy decoration-purple-500 underline-offset-4 ml-2">
              {session.user?.name?.split(" ")[0]}
            </span>
            !
          </h1>

          <p className="text-gray-600 font-medium mt-2 text-lg">
            Your cognitive load is optimal. Your AI is tuned for a{" "}
            <span className="font-bold text-black">
              {formatArchetype(profile.primary_archetype)}
            </span>{" "}
            profile.
          </p>

          {/* Use Next.js Link instead of useRouter for Server Components */}
          <Link
            href="/chat"
            className="w-fit mt-6 flex items-center gap-3 bg-[#FF9F1C] hover:bg-[#ff8c00] border-2 border-black px-6 py-3 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
            New Mission
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            <div className="p-3 bg-blue-100 border-2 border-black rounded-lg mb-4 w-fit">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase">
              Learning Sessions
            </h3>
            <p className="text-4xl font-bold mt-1">1</p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            <div className="p-3 bg-purple-100 border-2 border-black rounded-lg mb-4 w-fit">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase">
              Cognitive Profile
            </h3>
            {/* Display the dynamically fetched archetype! */}
            <p className="text-3xl font-bold mt-1 tracking-tight truncate">
              {formatArchetype(profile.primary_archetype)}
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            <div className="p-3 bg-green-100 border-2 border-black rounded-lg mb-4 w-fit">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase">
              Adaptive Score
            </h3>
            {/* We can use their total score or engagement time here later */}
            <p className="text-4xl font-bold mt-1">94</p>
          </div>
        </div>
      </main>
    </div>
  );
}
