## AI Signals – Automated AI News Blog

AI Signals is a Next.js blog that continuously gathers the latest artificial intelligence headlines from curated RSS feeds and synthesises polished articles with OpenAI. Run it locally for live previews, trigger updates on-demand, or wire it up to a scheduler for hands-free publishing.

## Prerequisites

- Node.js 18+
- An OpenAI API key with access to the `gpt-4.1-mini` model (set `OPENAI_API_KEY`)

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with your OpenAI credentials:

```bash
cp .env.example .env.local # if you create an example file
```

```
OPENAI_API_KEY=sk-...
```

## Running the Site

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the automatically updated homepage and generated articles.

## Generating New Articles

Trigger an update manually:

```bash
npm run update-content
```

Optional flags:

- `--limit 5` – number of feed items to process (default 3, max 10)
- `--feed https://example.com/rss` – override default feeds (repeatable)

Behind the scenes, `scripts/update-content.ts` parses the configured RSS feeds, sends relevant context to OpenAI, and saves Markdown posts in `content/posts`. Each run skips previously generated articles so only fresh content is added.

## API Endpoint

Deploy to any Node-compatible host and call the API route to refresh content remotely:

```
POST /api/update
{
  "limit": 3,
  "feedUrls": ["https://custom-feed/rss"]
}
```

The route shares the same logic as the CLI script, returning details about generated or skipped articles.

## Scheduling Ideas

- GitHub Action or cron job that runs `npm run update-content` daily
- Vercel/Netlify scheduled function hitting `/api/update`
- Self-hosted serverless function or containerised task

## Project Structure Highlights

- `content/posts` – Markdown sources with frontmatter metadata
- `src/app/page.tsx` – landing page listing generated posts
- `src/app/posts/[slug]/page.tsx` – individual article renderer
- `src/lib/update.ts` – shared logic for RSS ingestion and AI generation
- `scripts/update-content.ts` – CLI entrypoint for automation

Happy automating!
