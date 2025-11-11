import Link from "next/link";
import { PostSummary } from "@/lib/posts";
import { getCategoryById } from "@/lib/categories";
import { CategoryBadge } from "./CategoryBadge";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});

type PostCardProps = {
  post: PostSummary;
};

export function PostCard({ post }: PostCardProps) {
  const category = getCategoryById(post.category);

  let sourceLabel = post.source;
  try {
    sourceLabel = new URL(post.source).hostname || post.source;
  } catch {
    // keep original label
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 p-8 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-1">
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
        style={{
          background: `linear-gradient(135deg, ${category.color}20, transparent)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <CategoryBadge categoryId={post.category} size="sm" />
          <span className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500">
            {dateFormatter.format(new Date(post.publishedAt))}
          </span>
        </div>

        <h2 className="mb-3 text-2xl font-bold leading-tight text-zinc-50 transition-colors group-hover:text-emerald-300">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        <p className="mb-4 text-zinc-400 line-clamp-3">{post.description}</p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-full bg-zinc-800/60 px-2.5 py-1 text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">{sourceLabel}</span>
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Read more
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
