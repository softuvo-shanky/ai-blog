import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  source: string;
  tags: string[];
  category: string;
};

export type Post = PostSummary & {
  content: string;
};

async function ensurePostsDir() {
  await fs.mkdir(POSTS_DIR, { recursive: true });
}

async function readPostFile(slug: string) {
  await ensurePostsDir();
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  const raw = await fs.readFile(fullPath, "utf8");
  const parsed = matter(raw);

  const {
    title,
    description,
    publishedAt,
    source = "unknown",
    tags = [],
    category = "general",
  } = parsed.data;

  if (!title || !description || !publishedAt) {
    throw new Error(`Post ${slug} is missing required frontmatter fields.`);
  }

  return {
    slug,
    title,
    description,
    publishedAt,
    source,
    tags,
    category,
    content: parsed.content.trim(),
  } satisfies Post;
}

export async function getPostBySlug(slug: string) {
  return readPostFile(slug);
}

export async function getAllPosts() {
  await ensurePostsDir();
  const files = await fs.readdir(POSTS_DIR);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map((file) => readPostFile(file.replace(/\.md$/, ""))),
  );

  return posts
    .map<PostSummary>((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
      source: post.source,
      tags: post.tags,
      category: post.category,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getPostsByCategory(category: string) {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export async function getAllCategories() {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}

export async function listPostSlugs() {
  await ensurePostsDir();
  const files = await fs.readdir(POSTS_DIR);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getPostPath(slug: string) {
  return path.join(POSTS_DIR, `${slug}.md`);
}

