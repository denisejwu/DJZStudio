import { useEffect, useRef } from "react";

/**
 * Draws a cinematic-looking still for a project: gradient, key light,
 * craft-specific geometry, emulsion grain, gate vignette.
 *
 * If the project has a real image (`src`), that is shown instead. This means
 * the site looks finished before any photos exist, and upgrades silently
 * as they get added.
 */
export default function Frame({ project, src, ratio = 3 / 2, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (src) return;
    const cv = ref.current;
    if (!cv) return;

    const w = 640;
    const h = Math.round(w / ratio);
    cv.width = w;
    cv.height = h;
    const x = cv.getContext("2d");
    const [a, b, c] = project.palette;
    const s = w / 320;

    const g = x.createLinearGradient(0, h, w, 0);
    g.addColorStop(0, a);
    g.addColorStop(0.55, b);
    g.addColorStop(1, c);
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);

    const key = x.createRadialGradient(w * 0.74, h * 0.2, 8, w * 0.74, h * 0.2, w * 0.9);
    key.addColorStop(0, "rgba(255,247,226,.85)");
    key.addColorStop(1, "rgba(255,247,226,0)");
    x.fillStyle = key;
    x.fillRect(0, 0, w, h);

    x.globalCompositeOperation = "multiply";
    x.strokeStyle = "rgba(22,18,16,.26)";
    x.lineWidth = 1.1;

    if (project.kind === "film") {
      for (let n = 0; n < 3; n++) x.strokeRect(26 * s, (14 + n * 52) * s, 268 * s, 40 * s);
      x.fillStyle = "rgba(22,18,16,.14)";
      for (let n = 0; n < 8; n++) {
        x.fillRect(7 * s, (10 + n * 25) * s, 11 * s, 13 * s);
        x.fillRect(302 * s, (10 + n * 25) * s, 11 * s, 13 * s);
      }
    } else if (project.kind === "photo") {
      x.beginPath();
      x.arc(w / 2, h / 2, 60 * s, 0, 7);
      x.stroke();
      for (let n = 0; n < 9; n++) {
        const an = (n * Math.PI * 2) / 9;
        x.beginPath();
        x.moveTo(w / 2 + Math.cos(an) * 60 * s, h / 2 + Math.sin(an) * 60 * s);
        x.lineTo(w / 2 + Math.cos(an + 1.1) * 26 * s, h / 2 + Math.sin(an + 1.1) * 26 * s);
        x.stroke();
      }
      x.strokeRect(w / 2 - 54 * s, h / 2 - 54 * s, 108 * s, 108 * s);
    } else {
      for (let n = 0; n < 14; n++) {
        let px = 20 * s + Math.random() * (w - 40 * s);
        let py = 16 * s + Math.random() * (h - 32 * s);
        x.beginPath();
        x.moveTo(px, py);
        for (let q = 0; q < 3; q++) {
          const hz = Math.random() > 0.5;
          px += hz ? (Math.random() - 0.5) * 90 * s : 0;
          py += hz ? 0 : (Math.random() - 0.5) * 90 * s;
          x.lineTo(px, py);
        }
        x.stroke();
        x.fillStyle = "rgba(12,79,61,.55)";
        x.beginPath();
        x.arc(px, py, 2.6 * s, 0, 7);
        x.fill();
      }
    }

    x.globalCompositeOperation = "source-over";

    const im = x.getImageData(0, 0, w, h);
    const d = im.data;
    for (let n = 0; n < d.length; n += 4) {
      const v = (Math.random() - 0.5) * 22;
      d[n] += v;
      d[n + 1] += v;
      d[n + 2] += v * 0.85;
    }
    x.putImageData(im, 0, 0);

    const vg = x.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(22,18,16,.3)");
    x.fillStyle = vg;
    x.fillRect(0, 0, w, h);
  }, [project, src, ratio]);

  if (src) {
    return (
      <img
        src={src}
        alt={project.title}
        className={`block h-full w-full object-cover ${className}`}
      />
    );
  }
  return <canvas ref={ref} className={`block h-full w-full object-cover ${className}`} />;
}
