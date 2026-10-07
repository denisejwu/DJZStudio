# DJZ Studios — interactive portfolio

Plain HTML, CSS and JavaScript. No framework, no build step, no npm packages.

## Run it

Double-click `index.html`, or serve the folder so it behaves exactly like the
live site:

    python -m http.server 8000        # then open http://localhost:8000

(VS Code's Live Server extension works too.) Notes about missing media appear
in project pages only when you run it locally; visitors never see them.

## How it flows

    landing   A 3D DSLR built from CSS layers. Click the lens.
      v       shutter flash
    polaroid  A Polaroid ejects and develops: "Get to know my world."    #shot
      v       scroll, swipe, or click
    home      three drifting room cards - Film, Photography, Tech       #home
              then About, Studio, and Contact on the same scroll        #about …
      v
    film      a draggable film strip, hover reveals the detail          #film
    photo     masonry gallery, click a photo to enlarge it              #photo
    tech      floating case-study cards                                 #tech

Any project opens as a page over the room: film plays the video, photography
shows the series, tech shows problem / role / process / outcome. Projects
have their own links too, e.g. `#tech/sage` — handy to send someone.

## Adding your work

All project content is in `js/data.js`. Put images in `img/` and video in
`films/`, then fill in:

    poster: 'img/half-past-10.jpg'
    video:  'films/cut.mp4'          (or a YouTube URL - it detects both)
    shots:  ['img/grad-01.jpg', ...]

Leave a field empty and a frame is drawn for it, so the site looks finished
before any photos exist. If a path is wrong, the drawn frame shows instead of
a broken image.

## Structure

    index.html          every page section; About, Studio and Contact copy
    css/style.css       all styles; color tokens at the top under :root
    js/data.js          all project content
    js/frame.js         procedural frame art for anything without a photo
    js/camera.js        the CSS 3D camera and the WebGL lens shader
    js/main.js          stages, links, rooms, project pages, lightbox
    img/                images (the logo lives here)
    logo/               original logo exports - not published

## Things to fill in yourself

1. `img/denise.jpg` — a photo of you working. In `index.html`, swap the
   placeholder `<svg>` in the About section for the `<img>` line in the
   comment just above it.
2. The three plan cards in the Studio section of `index.html`, marked
   EDIT THESE THREE. Your ambition in your own words beats mine.
3. Instagram and YouTube in the Contact section of `index.html` are hidden
   until the real profile URLs are in: add them, then delete `hidden`.
4. Real stills and cuts, via `js/data.js`.

## Deploy

Pushing to `main` publishes the site to GitHub Pages
(`.github/workflows/deploy.yml`). One-time setup: in the repo on GitHub, go to
Settings → Pages and set Source to "GitHub Actions". All paths are relative,
so it works at `denisejwu.github.io/DJZStudio/` with no configuration.
