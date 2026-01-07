import { NextResponse } from "next/server";

export async function GET() {
  const raw = process.env.FINNHUB_API_KEY ?? "";
  return NextResponse.json({
    hasKey: raw.length > 0,
    keyLength: raw.length,
    keyPrefix: raw.slice(0, 4),
  });
}
