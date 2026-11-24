export interface CinemaChapter {
  id: string;
  index: string;
  tabLabel: string;
  title: string;
  caption: string;
  videoSrc: string;
  posterSrc: string;
  timecode: string;
  specs: string;
}

export const CINEMA_CHAPTERS: CinemaChapter[] = [
  {
    id: 'links-dusk',
    index: 'I',
    tabLabel: 'I · Coastal Links',
    title: 'Twilight Over the 7th Fairway',
    caption:
      'Rolling Pacific sea mist drifts across fescue-rimmed cathedral bunkers as golden hour settles into twilight.',
    videoSrc: '/videos/hero-links.mp4',
    posterSrc: '/images/hero-links.jpg',
    timecode: '00:00 — 00:24',
    specs: 'ARRI 35MM ANAMORPHIC · MONTEREY BLUFFS',
  },
  {
    id: 'impact-lab',
    index: 'II',
    tabLabel: 'II · 1,000-FPS Forge',
    title: 'Sub-Millisecond Impact Telemetry',
    caption:
      'High-speed optical tracking captures clubhead closure, turf interaction, and spin-loft at 1,000 frames per second.',
    videoSrc: '/videos/swing-impact.mp4',
    posterSrc: '/images/swing-impact.jpg',
    timecode: '00:24 — 00:48',
    specs: 'PHANTOM FLEX 4K · TOUR BIOMECHANICS LAB',
  },
  {
    id: 'monolith-dusk',
    index: 'III',
    tabLabel: 'III · The Monolith',
    title: 'Dusk at the 18th Pavilion',
    caption:
      'Board-formed concrete, smoked walnut, and warm hearth light overlooking the 18th bentgrass green.',
    videoSrc: '/videos/clubhouse-dusk.mp4',
    posterSrc: '/images/clubhouse-dusk.jpg',
    timecode: '00:48 — 01:12',
    specs: 'ARCHITECTURAL STUDY · 14 PRIVATE SUITES',
  },
];
