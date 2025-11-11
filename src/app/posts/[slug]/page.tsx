import { Metadata } from "next";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

import { getAllPosts, getPostBySlug } from "@/lib/posts";

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-12">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            AI Signals • {sourceLabel}
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="text-sm text-zinc-400">
            Published {formatter.format(published)}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <article
          className="space-y-6 text-lg leading-relaxed text-zinc-200 [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_p]:text-zinc-300 [&_code]:rounded [&_code]:bg-zinc-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_strong]:text-zinc-50 [&_a]:text-emerald-300 [&_a:hover]:text-emerald-200 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:ml-6 [&_ol]:list-decimal [&_li]:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        {post.tags?.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 text-xs uppercase tracking-wide">
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
        <div className="mt-16 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400">
          This article was generated automatically from curated AI news sources
          using large language models. Review original reporting for complete
          context.
        </div>
      </main>
    </div>
  );
}

