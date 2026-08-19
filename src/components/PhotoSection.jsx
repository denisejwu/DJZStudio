import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHOTO } from "../data/projects";
import Frame from "./Frame";

/**
 * Flattens each series into individual plates so the masonry has enough
 * to work with. When real files land in `shots`, they're used directly;
 * until then each plate is generated at its own aspect ratio.
 */
const PLATES = PHOTO.flatMap((series) =>
  (series.shots?.length ? series.shots : series.ratios).map((s, i) => ({
    key: `${series.id}-${i}`,
    series,
    src: typeof s === "string" ? s : null,
    ratio: typeof s === "string" ? 1 : s,
  }))
);

export default function PhotoSection({ onOpen }) {
  const [zoom, setZoom] = useState(null);

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-5xl px-5 pb-10">
        <span className="slate text-[color:var(--color-photo)]">02 — Photography</span>
        <h2 className="mt-3 text-[clamp(30px,4.4vw,52px)]">The gallery.</h2>
        <p className="mt-4 max-w-[56ch] text-[16px]">
          Click any plate to enlarge it. Open a series for the full story behind the shoot.
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-8 flex flex-wrap gap-2">
          {PHOTO.map((s) => (
            <button
              key={s.id}
              onClick={() => onOpen(s)}
              className="rounded-full border-[1.5px] border-[rgba(22,18,16,.14)] px-4 py-2 text-[14px] transition-colors hover:border-[color:var(--color-photo)] hover:text-[color:var(--color-ink)]"
            >
              {s.title} →
            </button>
          ))}
        </div>

        <div className="masonry columns-2 md:columns-3 lg:columns-4">
          {PLATES.map((plate, i) => (
            <motion.button
              key={plate.key}
              layoutId={plate.key}
              onClick={() => setZoom(plate)}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
              whileHover={{ y: -5 }}
              className="block w-full overflow-hidden rounded-xl bg-[color:var(--color-sand)] shadow-[0_14px_30px_-24px_rgba(22,18,16,.8)]"
              style={{ aspectRatio: String(plate.ratio) }}
            >
              <Frame project={plate.series} src={plate.src} ratio={plate.ratio} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-[95] grid place-items-center bg-[rgba(28,22,18,.62)] p-6 backdrop-blur-sm"
          >
            <motion.div
              layoutId={zoom.key}
              className="max-h-[86svh] w-auto max-w-[min(1000px,92vw)] overflow-hidden rounded-2xl bg-[color:var(--color-parchment)] p-3 shadow-[0_50px_90px_-40px_rgba(22,18,16,.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="overflow-hidden rounded-xl"
                style={{ aspectRatio: String(zoom.ratio), maxHeight: "72svh" }}
              >
                <Frame project={zoom.series} src={zoom.src} ratio={zoom.ratio} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-3">
                <div>
                  <p className="slate text-[color:var(--color-golddeep)]">
                    {zoom.series.title} · {zoom.series.when}
                  </p>
                  <p className="mt-1 text-[15px]">{zoom.series.short}</p>
                </div>
                <button
                  onClick={() => {
                    setZoom(null);
                    onOpen(zoom.series);
                  }}
                  className="rounded-full bg-[color:var(--color-ink)] px-5 py-2.5 text-[14px] font-medium text-[color:var(--color-parchment)]"
                >
                  About this series
                </button>
              </div>
            </motion.div>
            <button
              onClick={() => setZoom(null)}
              aria-label="Close"
              className="absolute right-6 top-5 text-[30px] leading-none text-[color:var(--color-parchment)]"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
