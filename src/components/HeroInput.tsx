"use client";

import { useState } from "react";
import { ClipboardPaste, Loader2, X, Youtube, ArrowRight, Upload } from "lucide-react";

interface HeroInputProps {
  url: string;
  onUrlChange: (val: string) => void;
  onSubmit: (urlOverride?: string) => void;
  loading: boolean;
  error: string | null;
  onDropImageFile: (file: File) => void;
}

export function HeroInput({
  url,
  onUrlChange,
  onSubmit,
  loading,
  error,
  onDropImageFile,
}: HeroInputProps) {
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onUrlChange(text.trim());
        onSubmit(text.trim());
      }
    } catch {
      // Clipboard permission may be denied; user can paste manually
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onDropImageFile(file);
    }
  };

  return (
    <section id="top" className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
      <div className="mb-4 inline-flex items-center gap-2 rounded border border-line bg-surface px-2.5 py-1 text-[11px] uppercase tracking-widest text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span>Instant Thumbnail Extractor</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
        Download YouTube Thumbnails
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
        Get high-quality thumbnails from any YouTube video in seconds. Simple, fast and free.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="mt-8"
      >
        <div
          className={`flex flex-col gap-2 rounded-md border bg-surface p-1.5 transition-colors sm:flex-row sm:items-center ${
            dragging
              ? "border-accent bg-hover"
              : focused
              ? "border-accent"
              : error
              ? "border-danger"
              : "border-line"
          }`}
        >
          <div className="flex flex-1 items-center gap-2 px-2">
            <input
              type="text"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Paste your YouTube video URL here..."
              aria-label="YouTube video URL"
              className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-subtle focus:outline-none"
            />
            {url && (
              <button
                type="button"
                onClick={() => onUrlChange("")}
                aria-label="Clear URL input"
                className="rounded p-1 text-subtle transition-colors hover:bg-hover hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handlePaste}
              title="Paste from clipboard"
              className="inline-flex shrink-0 items-center gap-1 rounded border border-line bg-canvas px-2 py-1 text-xs text-muted transition-colors hover:bg-hover hover:text-ink"
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Paste</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-accent px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <span>Get Thumbnail</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Youtube className="h-3.5 w-3.5 text-danger" />
            <span>Supports YouTube videos and Shorts.</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-subtle">
            <Upload className="h-3 w-3" />
            <span>Tip: Drop any local image here to convert/upscale</span>
          </span>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded border border-danger/40 bg-surface px-3.5 py-2.5 text-left text-xs text-danger"
          >
            {error}
          </div>
        )}
      </form>
    </section>
  );
}
