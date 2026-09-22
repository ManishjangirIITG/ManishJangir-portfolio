import { NextResponse } from "next/server";
import { sql } from "@/db";
import { logger } from "@/lib/logger";
import { getPublicSystemInfo } from "@/lib/system/info";

export const dynamic = "force-dynamic";

const READINESS_TIMEOUT_MS = 2_000;

async function checkDatabase(): Promise<void> {
  await Promise.race([
    sql`select 1`,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("readiness timeout")), READINESS_TIMEOUT_MS),
    ),
  ]);
}

export async function GET() {
  const startedAt = performance.now();
  const system = getPublicSystemInfo();

  try {
    await checkDatabase();
    const durationMs = Math.round(performance.now() - startedAt);

    return NextResponse.json(
      {
        status: "ready",
        checks: { database: "ok" },
        version: system.version,
        gitSha: system.gitSha,
        durationMs,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    const durationMs = Math.round(performance.now() - startedAt);
    logger.warn("Readiness check failed", {
      route: "/api/health/ready",
      status: 503,
      durationMs,
    });

    return NextResponse.json(
      {
        status: "not_ready",
        checks: { database: "unavailable" },
        version: system.version,
        gitSha: system.gitSha,
        durationMs,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
