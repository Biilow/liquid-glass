import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

// The picture was drawn 1344 by 752; it is laid over the scene a little
// larger than the scene, bottom edges together, so the ridges can drift
// sideways without showing an end.
const SCALE = 1.4
const PLACE = `translate(${Math.round((W - 1344 * SCALE) / 2)} ${Math.round(H - 752 * SCALE)}) scale(${SCALE})`

// Ridges from far to near, each with its colour by day and by night.
const RIDGES = [
  { light: '#9ccbce', dark: '#24484f', d: 'M0 261 C37 249 57 235 91 233 C131 232 149 215 186 204 C224 192 249 208 281 223 C308 236 324 228 352 242 C385 258 403 270 436 273 C472 278 490 270 521 278 C555 285 582 304 620 305 C666 308 708 276 749 279 C790 280 816 294 847 299 C884 306 900 318 942 314 C984 311 1007 295 1034 290 C1062 285 1088 298 1122 291 C1163 282 1187 265 1221 270 C1263 276 1286 291 1344 279 L1344 752 H0Z' },
  { light: '#89bdc3', dark: '#1f4047', d: 'M0 360 C36 359 63 365 85 364 C164 357 243 318 329 310 C415 301 447 319 511 337 C587 360 643 372 718 371 C804 372 878 374 960 379 L1344 410 V752 H0Z' },
  { light: '#78b0b9', dark: '#1a383f', d: 'M0 440 C159 434 274 430 395 420 C461 415 509 418 567 406 C632 392 658 378 718 370 C781 356 839 322 881 319 C920 316 981 336 1040 351 C1087 363 1113 369 1153 366 C1216 360 1263 355 1344 370 V752 H0Z' },
  { light: '#629fa9', dark: '#163137', d: 'M0 435 C82 411 171 374 258 376 C344 375 428 400 510 419 C617 440 743 479 841 477 C923 476 1030 433 1131 413 C1209 398 1270 395 1344 407 V752 H0Z' },
  { light: '#4a8b95', dark: '#122a30', d: 'M0 559 C116 545 233 497 354 473 C477 449 569 462 650 476 C779 498 946 549 1055 541 C1153 533 1254 527 1344 534 V752 H0Z' },
  { light: '#3a7b84', dark: '#0e2329', d: 'M0 655 C180 645 334 637 484 636 C662 639 811 591 975 559 C1112 532 1221 516 1344 522 V752 H0Z' },
  { light: '#2a6870', dark: '#0a1c21', d: 'M0 604 C145 575 265 593 369 612 C534 643 656 674 803 695 C978 722 1170 736 1344 732 V752 H0Z' },
] as const

const BIRDS = ['M548 115 Q565 108 577 124 Q590 109 605 115 Q589 110 577 126 Q563 113 548 115Z', 'M456 139 Q466 136 474 145 Q481 137 490 139', 'M506 168 Q515 165 522 173 Q528 165 537 168']

export const singleHueLandscapes: Preset = {
  id: 'single-hue-landscapes',
  name: 'Single-hue landscapes',
  kind: 'svg',
  roles: { accent: '#2f7f8c', danger: '#c2413a', success: '#2f8a6a', warning: '#b5771a', pro: '#6a5cc8' },
  light: {
    'surface-0': '#dfeceb',
    'surface-1': '#e8f2f1',
    'surface-2': '#f3f8f8',
    'text-primary': '#12292d',
    'text-secondary': '#38504f',
    'text-muted': '#506866',
  },
  dark: {
    'surface-0': '#0c1b1f',
    'surface-1': '#11242a',
    'surface-2': '#172d33',
    'surface-3': '#1d363d',
    'text-primary': '#e6f4f2',
    'text-secondary': '#bcd6d3',
    'text-muted': '#96b5b2',
  },
  minOpacity: 0.55,
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="sky" x1="0" y1="0" x2="0.8" y2="1"><stop class="hi" offset="0" stop-color="#a2cccf"/>' +
        '<stop class="lo" offset="1" stop-color="#d1eae6"/></linearGradient>' +
        '<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop class="orb" offset="0" stop-color="#e7f6ee" stop-opacity="0.94"/>' +
        '<stop class="orb" offset="1" stop-color="#def1e9" stop-opacity="0.08"/></linearGradient>',
      style:
        RIDGES.map((r, i) => `.r${i}{fill:${r.light}}`).join('') +
        '.bird{fill:none;stroke:#6faab3;stroke-width:1.8;stroke-linecap:round}' +
        '@media (prefers-color-scheme: dark){.hi{stop-color:#0a181c}.lo{stop-color:#163038}.orb{stop-color:#cfe6e2}.bird{stroke:#3f6a71}' +
        RIDGES.map((r, i) => `.r${i}{fill:${r.dark}}`).join('') +
        '}',
      // Each ridge sways a little and comes back; the near ones go further, which reads as depth.
      animation:
        RIDGES.map((_, i) => `@keyframes s${i}{to{transform:translateX(${(i + 1) * (motion === 'lively' ? -12 : -7)}px)}}`).join('') +
        RIDGES.map((_, i) => `.r${i}{animation:s${i} ${pace(motion, 70, 34)}s ease-in-out infinite alternate}`).join('') +
        `@keyframes fly{to{transform:translate(60px,-14px)}}.birds{animation:fly ${pace(motion, 90, 45)}s ease-in-out infinite alternate}`,
      body:
        `<rect width="${W}" height="${H}" fill="url(#sky)"/>` +
        `<g transform="${PLACE}"><circle cx="948" cy="258" r="124" fill="url(#sun)"/>` +
        `<g class="birds">${BIRDS.map(d => `<path class="bird" d="${d}"/>`).join('')}</g>` +
        RIDGES.map((r, i) => `<path class="r${i}" d="${r.d}" fill="${r.light}"/>`).join('') +
        '</g>',
    }),
}
