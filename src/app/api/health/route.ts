import { NextResponse } from "next/server";
import { getPublicSystemInfo } from "@/lib/system/info";

export const dynamic = "force-dynamic";

export function GET() {
  const system = getPublicSystemInfo();

  return NextResponse.json(
    {
      status: "ok",
      service: "portfolio-web",
      version: system.version,
      gitSha: system.gitSha,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
