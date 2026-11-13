"use client";

import { X, Download, ExternalLink } from "lucide-react";
import { ImageFormat, ResolutionOption } from "@/types/thumbnail";
import { formatBytes } from "@/lib/youtube";

interface PreviewModalProps {
  option: ResolutionOption | null;
  previewSrc: string | null;
  format: ImageFormat;
  onClose: () => void;
  onDownload: (option: ResolutionOption) => void;
}

export function PreviewModal({
  option,
  previewSrc,
  format,
  onClose,
  onDownload,
}: PreviewModalProps) {
  if (!option || !previewSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-md border border-line bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-ink">{option.label}</span>
            <span className="text-muted">
              {option.targetWidth} × {option.targetHeight}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                option.origin === "original"
                  ? "bg-accent/10 text-accent"
                  : "bg-hover text-muted"
              }`}
            >
              {option.origin === "original" ? "Original" : "Client Upscaled"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded p-1 text-muted hover:bg-hover hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex max-h-[70vh] items-center justify-center overflow-auto bg-canvas p-4">
          <img
            src={previewSrc}
            alt={`${option.label} preview`}
            className="max-h-[62vh] w-auto rounded border border-line object-contain"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs">
          <div className="flex items-center gap-4 text-muted">
            <span>Format: {format.toUpperCase()}</span>
            <span>Source Size: {formatBytes(option.sizeBytes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={option.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-line bg-canvas px-3 py-1.5 text-ink transition-colors hover:bg-hover"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Original</span>
            </a>
            <button
              type="button"
              onClick={() => onDownload(option)}
              className="inline-flex items-center gap-1.5 rounded bg-ink px-3 py-1.5 font-medium text-surface transition-opacity hover:opacity-90"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download {format.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
