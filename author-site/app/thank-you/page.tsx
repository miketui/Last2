import { UtilityShell } from "@/components/design/UtilityShell";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { pageMetadata } from "@/lib/seo";
import { freeChapterLinks } from "@/lib/free-assets";
import { publicEnv } from "@/lib/env";

export const metadata = pageMetadata("Thank You", "Chapter 1 is on its way — and here's what comes next.", true);

export default function Page() {
  const links = freeChapterLinks();
  const videoId = publicEnv.NEXT_PUBLIC_THANKYOU_VIDEO_ID;

  return (
    <UtilityShell
      eyebrow="Chapter 1 is on its way"
      title="Check your inbox. Then meet me here."
      description="Your chapter and the Pricing Confidence Checklist are headed to your email right now. While they land, sixty seconds on what this book is actually for."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="editorial-panel overflow-hidden rounded-[2rem]">
          {videoId ? (
            <div className="relative aspect-video">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title="A sixty-second welcome from Michael David"
                loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center p-8 text-center">
              <p className="max-w-md text-whitegold/70">
                A sixty-second welcome from Michael lands here — unlisted video, no autoplay, no tricks. Until it&rsquo;s uploaded: read the chapter tonight. That&rsquo;s the whole assignment.
              </p>
            </div>
          )}
        </div>
        <div>
          <h2 className="font-display text-3xl leading-tight text-white md:text-4xl">If Chapter 1 reads like your week, the rest is the map.</h2>
          <p className="mt-4 leading-8 text-whitegold/80">
            The direct edition is <strong className="text-white">$17.99</strong> right now. Fifteen days after release it becomes $19.99 — permanently. That schedule is real, published, and the only urgency you&rsquo;ll ever get from me. No timers. No &ldquo;only 3 left&rdquo; of a digital file.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <MagneticCurlButton href="/preorder">Preorder — $17.99</MagneticCurlButton>
            <MagneticCurlButton href="/chapters" variant="secondary">Preview the Chapters</MagneticCurlButton>
          </div>
          {links.configured ? (
            <div className="mt-8 rounded-2xl border border-whitegold/15 bg-white/5 p-5 text-sm leading-6 text-whitegold/75">
              <p className="font-semibold text-white">Email playing hard to get?</p>
              <p className="mt-2">
                Direct links, same files: <a className="text-antique underline underline-offset-4" href={links.chapter}>Chapter 1 (PDF)</a> ·{" "}
                <a className="text-antique underline underline-offset-4" href={links.checklist}>Pricing Confidence Checklist (PDF)</a>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </UtilityShell>
  );
}
