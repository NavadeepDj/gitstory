import { fetchUserStory } from "@/services/githubService";
import StoryView from "@/components/StoryView";
import { GitStoryData } from "@/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ githubId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate dynamic metadata for SEO and social sharing
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { githubId } = await params;

  // Try to fetch basic user data for metadata
  // We use a lightweight approach here to avoid double-fetching
  let title = `@${githubId}'s Story`;
  let description = `Discover @${githubId}'s coding journey - commits, streaks, languages, and more. Every commit tells a story.`;

  const baseUrl = siteConfig.url;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | GitStory`,
      description,
      url: `${baseUrl}/${githubId}`,
      siteName: "GitStory",
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${title} | GitStory`,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${githubId}`,
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { githubId } = await params;

  // Read OAuth token from HTTP-only cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("gitstory_token")?.value;

  // Fetch data on the server side
  let storyData: GitStoryData | null = null;
  let error = null;

  try {
    storyData = await fetchUserStory(githubId, token);
  } catch (e) {
    console.error("Failed to fetch story data", e);
    error = e instanceof Error ? e.message : "Failed to load story";
  }

  if (!storyData && !error) {
    notFound();
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Story couldn&apos;t be written
        </h1>
        <p className="text-neutral-400 mb-8 max-w-md">{error}</p>
        <a
          href="/"
          className="px-6 py-3 bg-white text-black font-medium rounded-full hover:opacity-90 transition-opacity"
        >
          Try Another Story
        </a>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 bg-black text-white overflow-hidden">
      <StoryView data={storyData!} />
    </main>
  );
}
