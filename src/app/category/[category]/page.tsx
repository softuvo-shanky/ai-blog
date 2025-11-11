import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import { getCategoryById, getAllCategoryIds } from "@/lib/categories";
import { CategoryNav } from "@/components/CategoryNav";
import { PostCard } from "@/components/PostCard";

type Props = {
  params: { category: string };
};

export async function generateStaticParams() {
  const categoryIds = getAllCategoryIds();
  return categoryIds.map((id) => ({
    category: id,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const category = getCategoryById(params.category);

  if (!category) return undefined;

  return {
    title: `${category.name} – AI Signals`,
    description: `${category.description} - Latest AI news and insights in ${category.name.toLowerCase()}.`,
    openGraph: {
      title: `${category.name} – AI Signals`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const categoryIds = getAllCategoryIds();

  if (!categoryIds.includes(params.category)) {
    notFound();
  }

  const category = getCategoryById(params.category);
  const posts = await getPostsByCategory(params.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      {/* Category Header */}
      <header className="relative overflow-hidden border-b border-zinc-800 backdrop-blur">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${category.color}20, transparent)`,
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <div
              className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-2xl"
              style={{
                backgroundColor: category.color,
                boxShadow: `0 20px 40px -10px ${category.color}40`,
              }}
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>

            <h1
              className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
              style={{ color: category.color }}
            >
              {category.name}
            </h1>

            <p className="max-w-2xl text-lg text-zinc-400 mb-6">
              {category.description}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 ring-1 ring-zinc-800">
              <span className="font-semibold" style={{ color: category.color }}>
                {posts.length}
              </span>
              <span>{posts.length === 1 ? "article" : "articles"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryNav />

      {/* Posts Grid */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-16 text-center backdrop-blur">
            <div className="mx-auto max-w-md">
              <div
                className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-zinc-200">
                No articles yet
              </h2>
              <p className="text-zinc-400">
                No articles have been published in this category yet. Check back
                soon for updates!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
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
