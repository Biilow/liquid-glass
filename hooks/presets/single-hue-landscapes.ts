import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

// Ridges from far to near: where each sits, how tall, its three waves (whole
// turns a screen, so two screens of it meet without a seam), and its color.
const RIDGES = [
  { base: 540, tall: 70, waves: [1, 2, 5], shift: 0.4, light: '#9db6dc', dark: '#1d3358' },
  { base: 630, tall: 62, waves: [2, 3, 7], shift: 1.9, light: '#7f9dcd', dark: '#192c4d' },
  { base: 720, tall: 55, waves: [1, 3, 6], shift: 3.1, light: '#6283bb', dark: '#152542' },
  { base: 810, tall: 46, waves: [2, 5, 8], shift: 4.4, light: '#4a6aa3', dark: '#111e37' },
  { base: 900, tall: 36, waves: [3, 4, 9], shift: 5.6, light: '#36528a', dark: '#0d172c' },
] as const

const outline = (ridge: (typeof RIDGES)[number]): string => {
  const [a, b, c] = ridge.waves
  let path = `M0 ${H}`

  for (let x = 0; x <= W * 2; x += 40) {
    const turn = (x / W) * Math.PI * 2
    const lift =
      Math.sin(turn * a + ridge.shift) * 0.6 + Math.sin(turn * b + ridge.shift * 2) * 0.3 + Math.sin(turn * c + ridge.shift * 3) * 0.1

    path += `L${x} ${Math.round(ridge.base + ridge.tall * lift)}`
  }

  return `${path}L${W * 2} ${H}Z`
}

export const singleHueLandscapes: Preset = {
  id: 'single-hue-landscapes',
  name: 'Single-hue landscapes',
  kind: 'svg',
  roles: { accent: '#3a66b8', danger: '#c2413a', success: '#2f8a6a', warning: '#b5771a', pro: '#6a5cc8' },
  light: {
    'surface-0': '#e0e8f4',
    'surface-1': '#e9eff8',
    'surface-2': '#f4f7fc',
    'text-primary': '#16233a',
    'text-secondary': '#3b4a64',
    'text-muted': '#53627c',
  },
  dark: {
    'surface-0': '#0e1728',
    'surface-1': '#131e33',
    'surface-2': '#19263d',
    'surface-3': '#1f2d47',
    'text-primary': '#e9f0fc',
    'text-secondary': '#c0cde6',
    'text-muted': '#9aabcb',
  },
  minOpacity: 0.55,
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop class="hi" offset="0" stop-color="#dfe9f7"/>' +
        '<stop class="lo" offset="1" stop-color="#b9cdea"/></linearGradient>' +
        '<radialGradient id="halo"><stop class="orb" offset="0" stop-color="#ffffff" stop-opacity="0.9"/>' +
        '<stop class="orb" offset="0.28" stop-color="#ffffff" stop-opacity="0.85"/>' +
        '<stop class="orb" offset="0.3" stop-color="#ffffff" stop-opacity="0.3"/>' +
        '<stop class="orb" offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>',
      style:
        RIDGES.map((r, i) => `.r${i}{fill:${r.light}}`).join('') +
        '@media (prefers-color-scheme: dark){.hi{stop-color:#0b1426}.lo{stop-color:#162744}.orb{stop-color:#c9d8f5}' +
        RIDGES.map((r, i) => `.r${i}{fill:${r.dark}}`).join('') +
        '}',
      // Each ridge slides one screen and starts again; the near ones go faster.
      animation:
        `@keyframes slide{to{transform:translateX(${-W}px)}}` +
        RIDGES.map((_, i) => `.r${i}{animation:slide ${pace(motion, 260 - i * 40, 130 - i * 20)}s linear infinite}`).join(''),
      body:
        `<rect width="${W}" height="${H}" fill="url(#sky)"/>` +
        '<circle cx="1160" cy="330" r="300" fill="url(#halo)"/>' +
        RIDGES.map((r, i) => `<path class="r${i}" d="${outline(r)}" fill="${r.light}"/>`).join(''),
    }),
}
