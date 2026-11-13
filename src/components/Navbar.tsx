"use client";

import { Moon, Sun } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Navbar({ darkMode, onToggleDark }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="flex items-center transition-opacity hover:opacity-85"
          aria-label="ClickThumbnail Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="24 36 472 88"
            className="h-7 w-auto text-ink"
            role="img"
            aria-label="ClickThumbnail"
          >
            <rect x="30" y="42" width="170" height="76" rx="6" fill="currentColor" />
            <text
              x="115"
              y="95"
              textAnchor="middle"
              fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
              fontSize="42"
              fontWeight="800"
              fill="var(--bg-canvas)"
              letterSpacing="2"
            >
              CLICK
            </text>
            <text
              x="216"
              y="95"
              fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
              fontSize="42"
              fontWeight="300"
              fill="currentColor"
              letterSpacing="2"
            >
              THUMBNAIL
            </text>
          </svg>
        </a>

        <nav className="flex items-center gap-4 text-xs text-muted sm:gap-6">
          <a href="#top" className="transition-colors hover:text-ink">
            Home
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-ink">
            How it works
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            FAQ
          </a>
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-line bg-surface text-ink transition-colors hover:bg-hover"
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
