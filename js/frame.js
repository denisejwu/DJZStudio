/**
 * Procedural stills.
 *
 * Any project without a real image gets a cinematic-looking frame drawn on a
 * canvas: gradient, key light, craft-specific geometry, emulsion grain, gate
 * vignette. The site looks finished before any photos exist, and upgrades
 * silently as real files are added in js/data.js.
 *
 * If a real image fails to load (a typo in a path, say), the drawn frame takes
 * its place, so a visitor never sees a broken image.
 */

/** Markup for one frame: the real image if there is one, otherwise a canvas to paint. */
function frameHTML(project, src, ratio, label = "", width = 640) {
  const attr = (v) => String(v).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const data = `data-frame="${attr(project.id)}" data-ratio="${ratio || ""}" data-width="${width}"`;
  if (src) {
    return `<img src="${attr(src)}" alt="${attr(label)}" loading="lazy" decoding="async" draggable="false" ${data}>`;
  }
  const a11y = label ? `role="img" aria-label="${attr(label)}"` : `aria-hidden="true"`;
  return `<canvas ${data} ${a11y}></canvas>`;
}

/* Paint canvases as they come into view, rather than all at once on load. */
const frameWatcher =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            frameWatcher.unobserve(e.target);
            paintCanvas(e.target);
          }
        },
        { rootMargin: "240px" }
      )
    : null;

/** Paint every unpainted frame inside `root`. `now` skips the wait for visibility. */
function paintFrames(root, now = false) {
  root.querySelectorAll("canvas[data-frame]:not([data-painted])").forEach((cv) => {
    if (now || !frameWatcher) paintCanvas(cv);
    else frameWatcher.observe(cv);
  });
}

function paintCanvas(cv) {
  const project = ALL.find((p) => p.id === cv.dataset.frame);
  if (!project) return;
  drawFrame(cv, project, Number(cv.dataset.ratio) || 1, Number(cv.dataset.width) || 640);
  cv.dataset.painted = "";
}

// a real image that fails to load becomes a drawn frame
document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.frame) return;
    const cv = document.createElement("canvas");
    Object.assign(cv.dataset, { frame: img.dataset.frame, ratio: img.dataset.ratio, width: img.dataset.width });
    if (img.alt) {
      cv.setAttribute("role", "img");
      cv.setAttribute("aria-label", img.alt);
    } else cv.setAttribute("aria-hidden", "true");
    img.replaceWith(cv);
    paintCanvas(cv);
  },
  true
);

/** A hex color token from css/style.css as [r, g, b]. */
function tokenRGB(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? hexRGB(v) : fallback;
}

function hexRGB(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;

function drawFrame(cv, project, ratio = 1.5, width = 640) {
  const w = width;
  const h = Math.round(w / ratio);
  cv.width = w;
  cv.height = h;
  const x = cv.getContext("2d", { willReadFrequently: true });
  const [a, b, c] = project.palette;
  const s = w / 320;
  const ink = tokenRGB("--stock", [36, 28, 22]); // the warm dark, for lines and vignette
  const light = tokenRGB("--light", [255, 246, 228]);

  const g = x.createLinearGradient(0, h, w, 0);
  g.addColorStop(0, a);
  g.addColorStop(0.55, b);
  g.addColorStop(1, c);
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  const key = x.createRadialGradient(w * 0.74, h * 0.2, 8, w * 0.74, h * 0.2, w * 0.9);
  key.addColorStop(0, rgba(light, 0.85));
  key.addColorStop(1, rgba(light, 0));
  x.fillStyle = key;
  x.fillRect(0, 0, w, h);

  x.globalCompositeOperation = "multiply";
  x.strokeStyle = rgba(ink, 0.26);
  x.lineWidth = 0.55 * s;

  if (project.kind === "film") {
    // three frames of a strip, with sprocket holes down both edges
    for (let n = 0; n < 3; n++) x.strokeRect(26 * s, (14 + n * 52) * s, 268 * s, 40 * s);
    x.fillStyle = rgba(ink, 0.14);
    for (let n = 0; n < 8; n++) {
      x.fillRect(7 * s, (10 + n * 25) * s, 11 * s, 13 * s);
      x.fillRect(302 * s, (10 + n * 25) * s, 11 * s, 13 * s);
    }
  } else if (project.kind === "photo") {
    // an iris and a crop box
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
    // circuit traces: right-angled runs ending in a pad
    const pad = rgba(hexRGB(a), 0.55);
    for (let n = 0; n < 14; n++) {
      let px = 20 * s + Math.random() * (w - 40 * s);
      let py = 16 * s + Math.random() * (h - 32 * s);
      x.beginPath();
      x.moveTo(px, py);
      for (let q = 0; q < 3; q++) {
        const across = Math.random() > 0.5;
        px += across ? (Math.random() - 0.5) * 90 * s : 0;
        py += across ? 0 : (Math.random() - 0.5) * 90 * s;
        x.lineTo(px, py);
      }
      x.stroke();
      x.fillStyle = pad;
      x.beginPath();
      x.arc(px, py, 2.6 * s, 0, 7);
      x.fill();
    }
  }

  x.globalCompositeOperation = "source-over";

  // emulsion grain
  const im = x.getImageData(0, 0, w, h);
  const d = im.data;
  for (let n = 0; n < d.length; n += 4) {
    const v = (Math.random() - 0.5) * 22;
    d[n] += v;
    d[n + 1] += v;
    d[n + 2] += v * 0.85;
  }
  x.putImageData(im, 0, 0);

  // gate vignette
  const vg = x.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
  vg.addColorStop(0, rgba(ink, 0));
  vg.addColorStop(1, rgba(ink, 0.3));
  x.fillStyle = vg;
  x.fillRect(0, 0, w, h);
}
