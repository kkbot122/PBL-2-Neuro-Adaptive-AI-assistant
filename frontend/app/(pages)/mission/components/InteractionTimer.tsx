"use server"

import { auth } from "@/auth"; // Adjust this path to wherever your NextAuth config is exported

interface TelemetryData {
  clicked_diagram: boolean;
  read_summary_first: boolean;
  time_spent_on_text: number;
  interacted_with_quiz: boolean;
  scrolled_erratically: boolean;
}

export async function submitCalibration(data: TelemetryData) {
  // 1. Get the logged-in user from NextAuth
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to take the test.");
  }

  // 2. Forward the data securely to FastAPI
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/calibrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-token": process.env.INTERNAL_API_KEY as string,
      "x-user-email": session.user.email, // Passing email to identify the user
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to calibrate:", errorText);
    return { success: false, error: "Backend failed to process profile." };
  }

  const result = await response.json();
  return { success: true, archetype: result.archetype };
}