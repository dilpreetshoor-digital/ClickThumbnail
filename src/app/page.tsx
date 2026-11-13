"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroInput } from "@/components/HeroInput";
import { ThumbnailResults } from "@/components/ThumbnailResults";
import { FeedPreviewer } from "@/components/FeedPreviewer";
import { PreviewModal } from "@/components/PreviewModal";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { ToastContainer, ToastItem } from "@/components/Toast";
import {
  ExtractResponse,
  ImageFormat,
  ResolutionOption,
} from "@/types/thumbnail";
import {
  buildDownloadFilename,
  processImageWithCanvas,
  triggerBlobDownload,
} from "@/lib/upscale";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewOption, setPreviewOption] = useState<ResolutionOption | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const pushToast = (type: "success" | "error", message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleExtract = async (urlOverride?: string) => {
    const target = (urlOverride ?? url).trim();
    if (!target) {
      setError("Please paste a YouTube video URL first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/thumbnails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Unable to retrieve thumbnails.");
        setResult(null);
        return;
      }
      setResult(json as ExtractResponse);
      pushToast("success", `Found thumbnails for ${json.videoId}`);
    } catch {
      setError("Network error while probing YouTube thumbnails.");
    } finally {
      setLoading(false);
    }
  };

  const resolutionOptions: ResolutionOption[] = useMemo(() => {
    if (!result || !result.highestOriginal) return [];
    const highest = result.highestOriginal;
    const isNativeFullHd = highest.width >= 1920 && highest.height >= 1080;
    const isNativeHd = highest.width >= 1280 && highest.height >= 720;

    const list: ResolutionOption[] = [
      {
        id: "highest-original",
        label: "Highest Original",
        targetWidth: highest.width,
        targetHeight: highest.height,
        actualWidth: highest.width,
        actualHeight: highest.height,
        origin: "original",
        isHighestOriginal: true,
        sourceUrl: highest.url,
        sizeBytes: highest.sizeBytes,
        format: "jpeg",
        note: highest.key,
      },
      {
        id: "standard-360",
        label: "Standard (360p)",
        targetWidth: 640,
        targetHeight: 360,
        actualWidth: highest.width,
        actualHeight: highest.height,
        origin: isNativeHd ? "original" : "upscaled",
        sourceUrl: highest.url,
        sizeBytes: highest.sizeBytes,
        format: "jpeg",
        note: "16:9 crop",
      },
      {
        id: "full-hd-1080",
        label: "Full HD (1080p)",
        targetWidth: 1920,
        targetHeight: 1080,
        actualWidth: highest.width,
        actualHeight: highest.height,
        origin: isNativeFullHd ? "original" : "upscaled",
        sourceUrl: highest.url,
        sizeBytes: highest.sizeBytes,
        format: "jpeg",
        note: isNativeFullHd ? "Native" : "Client resample",
      },
      {
        id: "qhd-2k",
        label: "2K / QHD",
        targetWidth: 2560,
        targetHeight: 1440,
        actualWidth: highest.width,
        actualHeight: highest.height,
        origin: "upscaled",
        sourceUrl: highest.url,
        sizeBytes: highest.sizeBytes,
        format: "jpeg",
        note: "High-res interpolation",
      },
      {
        id: "uhd-4k",
        label: "4K / UHD",
        targetWidth: 3840,
        targetHeight: 2160,
        actualWidth: highest.width,
        actualHeight: highest.height,
        origin: "upscaled",
        sourceUrl: highest.url,
        sizeBytes: highest.sizeBytes,
        format: "jpeg",
        note: "High-res interpolation",
      },
      {
        id: "uhd-8k",
        label: "8K / UHD",
        targetWidth: 7680,
        targetHeight: 4320,
        actualWidth: highest.width,
        actualHeight: highest.height,
        origin: "upscaled",
        sourceUrl: highest.url,
        sizeBytes: highest.sizeBytes,
        format: "jpeg",
        note: "High-res interpolation",
      },
    ];

    return list;
  }, [result]);

  const handleDownloadOption = async (opt: ResolutionOption) => {
    if (!result) return;
    setDownloadingId(opt.id);

    const filename = buildDownloadFilename(
      result.videoId,
      opt.targetWidth,
      opt.targetHeight,
      format,
      opt.origin === "upscaled"
    );

    try {
      const proxySrc = `/api/download?url=${encodeURIComponent(opt.sourceUrl)}&inline=1`;
      if (
        opt.origin === "original" &&
        format === "jpeg" &&
        opt.targetWidth === opt.actualWidth &&
        opt.targetHeight === opt.actualHeight
      ) {
        const a = document.createElement("a");
        a.href = `/api/download?url=${encodeURIComponent(opt.sourceUrl)}&filename=${encodeURIComponent(filename)}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        pushToast("success", `Downloaded ${filename}`);
      } else {
        const { blob } = await processImageWithCanvas({
          sourceUrl: proxySrc,
          targetWidth: opt.targetWidth,
          targetHeight: opt.targetHeight,
          format,
        });
        triggerBlobDownload(blob, filename);
        pushToast("success", `Generated & downloaded ${filename}`);
      }
    } catch {
      pushToast("error", "Failed to process thumbnail download.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAllOriginals = () => {
    if (!result) return;
    const available = result.candidates.filter((c) => c.available);
    available.forEach((c, index) => {
      setTimeout(() => {
        const filename = buildDownloadFilename(result.videoId, c.width, c.height, "jpeg");
        const a = document.createElement("a");
        a.href = `/api/download?url=${encodeURIComponent(c.url)}&filename=${encodeURIComponent(filename)}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, index * 250);
    });
    pushToast("success", `Started downloading ${available.length} original thumbnails.`);
  };

  const handleCopyUrl = async (targetUrl: string) => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      pushToast("success", "Image URL copied to clipboard.");
    } catch {
      pushToast("error", "Could not access clipboard.");
    }
  };

  const handleDropImageFile = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    try {
      const { blob, width, height } = await processImageWithCanvas({
        sourceUrl: objectUrl,
        targetWidth: 1920,
        targetHeight: 1080,
        format,
      });
      const outName = `clickthumbnail_local_${width}x${height}.${format === "png" ? "png" : "jpg"}`;
      triggerBlobDownload(blob, outName);
      pushToast("success", `Converted dropped image to ${outName}`);
    } catch {
      pushToast("error", "Could not process dropped image file.");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      <main className="flex-1">
        <HeroInput
          url={url}
          onUrlChange={setUrl}
          onSubmit={handleExtract}
          loading={loading}
          error={error}
          onDropImageFile={handleDropImageFile}
        />

        {result && (
          <ThumbnailResults
            data={result}
            options={resolutionOptions}
            format={format}
            onFormatChange={setFormat}
            downloadingId={downloadingId}
            onDownload={handleDownloadOption}
            onDownloadAllOriginals={handleDownloadAllOriginals}
            onCopyUrl={handleCopyUrl}
            onPreview={setPreviewOption}
          />
        )}

        {result && result.highestOriginal && (
          <FeedPreviewer
            thumbnailUrl={`/api/download?url=${encodeURIComponent(result.highestOriginal.url)}&inline=1`}
            initialTitle={result.metadata.title}
            initialChannel={result.metadata.channelTitle}
          />
        )}

        <HowItWorks />
        <FaqSection />
      </main>

      <Footer />

      <PreviewModal
        option={previewOption}
        previewSrc={
          previewOption
            ? `/api/download?url=${encodeURIComponent(previewOption.sourceUrl)}&inline=1`
            : null
        }
        format={format}
        onClose={() => setPreviewOption(null)}
        onDownload={handleDownloadOption}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
