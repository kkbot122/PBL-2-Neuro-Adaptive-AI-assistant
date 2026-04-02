import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // Update this import if your auth is elsewhere

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    // We already have formData containing "prompt" and "file".
    // We forward this to the FastAPI backend.
    
    const apiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://backend:8000";
      
    const internalKey = process.env.INTERNAL_API_KEY;

    if (!internalKey) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const response = await fetch(`${apiUrl}/api/v1/chat/message`, {
      method: "POST",
      headers: {
        "x-user-email": session.user.email,
        "x-internal-token": internalKey,
        // Let fetch automatically set the Content-Type to multipart/form-data with boundary
      },
      body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("FastAPI Chat Error:", response.status, errorText);
        
        let errorDetail = "Failed to process chat";
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.detail) errorDetail = typeof parsed.detail === 'string' ? parsed.detail : JSON.stringify(parsed.detail);
        } catch(e) {}

        return NextResponse.json({ error: errorDetail }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
