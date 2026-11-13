import type { Metadata } from "next";
import { IBM_Plex_Mono, Inconsolata } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inconsolata",
});

export const metadata: Metadata = {
  title: "ClickThumbnail — Download YouTube Thumbnails in Full Quality",
  description:
    "Get high-quality thumbnails from any YouTube video or Short in seconds. Inspect actual dimensions, convert PNG/JPEG, and optionally upscale up to 8K.",
  keywords: [
    "YouTube thumbnail downloader",
    "ClickThumbnail",
    "YouTube Shorts thumbnail",
    "HD thumbnail",
    "4K thumbnail",
  ],
  openGraph: {
    title: "ClickThumbnail — Download YouTube Thumbnails",
    description:
      "Minimal, fast YouTube thumbnail extractor with real dimension verification and client-side upscaling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${inconsolata.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-canvas text-ink antialiased selection:bg-accent/15 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
