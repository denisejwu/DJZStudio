import { useEffect } from "react";
import { motion } from "framer-motion";
import Frame from "./Frame";

const yt = (u) => {
  const m = String(u || "").match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/);
  return m ? m[1] : null;
};

function Note({ children }) {
  return (
    <p className="rounded-lg bg-[rgba(185,138,37,.1)] px-4 py-3 font-[family-name:var(--font-slate)] text-[11.5px] leading-relaxed tracking-[0.04em] text-[color:var(--color-golddeep)]">
      {children}
    </p>
  );
}

export default function ProjectPage({ project, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const id = yt(project.video);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[95] overflow-auto bg-[rgba(28,22,18,.55)] p-5 backdrop-blur-md"
    >
      <motion.article
        initial={{ y: 34, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto max-w-[940px] overflow-hidden rounded-3xl bg-[color:var(--color-parchment)] shadow-[0_50px_90px_-36px_rgba(22,18,16,.75)]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-4 z-10 text-[30px] leading-none text-[color:var(--color-ink)]"
        >
          ×
        </button>

        <header className="border-b border-[rgba(22,18,16,.14)] px-8 pb-6 pt-9 sm:px-10">
          <p className="slate text-[color:var(--color-golddeep)]">
            {project.client} · {project.when}
          </p>
          <h2 className="mt-2 text-[clamp(26px,3.2vw,40px)]">{project.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(project.roles || project.tags || []).map((t) => (
              <span
                key={t}
                className="rounded-full bg-[rgba(185,138,37,.14)] px-3 py-1 text-[13.5px] text-[#6b4b0e]"
              >
                {t}
              </span>
            ))}
          </div>
          {project.body && (
            <p className="mt-5 max-w-[70ch] text-[16.5px] leading-relaxed">{project.body}</p>
          )}
        </header>

        <div className="grid gap-5 px-8 py-7 sm:px-10">
          {/* ---- film: play it ---- */}
          {project.kind === "film" &&
            (project.video ? (
              id ? (
                <iframe
                  className="aspect-video w-full rounded-xl border-0 bg-[#0f0b09]"
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              ) : (
                <video
                  className="aspect-video w-full rounded-xl bg-[#0f0b09]"
                  src={project.video}
                  autoPlay
                  muted
                  loop
                  controls
                  playsInline
                />
              )
            ) : (
              <>
                <div className="overflow-hidden rounded-xl">
                  <Frame project={project} src={project.poster} ratio={16 / 9} />
                </div>
                <Note>
                  Add the cut: set <b>video</b> on this project in src/data/projects.js — a file
                  in /public or a YouTube link. It autoplays here.
                </Note>
              </>
            ))}

          {/* ---- photo: the series ---- */}
          {project.kind === "photo" && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(project.shots?.length ? project.shots : project.ratios).map((s, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl bg-[color:var(--color-sand)]"
                    style={{ aspectRatio: typeof s === "string" ? "1" : String(s) }}
                  >
                    <Frame
                      project={project}
                      src={typeof s === "string" ? s : null}
                      ratio={typeof s === "string" ? 1 : s}
                    />
                  </div>
                ))}
              </div>
              {!project.shots?.length && (
                <Note>
                  Add the set: <b>shots: ['img/grad-01.jpg', …]</b> on this project in
                  src/data/projects.js.
                </Note>
              )}
            </>
          )}

          {/* ---- tech: the case study ---- */}
          {project.kind === "tech" && project.study && (
            <>
              {[
                ["The problem", project.study.problem],
                ["My role", project.study.role],
              ].map(([h, p]) => (
                <div
                  key={h}
                  className="grid gap-4 border-t border-[rgba(22,18,16,.14)] py-4 first:border-t-0 first:pt-0 sm:grid-cols-[150px_1fr] sm:gap-5"
                >
                  <h4 className="slate m-0 text-[color:var(--color-tech)]">{h}</h4>
                  <p className="m-0 text-[16px] leading-relaxed">{p}</p>
                </div>
              ))}
              <div className="grid gap-4 border-t border-[rgba(22,18,16,.14)] py-4 sm:grid-cols-[150px_1fr] sm:gap-5">
                <h4 className="slate m-0 text-[color:var(--color-tech)]">Process</h4>
                <ol className="m-0 list-decimal pl-5 text-[16px] leading-relaxed">
                  {project.study.process.map((s) => (
                    <li key={s} className="mb-1.5">
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid gap-4 border-t border-[rgba(22,18,16,.14)] py-4 sm:grid-cols-[150px_1fr] sm:gap-5">
                <h4 className="slate m-0 text-[color:var(--color-tech)]">Where it stands</h4>
                <p className="m-0 text-[16px] leading-relaxed">{project.study.outcome}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(project.shots?.length ? project.shots : [0, 1, 2]).map((s, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] overflow-hidden rounded-xl bg-[color:var(--color-sand)]"
                  >
                    <Frame
                      project={project}
                      src={typeof s === "string" ? s : null}
                      ratio={4 / 3}
                    />
                  </div>
                ))}
              </div>
              {!project.shots?.length && (
                <Note>
                  Add screens: <b>shots: ['img/sage-home.png', …]</b> on this project in
                  src/data/projects.js.
                </Note>
              )}
            </>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}
