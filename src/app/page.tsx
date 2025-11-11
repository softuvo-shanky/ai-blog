import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-6 py-12">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            AI Signals
          </p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            Fresh intelligence on artificial intelligence
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300">
            Daily updates sourced from trusted AI publications, synthesised by
            large language models, and delivered straight to you automatically.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 text-sm text-zinc-400">
            <span>
              Feeds: Synced from{" "}
              <span className="text-zinc-200">AI news & research RSS</span>
            </span>
            <span>
              Generated with{" "}
              <code className="rounded bg-zinc-900 px-2 py-1 text-xs text-emerald-300">
                OPENAI_API_KEY
              </code>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/60 p-12 text-center">
            <h2 className="text-2xl font-semibold text-zinc-200">
              No stories yet
            </h2>
            <p className="mt-2 text-zinc-400">
              Run <code>npm run update-content</code> to ingest the latest AI
              news and generate your first article.
            </p>
          </div>
        ) : (
          posts.map((post) => {
            let sourceLabel = post.source;
            try {
              sourceLabel = new URL(post.source).hostname || post.source;
            } catch {
              // keep original label
            }

            return (
              <article
                key={post.slug}
                className="group rounded-2xl border border-zinc-900 bg-zinc-900/40 p-8 transition hover:border-emerald-400/60 hover:bg-zinc-900"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-emerald-300">
                  <span>{sourceLabel}</span>
                <span className="h-px flex-1 bg-emerald-400/30" />
                <span className="text-zinc-400">
                  {dateFormatter.format(new Date(post.publishedAt))}
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-zinc-50 group-hover:text-emerald-200">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-zinc-300">{post.description}</p>
                {post.tags?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-emerald-400/40 px-3 py-1 text-emerald-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
                  >
                    Read the synthesis →
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </main>
      <footer className="border-t border-zinc-900 bg-black/80 py-8 text-center text-xs text-zinc-500">
        Automated by large language models • Powered by curated RSS feeds
      </footer>
    </div>
  );
}
