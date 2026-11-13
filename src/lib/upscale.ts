import { ImageFormat } from "@/types/thumbnail";

export function buildDownloadFilename(
  videoId: string,
  width: number,
  height: number,
  format: ImageFormat,
  isUpscaled = false
): string {
  const ext = format === "png" ? "png" : "jpg";
  const suffix = isUpscaled ? "_upscaled" : "";
  return `clickthumbnail_${videoId}_${width}x${height}${suffix}.${ext}`;
}

/**
 * Multi-step high-quality canvas resampling for client-side upscaling (2K / 4K / 8K)
 * and JPEG/PNG format conversion. Uses progressive 2x stepping where appropriate to
 * minimize interpolation artifacts.
 */
export async function processImageWithCanvas(params: {
  sourceUrl: string;
  targetWidth: number;
  targetHeight: number;
  format: ImageFormat;
  quality?: number;
}): Promise<{ blob: Blob; width: number; height: number }> {
  const { sourceUrl, targetWidth, targetHeight, format, quality = 0.94 } = params;

  const img = await loadImage(sourceUrl);
  const srcW = img.naturalWidth || targetWidth;
  const srcH = img.naturalHeight || targetHeight;

  let currentCanvas = document.createElement("canvas");
  currentCanvas.width = srcW;
  currentCanvas.height = srcH;
  const initCtx = currentCanvas.getContext("2d");
  if (!initCtx) throw new Error("Canvas 2D context unavailable.");
  initCtx.imageSmoothingEnabled = true;
  initCtx.imageSmoothingQuality = "high";
  initCtx.drawImage(img, 0, 0, srcW, srcH);

  // Progressive step-up for smoother upscaling
  let curW = srcW;
  let curH = srcH;
  while (curW * 2 < targetWidth && curH * 2 < targetHeight) {
    const nextW = curW * 2;
    const nextH = curH * 2;
    const stepCanvas = document.createElement("canvas");
    stepCanvas.width = nextW;
    stepCanvas.height = nextH;
    const stepCtx = stepCanvas.getContext("2d");
    if (!stepCtx) break;
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.drawImage(currentCanvas, 0, 0, nextW, nextH);
    currentCanvas = stepCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Final target resize
  const outCanvas = document.createElement("canvas");
  outCanvas.width = targetWidth;
  outCanvas.height = targetHeight;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) throw new Error("Canvas 2D context unavailable.");
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";
  outCtx.drawImage(currentCanvas, 0, 0, targetWidth, targetHeight);

  const mime = format === "png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    outCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image."))),
      mime,
      format === "jpeg" ? quality : undefined
    );
  });

  return { blob, width: targetWidth, height: targetHeight };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load source image for processing."));
    img.src = src;
  });
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}
