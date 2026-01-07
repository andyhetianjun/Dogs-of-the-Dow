"use client";

import React, { useEffect, useState } from "react";

type Row = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  changeAbs: number;
  dividendYield?: number;
};

const PRESETS = [
  { id: "movers", label: "Biggest Movers" },
  { id: "gainers", label: "Top Gainers" },
  { id: "losers", label: "Top Losers" },
  { id: "dogs", label: "Dogs of the Dow (Dividend)" },
];

export default function ScreenerPage() {
  const [preset, setPreset] = useState("movers");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/screener?preset=${preset}`);
      const data = await res.json();
      setRows(data.rows ?? []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load screener");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [preset]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Screener</h1>
          <p className="text-zinc-400 mt-1">DJIA universe · live-ish quotes</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400">Preset</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-6 bg-zinc-900 text-zinc-300 text-sm px-4 py-3">
          <div className="col-span-2">Ticker</div>
          <div>Last</div>
          <div>Change</div>
          <div>%</div>
          <div>Yield</div>
        </div>

        {loading ? (
          <div className="p-4 text-zinc-400">Loading…</div>
        ) : error ? (
          <div className="p-4 text-red-400">{error}</div>
        ) : (
          <div>
            {rows.map((r) => {
              const up = r.changePct >= 0;
              return (
                <div
                  key={r.symbol}
                  className="grid grid-cols-6 px-4 py-3 border-t border-zinc-900 hover:bg-zinc-900/40"
                >
                  <div className="col-span-2">
                    <div className="font-medium">{r.symbol}</div>
                    <div className="text-xs text-zinc-500">{r.name}</div>
                  </div>

                  <div className="tabular-nums">{r.price?.toFixed?.(2)}</div>

                  <div className={up ? "text-green-400 tabular-nums" : "text-red-400 tabular-nums"}>
                    {r.changeAbs?.toFixed?.(2)}
                  </div>

                  <div className={up ? "text-green-400 tabular-nums" : "text-red-400 tabular-nums"}>
                    {r.changePct?.toFixed?.(2)}%
                  </div>

                  <div className="tabular-nums">{(r.dividendYield ?? 0).toFixed(2)}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
