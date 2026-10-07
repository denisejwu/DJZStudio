/**
 * DJZ Studios — the page.
 *
 * Stages (one <main> each; only one shows at a time):
 *   landing  — the camera, lens waiting to be clicked
 *   polaroid — the shot develops
 *   home     — rooms + about + studio + contact, one scroll
 *   film | photo | tech — a single room (the three share one <main>)
 *
 * The URL hash drives everything after the landing, so any room, section,
 * or project can be linked to directly:  #home  #contact  #film  #tech/sage
 * (#shot is the Polaroid; no hash is the camera.)
 */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const calm = () => motion.matches;

  // Notes about missing media are for Denise while she edits, never for visitors.
  const LOCAL = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

  const ROOM_IDS = ROOMS.map((r) => r.id);
  const SECTIONS = ["about", "studio", "contact"];
  const WORK = { film: FILM, photo: PHOTO, tech: TECH };

  /* ---------- html`` — a template tag that escapes whatever it interpolates ---------- */

  class Markup {
    constructor(s) {
      this.s = s;
    }
    toString() {
      return this.s;
    }
  }
  const raw = (s) => new Markup(String(s));
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const piece = (v) =>
    v == null || v === false ? "" : Array.isArray(v) ? v.map(piece).join("") : v instanceof Markup ? v.s : esc(v);
  const html = (strings, ...values) => raw(strings.reduce((out, s, i) => out + piece(values[i - 1]) + s));
  const frame = (...args) => raw(frameHTML(...args));

  /* Scroll without the smooth behavior set on <html>. */
  function jump(fn) {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    fn();
    root.style.scrollBehavior = "";
  }

  /* ---------- rooms, rendered from js/data.js ---------- */

  function renderRoomCards() {
    $("#room-cards").innerHTML = html`${ROOMS.map(
      (r) => html`
        <li class="room-slot">
          <a class="room-card" href="#${r.id}" style="--tone: ${r.accent}">
            <span class="room-card__top">
              <span class="slate room-card__n">${r.n} — ${r.label}</span>
              <span class="slate room-card__count">${r.count} ${r.count === 1 ? "project" : "projects"}</span>
            </span>
            <h3>${r.heading}</h3>
            <p>${r.blurb}</p>
            <span class="room-card__go">Open ${r.label.toLowerCase()} <span class="arrow" aria-hidden="true">→</span></span>
          </a>
        </li>`
    )}`;
  }

  function renderFilm() {
    $("#film-track").innerHTML = html`${FILM.map(
      (p, i) => html`
        <li class="frame">
          <a class="frame__link" href="#film/${p.id}" draggable="false">
            <span class="frame__no" aria-hidden="true">${String(i + 1).padStart(2, "0")}A</span>
            <span class="frame__art">${frame(p, p.poster, 16 / 10)}</span>
            <span class="frame__reveal" aria-hidden="true">
              <span class="frame__meta">${p.client} · ${p.when}</span>
              <span class="frame__short">${p.short}</span>
              <span class="frame__roles">${p.roles.map((r) => html`<span>${r}</span>`)}</span>
            </span>
            <span class="frame__title">${p.title}</span>
          </a>
        </li>`
    )}`;
  }

  // each photo series becomes individual plates, so the masonry has enough to work with
  const PLATES = PHOTO.flatMap((series) =>
    (series.shots?.length ? series.shots : series.ratios).map((s, i) => ({
      series,
      n: i + 1,
      src: typeof s === "string" ? s : null,
      ratio: typeof s === "string" ? null : s, // real photos keep their own shape
    }))
  );

  function renderPhoto() {
    $("#photo-series").innerHTML = html`${PHOTO.map(
      (s) => html`<li><a class="series-link" href="#photo/${s.id}">${s.title} <span aria-hidden="true">→</span></a></li>`
    )}`;
    $("#photo-masonry").innerHTML = html`${PLATES.map(
      (pl, i) => html`
        <button class="plate" type="button" data-plate="${i}" data-reveal
          style="${pl.ratio ? `aspect-ratio: ${pl.ratio}; ` : ""}--d: ${(i % 6) * 0.05}s"
          aria-label="Enlarge ${pl.series.title}, photo ${pl.n}">${frame(pl.series, pl.src, pl.ratio)}</button>`
    )}`;
  }

  const TAG_TONE = { "UI/UX": "var(--art)", Figma: "var(--photo)", Frontend: "var(--tech)", Backend: "var(--film)" };

  function renderTech() {
    $("#tech-cards").innerHTML = html`${TECH.map(
      (p, i) => html`
        <li class="tech-slot" data-reveal style="--d: ${i * 0.1}s">
          <a class="tech-card" href="#tech/${p.id}" style="--float: ${6 + i * 0.9}s; --float-delay: ${i * 0.5}s">
            <span class="tech-card__box">
              <span class="tech-card__art">${frame(p, p.shots?.[0], 4 / 3)}</span>
              <span class="tech-card__body">
                <span class="tags">${p.tags.map(
                  (t) => html`<span class="tag" style="--tone: ${TAG_TONE[t] || "var(--golddeep)"}">${t}</span>`
                )}</span>
                <h3>${p.title}</h3>
                <span class="tech-card__short">${p.short}</span>
                <span class="tech-card__go">Read the case study <span class="arrow" aria-hidden="true">→</span></span>
              </span>
            </span>
          </a>
        </li>`
    )}`;
  }

  /* ---------- stages ---------- */

  const roomMain = $(".stage--room");
  const stageOf = (name) => (ROOM_IDS.includes(name) ? roomMain : $(`.stage--${name}`));
  let current = null;
  let pending = null; // a stage swap waiting on its exit animation

  function show(next, { section = null, instant = false, focus = true } = {}) {
    if (pending) pending();
    if (next === current) {
      if (section) toSection(section, true);
      return;
    }
    const prev = current;
    const from = prev ? stageOf(prev) : null;
    const to = stageOf(next);
    current = next;
    document.body.dataset.stage = next;
    $$("[data-nav]").forEach((a) =>
      a.dataset.nav === next ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")
    );

    let timer = 0;
    const finish = () => {
      clearTimeout(timer);
      pending = null;
      if (from) {
        from.classList.remove("is-leaving");
        from.hidden = true;
        leave(prev);
      }
      $$(".room", roomMain).forEach((r) => (r.hidden = r.dataset.room !== next));
      to.hidden = false;
      if (section) toSection(section, false);
      else jump(() => scrollTo(0, 0));
      enter(next);
      if (focus) (section ? document.getElementById(section) : to).focus({ preventScroll: true });
    };

    if (!from || instant || calm()) return finish();
    from.classList.add("is-leaving");
    timer = setTimeout(finish, 250);
    pending = finish;
  }

  function enter(name) {
    if (name === "landing") Camera.start();
    if (name === "polaroid") polaroidReadyAt = performance.now() + 900;
    if (name === "home") requestParallax();
    if (name === "film") updateStripHint();
    const el = stageOf(name);
    paintFrames(el);
    watchReveals(el);
  }

  function leave(name) {
    if (name === "landing") Camera.stop();
  }

  function toSection(id, smooth) {
    const el = document.getElementById(id);
    if (!el) return;
    if (smooth && !calm()) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else jump(() => el.scrollIntoView({ block: "start" }));
  }

  /* ---------- the URL ---------- */

  function route({ initial = false } = {}) {
    const [head = "", id = ""] = location.hash.slice(1).split("/");
    const options = { instant: initial, focus: !initial };
    closeLightbox(true);

    if (ROOM_IDS.includes(head)) {
      show(head, options);
      const project = WORK[head].find((p) => p.id === id);
      if (project) openProject(project, initial);
      else closeProject();
      return;
    }
    closeProject(true);
    if (SECTIONS.includes(head)) {
      show("home", { ...options, section: head });
      // webfonts can reflow the page after a fresh load; land on the section once they're in
      if (initial && document.fonts) document.fonts.ready.then(() => current === "home" && toSection(head, false));
    } else if (head === "home") show("home", options);
    else if (head === "shot") show("polaroid", options);
    else show("landing", options);
  }

  /* ---------- landing: the shot ---------- */

  const flash = $(".flash");
  let firing = false;

  function shoot() {
    if (firing || current !== "landing") return;
    firing = true;
    Camera.setDisabled(true);
    if (!calm()) {
      flash.classList.remove("is-firing");
      void flash.offsetWidth; // restart the animation
      flash.classList.add("is-firing");
    }
    // the Polaroid gets its own history entry, so Back returns to the camera
    setTimeout(() => (location.hash = "shot"), calm() ? 0 : 220);
    setTimeout(() => {
      firing = false;
      Camera.setDisabled(false);
    }, 700);
  }

  /* ---------- polaroid: any nudge moves on ---------- */

  let polaroidReadyAt = 0;
  let touchY = null;
  const polaroidReady = () => current === "polaroid" && performance.now() > polaroidReadyAt;
  // replace rather than push: Back from home goes to the camera, not to the Polaroid again
  const leavePolaroid = () => {
    if (current === "polaroid") location.replace("#home");
  };

  addEventListener("wheel", (e) => e.deltaY > 0 && polaroidReady() && leavePolaroid(), { passive: true });
  addEventListener("touchstart", (e) => (touchY = e.touches[0].clientY), { passive: true });
  addEventListener(
    "touchmove",
    (e) => {
      if (touchY === null || touchY - e.touches[0].clientY < 40 || !polaroidReady()) return;
      touchY = null;
      leavePolaroid();
    },
    { passive: true }
  );
  addEventListener("keydown", (e) => {
    if (current !== "polaroid" || (e.target instanceof Element && e.target.closest("a, button"))) return;
    if (!["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) return;
    e.preventDefault();
    leavePolaroid();
  });

  /* ---------- home: room cards drift at their own rates ---------- */

  let parallaxQueued = false;

  function requestParallax() {
    if (parallaxQueued) return;
    parallaxQueued = true;
    requestAnimationFrame(parallax);
  }

  function parallax() {
    parallaxQueued = false;
    if (current !== "home") return;
    const vh = innerHeight;
    $$(".room-slot").forEach((slot, i) => {
      const card = slot.firstElementChild;
      if (calm()) {
        card.style.transform = card.style.opacity = "";
        return;
      }
      // the slot isn't transformed, so it gives a steady measurement for the card inside it
      const r = slot.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const y = 90 + i * 26 - (160 + i * 52) * p;
      const opacity = p < 0.22 ? p / 0.22 : p > 0.8 ? 1 - ((p - 0.8) / 0.2) * 0.75 : 1;
      const scale = p < 0.3 ? 0.94 + (p / 0.3) * 0.06 : 1 - ((p - 0.3) / 0.7) * 0.02;
      card.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
      card.style.opacity = opacity.toFixed(3);
    });
  }

  addEventListener("scroll", requestParallax, { passive: true });
  addEventListener("resize", requestParallax);

  /* ---------- film: drag the strip ---------- */

  function dragToScroll(track) {
    let id = null;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let speed = 0;
    let moved = 0;
    let dragging = false;
    let glide = 0;

    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(glide);
      id = e.pointerId;
      startX = lastX = e.clientX;
      startLeft = track.scrollLeft;
      lastT = e.timeStamp;
      speed = moved = 0;
      dragging = false;
    });

    track.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 5) {
        dragging = true;
        track.setPointerCapture(id);
        track.classList.add("is-dragging");
      }
      if (!dragging) return;
      moved = Math.max(moved, Math.abs(dx));
      track.scrollLeft = startLeft - dx;
      speed = (e.clientX - lastX) / Math.max(1, e.timeStamp - lastT);
      lastX = e.clientX;
      lastT = e.timeStamp;
    });

    const release = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      if (calm() || e.timeStamp - lastT > 80) return; // let go after stopping: no coast
      let v = -speed * 16; // px per frame
      const coast = () => {
        if (Math.abs(v) < 0.4) return;
        track.scrollLeft += v;
        v *= 0.94;
        glide = requestAnimationFrame(coast);
      };
      glide = requestAnimationFrame(coast);
    };
    track.addEventListener("pointerup", release);
    track.addEventListener("pointercancel", release);

    // a drag shouldn't open the frame it ended on
    track.addEventListener(
      "click",
      (e) => {
        if (moved > 5) {
          e.preventDefault();
          e.stopPropagation();
        }
        moved = 0;
      },
      true
    );
  }

  function updateStripHint() {
    const track = $("#film-track");
    $(".room--film").classList.toggle("is-scrollable", track.scrollWidth > track.clientWidth + 4);
  }

  /* ---------- photo lightbox: the plate grows into place ---------- */

  const lightbox = $("#lightbox");
  const lbPanel = $(".lightbox__panel");
  const lbMedia = $("#lightbox-media");
  const lbInfo = $(".lightbox__info");
  let lbPlate = null;
  let lbToken = 0;

  function openLightbox(index, plate) {
    const pl = PLATES[index];
    lbToken++;
    lbPlate = plate;
    lbPanel.getAnimations().forEach((a) => a.cancel());
    lightbox.classList.remove("is-closing");
    lbMedia.innerHTML = frameHTML(pl.series, pl.src, pl.ratio, `${pl.series.title}, photo ${pl.n}`, 1280);
    lbMedia.querySelector("img")?.setAttribute("loading", "eager");
    lbMedia.style.setProperty("--ratio", pl.ratio || 1);
    lbMedia.classList.toggle("is-natural", !pl.ratio);
    paintFrames(lbMedia, true);
    $("#lightbox-meta").textContent = `${pl.series.title} · ${pl.series.when}`;
    $("#lightbox-short").textContent = pl.series.short;
    $("#lightbox-series").href = `#photo/${pl.series.id}`;
    if (!lightbox.open) lightbox.showModal();
    if (!calm()) grow(plate, false);
  }

  /** FLIP: start the panel exactly over the plate, then let it settle. `back` reverses it. */
  function grow(plate, back) {
    const a = plate.getBoundingClientRect();
    const b = lbMedia.getBoundingClientRect();
    const box = lbPanel.getBoundingClientRect();
    const timing = { duration: back ? 380 : 520, easing: "cubic-bezier(.2, .8, .2, 1)", fill: back ? "forwards" : "none" };
    if (!a.width || !b.width || !b.height) {
      const shown = { opacity: 1, transform: "none" };
      const hidden = { opacity: 0, transform: "scale(.96)" };
      return lbPanel.animate(back ? [shown, hidden] : [hidden, shown], { ...timing, duration: 260 });
    }
    const transformOrigin = `${b.left - box.left}px ${b.top - box.top}px`;
    const over = {
      transformOrigin,
      transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`,
    };
    const settled = { transformOrigin, transform: "none" };
    lbInfo.animate(
      back ? [{ opacity: 1 }, { opacity: 0, offset: 0.3 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }],
      timing
    );
    return lbPanel.animate(back ? [settled, over] : [over, settled], timing);
  }

  function closeLightbox(instant = false) {
    if (!lightbox.open) return;
    const token = ++lbToken;
    const done = () => {
      if (token !== lbToken) return; // reopened in the meantime
      lightbox.close();
      lightbox.classList.remove("is-closing");
      lbPanel.getAnimations().forEach((a) => a.cancel());
      lbMedia.textContent = "";
    };
    if (instant || calm()) return done();
    lightbox.classList.add("is-closing");
    const r = lbPlate?.isConnected ? lbPlate.getBoundingClientRect() : null;
    const onScreen = r && r.bottom > 0 && r.top < innerHeight;
    grow(onScreen ? lbPlate : lbMedia, true).finished.then(done, done);
  }

  lightbox.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeLightbox();
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.closest("[data-dismiss]")) closeLightbox();
  });

  /* ---------- project pages ---------- */

  const projectDialog = $("#project");
  let projectFromLink = false; // opened straight from a shared URL: no history entry to go back to
  let dismissing = false;
  let projectTimer = 0;

  function openProject(p, fromLink = false) {
    projectFromLink = fromLink;
    dismissing = false;
    clearTimeout(projectTimer);
    projectDialog.classList.remove("is-closing");
    fillProject(p);
    if (!projectDialog.open) projectDialog.showModal();
    projectDialog.scrollTop = 0;
  }

  // Close buttons, Escape and the backdrop all land here. Going back through history
  // keeps the browser's back button in step with what's on screen.
  function dismissProject() {
    if (dismissing) return;
    dismissing = true;
    if (projectFromLink) {
      history.replaceState(null, "", "#" + current);
      route();
    } else history.back();
  }

  function closeProject(instant = false) {
    if (!projectDialog.open) return;
    const done = () => {
      projectDialog.close();
      projectDialog.classList.remove("is-closing");
      $("#project-content").textContent = ""; // stops any video
      // opened from a shared link, there was nothing focused to return to: land in the room
      if (document.activeElement === document.body) stageOf(current).focus({ preventScroll: true });
    };
    clearTimeout(projectTimer);
    if (instant || calm()) return done();
    projectDialog.classList.add("is-closing");
    projectTimer = setTimeout(done, 240);
  }

  projectDialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    dismissProject();
  });
  projectDialog.addEventListener("click", (e) => {
    if (e.target === projectDialog || e.target.closest("[data-dismiss]")) dismissProject();
  });

  function fillProject(p) {
    $("#project-meta").textContent = `${p.client} · ${p.when}`;
    $("#project-title").textContent = p.title;
    $("#project-chips").innerHTML = html`${(p.roles || p.tags || []).map((t) => html`<li>${t}</li>`)}`;
    const body = $("#project-body");
    body.textContent = p.body || "";
    body.hidden = !p.body;
    const content = $("#project-content");
    content.innerHTML = p.kind === "film" ? filmBody(p) : p.kind === "photo" ? photoBody(p) : p.study ? techBody(p) : "";
    paintFrames(content, true);
  }

  const note = (text) => (LOCAL ? html`<p class="dev-note">${text}</p>` : "");
  const youtubeId = (url) => (String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/) || [])[1];

  // film plays the video
  function filmBody(p) {
    if (p.video) {
      const id = youtubeId(p.video);
      return id
        ? html`<iframe class="project__video" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&amp;mute=1&amp;rel=0"
            title="${p.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
        : html`<video class="project__video" src="${p.video}" poster="${p.poster || ""}" autoplay muted loop controls playsinline></video>`;
    }
    return html`
      <div class="project__still">${frame(p, p.poster, 16 / 9, p.title, 960)}</div>
      ${note(html`Add the cut: set <b>video</b> on this project in js/data.js — a file in films/ or a YouTube link. It autoplays here.`)}`;
  }

  // photography opens the series
  function photoBody(p) {
    const real = p.shots?.length > 0;
    return html`
      <div class="project__grid">${(real ? p.shots : p.ratios).map(
        (s, i) => html`
          <div class="project__shot" style="${real ? "" : `aspect-ratio: ${s}`}">${frame(p, real ? s : null, real ? null : s, `${p.title}, photo ${i + 1}`)}</div>`
      )}</div>
      ${!real && note(html`Add the set: <b>shots: ['img/grad-01.jpg', …]</b> on this project in js/data.js.`)}`;
  }

  // tech shows the case study
  function techBody(p) {
    const s = p.study;
    const row = (title, content) => html`<div class="study__row"><h3 class="slate">${title}</h3>${content}</div>`;
    const screens = p.shots?.length ? p.shots : [null, null, null];
    return html`
      <div class="study">
        ${row("The problem", html`<p>${s.problem}</p>`)}
        ${row("My role", html`<p>${s.role}</p>`)}
        ${row("Process", html`<ol>${s.process.map((step) => html`<li>${step}</li>`)}</ol>`)}
        ${row("Where it stands", html`<p>${s.outcome}</p>`)}
      </div>
      <div class="project__grid">${screens.map(
        (src, i) => html`
          <div class="project__shot project__shot--screen">${frame(p, src, 4 / 3, src ? `${p.title}, screen ${i + 1}` : "")}</div>`
      )}</div>
      ${!p.shots?.length && note(html`Add screens: <b>shots: ['img/sage-home.png', …]</b> on this project in js/data.js.`)}`;
  }

  /* ---------- fade things up as they scroll in ---------- */

  const revealer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              e.target.classList.add("is-in");
              revealer.unobserve(e.target);
            }
          },
          { rootMargin: "0px 0px -60px 0px" }
        )
      : null;

  function watchReveals(root) {
    $$("[data-reveal]:not(.is-in)", root).forEach((el) => (revealer ? revealer.observe(el) : el.classList.add("is-in")));
  }

  /* ---------- contact: copy the address ---------- */

  $$("[data-copy]").forEach((btn) => {
    const label = btn.textContent;
    const status = $("#copy-status");
    let timer = 0;
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const t = Object.assign(document.createElement("textarea"), { value: text });
        t.style.cssText = "position: fixed; opacity: 0";
        document.body.append(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      btn.textContent = "Address copied";
      status.textContent = "Email address copied";
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = label;
        status.textContent = "";
      }, 2400);
    });
  });

  /* ---------- start ---------- */

  // stages pad themselves below the fixed header, whatever height it wraps to
  const header = $(".site-header");
  const measureHeader = () => document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
  if ("ResizeObserver" in window) new ResizeObserver(measureHeader).observe(header);
  measureHeader();

  renderRoomCards();
  renderFilm();
  renderPhoto();
  renderTech();
  dragToScroll($("#film-track"));
  Camera.init($("#cam"), $("#camera-stage"), { onShoot: shoot });

  $$("[data-shoot]").forEach((b) => b.addEventListener("click", shoot));
  $(".polaroid__card").addEventListener("click", leavePolaroid);
  $(".polaroid__next").addEventListener("click", (e) => {
    e.preventDefault();
    leavePolaroid();
  });
  $("#photo-masonry").addEventListener("click", (e) => {
    const plate = e.target.closest("[data-plate]");
    if (plate) openLightbox(Number(plate.dataset.plate), plate);
  });
  addEventListener("resize", () => current === "film" && updateStripHint());

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  addEventListener("hashchange", () => route());
  route({ initial: true });
  document.documentElement.classList.remove("deep-link");
  watchReveals(document);
})();
