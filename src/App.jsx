import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./components/Landing";
import PolaroidCard from "./components/PolaroidCard";
import ScrollCards from "./components/ScrollCards";
import FilmSection from "./components/FilmSection";
import PhotoSection from "./components/PhotoSection";
import TechSection from "./components/TechSection";
import ProjectPage from "./components/ProjectPage";
import About from "./components/About";
import Studio from "./components/Studio";
import Contact, { EMAIL } from "./components/Contact";
import { ROOMS } from "./data/projects";

/**
 * Stages:
 *   landing  — the 3D camera, lens waiting to be clicked
 *   polaroid — the shot develops
 *   home     — rooms + about + studio + contact, one scroll
 *   film | photo | tech — a single room
 */
const ROOM_IDS = ["film", "photo", "tech"];

export default function App() {
  const [stage, setStage] = useState("landing");
  const [flash, setFlash] = useState(false);
  const [project, setProject] = useState(null);

  const shoot = useCallback(() => {
    if (flash) return;
    setFlash(true);
    setTimeout(() => setStage("polaroid"), 220);
    setTimeout(() => setFlash(false), 620);
  }, [flash]);

  const goto = useCallback((next) => {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /** Jump to a section of the home page from anywhere. */
  const jump = useCallback(
    (id) => {
      const scroll = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      if (stage === "home") scroll();
      else {
        setStage("home");
        setTimeout(scroll, 90);
      }
    },
    [stage]
  );

  useEffect(() => {
    document.body.classList.add("grain");
  }, []);

  const inRoom = ROOM_IDS.includes(stage);

  return (
    <div className="min-h-svh">
      {/* shutter flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.62, times: [0, 0.1, 0.28, 1] }}
            className="pointer-events-none fixed inset-0 z-[110] bg-white"
          />
        )}
      </AnimatePresence>

      {/* header, once past the camera */}
      <AnimatePresence>
        {stage !== "landing" && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-y-1 border-b border-[rgba(22,18,16,.08)] bg-[rgba(251,246,236,.9)] px-4 py-2.5 backdrop-blur-md sm:px-8"
          >
            <button
              onClick={() => goto("home")}
              aria-label="DJZ Studios — home"
              className="flex items-center gap-2.5"
            >
              <img
                src="img/djz-logo.png"
                alt=""
                className="h-7 w-auto"
                style={{
                  filter:
                    "saturate(1.15) contrast(1.1) brightness(.93) drop-shadow(0 0 .6px rgba(58,36,8,.8))",
                }}
              />
            </button>
            <nav className="flex flex-wrap items-center gap-0.5 sm:gap-1">
              {ROOMS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => goto(r.id)}
                  className="rounded-full px-2.5 py-1.5 text-[14px] transition-colors hover:bg-[rgba(185,138,37,.12)] sm:px-3"
                  style={{ color: stage === r.id ? r.accent : "var(--color-body)" }}
                >
                  {r.label}
                </button>
              ))}
              <span className="mx-1 hidden h-4 w-px bg-[rgba(22,18,16,.16)] sm:block" />
              {["about", "studio", "contact"].map((id) => (
                <button
                  key={id}
                  onClick={() => jump(id)}
                  className="rounded-full px-2.5 py-1.5 text-[14px] capitalize text-[color:var(--color-body)] transition-colors hover:bg-[rgba(185,138,37,.12)] sm:px-3"
                >
                  {id}
                </button>
              ))}
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <motion.main key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Landing onShoot={shoot} fired={flash} />
          </motion.main>
        )}

        {stage === "polaroid" && (
          <motion.main
            key="polaroid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PolaroidCard onContinue={() => goto("home")} />
          </motion.main>
        )}

        {stage === "home" && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-20"
          >
            <ScrollCards onOpen={goto} />
            <About />
            <Studio onContact={() => jump("contact")} />
            <Contact />
          </motion.main>
        )}

        {inRoom && (
          <motion.main
            key={stage}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className="pt-24"
          >
            <button
              onClick={() => goto("home")}
              className="mx-auto mb-6 block max-w-5xl px-5 text-left text-[14.5px] text-[color:var(--color-golddeep)] hover:text-[color:var(--color-ink)]"
            >
              ← All rooms
            </button>
            {stage === "film" && <FilmSection onOpen={setProject} />}
            {stage === "photo" && <PhotoSection onOpen={setProject} />}
            {stage === "tech" && <TechSection onOpen={setProject} />}

            {/* every room ends with a way to get in touch */}
            <div className="mx-auto max-w-5xl px-5 pb-24 text-center">
              <p className="text-[17px]">Seen something you'd want made for you?</p>
              <button
                onClick={() => jump("contact")}
                className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-[color:var(--color-ink)] px-6 py-3.5 text-[15px] font-medium text-[color:var(--color-parchment)] transition-transform hover:-translate-y-0.5"
              >
                <span className="block h-1.5 w-1.5 rounded-full bg-[color:var(--color-goldlite)]" />
                Get in touch
              </button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {project && <ProjectPage project={project} onClose={() => setProject(null)} />}
      </AnimatePresence>

      {stage !== "landing" && (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(22,18,16,.14)] px-5 py-7 text-[14px] sm:px-8">
          <span>DJZ Studios · San Diego, CA</span>
          <span>Film · Photo · Tech · Art</span>
          <a
            className="underline underline-offset-4 hover:text-[color:var(--color-ink)]"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
        </footer>
      )}
    </div>
  );
}
