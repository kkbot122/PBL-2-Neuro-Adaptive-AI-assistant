// frontend/app/(pages)/mission/actions.ts
"use server";

import { auth } from "@/auth"; // Update this import path to wherever your NextAuth config is exported
import { revalidatePath } from "next/cache";

// 1. Define the specific shapes of our new nested payload
interface TelemetryData {
  clicked_diagram: boolean;
  read_summary_first: boolean;
  time_spent_on_text: number;
  time_spent_on_visuals: number;
  time_spent_on_summary: number;
  scrolled_erratically: boolean;
}

interface QuizResultsData {
  score: number;
  q1_correct: boolean;
  q2_correct: boolean;
  q3_correct: boolean;
}

// 2. Define the main payload interface wrapper
export interface CalibrationPayload {
  telemetry: {
    clicked_diagram: boolean;
    read_summary_first: boolean;
    time_spent_on_text: number;
    time_spent_on_visuals: number;
    time_spent_on_summary: number;
    scrolled_erratically: boolean;
    reading_speed_wpm: number; // Added in Phase 3
  };
  quiz_results: {
    total_score: number;
    q1: QuestionMetric;
    q2: QuestionMetric;
    q3: QuestionMetric;
  };
}

interface QuestionMetric {
  is_correct: boolean;
  time_to_answer_ms: number;
  changed_answer: boolean;
}

export async function overrideUserArchetype(newArchetype: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";
    const internalKey = process.env.INTERNAL_API_KEY;

    const response = await fetch(`${apiUrl}/api/v1/profile/override`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-email": session.user.email,
        "x-internal-token": internalKey as string,
      },
      body: JSON.stringify({ primary_archetype: newArchetype }),
    });

    if (!response.ok) return { success: false, error: "Failed to override archetype." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error." };
  }
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
    const apiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://backend:8000";
      
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
      return {
        success: false,
        error: "Failed to save profile on the backend.",
      };
    }

    // 4. Parse the result from FastAPI
    const data = await response.json();

    // 5. Revalidate the dashboard page so the new chart data shows immediately
    revalidatePath("/dashboard");

    return {
      success: true,
      archetype: data.archetype, // E.g., "THE_VISUALIZER"
    };
  } catch (error) {
    console.error("Action Error (submitCalibration):", error);
    return { success: false, error: "An unexpected network error occurred." };
  }
}