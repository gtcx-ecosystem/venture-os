import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "venture-os",
      version: process.env.GIT_COMMIT?.slice(0, 7) ?? "dev",
      environment: process.env.DEPLOY_ENV ?? process.env.NODE_ENV ?? "development",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
