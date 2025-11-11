import { NextResponse } from "next/server";

import { updateContent } from "@/lib/update";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let feedUrls: string[] | undefined;
  let limit: number | undefined;

  try {
    const body = await request.json();
    feedUrls = Array.isArray(body?.feedUrls)
      ? (body.feedUrls as string[])
      : undefined;
    limit =
      typeof body?.limit === "number" && Number.isFinite(body.limit)
        ? Math.max(1, Math.min(body.limit, 10))
        : undefined;
  } catch {
    // non-JSON body; fallback to defaults
  }

  try {
    const result = await updateContent({ feedUrls, limit });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

