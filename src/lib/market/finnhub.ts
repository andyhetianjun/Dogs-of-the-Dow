export type Candle = {
  t: number[];
  c: number[];
  o: number[];
  h: number[];
  l: number[];
  v: number[];
  s: "ok" | "no_data";
};

export type Quote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

const API = "https://finnhub.io/api/v1";

function requireKey() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("Missing FINNHUB_API_KEY in .env.local");
  return key;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const key = requireKey();
  const url = `${API}/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
  const res = await fetch(url, { next: { revalidate: 10 } });
  if (!res.ok) throw new Error(`Finnhub quote failed: ${res.status}`);
  return res.json();
}

export async function getCandles(params: {
  symbol: string;
  resolution: "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";
  from: number;
  to: number;
}): Promise<Candle> {
  const key = requireKey();
  const { symbol, resolution, from, to } = params;
  const url =
    `${API}/stock/candle?symbol=${encodeURIComponent(symbol)}` +
    `&resolution=${resolution}&from=${from}&to=${to}&token=${key}`;
  const res = await fetch(url, { next: { revalidate: 10 } });
  if (!res.ok) throw new Error(`Finnhub candles failed: ${res.status}`);
  return res.json();
}
