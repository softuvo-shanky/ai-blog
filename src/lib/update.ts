import fs from "node:fs/promises";

import matter from "gray-matter";
import OpenAI from "openai";
import Parser from "rss-parser";

import { getPostPath, listPostSlugs } from "@/lib/posts";

export const DEFAULT_FEED_URLS = [
  "https://www.technologyreview.com/feed/",
  "https://www.theverge.com/rss/artificial-intelligence/index.xml",
  "https://feeds.feedburner.com/thealgorithm",
];

type UpdateOptions = {
  feedUrls?: string[];
  limit?: number;
};

type UpdateResult = {
  generated: Array<{
    slug: string;
    title: string;
    filePath: string;
    source: string;
  }>;
  skipped: Array<{
    reason: string;
    title?: string;
    source?: string;
  }>;
  warnings: string[];
};

type FeedItem = {
  title: string;
  link?: string;
  summary?: string;
  publishedAt?: string;
  sourceFeed: string;
};

const parser = new Parser({
  customFields: {
    item: ["contentSnippet", "content:encoded", "summary"],
  },
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `ai-update-${Date.now()}`;
}

function ensureUniqueSlug(base: string, taken: Set<string>) {
  let slug = base;
  let counter = 1;

  while (taken.has(slug)) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  taken.add(slug);
  return slug;
}

function normaliseTags(tags?: string[]) {
  if (!tags?.length) return ["ai", "automation"];
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .map((tag) => tag.replace(/[^a-z0-9\- ]+/g, "").replace(/\s+/g, "-")),
    ),
  ).slice(0, 6);
}

async function fetchFeedItems(feedUrls: string[]) {
  const items: FeedItem[] = [];
  const warnings: string[] = [];

  await Promise.all(
    feedUrls.map(async (feedUrl) => {
      try {
        const feed = await parser.parseURL(feedUrl);
        feed.items.forEach((item) => {
          items.push({
            title: item.title ?? "Untitled",
            link: item.link,
            summary:
              item.contentSnippet ??
              (typeof item.content === "string" ? item.content : undefined) ??
              (item["content:encoded"] as string | undefined) ??
              item.summary ??
              "",
            publishedAt: item.isoDate ?? item.pubDate ?? undefined,
            sourceFeed: feedUrl,
          });
        });
      } catch (error) {
        warnings.push(
          `Failed to read feed ${feedUrl}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }),
  );

  return { items, warnings };
}

const articleSchema = {
  name: "ai_blog_article",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "description", "body", "tags"],
    properties: {
      title: {
        type: "string",
        description: "Compelling headline for the AI blog article.",
        maxLength: 120,
      },
      description: {
        type: "string",
        description:
          "One-sentence summary enticing readers to learn about the AI news.",
        maxLength: 240,
      },
      body: {
        type: "string",
        description:
          "Markdown article expanding the AI news, including insights, context, and outlook.",
      },
      tags: {
        type: "array",
        description: "Up to 6 topical tags highlighting key themes.",
        maxItems: 6,
        items: {
          type: "string",
        },
        default: ["ai", "automation"],
      },
    },
  },
} as const;

export async function updateContent(
  options: UpdateOptions = {},
): Promise<UpdateResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it in your environment before running updates.",
    );
  }

  const feedUrls = options.feedUrls ?? DEFAULT_FEED_URLS;
  const limit = options.limit ?? 3;

  const { items, warnings } = await fetchFeedItems(feedUrls);

  if (items.length === 0) {
    return {
      generated: [],
      skipped: [],
      warnings: warnings.length
        ? warnings
        : ["No feed items available to process."],
    };
  }

  const sortedItems = items.sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });

  const candidates = sortedItems.slice(0, limit);
  const existingSlugs = new Set(await listPostSlugs());
  const openai = new OpenAI({ apiKey });

  const generated: UpdateResult["generated"] = [];
  const skipped: UpdateResult["skipped"] = [];

  for (const item of candidates) {
    const baseSlug = slugify(item.title);
    if (existingSlugs.has(baseSlug)) {
      skipped.push({
        reason: "duplicate-slug",
        title: item.title,
        source: item.link ?? item.sourceFeed,
      });
      continue;
    }

    const prompt = [
      "You are an editor producing polished blog posts about artificial intelligence.",
      "Analyse the provided news item, enrich it with relevant background,",
      "highlight implications for practitioners, and conclude with forward-looking insights.",
      "",
      `Article title: ${item.title}`,
      `Source link: ${item.link ?? "unknown"}`,
      item.publishedAt ? `Published: ${item.publishedAt}` : "",
      "",
      "Original summary:",
      item.summary?.slice(0, 2000) || "No summary available.",
      "",
      "Write an original article in Markdown with short sections and bullet points where helpful.",
      "Avoid fabricating details—stay faithful to the source material.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You are a senior AI analyst and journalist. Produce accurate, engaging articles suitable for a professional audience.",
          },
          { role: "user", content: prompt },
        ],
        max_output_tokens: 1500,
        text: {
          format: {
            type: "json_schema",
            name: articleSchema.name,
            schema: articleSchema.schema,
          },
        },
      });

      const text = response.output_text;
      if (!text) {
        skipped.push({
          reason: "empty-response",
          title: item.title,
          source: item.link ?? item.sourceFeed,
        });
        continue;
      }

      let parsed: {
        title: string;
        description: string;
        body: string;
        tags?: string[];
      };

      try {
        parsed = JSON.parse(text);
      } catch (error) {
        skipped.push({
          reason: `invalid-json: ${
            error instanceof Error ? error.message : String(error)
          }`,
          title: item.title,
          source: item.link ?? item.sourceFeed,
        });
        continue;
      }

      const slug = ensureUniqueSlug(slugify(parsed.title), existingSlugs);
      const filePath = getPostPath(slug);

      const file = matter.stringify(parsed.body.trim(), {
        title: parsed.title,
        description: parsed.description,
        publishedAt: new Date().toISOString(),
        source: item.link ?? item.sourceFeed,
        tags: normaliseTags(parsed.tags),
      });

      await fs.writeFile(filePath, `${file.trimEnd()}\n`, "utf8");

      generated.push({
        slug,
        title: parsed.title,
        filePath,
        source: item.link ?? item.sourceFeed,
      });
    } catch (error) {
      skipped.push({
        reason: `generation-error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        title: item.title,
        source: item.link ?? item.sourceFeed,
      });
    }
  }

  return {
    generated,
    skipped,
    warnings,
  };
}

