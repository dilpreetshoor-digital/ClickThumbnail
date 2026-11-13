import { NextRequest, NextResponse } from "next/server";
import { buildCandidateUrls, extractYouTubeVideoId } from "@/lib/youtube";
import { ThumbnailCandidate, VideoMetadata } from "@/types/thumbnail";

const FETCH_TIMEOUT_MS = 6000;
const MAX_PROBE_BYTES = 5 * 1024 * 1024; // 5 MB safety cap per probe

function parseJpegDimensions(buf: Uint8Array): { width: number; height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 4 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buf[offset + 1];
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      if (offset + 8 < buf.length) {
        const height = (buf[offset + 5] << 8) | buf[offset + 6];
        const width = (buf[offset + 7] << 8) | buf[offset + 8];
        return { width, height };
      }
      return null;
    }
    if (marker === 0xd9 || marker === 0xda) break;
    const segLen = (buf[offset + 2] << 8) | buf[offset + 3];
    if (segLen < 2) break;
    offset += 2 + segLen;
  }
  return null;
}

async function probeCandidate(
  candidate: ReturnType<typeof buildCandidateUrls>[number]
): Promise<ThumbnailCandidate> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(candidate.url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ...candidate,
        width: 0,
        height: 0,
        sizeBytes: null,
        mimeType: "image/jpeg",
        available: false,
      };
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return {
        ...candidate,
        width: 0,
        height: 0,
        sizeBytes: null,
        mimeType: contentType,
        available: false,
      };
    }

    const arrayBuf = await res.arrayBuffer();
    if (arrayBuf.byteLength > MAX_PROBE_BYTES) {
      return {
        ...candidate,
        width: 0,
        height: 0,
        sizeBytes: arrayBuf.byteLength,
        mimeType: contentType,
        available: false,
      };
    }

    const bytes = new Uint8Array(arrayBuf);
    const dims = parseJpegDimensions(bytes);

    return {
      ...candidate,
      width: dims?.width ?? 0,
      height: dims?.height ?? 0,
      sizeBytes: arrayBuf.byteLength,
      mimeType: contentType,
      available: Boolean(dims && dims.width > 0 && dims.height > 0),
    };
  } catch {
    return {
      ...candidate,
      width: 0,
      height: 0,
      sizeBytes: null,
      mimeType: "image/jpeg",
      available: false,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchYouTubeDataApiMetadata(
  videoId: string
): Promise<Partial<VideoMetadata> | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
    endpoint.searchParams.set("part", "snippet");
    endpoint.searchParams.set("id", videoId);
    endpoint.searchParams.set("key", apiKey);

    const res = await fetch(endpoint.toString(), {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.items?.[0]?.snippet;
    if (!item) return null;

    return {
      title: item.title,
      channelTitle: item.channelTitle,
      source: "youtube-data-api",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = typeof body?.url === "string" ? body.url : "";
    const videoId = extractYouTubeVideoId(rawUrl);

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL. Please paste a valid watch, Shorts, embed, live, or youtu.be link." },
        { status: 400 }
      );
    }

    const candidateUrls = buildCandidateUrls(videoId);
    const [candidates, apiMeta] = await Promise.all([
      Promise.all(candidateUrls.map(probeCandidate)),
      fetchYouTubeDataApiMetadata(videoId),
    ]);

    const available = candidates.filter((c) => c.available);
    if (available.length === 0) {
      return NextResponse.json(
        { error: "No thumbnails could be found for this video ID. Verify the video is public." },
        { status: 404 }
      );
    }

    const highestOriginal = [...available].sort(
      (a, b) => b.width * b.height - a.width * a.height
    )[0];

    const metadata: VideoMetadata = {
      videoId,
      title: apiMeta?.title,
      channelTitle: apiMeta?.channelTitle,
      source: apiMeta?.source ?? "direct-probe",
    };

    return NextResponse.json({
      videoId,
      metadata,
      candidates,
      highestOriginal,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request. Please check the URL and try again." },
      { status: 400 }
    );
  }
}
