#!/usr/bin/env tsx
import "dotenv/config";

import { updateContent } from "@/lib/update";

type CliOptions = {
  limit?: number;
  feeds?: string[];
};

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if ((arg === "-l" || arg === "--limit") && args[i + 1]) {
      options.limit = Number.parseInt(args[i + 1]!, 10);
      i += 1;
    } else if ((arg === "-f" || arg === "--feed") && args[i + 1]) {
      options.feeds = options.feeds ?? [];
      options.feeds.push(args[i + 1]!);
      i += 1;
    }
  }

  return options;
}

async function main() {
  const { limit, feeds } = parseArgs();

  try {
    const result = await updateContent({
      limit,
      feedUrls: feeds,
    });

    if (result.generated.length === 0) {
      console.log("No new articles generated.");
    } else {
      console.log("Generated articles:");
      result.generated.forEach((post) => {
        console.log(`• ${post.title} (${post.slug}) -> ${post.filePath}`);
      });
    }

    if (result.skipped.length > 0) {
      console.log("\nSkipped items:");
      result.skipped.forEach((item) => {
        console.log(
          `• ${item.reason}${item.title ? ` — ${item.title}` : ""}`,
        );
      });
    }

    if (result.warnings.length > 0) {
      console.warn("\nWarnings:");
      result.warnings.forEach((warning) => console.warn(`• ${warning}`));
    }
  } catch (error) {
    console.error(
      "Failed to update content:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  }
}

main();

