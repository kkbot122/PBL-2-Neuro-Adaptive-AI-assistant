"use server";

import { auth } from "@/auth";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// Notice we are NOT using NEXT_PUBLIC_ here. This stays hidden on the server.
const INTERNAL_TOKEN = process.env.INTERNAL_API_KEY || "dev_secret_key_123";

export async function submitCalibrationAction(dimension: string, points: number) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized: No active session.");
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/profile/calibrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-email": session.user.email,
      "x-internal-token": INTERNAL_TOKEN,
    },
    body: JSON.stringify({
      paragraph_id: 0,
      dimension,
      points,
      calibration: true,
    }),
  });

  if (!res.ok) {
    console.error("Backend calibration failed:", await res.text());
    throw new Error("Failed to calibrate profile on backend");
  }

  return await res.json();
}

export async function getMyProfileAction() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized: No active session.");
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/profile/me`, {
    method: "GET",
    headers: {
      "x-user-email": session.user.email,
      "x-internal-token": INTERNAL_TOKEN,
    },
  });

  if (!res.ok) {
    console.error("Backend profile fetch failed:", await res.text());
    throw new Error("Failed to fetch profile from backend");
  }

  return await res.json();
}