import { NextResponse } from "next/server";
import { DJIA } from "@/lib/universe/djia";
import { DJIA_DIVIDEND_YIELD } from "@/lib/dividends/djia_yield";
import { getQuote } from "@/lib/market/finnhub";

type Row = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  changeAbs: number;
  dividendYield?: number; // percent, e.g. 4.2
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const preset = (searchParams.get("preset") ?? "movers").toLowerCase();

  try {
    const quotes: Row[] = await Promise.all(
      DJIA.map(async (s) => {
        const q = await getQuote(s.symbol);
        return {
          symbol: s.symbol,
          name: s.name,
          price: q.c,
          changePct: q.dp,
          changeAbs: q.d,
          dividendYield: DJIA_DIVIDEND_YIELD[s.symbol] ?? 0,
        };
      })
    );

    let rows = quotes;

    if (preset === "dogs") {
      rows = [...rows]
        .sort((a, b) => (b.dividendYield ?? 0) - (a.dividendYield ?? 0))
        .slice(0, 10);
    } else if (preset === "gainers") {
      rows = [...rows].sort((a, b) => b.changePct - a.changePct);
    } else if (preset === "losers") {
      rows = [...rows].sort((a, b) => a.changePct - b.changePct);
    } else {
      rows = [...rows].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
    }

    return NextResponse.json({ preset, rows }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unknown error" }, { status: 500 });
  }
}
