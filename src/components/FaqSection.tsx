"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How do I download a YouTube thumbnail?",
    a: "Paste any YouTube video or Shorts URL into the input box above and click Get Thumbnail. ClickThumbnail verifies all available image streams and lets you download your chosen resolution in one click.",
  },
  {
    q: "Which resolutions are supported?",
    a: "ClickThumbnail probes YouTube's native streams (1280×720, 640×480, 480×360, 320×180, 120×90) and provides Standard (640×360), Full HD (1920×1080), 2K (2560×1440), 4K (3840×2160), and 8K (7680×4320) output options.",
  },
  {
    q: "Can I download 4K thumbnails?",
    a: "YouTube itself only stores thumbnails up to 1280×720 (or 1920×1080 on select videos). When YouTube does not supply a native 4K file, ClickThumbnail clearly labels 2K, 4K, and 8K options as Client Upscaled using multi-step high-quality interpolation.",
  },
  {
    q: "Does the tool work with YouTube Shorts?",
    a: "Yes. ClickThumbnail supports youtube.com/shorts/ links as well as standard watch, youtu.be, embed, and live URLs.",
  },
  {
    q: "Is this tool free?",
    a: "Yes, ClickThumbnail is completely free with no registration, watermarks, or usage limits.",
  },
  {
    q: "Do I need to install anything?",
    a: "No installation or browser extension is required. Everything runs directly in your browser.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-widest text-muted">Details</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="divide-y divide-line rounded-md border border-line bg-surface">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-xs font-semibold text-ink transition-colors hover:bg-hover sm:text-sm"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs leading-relaxed text-muted">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
