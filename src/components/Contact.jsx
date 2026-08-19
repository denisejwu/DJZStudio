import { useState } from "react";
import { motion } from "framer-motion";

export const EMAIL = "dwumendez@ucsd.edu";

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/denise-wu-mendez",
    d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21H9z",
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    d: "M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.4-4.04-1.4-.55-1.4-1.34-1.78-1.34-1.78-1.1-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.24a11.4 11.4 0 0 1 6 0c2.3-1.56 3.3-1.24 3.3-1.24.66 1.66.25 2.88.12 3.18.77.84 1.23 1.92 1.23 3.24 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.83.57A12 12 0 0 0 12 .5z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/",
    d: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 5.68A4.16 4.16 0 1 0 16.16 12 4.16 4.16 0 0 0 12 7.84zm0 6.86A2.7 2.7 0 1 1 14.7 12a2.7 2.7 0 0 1-2.7 2.7zm5.3-7.03a.97.97 0 1 1-.97-.97.97.97 0 0 1 .97.97z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/",
    d: "M23 12s0-3.6-.46-5.32a2.77 2.77 0 0 0-1.95-1.96C18.87 4.25 12 4.25 12 4.25s-6.87 0-8.59.47a2.77 2.77 0 0 0-1.95 1.96C1 8.4 1 12 1 12s0 3.6.46 5.32a2.77 2.77 0 0 0 1.95 1.96c1.72.47 8.59.47 8.59.47s6.87 0 8.59-.47a2.77 2.77 0 0 0 1.95-1.96C23 15.6 23 12 23 12zM9.75 15.27V8.73L15.5 12z",
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const t = document.createElement("textarea");
      t.value = EMAIL;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-gradient-to-b from-[color:var(--color-parchment)] via-[rgba(15,107,82,.07)] to-[color:var(--color-parchment)] px-5 py-28 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-3xl"
      >
        <span className="slate text-[color:var(--color-golddeep)]">Contact</span>
        <h2 className="mt-3 text-[clamp(30px,4.4vw,52px)]">Looking to hire?</h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-[17px]">
          Open to internships and freelance work in production, design, and development —
          San Diego or remote.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-8 inline-block bg-[linear-gradient(90deg,var(--color-golddeep),var(--color-gold))] bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat text-[clamp(24px,4.4vw,50px)] transition-[background-size] duration-500 hover:bg-[length:100%_2px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {EMAIL}
        </a>

        <div className="mt-3">
          <button
            onClick={copy}
            className="text-[13.5px] text-[color:var(--color-golddeep)] underline underline-offset-4 transition-colors hover:text-[color:var(--color-ink)]"
          >
            {copied ? "Address copied" : "Copy address"}
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-[54ch] text-[16px]">
          One click opens your email app with the subject filled in. Prefer to write it
          yourself? The address is right there.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Role or project — DJZ Studios")}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-[color:var(--color-ink)] px-6 py-3.5 text-[15px] font-medium text-[color:var(--color-parchment)] transition-transform hover:-translate-y-0.5"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-[color:var(--color-goldlite)]" />
            Email me about a role
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Project inquiry — DJZ Studios")}`}
            className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-[color:var(--color-gold)] px-6 py-3.5 text-[15px] font-medium text-[color:var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-gold)] hover:text-[color:var(--color-cream)]"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-current" />
            Email me about a project
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-[rgba(22,18,16,.14)] px-5 py-2.5 text-[15px] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-tech)] hover:text-[color:var(--color-tech)]"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                <path d={l.d} />
              </svg>
              {l.label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
