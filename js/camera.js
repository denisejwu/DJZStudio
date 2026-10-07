/**
 * The landing camera.
 *
 * A DSLR built from flat layers stacked in CSS 3D. Every part is a pile of thin
 * slices, so when the camera turns you see real depth: the side of the body,
 * the knurled focus ring, the recess around the glass. No library, no model
 * file. The lens glass is a <canvas> running a WebGL shader — an aperture that
 * breathes, circuit traces routing outward, a design grid, and pixel blocks
 * resolving in and out.
 *
 * Geometry is in camera units (the body is 3.1 × 1.9 × 1.15); CSS turns units
 * into pixels with --u on .camera-stage, so the camera scales with the screen.
 * Axes: x right, y up, z toward the viewer. The grip and shutter sit on the
 * viewer's left and the mode dial on the right, as on a real DSLR seen from
 * the front.
 *
 * Uses tokenRGB() from js/frame.js to read lens colors from css/style.css.
 */
const Camera = (() => {
  const FACE = 0.575; // z of the body's front
  const LENS = { x: 0.12, y: -0.02 };
  const REST = { x: -7, y: 12 }; // resting pose in degrees: seen a little from above, turned to show the grip
  const REACH = { x: 13, y: 18 }; // how far it turns to follow the pointer

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let stage, cam, lens, glass, hit;
  let shader = null;
  let onShoot = () => {};
  let running = false;
  let raf = 0;
  let last = 0;
  let time = 2;
  let hot = false;
  let disabled = false;
  let origin = null; // where the camera sits on screen, for pointer maths
  const aim = { x: 0, y: 0 };
  const pose = { rx: REST.x, ry: REST.y, hot: 0 };

  const f = (n) => +n.toFixed(4);

  /* ---------- building blocks ---------- */

  function slab(parent, cls, x, y, z, w, h, r = 0, more = "", tag = "div") {
    const el = document.createElement(tag);
    el.className = "slab " + cls;
    el.style.cssText = `--x:${f(x)};--y:${f(y)};--z:${f(z)};--w:${f(w)};--h:${f(h)};--r:${f(r)};${more}`;
    parent.appendChild(el);
    return el;
  }

  function part(cls) {
    const el = document.createElement("div");
    el.className = "cam-part " + cls;
    cam.appendChild(el);
    return el;
  }

  /** A rounded block extruded along z, with a softened front edge. Returns the front face. */
  function block(g, cls, { x, y, w, h, r, back, front, step = 0.09, bevel = 0.05 }) {
    for (let z = back; z < front - bevel - 1e-6; z += step) slab(g, cls, x, y, z, w, h, r);
    for (const t of [0.75, 0.4, 0.15]) {
      const d = bevel * t; // distance behind the face
      const inset = bevel - Math.sqrt(bevel * bevel - (bevel - d) ** 2);
      slab(g, cls + " is-bevel", x, y, front - d, w - 2 * inset, h - 2 * inset, Math.max(0, r - inset));
    }
    return slab(g, cls + "-face", x, y, front, w - 2 * bevel, h - 2 * bevel, Math.max(0, r - bevel));
  }

  /** An upright cylinder (a dial, a button) sliced across its depth. */
  function drum(g, cls, { x, y, z, R, H, n = 7 }) {
    for (let i = 0; i < n; i++) {
      const dz = R * (-1 + (2 * i + 1) / n);
      const w = 2 * Math.sqrt(R * R - dz * dz);
      slab(g, cls, x, y, z + dz, w, H, Math.min(0.02, w / 2), `--k:${f(i / (n - 1))}`);
    }
  }

  /** Half a rounded column standing proud of the body face: the grip. */
  function bulge(g, cls, { x, y, w, h, depth, n = 6 }) {
    for (let i = 0; i < n; i++) {
      const d = (depth * i) / n;
      const k = Math.sqrt(1 - (d / depth) ** 2);
      slab(g, cls, x, y, FACE + d, w * k, h - (1 - k) * 0.3, Math.min((w * k) / 2, 0.3), `--k:${f(i / (n - 1))}`);
    }
  }

  // lens slices are placed by d, their distance in front of the body face
  const disc = (g, cls, d, r, more = "", tag) => slab(g, cls, LENS.x, LENS.y, FACE + d, 2 * r, 2 * r, r, more, tag);
  const ring = (g, cls, d, r, inner) => disc(g, cls + " is-ring", d, r, `--hole:${f(inner / r)}`);
  const run = (from, to, n, fn) => {
    for (let i = 0; i < n; i++) fn(from + ((to - from) * i) / n);
  };

  const RIM =
    '<svg viewBox="0 0 200 200" aria-hidden="true">' +
    '<path id="cam-rim-top" d="M11 100A89 89 0 0 1 189 100" fill="none"/>' +
    '<path id="cam-rim-bottom" d="M7 100A93 93 0 0 0 193 100" fill="none"/>' +
    '<text text-anchor="middle"><textPath href="#cam-rim-top" startOffset="50%">DJZ STUDIOS · ƒ/1.4 35mm</textPath></text>' +
    '<text text-anchor="middle"><textPath href="#cam-rim-bottom" startOffset="50%">FILM · PHOTO · TECH · ART</textPath></text>' +
    "</svg>";

  function build() {
    cam.textContent = "";

    /* body, with flat details printed on its face */
    const body = part("cam-body");
    block(body, "s-body", { x: 0, y: 0, w: 3.1, h: 1.9, r: 0.2, back: -FACE, front: FACE }).innerHTML =
      '<i class="cam-badge"></i><i class="cam-release"></i>';

    /* pentaprism with its nameplate, and the hot shoe on top */
    const prism = part("cam-prism");
    block(prism, "s-prism", { x: LENS.x, y: 1.25, w: 1.42, h: 0.6, r: 0, back: -0.42, front: 0.42, bevel: 0.03 }).innerHTML =
      '<span class="cam-name">DJZ</span>';
    block(prism, "s-shoe", { x: LENS.x, y: 1.6, w: 0.64, h: 0.1, r: 0.015, back: -0.24, front: 0.2, step: 0.11, bevel: 0.015 });

    /* grip, with the self-timer lamp */
    const grip = part("cam-grip");
    bulge(grip, "s-grip", { x: -1.24, y: -0.03, w: 0.6, h: 1.78, depth: 0.3 });
    slab(grip, "s-lamp", -1.24, 0.56, FACE + 0.262, 0.11, 0.11, 0.055);

    /* top plate: mode dial on the right, shutter button above the grip */
    drum(part("cam-dial"), "s-dial", { x: 1.17, y: 1.06, z: 0.02, R: 0.28, H: 0.22 });
    const shutter = part("cam-shutter");
    drum(shutter, "s-collar", { x: -1.22, y: 0.98, z: 0.3, R: 0.21, H: 0.06, n: 5 });
    drum(shutter, "s-shutter", { x: -1.22, y: 1.05, z: 0.3, R: 0.15, H: 0.09, n: 5 });

    /* the lens, back to front. It's the one clickable part. (A div, not a <button>:
       some browsers wrap button contents in a box that would flatten the 3D.) */
    lens = part("cam-lens");
    run(0.01, 0.06, 2, (d) => disc(lens, "s-mount", d, 0.98));
    run(0.06, 0.14, 2, (d) => disc(lens, "s-barrel", d, 0.9));
    run(0.14, 0.4, 7, (d) => disc(lens, "s-focus", d, 0.95));
    run(0.4, 0.49, 3, (d) => disc(lens, "s-barrel", d, 0.9));
    disc(lens, "s-goldline", 0.445, 0.915);
    run(0.49, 0.64, 4, (d) => disc(lens, "s-zoom", d, 0.925));
    run(0.64, 0.7, 2, (d) => disc(lens, "s-barrel", d, 0.88));
    glass = disc(lens, "s-glass", 0.7, 0.62);
    glass.innerHTML = "<canvas></canvas>";
    ring(lens, "s-bezel", 0.703, 0.72, 0.6);
    disc(lens, "s-glare", 0.706, 0.6);
    run(0.72, 0.8, 2, (d) => ring(lens, "s-tube", d, 0.88, 0.72));
    ring(lens, "s-rim", 0.8, 0.88, 0.72).innerHTML = RIM;

    // a real button over the front of the lens, for keyboards and screen readers
    hit = disc(lens, "s-hit", 0.806, 0.94, "", "button");
    hit.type = "button";
    hit.setAttribute("aria-label", "Take the shot and open the portfolio");
  }

  /* ---------- the lens shader ---------- */

  const VERT = "attribute vec2 p; varying vec2 vUv; void main() { vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }";

  const FRAG = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHover;
    uniform vec3 uDeep;
    uniform vec3 uGold;
    uniform vec3 uGreen;
    uniform vec3 uLight;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv - 0.5;
      float r = length(uv);
      float ang = atan(uv.y, uv.x);
      float t = uTime;
      vec3 col = uDeep;

      // design grid, drifting
      vec2 g = fract((uv * 9.0) + vec2(t * 0.08, -t * 0.05));
      float grid = smoothstep(0.94, 1.0, max(g.x, g.y));
      col += uGreen * grid * 0.30;

      // circuit traces routing out from the centre
      float spokes = abs(sin(ang * 4.0 + t * 0.35));
      float trace = smoothstep(0.985, 1.0, spokes) * smoothstep(0.46, 0.10, r);
      col += uGold * trace * 0.55;

      // pixel blocks resolving in and out
      vec2 cell = floor((uv + 0.5) * 16.0);
      float seed = hash(cell);
      float blink = step(0.86, fract(seed + t * 0.16));
      col += mix(uGreen, uGold, seed) * blink * 0.34 * smoothstep(0.5, 0.16, r);

      // aperture rings, breathing
      float open = 0.10 + 0.035 * sin(t * 0.8) + uHover * 0.05;
      for (int i = 0; i < 3; i++) {
        float rr = open + float(i) * 0.085;
        col += uGold * smoothstep(0.010, 0.0, abs(r - rr)) * (0.85 - float(i) * 0.2);
      }

      // hot centre, where the light gets through
      col += mix(uGold, uLight, 0.55) * smoothstep(open, 0.0, r) * (0.75 + uHover * 0.5);

      // shutter sweep
      float sweep = smoothstep(0.02, 0.0, abs(uv.y - sin(t * 0.5) * 0.4));
      col += uGold * sweep * 0.12;

      // glass falloff and a specular hint
      col *= smoothstep(0.5, 0.30, r);
      col += vec3(1.0) * smoothstep(0.14, 0.0, length(uv - vec2(-0.16, 0.17))) * 0.32;

      float mask = smoothstep(0.5, 0.487, r);
      gl_FragColor = vec4(col * mask, mask);
    }`;

  function startShader(canvas) {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return null;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    // one square covering the canvas
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const p = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(p);
    gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);

    const u = (name) => gl.getUniformLocation(prog, name);
    const color = (uniform, token, fallback) => gl.uniform3fv(u(uniform), tokenRGB(token, fallback).map((c) => c / 255));
    color("uDeep", "--lens-deep", [11, 20, 25]);
    color("uGold", "--lens-gold", [200, 152, 66]);
    color("uGreen", "--lens-green", [29, 139, 105]);
    color("uLight", "--light", [255, 246, 228]);
    const uTime = u("uTime");
    const uHover = u("uHover");

    // if the GPU drops the context, the CSS glass underneath takes over
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      shader = null;
      canvas.hidden = true;
    });

    return {
      size() {
        // the lens is drawn nearer the viewer than z = 0, so render a little sharper than its box
        const px = Math.min(512, Math.round(canvas.clientWidth * Math.min(devicePixelRatio || 1, 2) * 1.4));
        if (px && canvas.width !== px) {
          canvas.width = canvas.height = px;
          gl.viewport(0, 0, px, px);
        }
      },
      draw(t, hover) {
        gl.uniform1f(uTime, t);
        gl.uniform1f(uHover, hover);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    };
  }

  /* ---------- motion ---------- */

  function measure() {
    const r = stage.getBoundingClientRect();
    origin = { x: r.left + cam.offsetLeft, y: r.top + cam.offsetTop };
  }

  function onPointer(e) {
    if (!origin) measure();
    aim.x = Math.max(-1, Math.min(1, (e.clientX - origin.x) / (innerWidth / 2)));
    aim.y = Math.max(-1, Math.min(1, (e.clientY - origin.y) / (innerHeight / 2)));
  }

  function onResize() {
    measure();
    if (shader) shader.size();
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    const calm = motion.matches;
    if (!calm) time += dt;
    const ease = (rate) => 1 - Math.pow(1 - rate, dt * 60); // a per-frame lerp that ignores frame rate

    // idle drift plus a gentle look toward the pointer
    const tx = calm ? REST.x : REST.x - aim.y * REACH.x + Math.sin(time * 0.4) * 1.7;
    const ty = calm ? REST.y : REST.y + aim.x * REACH.y + Math.sin(time * 0.3) * 3.4;
    pose.rx += (tx - pose.rx) * ease(0.05);
    pose.ry += (ty - pose.ry) * ease(0.05);
    pose.hot += ((hot ? 1 : 0) - pose.hot) * ease(0.08);
    const lift = calm ? 0 : Math.sin(time * 0.7) * 0.05;
    const scale = calm ? 1 : 1 + 0.06 * pose.hot;

    cam.style.transform =
      `translateY(calc(var(--u) * ${f(-lift)})) rotateX(${f(pose.rx)}deg) rotateY(${f(pose.ry)}deg) scale(${f(scale)})`;
    cam.style.setProperty("--rx", f(pose.rx));
    cam.style.setProperty("--ry", f(pose.ry));
    stage.style.setProperty("--lift", f(lift));
    if (shader) shader.draw(time, pose.hot);
  }

  function setHot(on) {
    hot = on && !disabled;
    cam.classList.toggle("is-hot", hot);
  }

  function start() {
    if (running || !cam) return;
    running = true;
    last = 0;
    measure();
    if (shader) shader.size();
    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("scroll", measure, { passive: true });
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    removeEventListener("pointermove", onPointer);
    removeEventListener("resize", onResize);
    removeEventListener("scroll", measure);
    setHot(false);
  }

  // no point drawing frames for a hidden tab
  document.addEventListener("visibilitychange", () => {
    if (!running) return;
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  });

  function init(root, stageEl, options = {}) {
    cam = root;
    stage = stageEl;
    if (options.onShoot) onShoot = options.onShoot;
    build();
    const canvas = glass.querySelector("canvas");
    shader = startShader(canvas);
    if (!shader) canvas.hidden = true;
    lens.addEventListener("pointerenter", () => setHot(true));
    lens.addEventListener("pointerleave", () => setHot(false));
    hit.addEventListener("focus", () => setHot(true));
    hit.addEventListener("blur", () => setHot(false));
    // clicks anywhere on the lens, and Enter/Space on the button, all arrive here
    lens.addEventListener("click", () => {
      if (!disabled) onShoot();
    });
  }

  return {
    init,
    start,
    stop,
    setDisabled(on) {
      disabled = on;
      if (on) setHot(false);
    },
  };
})();
