"use server";

import { auth } from "@/auth"; // Update this import path to wherever your NextAuth config is exported
import { revalidatePath } from "next/cache";

// Define the shape of the incoming telemetry data
interface CalibrationPayload {
  clicked_diagram: boolean;
  read_summary_first: boolean;
  time_spent_on_text: number;
  interacted_with_quiz: boolean;
  scrolled_erratically: boolean;
}

export async function submitCalibration(payload: CalibrationPayload) {
  try {
    // 1. Get the authenticated user's session
    const session = await auth();
    
    if (!session?.user?.email) {
      console.error("Calibration Error: No active session found.");
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // 2. Prepare the Backend Request
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const internalKey = process.env.INTERNAL_API_KEY;

    if (!internalKey) {
      console.error("Server Configuration Error: INTERNAL_API_KEY is missing.");
      return { success: false, error: "Server configuration error." };
    }

    // 3. Send the Data to FastAPI
    const response = await fetch(`${apiUrl}/api/v1/profile/calibrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // SECURITY: These two headers act as the "Gatekeeper" keys for your FastAPI backend
        "x-user-email": session.user.email,
        "x-internal-token": internalKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI Calibration Failed:", response.status, errorText);
      return { success: false, error: "Failed to save profile on the backend." };
    }

    // 4. Parse the result from FastAPI
    const data = await response.json();
    
    // 5. Revalidate the dashboard page so the new chart data shows immediately
    revalidatePath("/dashboard");

    return { 
      success: true, 
      archetype: data.archetype // E.g., "THE_VISUALIZER"
    };

  } catch (error) {
    console.error("Action Error (submitCalibration):", error);
    return { success: false, error: "An unexpected network error occurred." };
  }
}