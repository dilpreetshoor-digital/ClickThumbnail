# ClickThumbnail — YouTube Thumbnail Downloader

Minimal, fast YouTube Thumbnail Downloader built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Lucide React**, and **Framer Motion**.

## Features
- Supports `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, `youtube.com/embed/`, and `youtube.com/live/`.
- Server-side thumbnail probing (`/api/thumbnails`) that verifies real image availability and parses actual JPEG dimensions (`maxresdefault`, `sddefault`, `hqdefault`, `mqdefault`, `default`).
- Optional **YouTube Data API v3** integration via server-only `YOUTUBE_API_KEY`.
- SSRF-safe server-side download proxy (`/api/download`) restricted to trusted YouTube thumbnail hosts (`i.ytimg.com`, `img.youtube.com`, `i1–i4.ytimg.com`) with timeouts and size caps.
- Client-side multi-step canvas upscaling for **2K (2560×1440)**, **4K (3840×2160)**, and **8K (7680×4320)**, plus **JPEG / PNG** conversion—clearly labeled as **Original** vs **Upscaled**.
- Light theme (`#FAFAF8` / `#FFFFFF` / `#16A34A`) with a dark mode toggle.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Configure YouTube Data API v3 metadata enrichment:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your `YOUTUBE_API_KEY` to `.env.local`. Never expose it with `NEXT_PUBLIC_`.

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

## Project Structure
```
src/app/            Pages, layout, global CSS, API routes (/api/thumbnails, /api/download)
src/components/     UI components
src/lib/            YouTube URL parsing + canvas upscaling helpers
src/types/          Shared TypeScript types
public/             Static assets
```

## Scripts
`npm run dev` · `npm run build` · `npm start` · `npm run lint`

## Deploy: GitHub + Vercel
1. Push to GitHub:
   ```bash
   git init && git add . && git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/clickthumbnail.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the repo (Framework: Next.js is auto-detected — no settings to change).
3. (Optional) Add env var `YOUTUBE_API_KEY` in Project Settings → Environment Variables.
4. Click **Deploy**.
