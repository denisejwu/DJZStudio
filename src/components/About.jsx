import { motion } from "framer-motion";

const RAIL = [
  { label: "Film", detail: "concept · shoot · edit", tone: "var(--color-film)" },
  { label: "Photography", detail: "portraits · events", tone: "var(--color-photo)" },
  { label: "Design", detail: "research · UI · Figma", tone: "var(--color-art)" },
  { label: "Code", detail: "front-end · back-end", tone: "var(--color-tech)" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-gradient-to-b from-[color:var(--color-parchment)] via-[#f6ebdb] to-[color:var(--color-parchment)] px-5 py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        {/* portrait slot */}
        <motion.figure
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-[340px]"
        >
          <div
            aria-hidden
            className="absolute -inset-8 animate-pulse rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(228,192,119,.7), transparent 68%)",
              animationDuration: "9s",
            }}
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[200px] rounded-b-2xl bg-gradient-to-b from-[color:var(--color-sand)] to-[color:var(--color-linen)]">
            {/* Swap this whole <svg> for: <img src="img/denise.jpg" alt="Denise Wu Mendez" className="h-full w-full object-cover" /> */}
            <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7a5610" />
                  <stop offset="48%" stopColor="#a9552f" />
                  <stop offset="100%" stopColor="#241c16" />
                </linearGradient>
              </defs>
              <path
                fill="url(#sil)"
                opacity=".9"
                d="M200 120c40 0 66 30 66 71 0 26-9 47-20 61 30 12 52 26 68 45 26 31 38 74 42 129H44c4-55 16-98 42-129 16-19 38-33 68-45-11-14-20-35-20-61 0-41 26-71 66-71z"
              />
              <g fill="none" stroke="#0f6b52" strokeWidth="1.2" opacity=".45">
                <circle cx="200" cy="187" r="98" />
                <circle cx="200" cy="187" r="130" />
                <path d="M102 187H52M348 187h50M200 57V25" />
              </g>
            </svg>
            <span className="slate absolute bottom-4 left-0 right-0 text-center text-[rgba(59,50,43,.6)]">
              A photo of you working goes here
            </span>
          </div>
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="slate text-[color:var(--color-golddeep)]">About</span>
          <h2 className="mt-3 text-[clamp(30px,4.4vw,52px)]">Denise Wu Mendez</h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Product designer", "Visual storyteller", "Creative technologist"].map((r) => (
              <span
                key={r}
                className="rounded-full bg-[rgba(185,138,37,.14)] px-3.5 py-1.5 text-[14px] font-medium text-[#6b4b0e]"
              >
                {r}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed">
            I spend as much time behind a camera as in a code editor. I produced a
            quarter-long concept video for a campus dance club — finding the locations,
            shaping the idea, shooting it, running lighting and sound — and I photograph
            graduations and events on my own.
          </p>
          <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed">
            On the other side of the desk I run DJZ Studios, where I'm designing and
            building Sage/Auriele, a language-learning app that brings reading, writing,
            grammar, and speaking into one place. I do the research, the wireframes, the
            prototypes, and the code.
          </p>
          <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed">
            What I'm actually good at is figuring out how to make something happen with
            whatever's available — a borrowed light, a free afternoon, a first draft of a
            feature. That's the thread through all of it.
          </p>

          {/* capability rail — each craft stands alone, dashed line = optional connection */}
          <div className="relative mt-10 grid gap-4 pl-8">
            <span
              aria-hidden
              className="absolute bottom-2 left-[6px] top-2 w-[2px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, rgba(122,86,16,.45) 0 6px, transparent 6px 13px)",
              }}
            />
            {RAIL.map((r) => (
              <div key={r.label} className="relative text-[13.5px]">
                <span
                  aria-hidden
                  className="absolute -left-8 top-1 block h-3 w-3 rounded-full bg-[color:var(--color-parchment)]"
                  style={{ boxShadow: `0 0 0 2.5px ${r.tone}` }}
                />
                <b className="block text-[16.5px] font-semibold" style={{ color: r.tone }}>
                  {r.label}
                </b>
                {r.detail}
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-[rgba(22,18,16,.14)] pt-4 text-[13.5px]">
            Each stands on its own — connected when a project calls for it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
