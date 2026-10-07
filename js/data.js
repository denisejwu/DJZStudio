/**
 * Every project on the site lives here.
 *
 * Add real media by filling in these fields. Until you do, each item renders
 * a procedurally generated frame (js/frame.js), so nothing is ever a broken image.
 *
 *   poster : 'img/half-past-10.jpg'      cover image
 *   video  : 'films/cut.mp4'  or a YouTube URL
 *   shots  : ['img/a.jpg', 'img/b.jpg']  gallery + case-study screens
 *
 * Paths are relative to index.html: put images in img/ and video in films/.
 */

const FILM = [
  {
    id: "half-past-10",
    title: "Half Past 10 — Concept Video",
    client: "Litto Media, UCSD",
    when: "Jan – Jul 2026",
    roles: ["Producer", "Videographer", "Lighting", "Sound"],
    short: "A quarter-long concept video, from first idea to final cut.",
    body: "A concept video for the Half Past 10 dance club. I shaped the creative concept from scratch, secured the filming locations, shot it, and ran lighting and sound on set through to the finished cut.",
    poster: null,
    video: null,
    palette: ["#7C3A1E", "#D98B45", "#F3DCC0"],
    kind: "film",
  },
];

const PHOTO = [
  {
    id: "grad-portraits",
    title: "Graduation Portraits",
    client: "Independent",
    when: "Ongoing",
    roles: ["Portraiture", "Natural light", "Lightroom"],
    short: "Sessions built around the light, finished frame by frame.",
    body: "Portrait sessions for graduating students — planning the shoot around the light, directing people who aren't used to being photographed, and finishing every frame in Lightroom and Photoshop before delivery.",
    shots: [],
    palette: ["#9A6416", "#F0CE8E", "#FCF3E2"],
    kind: "photo",
    ratios: [1.3, 0.75, 1, 1.4, 0.8, 1.1],
  },
  {
    id: "events",
    title: "Event Photography",
    client: "Independent",
    when: "Ongoing",
    roles: ["Events", "Fast turnaround", "Editing"],
    short: "Full-day coverage, edited and delivered on a short clock.",
    body: "Covering events end to end: shot planning ahead of the day, shooting through it, then editing and delivering a finished set on a short turnaround.",
    shots: [],
    palette: ["#5F6544", "#CFC38F", "#F7EEDC"],
    kind: "photo",
    ratios: [0.8, 1.25, 1, 0.9, 1.5, 1],
  },
];

const TECH = [
  {
    id: "sage",
    title: "Sage / Auriele",
    client: "DJZ Studios",
    when: "Jul 2026 – Present",
    tags: ["UI/UX", "Figma", "Frontend", "Backend"],
    short: "Reading, writing, grammar, and speaking in one curriculum.",
    study: {
      problem:
        "Learners juggle a different app for every skill — one for vocabulary, another for grammar, a third for speaking. Nothing carries progress across them.",
      role: "Founder, sole designer and developer. Research, UI, front-end and back-end.",
      process: [
        "Ran user research and surveys to find where learners drop off",
        "Wireframed a single loop covering all four skills",
        "Prototyped the lesson flow in Figma",
        "Built the front-end and back-end for interactive lessons",
      ],
      outcome:
        "In active build — the first end-to-end curriculum loop is designed and lesson delivery is working.",
    },
    shots: [],
    palette: ["#163E3E", "#5E9E9A", "#E3EFEE"],
    kind: "tech",
  },
  {
    id: "portfolio",
    title: "This Portfolio",
    client: "Design + build",
    when: "2026",
    tags: ["UI/UX", "Frontend", "WebGL", "Motion"],
    short: "A 3D camera you click to open the site.",
    study: {
      problem:
        "Four disciplines can read as unfocused. The landing had to make range look deliberate before anyone reads a word.",
      role: "Design and build — plain HTML, CSS, and JavaScript, no framework.",
      process: [
        "Built a DSLR from layered CSS 3D transforms, with a clickable lens",
        "Wrote a WebGL shader for the lens: circuits, grid, and pixel blocks",
        "Built the reveal as a developing Polaroid",
        "Split the work into three scroll-triggered rooms — film, photo, tech",
      ],
      outcome:
        "A portfolio where the interaction itself is a work sample.",
    },
    shots: [],
    palette: ["#1F4C4C", "#70AEA9", "#E8F2F1"],
    kind: "tech",
  },
];

const ROOMS = [
  {
    id: "film",
    label: "Film",
    n: "01",
    accent: "var(--film)",
    heading: "Concept to final cut",
    blurb:
      "Concept development, locations, videography, on-set lighting and sound, and the edit.",
    count: FILM.length,
  },
  {
    id: "photo",
    label: "Photography",
    n: "02",
    accent: "var(--photo)",
    heading: "Stills that hold up",
    blurb:
      "Portrait and event work, planned around the light and finished in Lightroom and Photoshop.",
    count: PHOTO.length,
  },
  {
    id: "tech",
    label: "Tech",
    n: "03",
    accent: "var(--tech)",
    heading: "Design and build",
    blurb:
      "UX research and Figma prototyping through to front-end and back-end code.",
    count: TECH.length,
  },
];

const ALL = [...FILM, ...PHOTO, ...TECH];
