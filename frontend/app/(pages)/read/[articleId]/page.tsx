import { notFound } from "next/navigation";
import TrackedImage from "@/components/TrackedImage";
import CalibrationQuiz from "@/components/CalibrationQuiz";
import AdaptiveContent from "@/components/AdaptiveContent"; // New Client Component

interface Paragraph {
  id: number;
  order_index: number;
  original_text: string;
  adapted_text: string; // The backend now provides this
}

interface Article {
  id: number;
  title: string;
  topic: string;
  paragraphs: Paragraph[];
}

async function getArticle(id: string): Promise<Article | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/content/articles/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

async function getUserProfile(userId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/profile/?user_id=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function ReadPage({ params }: { params: Promise<{ articleId: string }> }) {
  const resolvedParams = await params;
  
  const [article, profile] = await Promise.all([
    getArticle(resolvedParams.articleId),
    getUserProfile(1)
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* 1. CALIBRATION OVERLAY */}
      {profile?.primary_archetype === "THE_PIONEER" && (
        <CalibrationQuiz userId={1} />
      )}

      <div className="max-w-3xl mx-auto p-8 font-sans">
        {/* Header Section */}
        <div className="mb-10 border-b pb-6">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
            {article.topic}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            {article.title}
          </h1>
        </div>

        {/* 2. VISUAL TRACKER */}
        <TrackedImage 
          id={1001} 
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000" 
          alt="Complex Quantum Probability Distribution Diagram" 
        />

        {/* 3. ADAPTIVE CONTENT WRAPPER (Handles Toggle and Trackers) */}
        <AdaptiveContent paragraphs={article.paragraphs} />
        
        <div className="mt-16 pt-8 border-t text-center text-gray-500">
          <p>End of article.</p>
        </div>
      </div>
    </div>
  );
}