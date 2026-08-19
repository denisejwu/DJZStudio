import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ROOMS } from "../data/projects";

function RoomCard({ room, index, onOpen }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // each card drifts at its own rate — that difference is the parallax
  const y = useTransform(scrollYProgress, [0, 1], [90 + index * 26, -70 - index * 26]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [0, 1, 1, 0.25]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.94, 1, 0.98]);

  return (
    <motion.button
      ref={ref}
      style={{ y, opacity, scale }}
      onClick={() => onOpen(room.id)}
      whileHover={{ y: -8 }}
      className="group relative w-full overflow-hidden rounded-2xl border border-[rgba(22,18,16,.1)] bg-[color:var(--color-cream)] p-8 text-left shadow-[0_20px_44px_-34px_rgba(22,18,16,.6)] transition-shadow hover:shadow-[0_36px_60px_-34px_rgba(22,18,16,.55)]"
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: room.accent }}
      />
      <div className="flex items-baseline justify-between gap-4">
        <span className="slate" style={{ color: room.accent }}>
          {room.n} — {room.label}
        </span>
        <span className="slate text-[color:var(--color-golddeep)]">
          {room.count} {room.count === 1 ? "project" : "projects"}
        </span>
      </div>
      <h3 className="mt-4 text-[clamp(22px,2.4vw,30px)]">{room.heading}</h3>
      <p className="mt-3 max-w-[46ch] text-[15.5px]">{room.blurb}</p>
      <span
        className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium"
        style={{ color: room.accent }}
      >
        Open {room.label.toLowerCase()}
        <span className="transition-transform group-hover:translate-x-1.5">→</span>
      </span>
    </motion.button>
  );
}

export default function ScrollCards({ onOpen }) {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-40 pt-16">
      <div className="mb-16 text-center">
        <span className="slate text-[color:var(--color-golddeep)]">Three rooms</span>
        <h2 className="mt-4 text-[clamp(30px,4.6vw,56px)]">Pick where to start.</h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[16px]">
          Each one stands on its own. Some projects use two or three together —
          that's usually where I'm most useful.
        </p>
      </div>

      <div className="grid gap-8">
        {ROOMS.map((room, i) => (
          <RoomCard key={room.id} room={room} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
