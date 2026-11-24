import { H, W, scene } from './svg'
import type { Preset } from './types'

// Held still, the map draws its own lines: rings around three hills.
const HILLS = [
  { x: 420, y: 360, r: 70, rings: 7, wobble: 0.16 },
  { x: 1180, y: 620, r: 80, rings: 8, wobble: 0.2 },
  { x: 1420, y: 180, r: 60, rings: 4, wobble: 0.12 },
] as const

const ring = (hill: (typeof HILLS)[number], n: number): string => {
  const radius = hill.r * (n + 1)
  let path = ''

  for (let step = 0; step <= 48; step++) {
    const turn = (step / 48) * Math.PI * 2
    const reach = radius * (1 + hill.wobble * Math.sin(turn * 3 + n * 0.5) + hill.wobble * 0.5 * Math.cos(turn * 5 - n))

    path += `${step === 0 ? 'M' : 'L'}${Math.round(hill.x + Math.cos(turn) * reach)} ${Math.round(hill.y + Math.sin(turn) * reach * 0.8)}`
  }

  return `${path}Z`
}

export const contourLines: Preset = {
  id: 'contour-lines',
  name: 'Contour lines',
  kind: 'shader',
  roles: { accent: '#2f8a6f', danger: '#c2413a', success: '#3f8a4a', warning: '#b5771a', pro: '#6a6cc8' },
  light: {
    'surface-0': '#e4ece6',
    'surface-1': '#ecf2ed',
    'surface-2': '#f5f9f6',
    'text-primary': '#182a22',
    'text-secondary': '#3c5248',
    'text-muted': '#546a5f',
  },
  dark: {
    'surface-0': '#0f1f1b',
    'surface-1': '#142722',
    'surface-2': '#1a302a',
    'surface-3': '#203932',
    'text-primary': '#e6f4ee',
    'text-secondary': '#bcd6cc',
    'text-muted': '#96b5a9',
  },
  minOpacity: 0.55,
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="map" x1="0" y1="0" x2="1" y2="1"><stop class="a" offset="0" stop-color="#e3efe2"/>' +
        '<stop class="b" offset="1" stop-color="#c3ddd2"/></linearGradient>',
      style:
        '.iso{stroke:#4f8f7a;opacity:0.55}' +
        '@media (prefers-color-scheme: dark){.a{stop-color:#0f2a25}.b{stop-color:#163d3a}.iso{stroke:#7fd0b5;opacity:0.4}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#map)"/>` +
        (motion === 'still'
          ? '<g fill="none" stroke-width="2.5">' +
            HILLS.map(hill => Array.from({ length: hill.rings }, (_, n) => `<path class="iso" d="${ring(hill, n)}"/>`).join('')).join('') +
            '</g>'
          : ''),
    }),
}
