import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FILM } from "../data/projects";
import Frame from "./Frame";

export default function FilmSection({ onOpen }) {
  const track = useRef(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-5xl px-5 pb-10">
        <span className="slate text-[color:var(--color-film)]">01 — Film</span>
        <h2 className="mt-3 text-[clamp(30px,4.4vw,52px)]">The strip.</h2>
        <p className="mt-4 max-w-[56ch] text-[16px]">
          Drag it sideways. Hover a frame for the detail, click to open the project.
        </p>
      </header>

      {/* film stock */}
      <div className="relative bg-gradient-to-b from-[#332720] via-[#241c16] to-[#1b1410] py-4 shadow-[0_26px_60px_-34px_rgba(22,18,16,.85)]">
        <div className="perf h-[18px] opacity-90" />
        <div className="flex justify-between px-6 pt-1 font-[family-name:var(--font-slate)] text-[9px] uppercase tracking-[0.3em] text-[rgba(228,192,119,.55)]">
          <span>DJZ · 24 fps</span>
          <span>Reel one</span>
        </div>

        <motion.div
          ref={track}
          drag="x"
          dragConstraints={{ left: -(FILM.length * 340), right: 0 }}
          dragElastic={0.08}
          className="flex cursor-grab gap-4 px-6 py-4 active:cursor-grabbing"
        >
          {FILM.map((p, i) => (
            <motion.article
              key={p.id}
              onHoverStart={() => setHovered(p.id)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => onOpen(p)}
              whileHover={{ y: -6 }}
              className="relative w-[min(330px,74vw)] shrink-0 rounded-[3px] bg-[#0f0b09] p-[6px]"
            >
              <span className="absolute left-3 top-3 z-10 font-[family-name:var(--font-slate)] text-[9px] uppercase tracking-[0.16em] text-[rgba(255,247,226,.75)]">
                {String(i + 1).padStart(2, "0")}A
              </span>
              <div className="overflow-hidden rounded-[2px]">
                <motion.div
                  animate={{
                    filter:
                      hovered === p.id
                        ? "sepia(0) saturate(1.05) brightness(1.04)"
                        : "sepia(.38) saturate(.85) brightness(.86)",
                    scale: hovered === p.id ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.55 }}
                >
                  <Frame project={p} src={p.poster} ratio={16 / 10} />
                </motion.div>
              </div>

              {/* hover reveal */}
              <motion.div
                initial={false}
                animate={{
                  opacity: hovered === p.id ? 1 : 0,
                  y: hovered === p.id ? 0 : 10,
                }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute inset-x-[6px] bottom-[6px] rounded-b-[2px] bg-gradient-to-t from-[rgba(15,11,9,.95)] via-[rgba(15,11,9,.8)] to-transparent p-4 pt-10"
              >
                <p className="font-[family-name:var(--font-slate)] text-[9px] uppercase tracking-[0.16em] text-[color:var(--color-goldlite)]">
                  {p.client} · {p.when}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-[#fff6e4]">{p.short}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.roles.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-[rgba(228,192,119,.45)] px-2 py-0.5 font-[family-name:var(--font-slate)] text-[8.5px] uppercase tracking-[0.12em] text-[color:var(--color-goldlite)]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </motion.div>

              <p className="px-1 pb-1 pt-2 text-center">
                <span
                  className="block leading-tight text-[#fff6e4]"
                  style={{ fontFamily: "var(--font-display)", fontSize: 16 }}
                >
                  {p.title}
                </span>
              </p>
            </motion.article>
          ))}
        </motion.div>

        <div className="flex justify-between px-6 pb-1 font-[family-name:var(--font-slate)] text-[9px] uppercase tracking-[0.3em] text-[rgba(228,192,119,.55)]">
          <span>Click a frame to open</span>
          <span>Safety film · KEEP</span>
        </div>
        <div className="perf h-[18px] opacity-90" />
      </div>
    </div>
  );
}
