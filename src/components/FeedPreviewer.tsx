"use client";

import { useState } from "react";
import { Monitor, Smartphone, Upload } from "lucide-react";

interface FeedPreviewerProps {
  thumbnailUrl: string;
  initialTitle?: string;
  initialChannel?: string;
}

export function FeedPreviewer({
  thumbnailUrl,
  initialTitle = "How I Built a Minimal SaaS in 48 Hours (Full Breakdown)",
  initialChannel = "Creator Studio",
}: FeedPreviewerProps) {
  const [layout, setLayout] = useState<"desktop" | "mobile">("desktop");
  const [ytDark, setYtDark] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [channel, setChannel] = useState(initialChannel);
  const [duration, setDuration] = useState("12:48");
  const [customUrl, setCustomUrl] = useState<string | null>(null);

  const activeSrc = customUrl || thumbnailUrl;
  const initials = (channel.trim()[0] || "C").toUpperCase();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customUrl) URL.revokeObjectURL(customUrl);
    setCustomUrl(URL.createObjectURL(file));
  };

  const handleReset = () => {
    if (customUrl) URL.revokeObjectURL(customUrl);
    setCustomUrl(null);
  };

  const neighbors = [
    {
      title: "Design Systems That Scale Without Bloat",
      channel: "Design Lab · 180K views · 1 day ago",
      duration: "08:15",
    },
    {
      title: "Why Typography Matters More Than Color",
      channel: "Type Craft · 94K views · 3 days ago",
      duration: "15:02",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <div className="rounded-md border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted">
              Context Check
            </p>
            <h3 className="mt-0.5 text-sm font-semibold text-ink">
              YouTube Feed Previewer
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="inline-flex rounded border border-line bg-canvas p-0.5">
              <button
                type="button"
                onClick={() => setLayout("desktop")}
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 transition-colors ${
                  layout === "desktop"
                    ? "bg-surface font-semibold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                <Monitor className="h-3 w-3" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setLayout("mobile")}
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 transition-colors ${
                  layout === "mobile"
                    ? "bg-surface font-semibold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>Mobile</span>
              </button>
            </div>

            <div className="inline-flex rounded border border-line bg-canvas p-0.5">
              <button
                type="button"
                onClick={() => setYtDark(false)}
                className={`rounded px-2.5 py-1 transition-colors ${
                  !ytDark
                    ? "bg-surface font-semibold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                YT Light
              </button>
              <button
                type="button"
                onClick={() => setYtDark(true)}
                className={`rounded px-2.5 py-1 transition-colors ${
                  ytDark
                    ? "bg-surface font-semibold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                YT Dark
              </button>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-1 rounded border border-line bg-canvas px-2.5 py-1 text-ink transition-colors hover:bg-hover">
              <Upload className="h-3 w-3 text-accent" />
              <span>Test Local Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>

            {customUrl && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded border border-line bg-canvas px-2.5 py-1 text-muted transition-colors hover:bg-hover hover:text-ink"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Editable Metadata */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] text-muted">Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted">Channel Name</label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Mockup Stage */}
        <div
          className="mt-4 rounded border border-line p-4 transition-colors"
          style={{
            backgroundColor: ytDark ? "#181818" : "#ffffff",
            color: ytDark ? "#f5f5f3" : "#171717",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <div
            className={
              layout === "mobile"
                ? "mx-auto grid max-w-[360px] grid-cols-1 gap-4"
                : "grid grid-cols-1 gap-4 md:grid-cols-3"
            }
          >
            {/* Active Video Card */}
            <div className="flex flex-col">
              <div
                className="relative aspect-video w-full overflow-hidden rounded-lg"
                style={{ backgroundColor: ytDark ? "#272727" : "#f1f1ef" }}
              >
                <img
                  src={activeSrc}
                  alt="YouTube feed preview"
                  className="h-full w-full object-cover"
                />
                <span
                  className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: "rgba(23,23,23,0.85)" }}
                >
                  {duration || "12:48"}
                </span>
              </div>
              <div className="mt-2.5 flex gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#16a34a" }}
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-semibold leading-snug">
                    {title || "Untitled Video"}
                  </div>
                  <div
                    className="mt-1 text-xs"
                    style={{ color: ytDark ? "#aaaaaa" : "#606060" }}
                  >
                    {channel || "Channel"} · 42K views · 2 hours ago
                  </div>
                </div>
              </div>
            </div>

            {/* Neighbor Cards on Desktop */}
            {layout === "desktop" &&
              neighbors.map((n) => (
                <div key={n.title} className="flex flex-col opacity-55">
                  <div
                    className="relative aspect-video w-full overflow-hidden rounded-lg"
                    style={{ backgroundColor: ytDark ? "#272727" : "#f1f1ef" }}
                  >
                    <div
                      className="flex h-full w-full items-center justify-center text-[11px]"
                      style={{ color: ytDark ? "#aaaaaa" : "#606060" }}
                    >
                      Feed Neighbor
                    </div>
                    <span
                      className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                      style={{ backgroundColor: "rgba(23,23,23,0.85)" }}
                    >
                      {n.duration}
                    </span>
                  </div>
                  <div className="mt-2.5 flex gap-3">
                    <div
                      className="h-9 w-9 shrink-0 rounded-full"
                      style={{ backgroundColor: ytDark ? "#272727" : "#f1f1ef" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-sm font-semibold leading-snug">
                        {n.title}
                      </div>
                      <div
                        className="mt-1 text-xs"
                        style={{ color: ytDark ? "#aaaaaa" : "#606060" }}
                      >
                        {n.channel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
