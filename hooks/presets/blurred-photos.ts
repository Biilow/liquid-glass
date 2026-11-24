import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

// Our own six colours: a dusk shoreline, read as a photo far out of focus.
const OWN = ['#e8a87c', '#d96c6c', '#6b8fc4', '#2f4a7a', '#f2d3a0', '#7fb4a8'] as const

// Where each of the six fields rests, how big, and how far it drifts.
const FIELDS = [
  { x: 240, y: 180, r: 700, dx: 120, dy: 70 },
  { x: 1300, y: 140, r: 640, dx: -110, dy: 90 },
  { x: 800, y: 520, r: 760, dx: 80, dy: -100 },
  { x: 1420, y: 820, r: 620, dx: -130, dy: -60 },
  { x: 220, y: 880, r: 660, dx: 120, dy: -80 },
  { x: 820, y: 1040, r: 560, dx: -90, dy: -70 },
] as const

export const blurredPhotos: Preset = {
  id: 'blurred-photos',
  name: 'Blurred photos',
  kind: 'svg',
  roles: { accent: '#3f6fb0', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#e6e4e8',
    'surface-1': '#eeecf0',
    'surface-2': '#f7f6f8',
    'text-primary': '#22242c',
    'text-secondary': '#484b58',
    'text-muted': '#5f6270',
  },
  dark: {
    'surface-0': '#16181f',
    'surface-1': '#1d2029',
    'surface-2': '#252833',
    'surface-3': '#2c303c',
    'text-primary': '#eceef4',
    'text-secondary': '#c5c8d4',
    'text-muted': '#a0a4b2',
  },
  minOpacity: 0.5,
  // `wash` is six colours read from the person's own photo (Photo wash).
  svg: (motion, wash) => {
    const colours = wash !== undefined && wash.length === FIELDS.length ? wash : OWN
    const gradients = FIELDS.map(
      (_, i) =>
        `<radialGradient id="f${i}"><stop offset="0" stop-color="${colours[i]}"/>` +
        `<stop offset="1" stop-color="${colours[i]}" stop-opacity="0"/></radialGradient>`,
    ).join('')
    const drift = FIELDS.map((f, i) => {
      const reach = motion === 'lively' ? 1.5 : 1

      return (
        `@keyframes p${i}{to{transform:translate(${Math.round(f.dx * reach)}px,${Math.round(f.dy * reach)}px)}}` +
        `.f${i}{animation:p${i} ${pace(motion, 70 + i * 6, 34 + i * 4)}s ease-in-out infinite alternate}`
      )
    }).join('')

    return scene({
      motion,
      defs: gradients,
      // The photo keeps its colours in both modes; dark mode dims it instead.
      style: '.dim{opacity:0}@media (prefers-color-scheme: dark){.dim{opacity:0.5}}',
      animation: drift,
      body:
        `<rect width="${W}" height="${H}" fill="${colours[3]}"/>` +
        FIELDS.map((f, i) => `<circle class="f${i}" cx="${f.x}" cy="${f.y}" r="${f.r}" fill="url(#f${i})"/>`).join('') +
        `<rect class="dim" width="${W}" height="${H}" fill="#05060a" opacity="0"/>`,
    })
  },
}
