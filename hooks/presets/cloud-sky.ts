import { H, W, scene } from './svg'
import type { Preset } from './types'

// Held still, the sky keeps a few clouds of its own: where, how wide, how tall.
const CLOUDS = [
  { x: 320, y: 260, w: 420, h: 150 },
  { x: 620, y: 330, w: 320, h: 120 },
  { x: 1180, y: 200, w: 480, h: 160 },
  { x: 1420, y: 520, w: 360, h: 130 },
  { x: 300, y: 700, w: 520, h: 170 },
  { x: 940, y: 760, w: 400, h: 140 },
] as const

export const cloudSky: Preset = {
  id: 'cloud-sky',
  name: 'Cloud sky',
  kind: 'shader',
  roles: { accent: '#2f78c8', danger: '#c2413a', success: '#2f8a6a', warning: '#b5771a', pro: '#6a5cc8' },
  light: {
    'surface-0': '#dfeaf6',
    'surface-1': '#e8f0f9',
    'surface-2': '#f3f7fc',
    'text-primary': '#14253a',
    'text-secondary': '#394c64',
    'text-muted': '#51647c',
  },
  dark: {
    'surface-0': '#0c1626',
    'surface-1': '#111d31',
    'surface-2': '#17253c',
    'surface-3': '#1d2d47',
    'text-primary': '#e8f0fb',
    'text-secondary': '#bfcee4',
    'text-muted': '#99abc8',
  },
  minOpacity: 0.55,
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="air" x1="0" y1="0" x2="0" y2="1"><stop class="hi" offset="0" stop-color="#5fa3ea"/>' +
        '<stop class="lo" offset="1" stop-color="#bfe0fb"/></linearGradient>' +
        '<radialGradient id="puff"><stop class="c" offset="0" stop-color="#ffffff" stop-opacity="0.95"/>' +
        '<stop class="c" offset="0.6" stop-color="#ffffff" stop-opacity="0.6"/><stop class="c" offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>',
      style: '@media (prefers-color-scheme: dark){.hi{stop-color:#071226}.lo{stop-color:#1b3358}.c{stop-color:#8aa3cc}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#air)"/>` +
        (motion === 'still'
          ? CLOUDS.map(c => `<ellipse cx="${c.x}" cy="${c.y}" rx="${c.w / 2}" ry="${c.h / 2}" fill="url(#puff)"/>`).join('')
          : ''),
    }),
}
