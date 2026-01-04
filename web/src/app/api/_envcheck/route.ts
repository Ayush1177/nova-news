export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    startsWithPostgres: (process.env.DATABASE_URL ?? "").startsWith("postgres"),
    length: (process.env.DATABASE_URL ?? "").length,
  });
}