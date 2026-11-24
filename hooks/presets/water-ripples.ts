import { H, W, scene } from './svg'
import type { Preset } from './types'

// Soft patches of light on the pool floor: where, how big.
const LIGHTS = [
  { x: 300, y: 240, r: 420 },
  { x: 1240, y: 320, r: 520 },
  { x: 760, y: 760, r: 480 },
  { x: 1460, y: 880, r: 360 },
  { x: 120, y: 820, r: 340 },
] as const

export const waterRipples: Preset = {
  id: 'water-ripples',
  name: 'Water ripples',
  kind: 'shader',
  roles: { accent: '#17808a', danger: '#c2413a', success: '#2f8a5a', warning: '#b5771a', pro: '#6a6cc8' },
  light: {
    'surface-0': '#dcecec',
    'surface-1': '#e6f2f2',
    'surface-2': '#f2f9f9',
    'text-primary': '#12292c',
    'text-secondary': '#35504f',
    'text-muted': '#4d6867',
  },
  dark: {
    'surface-0': '#0b2226',
    'surface-1': '#102a2f',
    'surface-2': '#163338',
    'surface-3': '#1c3c42',
    'text-primary': '#e6f5f4',
    'text-secondary': '#bcd8d6',
    'text-muted': '#97b8b6',
  },
  minOpacity: 0.55,
  // The shader sways this picture and sends a ring through it on a press.
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="pool" x1="0" y1="0" x2="0.4" y2="1">' +
        '<stop class="top" offset="0" stop-color="#bfe9e4"/><stop class="deep" offset="1" stop-color="#7fcfd0"/></linearGradient>' +
        '<radialGradient id="light"><stop class="lit" offset="0" stop-color="#f4fffb" stop-opacity="0.7"/>' +
        '<stop class="lit" offset="1" stop-color="#f4fffb" stop-opacity="0"/></radialGradient>',
      style: '@media (prefers-color-scheme: dark){.top{stop-color:#0e5a63}.deep{stop-color:#06343c}.lit{stop-color:#3fb7b4}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#pool)"/>` +
        LIGHTS.map(l => `<circle cx="${l.x}" cy="${l.y}" r="${l.r}" fill="url(#light)" opacity="0.55"/>`).join(''),
    }),
}
