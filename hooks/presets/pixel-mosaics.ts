import { H, W, scene } from './svg'
import type { Preset } from './types'

// Pools of color the tiles take theirs from: where, how big, color by mode.
const POOLS = [
  { x: 240, y: 200, r: 620, light: '#6fd3c8', dark: '#12615c' },
  { x: 1340, y: 240, r: 600, light: '#ff9fb6', dark: '#8a2850' },
  { x: 820, y: 620, r: 560, light: '#ffd27a', dark: '#8a5a12' },
  { x: 1400, y: 880, r: 520, light: '#9aa8ff', dark: '#2a3490' },
  { x: 200, y: 900, r: 500, light: '#c59bf5', dark: '#4b2a8a' },
] as const

const TILE = 30

export const pixelMosaics: Preset = {
  id: 'pixel-mosaics',
  name: 'Pixel mosaics',
  kind: 'shader',
  roles: { accent: '#1f8a84', danger: '#c2413a', success: '#3f8a4a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#e3ecec',
    'surface-1': '#ebf2f2',
    'surface-2': '#f5f9f9',
    'text-primary': '#172728',
    'text-secondary': '#3b4f50',
    'text-muted': '#536768',
  },
  dark: {
    'surface-0': '#101c1e',
    'surface-1': '#152426',
    'surface-2': '#1b2d2f',
    'surface-3': '#213638',
    'text-primary': '#e7f3f3',
    'text-secondary': '#bdd3d3',
    'text-muted': '#97b2b2',
  },
  minOpacity: 0.6,
  // The shader cuts this picture into tiles. Held still, a check of the same
  // pitch stands in for them.
  svg: motion =>
    scene({
      motion,
      defs:
        POOLS.map(
          (p, i) =>
            `<radialGradient id="m${i}"><stop class="m${i}" offset="0" stop-color="${p.light}"/>` +
            `<stop class="m${i}" offset="1" stop-color="${p.light}" stop-opacity="0"/></radialGradient>`,
        ).join('') +
        (motion === 'still'
          ? `<pattern id="tiles" width="${TILE * 2}" height="${TILE * 2}" patternUnits="userSpaceOnUse">` +
            `<rect width="${TILE}" height="${TILE}" fill="#ffffff" opacity="0.1"/>` +
            `<rect x="${TILE}" y="${TILE}" width="${TILE}" height="${TILE}" fill="#000000" opacity="0.07"/>` +
            `<path d="M0 0H${TILE * 2}M0 ${TILE}H${TILE * 2}M0 0V${TILE * 2}M${TILE} 0V${TILE * 2}" stroke="#000000" stroke-opacity="0.12" stroke-width="1.5"/></pattern>`
          : ''),
      style:
        '.wall{fill:#eaf3f1}@media (prefers-color-scheme: dark){.wall{fill:#0e1a1c}' +
        POOLS.map((p, i) => `.m${i}{stop-color:${p.dark}}`).join('') +
        '}',
      body:
        `<rect class="wall" width="${W}" height="${H}" fill="#eaf3f1"/>` +
        POOLS.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="url(#m${i})"/>`).join('') +
        (motion === 'still' ? `<rect width="${W}" height="${H}" fill="url(#tiles)"/>` : ''),
    }),
}
