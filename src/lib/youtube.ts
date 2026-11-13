const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

const ALLOWED_THUMBNAIL_HOSTS = new Set([
  "i.ytimg.com",
  "img.youtube.com",
  "i1.ytimg.com",
  "i2.ytimg.com",
  "i3.ytimg.com",
  "i4.ytimg.com",
]);

const ALLOWED_YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

export function extractYouTubeVideoId(rawInput: string): string | null {
  const input = rawInput.trim();
  if (!input) return null;

  if (VIDEO_ID_REGEX.test(input)) {
    return input;
  }

  let parsed: URL;
  try {
    parsed = new URL(input.startsWith("http") ? input : `https://${input}`);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_YOUTUBE_HOSTS.has(host)) {
    return null;
  }

  // youtu.be/VIDEO_ID
  if (host === "youtu.be" || host === "www.youtu.be") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id && VIDEO_ID_REGEX.test(id) ? id : null;
  }

  // youtube.com/watch?v=VIDEO_ID
  const vParam = parsed.searchParams.get("v");
  if (vParam && VIDEO_ID_REGEX.test(vParam)) {
    return vParam;
  }

  // youtube.com/shorts/VIDEO_ID, /embed/VIDEO_ID, /live/VIDEO_ID, /v/VIDEO_ID
  const segments = parsed.pathname.split("/").filter(Boolean);
  if (
    segments.length >= 2 &&
    ["shorts", "embed", "live", "v"].includes(segments[0]) &&
    VIDEO_ID_REGEX.test(segments[1])
  ) {
    return segments[1];
  }

  return null;
}

export function isTrustedThumbnailUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return false;
    if (!ALLOWED_THUMBNAIL_HOSTS.has(parsed.hostname.toLowerCase())) return false;
    return /^\/vi(_webp)?\/[a-zA-Z0-9_-]{11}\/[a-zA-Z0-9_]+\.(jpg|webp)$/i.test(
      parsed.pathname
    );
  } catch {
    return false;
  }
}

export function buildCandidateUrls(videoId: string) {
  return [
    { key: "maxresdefault" as const, label: "Max Resolution" },
    { key: "sddefault" as const, label: "SD Default" },
    { key: "hqdefault" as const, label: "High Quality" },
    { key: "mqdefault" as const, label: "Medium Quality" },
    { key: "default" as const, label: "Default" },
  ].map((item) => ({
    ...item,
    url: `https://i.ytimg.com/vi/${videoId}/${item.key}.jpg`,
  }));
}

export function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}
