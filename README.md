# DJZ Studios — interactive portfolio

React + Vite + Tailwind v4, Three.js via React Three Fiber, Framer Motion.

## Run it

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build into dist/

## How it flows

    landing   3D DSLR. The lens is clickable; a shader runs inside it.
      v       click -> shutter flash
    polaroid  a Polaroid ejects and develops: "Get to know my world."
      v       scroll to explore
    home      three scroll-parallax cards - Film, Photography, Tech
              then About, Studio, and Contact on the same scroll
      v
    film      horizontal draggable film strip, hover reveals info
    photo     masonry gallery, click to zoom (shared-layout lightbox)
    tech      floating cards with UI/UX / Figma / Frontend / Backend tags

Any project opens a full page: film plays, photography shows the series,
tech shows problem / role / process / outcome.

## Adding your work

Everything lives in `src/data/projects.js`. Put files in `public/`, then:

    poster: 'img/half-past-10.jpg'
    video:  'films/cut.mp4'          (or a YouTube URL - it detects both)
    shots:  ['img/grad-01.jpg', ...]

Leave a field empty and a frame is generated procedurally for it, so the
site looks finished before any photos exist.

## Structure

    src/
      App.jsx                  stage machine + flash + header
      data/projects.js         all content
      components/
        Landing.jsx            identity block + canvas, lights, shadows
        CameraRig.jsx          the DSLR + lens shader
        PolaroidCard.jsx       develop animation
        ScrollCards.jsx        parallax room cards
        FilmSection.jsx        the strip
        PhotoSection.jsx       masonry + lightbox
        TechSection.jsx        floating case-study cards
        ProjectPage.jsx        video / gallery / case study
        About.jsx              portrait slot + capability rail
        Studio.jsx             what DJZ is for: Now / Next / Long game
        Contact.jsx            mailto buttons, copy address, socials
        Frame.jsx              procedural frame art

## Things to fill in yourself

1. `public/img/denise.jpg` — a photo of you working. Swap the placeholder
   `<svg>` in About.jsx for the `<img>` line commented directly above it.
2. The three plan cards in Studio.jsx — they're marked EDIT THESE THREE.
   Your ambition in your own words beats mine.
3. GitHub / Instagram / YouTube URLs in Contact.jsx.
4. Real stills and cuts, via src/data/projects.js.

## Notes

- The camera is built from Three.js primitives, so there is no asset
  pipeline. For a photoreal body, drop a .glb in public/ and swap the
  primitives in CameraRig.jsx for `useGLTF`.
- Reduced motion is respected globally.
- Deploy: `npm run build`, then push `dist/` anywhere static
  (Vercel, Netlify, GitHub Pages).
