import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { analyticsEventSchema } from "@/lib/analytics/events";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid analytics event" }, { status: 400 });
  }

  try {
    await db.insert(analyticsEvents).values({
      eventType: parsed.data.name,
      path: parsed.data.path,
      projectSlug: parsed.data.projectSlug ?? null,
    });
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logger.error("analytics_event_write_failed", { error });
    return new NextResponse(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
