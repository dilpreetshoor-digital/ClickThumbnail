"use client";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Copy YouTube URL",
      desc: "Copy the link from any YouTube video, Shorts, live stream, or share link.",
    },
    {
      num: "02",
      title: "Paste the video link",
      desc: "Drop it into the extractor above or click Paste to inspect real streams.",
    },
    {
      num: "03",
      title: "Choose quality and download",
      desc: "Pick original resolution or client-upscaled 2K/4K/8K in JPEG or PNG.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-line py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-widest text-muted">Workflow</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-md border border-line bg-surface p-5"
            >
              <span className="text-xs font-semibold text-accent">{step.num}</span>
              <h3 className="mt-2 text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
