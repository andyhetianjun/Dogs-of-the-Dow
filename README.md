# DJIA Dividend Yield Stock Screener

A full-stack stock screener built with Next.js that tracks all 30 Dow Jones Industrial Average (DJIA) equities in near real-time.

## Features

- **Live quotes** via the [Finnhub API](https://finnhub.io), refreshed every 15 seconds
- **Four screening presets:**
  - 🐕 **Dogs of the Dow** — top 10 highest dividend-yield stocks (the Dogs of the Dow strategy)
  - 📈 **Top Gainers** — sorted by largest % gain
  - 📉 **Top Losers** — sorted by largest % loss
  - ⚡ **Biggest Movers** — sorted by largest absolute % change
- **Error handling** for API rate limits and failed requests
- Clean dark UI built with Tailwind CSS

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Finnhub Stock API](https://finnhub.io)
- TypeScript

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/andyhetianjun/Dogs-of-the-Dow.git
cd Dogs-of-the-Dow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Finnhub API key

Create a `.env.local` file in the root of the project:

```
FINNHUB_API_KEY=your_api_key_here
```

You can get a free API key at [finnhub.io](https://finnhub.io).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the screener automatically.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── screener/route.ts   # Fetches + sorts all 30 DJIA stocks
│   │   ├── quote/route.ts      # Single stock quote endpoint
│   │   └── chart/route.ts      # Candlestick data endpoint
│   └── screener/page.tsx       # Main screener UI
├── lib/
│   ├── market/finnhub.ts       # Finnhub API client
│   ├── dividends/djia_yield.ts # Dividend yield data
│   └── universe/djia.ts        # DJIA stock universe (all 30 tickers)
```