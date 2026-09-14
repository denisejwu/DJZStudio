# DJZ Studios — project brief

Context for whoever (or whatever) works on this next. Read this before
changing anything.

---

## Who this is for

Denise Wu Mendez. CS student at UC San Diego (B.S., June 2027), based in
San Diego. She shoots film, photographs portraits and events, designs
products, and writes code. DJZ Studios is the name she puts on that work.

This site is **a portfolio, not a résumé**. Résumé and experience content was
deliberately removed — do not add education sections, work history, skills
lists, or a CV download. The site exists to show the work and get her a
conversation.

**The audience is a recruiter with about six seconds.** Every decision should
be judged against: does this help someone decide, fast, that she's worth a
longer look?

---

## The pitch it has to land

The risk with four disciplines is reading as scattered. The site answers
that with one line, which appears on the landing:

> **Hire me for one craft — or for the handoff between them.**

Supporting idea, on the About rail: each craft stands on its own, and they
connect when a project calls for it. **Do not** rewrite this as "I do
everything" or draw the four crafts as a single fixed pipeline — she
explicitly rejected that framing as overclaiming.

---

## Look and feel

Light, warm, premium. Never a dark theme — that was rejected twice.

Tokens live in `src/index.css` under `@theme`. Use them; don't hardcode hex.

| Token | Use |
|---|---|
| `parchment` `cream` `sand` `linen` | backgrounds, cards |
| `ink` `body` | text — `body` is the readable brown for paragraphs |
| `gold` `goldlite` `golddeep` | brand metal, accents, small caps labels |
| `film` (clay red) | anything Film |
| `photo` (amber) | anything Photography |
| `tech` (emerald) | anything Tech |
| `art` (plum) | anything Design/Art |
| `stock` | dark film-stock backgrounds |

- Type: **Fraunces** display, **Space Grotesk** body, **JetBrains Mono** for
  small-caps labels (`.slate`).
- Body text is 17px minimum. She found earlier versions hard to read — do not
  shrink type to fit more in.
- Motion should be cinematic and calm: soft glows, gentle depth, slow drifts.
  No bouncing, no aggressive parallax.
- `prefers-reduced-motion` is respected globally. Keep it that way.

### Brand palette (supplied 2026-09-12, not yet applied)

The official DJZ palette. Once applied it replaces the brown/parchment
neutrals above; until then `index.css` still holds the old values.

| Hex | Name | Proposed role | Contrast on `#f8f4ee` |
|---|---|---|---|
| `#f8f4ee` | warm off-white | page ground → `parchment` | — |
| `#2a3b36` | green-slate | text → `ink` / `body` | 10.8 : 1 |
| `#1f4c4c` | deep teal | primary accent: links, buttons, focus ring | 8.7 : 1 |

- Gold stays the brand metal: the logo and small metallic details only.
  `gold` (`#b98a25`) is 2.85 : 1 on the ground, so never use it for
  body-size text. Use `golddeep` (6.05 : 1) when text needs to be gold.
- The two dark colors are for text and accents, **never** page backgrounds.
  The light-theme rule above still stands.
- **Open decision:** `#1f4c4c` and the `tech` emerald `#0f6b52` are only
  1.48 : 1 apart, so a teal primary accent would swallow Tech's color
  coding. Either Tech adopts the teal, or Tech moves to a clearly distinct
  hue. Ask Denise before applying.
- Moving text from warm brown to green-slate cools the site. Check that it
  still reads as warm and premium once applied.
- About 20 hex values are hardcoded in components (gradients, Three.js
  materials, film-strip darks). Move them onto tokens when applying the
  palette.

---

## The logo

`public/img/djz-logo.png` — gold DJZ monogram with an aperture in the D, film
strip through the J, circuit traces in the Z. Background is already keyed out.

Never put it on a black box or dark plate — that was tried and rejected. To
make it read on cream, use a warm radial halo behind it plus this filter:

```
saturate(1.16) contrast(1.1) brightness(.93)
drop-shadow(0 0 .7px rgba(58,36,8,.9))
drop-shadow(0 16px 26px rgba(122,86,16,.3))
```

Source files in `logo/`: **none are actually transparent.** `djz-logo.png`
is on solid white; `circle-logo.png` and the screenshot are on solid black.
The `A….png` files are AVIFs with a `.png` extension and no alpha channel
(`A4efec…` and its `(1)` copy are identical). The only transparent asset is
`public/img/djz-logo.png`, and it is the monogram **without** the
"FILM · PHOTO · TECH · ART" tagline. A transparent version with the tagline
still has to be produced. Keying the black-background export gives the
cleanest edges.

---

## Structure

```
landing   3D DSLR (Three.js primitives). Lens is clickable, runs a GLSL
          shader: breathing aperture, circuit traces, design grid, pixels.
          Above it: availability pill, her name, the four roles.
          Below it: the pitch line and four craft chips.
   |      click the lens -> shutter flash
polaroid  a Polaroid ejects and develops -> "Get to know my world."
   |
home      three parallax room cards (Film / Photography / Tech)
          then About, Studio, Contact on the same scroll
   |
film      draggable horizontal film strip, hover reveals detail
photo     masonry gallery, click zooms via shared layout
tech      floating case-study cards tagged UI/UX / Figma / Frontend / Backend
```

Any project opens `ProjectPage.jsx`, which renders differently by kind:
film **plays the video**, photo **opens the series**, tech **shows the case
study** (problem / role / process / outcome).

---

## Content rules

All content is in `src/data/projects.js`. Real work only:

- **Half Past 10 — Concept Video** · Litto Media, UCSD · Jan–Jul 2026 ·
  producer, videographer, lighting, sound
- **Graduation Portraits** · independent · ongoing
- **Event Photography** · independent · ongoing
- **Sage / Auriele** · language app under DJZ — reading, writing, grammar,
  speaking in one curriculum; she does research, UI, and code
- **This portfolio** · the site itself as a tech case study

Do not invent projects, clients, metrics, or awards. If a field is unknown,
leave it out rather than filling it in.

`Frame.jsx` generates procedural artwork for anything without a real image,
so the site always looks finished. As real files land in `public/`, they take
over automatically — keep this fallback working.

---

## Contact

Email only. **No form, no backend, no third-party form service** — all
removed deliberately. Plain `mailto:` links with pre-filled subjects, a copy
button, and social links. Address: `dwumendez@ucsd.edu`.

---

## Task queue

1. **Deploy to GitHub Pages** at `denisejwu.github.io/DJZStudio`. Needs
   `base: '/DJZStudio/'` in `vite.config.js` and a Pages Actions workflow.
   Verify the logo and other `public/` assets still resolve under the
   subpath.
2. **Real portrait** — swap the placeholder `<svg>` in `About.jsx` for
   `<img src="img/denise.jpg">`. The comment marking the spot is already
   there. A photo of her *working* is wanted, not a headshot.
3. **Real project media** — poster images, the Half Past 10 cut, graduation
   and event photos, Sage screens. Fields are `poster`, `video`, `shots`.
4. **Studio plan cards** — the three Now / Next / Long game cards in
   `Studio.jsx` are placeholders, marked `EDIT THESE THREE`. Replace with her
   wording when she supplies it. Don't invent ambition on her behalf.
5. **Social URLs** — GitHub, Instagram, YouTube in `Contact.jsx` are
   placeholder links. LinkedIn is real.
6. **Mobile pass** — check the landing on a phone. The camera canvas plus the
   identity block is a lot of vertical space; the reading order must stay
   name → availability → pitch → crafts → camera.
7. **Apply the brand palette.** See "Brand palette" under Look and feel.
   Blocked on the Tech-color decision.

## Later, only when there's real work for it

A PIN-gated "work I can't post yet" section was designed and then switched
off, because the only entries were placeholders. Bring it back **only** when
she has a genuine client project awaiting sign-off. If rebuilt, encrypt the
content (AES-GCM + PBKDF2) rather than comparing a PIN string in JS, and
never put anything under NDA on the site at all — embedded media is fetchable
by URL regardless of any gate.

---

## Standing rules

- Ask before adding a dependency. The stack is React, Vite, Tailwind v4,
  three / @react-three/fiber / drei, framer-motion. Nothing else is needed.
- Don't commit `node_modules` or `dist` — `.gitignore` covers both.
- Run `npm run build` before pushing; it should compile with no errors.
- If something can't be done without a file or an account she has to supply,
  say so plainly and tell her exactly what's needed. Don't work around it
  with fake data.
