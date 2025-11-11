import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";

import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getCategoryById } from "@/lib/categories";
import { CategoryBadge } from "@/components/CategoryBadge";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const post = await getPostBySlug(params.slug).catch(() => undefined);

  if (!post) return undefined;

  return {
    title: `${post.title} – AI Signals`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug).catch(() => undefined);

  if (!post) {
    notFound();
  }

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  const published = new Date(post.publishedAt);
  const formatter = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  });

  let sourceLabel = post.source;
  try {
    sourceLabel = new URL(post.source).hostname || post.source;
  } catch {
    // noop
  }

  const category = getCategoryById(post.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      {/* Navigation Bar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all posts
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <header className="relative overflow-hidden border-b border-zinc-800 backdrop-blur">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${category.color}30, transparent)`,
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative mx-auto max-w-4xl px-6 py-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <CategoryBadge categoryId={post.category} size="md" />
            <span className="text-sm text-zinc-500">•</span>
            <span className="text-sm text-zinc-400">{sourceLabel}</span>
            <span className="text-sm text-zinc-500">•</span>
            <time className="text-sm text-zinc-400">
              {formatter.format(published)}
            </time>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <p className="text-xl text-zinc-400 leading-relaxed">
            {post.description}
          </p>
        </div>
      </header>

      {/* Article Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <article
          className="prose prose-invert prose-lg max-w-none
            [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-zinc-100
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-zinc-200
            [&_p]:mb-6 [&_p]:text-zinc-300 [&_p]:leading-relaxed
            [&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2
            [&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2
            [&_li]:text-zinc-300 [&_li]:leading-relaxed
            [&_strong]:font-semibold [&_strong]:text-zinc-100
            [&_code]:rounded [&_code]:bg-zinc-900 [&_code]:px-2 [&_code]:py-1 [&_code]:text-sm [&_code]:text-emerald-400
            [&_a]:font-medium [&_a]:text-emerald-400 [&_a]:no-underline [&_a:hover]:text-emerald-300 [&_a:hover]:underline
            [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-400"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 ring-1 ring-zinc-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 p-8 backdrop-blur">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-zinc-200">
                AI-Generated Content
              </h4>
              <p className="text-sm leading-relaxed text-zinc-400">
                This article was automatically generated from curated AI news
                sources using large language models. While we strive for
                accuracy, please review original reporting for complete context
                and verification.
              </p>
            </div>
          </div>
        </div>

        {/* Source Link */}
        {post.source && post.source !== "system" && (
          <div className="mt-8 text-center">
            <a
              href={post.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              View original source
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-zinc-300">AI Signals</p>
              <p className="text-xs text-zinc-500">
                Automated intelligence briefings powered by AI
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

