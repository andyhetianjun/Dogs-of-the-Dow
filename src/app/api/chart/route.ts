import { NextResponse } from "next/server";
import { getCandles } from "@/lib/market/finnhub";

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const symbol = searchParams.get("symbol");
  const range = searchParams.get("range") ?? "1D";
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  const to = nowSec();

  let from = to - 60 * 60 * 24;
  let resolution: "5" | "15" | "60" | "D" = "5";

  if (range === "5D") { from = to - 60 * 60 * 24 * 5; resolution = "15"; }
  if (range === "1M") { from = to - 60 * 60 * 24 * 30; resolution = "60"; }
  if (range === "1Y") { from = to - 60 * 60 * 24 * 365; resolution = "D"; }

  try {
    const c = await getCandles({ symbol, resolution, from, to });

    if (c.s !== "ok" || !c.t?.length) {
      return NextResponse.json({ points: [] }, { status: 200 });
    }

    const points = c.t.map((t, i) => ({
      time: t,
      value: c.c[i],
    }));

    return NextResponse.json({ symbol, range, resolution, points }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unknown error" }, { status: 500 });
  }
}
