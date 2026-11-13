import { NextRequest, NextResponse } from "next/server";
import { isTrustedThumbnailUrl } from "@/lib/youtube";

const DOWNLOAD_TIMEOUT_MS = 8000;
const MAX_DOWNLOAD_BYTES = 15 * 1024 * 1024; // 15 MB cap

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url") || "";
  const filename = (searchParams.get("filename") || "clickthumbnail_thumbnail.jpg")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const inline = searchParams.get("inline") === "1";

  if (!isTrustedThumbnailUrl(targetUrl)) {
    return NextResponse.json(
      { error: "Blocked: URL must point to a trusted YouTube thumbnail host." },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  try {
    const upstream = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: "error",
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Thumbnail not found on upstream host." },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Upstream response is not an image." },
        { status: 415 }
      );
    }

    const contentLength = Number(upstream.headers.get("content-length") || "0");
    if (contentLength > MAX_DOWNLOAD_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds maximum allowed size." },
        { status: 413 }
      );
    }

    const buffer = await upstream.arrayBuffer();
    if (buffer.byteLength > MAX_DOWNLOAD_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds maximum allowed size." },
        { status: 413 }
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", String(buffer.byteLength));
    headers.set("Cache-Control", "no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    if (!inline) {
      headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    }

    return new NextResponse(buffer, { status: 200, headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch thumbnail within timeout." },
      { status: 504 }
    );
  } finally {
    clearTimeout(timer);
  }
}
