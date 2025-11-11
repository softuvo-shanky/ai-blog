import { getAllPosts } from "@/lib/posts";
import { CategoryNav } from "@/components/CategoryNav";
import { PostCard } from "@/components/PostCard";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-br from-emerald-950/20 via-zinc-950/80 to-zinc-950/80 backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live AI Intelligence
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-6">
              AI Signals
            </h1>

            <p className="max-w-3xl text-xl md:text-2xl text-zinc-300 mb-4">
              Fresh intelligence on artificial intelligence
            </p>

            <p className="max-w-2xl text-base text-zinc-400 mb-8">
              Daily updates sourced from trusted AI publications, synthesized by
              large language models, and delivered automatically.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Automated Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI-Powered Synthesis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Curated Categories</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryNav />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-16 text-center backdrop-blur">
            <div className="mx-auto max-w-md">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-zinc-200 mb-2">
                No stories yet
              </h2>
              <p className="text-zinc-400 mb-4">
                Run the content update script to ingest the latest AI news and generate your first articles.
              </p>
              <code className="inline-block rounded-lg bg-zinc-950 px-4 py-2 text-sm text-emerald-400 border border-zinc-800">
                npm run update-content
              </code>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-200">
                Latest Articles
                <span className="ml-3 text-base font-normal text-zinc-500">
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-zinc-300">AI Signals</p>
              <p className="text-xs text-zinc-500">
                Automated intelligence briefings powered by AI
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-zinc-500">
              <span>Curated RSS Feeds</span>
              <span>•</span>
              <span>OpenAI Synthesis</span>
              <span>•</span>
              <span>Auto-Updated</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
