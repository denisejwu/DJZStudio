import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import CameraRig from "./CameraRig";

const CRAFTS = [
  { label: "Film", tone: "var(--color-film)" },
  { label: "Photography", tone: "var(--color-photo)" },
  { label: "Design", tone: "var(--color-art)" },
  { label: "Code", tone: "var(--color-tech)" },
];

export default function Landing({ onShoot, fired }) {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(1100px,130vw)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(228,192,119,.55), rgba(15,107,82,.06) 58%, transparent 74%)",
        }}
      />

      {/* who, and whether she's available — before anything else */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <span className="inline-flex items-center gap-2.5 rounded-full bg-[rgba(15,107,82,.09)] px-4 py-2 text-[13.5px] font-medium text-[color:var(--color-tech)]">
          <span className="block h-2 w-2 rounded-full bg-current shadow-[0_0_0_4px_rgba(15,107,82,.18)]" />
          Open to internships &amp; freelance — San Diego or remote
        </span>
        <h1 className="mt-4 text-[clamp(32px,5.4vw,60px)]">Denise Wu Mendez</h1>
        <p
          className="mt-1.5 text-[clamp(16px,1.9vw,23px)] text-[color:var(--color-film)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Filmmaker · Photographer · Product designer · Developer
        </p>
      </motion.div>

      {/* the camera */}
      <div className="relative z-10 h-[42svh] min-h-[280px] w-full max-w-4xl">
        <Canvas
          camera={{ position: [0, 0.4, 6.2], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.75} color="#fff2d8" />
          <directionalLight position={[5, 6, 7]} intensity={1.5} />
          <pointLight position={[-6, 2, 4]} intensity={22} color="#ffbc63" distance={22} />
          <pointLight position={[5, -3, -3]} intensity={12} color="#fff0c9" distance={20} />
          <Suspense fallback={null}>
            <CameraRig onShoot={onShoot} disabled={fired} />
            <Environment preset="sunset" />
          </Suspense>
          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={0.34}
            scale={11}
            blur={2.6}
            far={4}
            color="#3b322b"
          />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.9 }}
        className="relative z-10 max-w-xl text-center"
      >
        <p
          className="text-[clamp(18px,2.1vw,26px)] leading-snug text-[color:var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hire me for one craft — or for the handoff between them.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {CRAFTS.map((c) => (
            <span
              key={c.label}
              className="rounded-lg border-[1.5px] bg-[color:var(--color-cream)] px-3.5 py-1.5 text-[13.5px] font-semibold"
              style={{ color: c.tone, borderColor: c.tone + "55" }}
            >
              {c.label}
            </span>
          ))}
        </div>

        <motion.button
          onClick={onShoot}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="slate mt-7 inline-block text-[color:var(--color-golddeep)]"
        >
          ◎ Click the lens to open the portfolio
        </motion.button>
      </motion.div>
    </section>
  );
}
