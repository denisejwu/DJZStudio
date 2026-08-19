import { motion } from "framer-motion";
import { TECH } from "../data/projects";
import Frame from "./Frame";

const TAG_TONE = {
  "UI/UX": "var(--color-art)",
  Figma: "var(--color-photo)",
  Frontend: "var(--color-tech)",
  Backend: "var(--color-film)",
};

export default function TechSection({ onOpen }) {
  return (
    <div className="pb-28">
      <header className="mx-auto max-w-5xl px-5 pb-10">
        <span className="slate text-[color:var(--color-tech)]">03 — Tech</span>
        <h2 className="mt-3 text-[clamp(30px,4.4vw,52px)]">The case studies.</h2>
        <p className="mt-4 max-w-[56ch] text-[16px]">
          What the problem was, what I did, and where it stands. Click any card for the full read.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {TECH.map((p, i) => (
          <motion.button
            key={p.id}
            onClick={() => onOpen(p)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="group text-left"
          >
            {/* the float: each card breathes on its own offset */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{
                duration: 6 + i * 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              whileHover={{ y: -14, rotateX: 4, rotateY: -4 }}
              style={{ transformPerspective: 900 }}
              className="overflow-hidden rounded-2xl border border-[rgba(22,18,16,.09)] bg-[color:var(--color-cream)] shadow-[0_22px_44px_-30px_rgba(22,18,16,.55)] transition-shadow group-hover:shadow-[0_40px_64px_-32px_rgba(22,18,16,.5)]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[color:var(--color-sand)]">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                  <Frame project={p} src={p.shots?.[0]} ratio={4 / 3} />
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full px-2.5 py-1 font-[family-name:var(--font-slate)] text-[9px] uppercase tracking-[0.14em] text-[#fff7e7]"
                      style={{ background: TAG_TONE[t] || "var(--color-gold)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-[21px]">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed">{p.short}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-medium text-[color:var(--color-tech)]">
                  Read the case study
                  <span className="transition-transform group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
