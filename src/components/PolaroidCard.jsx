import { motion } from "framer-motion";

/**
 * A Polaroid ejecting and developing. The "developing" part is a
 * blank chemical layer that fades away over ~2.6s, plus a saturation
 * and contrast ramp on the image underneath — which is how the real
 * thing actually resolves.
 */
export default function PolaroidCard({ onContinue }) {
  return (
    <section className="relative flex min-h-svh items-center justify-center px-5 py-24">
      <motion.figure
        initial={{ y: -260, rotate: -7, opacity: 0 }}
        animate={{ y: 0, rotate: -2, opacity: 1 }}
        transition={{ type: "spring", stiffness: 42, damping: 13, mass: 1.1 }}
        className="relative w-[min(400px,86vw)] rounded-[4px] bg-[#fdfbf5] p-4 pb-16 shadow-[0_44px_80px_-40px_rgba(22,18,16,.7)]"
      >
        <div className="relative aspect-square overflow-hidden bg-[#241c16]">
          {/* the exposure underneath */}
          <motion.div
            initial={{ filter: "saturate(0) contrast(0.6) brightness(1.5)" }}
            animate={{ filter: "saturate(1) contrast(1) brightness(1)" }}
            transition={{ duration: 2.8, delay: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 72% 22%, #f0ce8e 0%, #b98a25 34%, #a9552f 62%, #241c16 100%)",
            }}
          />
          {/* aperture mark, drawn in */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.path
                key={i}
                d={`M100 100 L${100 + 62 * Math.cos((i * Math.PI) / 3)} ${
                  100 + 62 * Math.sin((i * Math.PI) / 3)
                } A62 62 0 0 1 ${100 + 62 * Math.cos(((i + 1) * Math.PI) / 3)} ${
                  100 + 62 * Math.sin(((i + 1) * Math.PI) / 3)
                } Z`}
                fill="none"
                stroke="rgba(255,247,226,.5)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, delay: 1.2 + i * 0.09 }}
              />
            ))}
          </svg>
          {/* undeveloped chemical layer, clearing */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2.6, delay: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#e8e2d4]"
          />
        </div>

        <figcaption className="absolute bottom-5 left-0 right-0 px-5 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.9 }}
            className="font-display text-[19px] text-[color:var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get to know my world.
          </motion.span>
        </figcaption>
      </motion.figure>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        onClick={onContinue}
        className="slate absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[color:var(--color-golddeep)]"
      >
        Scroll to explore
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-6 w-[1.5px] bg-[color:var(--color-gold)]"
        />
      </motion.button>
    </section>
  );
}
