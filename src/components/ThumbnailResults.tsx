"use client";

import { motion } from "framer-motion";
import {
  Download,
  Copy,
  ExternalLink,
  Maximize2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Archive,
} from "lucide-react";
import {
  ExtractResponse,
  ImageFormat,
  ResolutionOption,
} from "@/types/thumbnail";
import { formatBytes } from "@/lib/youtube";

interface ThumbnailResultsProps {
  data: ExtractResponse;
  options: ResolutionOption[];
  format: ImageFormat;
  onFormatChange: (fmt: ImageFormat) => void;
  downloadingId: string | null;
  onDownload: (option: ResolutionOption) => void;
  onDownloadAllOriginals: () => void;
  onCopyUrl: (url: string) => void;
  onPreview: (option: ResolutionOption) => void;
}

export function ThumbnailResults({
  data,
  options,
  format,
  onFormatChange,
  downloadingId,
  onDownload,
  onDownloadAllOriginals,
  onCopyUrl,
  onPreview,
}: ThumbnailResultsProps) {
  const highest = data.highestOriginal;
  const availableCount = data.candidates.filter((c) => c.available).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-5xl px-4 pb-16 sm:px-6"
    >
      {/* Video Summary & Controls Bar */}
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-md border border-line bg-surface p-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 font-medium text-accent">
              <CheckCircle2 className="h-3 w-3" />
              <span>{availableCount} Original Streams Verified</span>
            </span>
            <span className="text-muted">ID: {data.videoId}</span>
            {highest && (
              <span className="text-muted">
                · Max Native: {highest.width} × {highest.height}
              </span>
            )}
          </div>
          {data.metadata.title && (
            <p className="text-sm font-medium text-ink">
              {data.metadata.title}
              {data.metadata.channelTitle ? ` — ${data.metadata.channelTitle}` : ""}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded border border-line bg-canvas p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onFormatChange("jpeg")}
              className={`rounded px-2.5 py-1 transition-colors ${
                format === "jpeg"
                  ? "bg-surface font-semibold text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              JPEG
            </button>
            <button
              type="button"
              onClick={() => onFormatChange("png")}
              className={`rounded px-2.5 py-1 transition-colors ${
                format === "png"
                  ? "bg-surface font-semibold text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              PNG
            </button>
          </div>

          <button
            type="button"
            onClick={onDownloadAllOriginals}
            className="inline-flex items-center gap-1.5 rounded border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-hover"
          >
            <Archive className="h-3.5 w-3.5 text-accent" />
            <span>Download All Originals</span>
          </button>
        </div>
      </div>

      {/* Resolution Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {options.map((opt, idx) => {
          const isUnavailable = opt.origin === "unavailable";
          const isUpscaled = opt.origin === "upscaled";
          const isDownloading = downloadingId === opt.id;
          const proxyPreview = `/api/download?url=${encodeURIComponent(opt.sourceUrl)}&inline=1`;

          return (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className={`flex flex-col overflow-hidden rounded-md border border-line ${
                isUnavailable ? "bg-hover/60 opacity-80" : "bg-surface"
              }`}
            >
              {/* Preview Area */}
              <div className="group relative aspect-video w-full overflow-hidden border-b border-line bg-canvas">
                {!isUnavailable ? (
                  <>
                    <img
                      src={proxyPreview}
                      alt={`${opt.label} thumbnail`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <button
                      type="button"
                      onClick={() => onPreview(opt)}
                      aria-label={`Expand ${opt.label} preview`}
                      className="absolute right-2 top-2 inline-flex items-center gap-1 rounded border border-line bg-surface/95 px-2 py-1 text-[11px] text-ink opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span>Preview</span>
                    </button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 p-4 text-center text-xs text-muted">
                    <AlertTriangle className="h-4 w-4 text-subtle" />
                    <span>Not supplied by YouTube for this video</span>
                  </div>
                )}

                {opt.isHighestOriginal && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded border border-accent/40 bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Highest Original
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{opt.label}</h3>
                      <p className="mt-0.5 text-xs text-muted">
                        {opt.targetWidth} × {opt.targetHeight} · {format.toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                        opt.origin === "original"
                          ? "border-accent/30 bg-accent/10 text-accent"
                          : opt.origin === "upscaled"
                          ? "border-line bg-hover text-muted"
                          : "border-line bg-hover text-subtle"
                      }`}
                    >
                      {opt.origin === "original" && "Original"}
                      {opt.origin === "upscaled" && (
                        <>
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>Upscaled</span>
                        </>
                      )}
                      {opt.origin === "unavailable" && "Unavailable"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-subtle">
                    <span>
                      {isUpscaled
                        ? `From ${opt.actualWidth}×${opt.actualHeight}`
                        : opt.sizeBytes
                        ? `Size: ${formatBytes(opt.sizeBytes)}`
                        : "Native stream"}
                    </span>
                    {opt.note && <span>{opt.note}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUnavailable || isDownloading}
                    onClick={() => onDownload(opt)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded bg-ink px-3 py-2 text-xs font-medium text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>
                      {isDownloading
                        ? "Processing..."
                        : isUpscaled
                        ? `Upscale & Download`
                        : `Download ${format.toUpperCase()}`}
                    </span>
                  </button>

                  {!isUnavailable && (
                    <>
                      <button
                        type="button"
                        onClick={() => onCopyUrl(opt.sourceUrl)}
                        title="Copy image URL"
                        aria-label="Copy image URL"
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-line bg-canvas text-muted transition-colors hover:bg-hover hover:text-ink"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={opt.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open original image"
                        aria-label="Open original image"
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-line bg-canvas text-muted transition-colors hover:bg-hover hover:text-ink"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Original Candidates Availability Table */}
      <div className="mt-8 rounded-md border border-line bg-surface p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Raw YouTube Stream Probe
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {data.candidates.map((c) => (
            <div
              key={c.key}
              className="flex items-center justify-between rounded border border-line bg-canvas px-3 py-2 text-xs"
            >
              <div>
                <div className="font-medium text-ink">{c.key}.jpg</div>
                <div className="text-[11px] text-muted">
                  {c.available ? `${c.width}×${c.height}` : "404 Not Found"}
                </div>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  c.available ? "bg-accent" : "bg-subtle/40"
                }`}
                title={c.available ? "Available" : "Unavailable"}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
