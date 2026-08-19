import { motion } from "framer-motion";

/* EDIT THESE THREE — they carry more weight in your own words than in mine. */
const PLAN = [
  {
    when: "Now",
    tone: "var(--color-tech)",
    title: "Build Sage / Auriele properly",
    body: "Finish the first full curriculum loop — reading, writing, grammar, speaking — and get it in front of real learners for feedback.",
  },
  {
    when: "Next",
    tone: "var(--color-film)",
    title: "Take on client work",
    body: "Concept videos, event and portrait shoots, and product design for small teams — the kind of project where one person carrying it across crafts is an advantage.",
  },
  {
    when: "The long game",
    tone: "var(--color-art)",
    title: "A studio that makes its own things",
    body: "Original short films and apps released under the DJZ name, with the tools and the visual language built in-house.",
  },
];

export default function Studio({ onContact }) {
  return (
    <section id="studio" className="scroll-mt-24 px-5 py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="relative grid justify-items-center gap-4 py-8"
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(closest-side, rgba(228,192,119,.75), transparent 70%)",
            }}
          />
          <img
            src="img/djz-logo.png"
            alt="DJZ Studios"
            className="relative w-[min(280px,72%)]"
            style={{
              filter:
                "saturate(1.16) contrast(1.1) brightness(.93) drop-shadow(0 0 .7px rgba(58,36,8,.9)) drop-shadow(0 16px 26px rgba(122,86,16,.3))",
            }}
          />
          <span className="slate relative text-[color:var(--color-golddeep)]">
            Founded 2026 · San Diego
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="slate text-[color:var(--color-golddeep)]">The studio</span>
          <h2 className="mt-3 text-[clamp(30px,4.4vw,52px)]">What DJZ Studios is for.</h2>
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed">
            DJZ Studios is the name I put on my own work — where the film, the photography,
            the design, and the code stop being separate hobbies and start being one
            practice. Right now it's me. The point of naming it was to hold the work to a
            standard, and to give it somewhere to grow.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PLAN.map((p, i) => (
              <motion.article
                key={p.when}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-[rgba(22,18,16,.14)] bg-[color:var(--color-cream)] p-6 shadow-[0_18px_36px_-30px_rgba(22,18,16,.6)]"
              >
                <span
                  className="slate inline-block rounded-full px-3 py-1 text-[#fff7e7]"
                  style={{ background: p.tone, fontSize: 10 }}
                >
                  {p.when}
                </span>
                <h3 className="mt-3.5 text-[19px]">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed">{p.body}</p>
              </motion.article>
            ))}
          </div>

          <p className="mt-7 text-[16px]">
            If any of that overlaps with what you're building, I'd rather hear about it early.
          </p>
          <button
            onClick={onContact}
            className="mt-4 inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-[color:var(--color-tech)] px-6 py-3 text-[15px] font-medium text-[color:var(--color-tech)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-tech)] hover:text-[color:var(--color-cream)]"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-current" />
            Start a conversation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
