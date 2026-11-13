"use client";

import { useState } from "react";
import { X } from "lucide-react";

type LegalDoc = "About" | "Privacy Policy" | "Terms of Service" | "Contact" | null;

const DOC_COPY: Record<Exclude<LegalDoc, null>, string> = {
  About:
    "ClickThumbnail is a minimal utility for creators, designers, and editors to inspect and download YouTube video thumbnails with transparent resolution labeling.",
  "Privacy Policy":
    "ClickThumbnail does not store submitted YouTube URLs, IP addresses, or downloaded images. All format conversions and upscaling run locally in your browser.",
  "Terms of Service":
    "Thumbnails remain the copyright of their respective creators and YouTube. Please use downloaded assets responsibly for fair use, commentary, or your own channel.",
  Contact:
    "For feedback, bug reports, or API inquiries, reach out via GitHub Issues or email support@clickthumbnail.example.",
};

export function Footer() {
  const [activeDoc, setActiveDoc] = useState<LegalDoc>(null);

  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted sm:flex-row sm:px-6">
        <a href="#top" className="flex items-center transition-opacity hover:opacity-85" aria-label="ClickThumbnail">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="24 36 472 88"
            className="h-6 w-auto text-ink"
            role="img"
            aria-label="ClickThumbnail"
          >
            <rect x="30" y="42" width="170" height="76" rx="6" fill="currentColor" />
            <text x="115" y="95" textAnchor="middle" fontFamily="Inter, Helvetica Neue, Arial, sans-serif" fontSize="42" fontWeight="800" fill="var(--bg-canvas)" letterSpacing="2">CLICK</text>
            <text x="216" y="95" fontFamily="Inter, Helvetica Neue, Arial, sans-serif" fontSize="42" fontWeight="300" fill="currentColor" letterSpacing="2">THUMBNAIL</text>
          </svg>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-5">
          {(["About", "Privacy Policy", "Terms of Service", "Contact"] as const).map(
            (label) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveDoc(label)}
                className="transition-colors hover:text-ink"
              >
                {label}
              </button>
            )
          )}
        </div>

        <p className="text-[11px] text-subtle">
          © {new Date().getFullYear()} ClickThumbnail. All rights reserved.
        </p>
      </div>

      {activeDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="w-full max-w-md rounded-md border border-line bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-semibold text-ink">{activeDoc}</h3>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="rounded p-1 text-muted hover:bg-hover hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {DOC_COPY[activeDoc]}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
