import { H, W, scene } from './svg'
import type { Preset } from './types'

/** A rib's width in the viewBox; the shader's ribs are 44 points wide too. */
const RIB = 44

export const flutedGlass: Preset = {
  id: 'fluted-glass',
  name: 'Fluted glass',
  kind: 'shader',
  roles: { accent: '#4a63d0', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#8a52c0' },
  light: {
    'surface-0': '#e4e6f4',
    'surface-1': '#ecedf8',
    'surface-2': '#f6f6fc',
    'text-primary': '#1f2138',
    'text-secondary': '#45486a',
    'text-muted': '#5c5f82',
  },
  dark: {
    'surface-0': '#151830',
    'surface-1': '#1b1f3a',
    'surface-2': '#232744',
    'surface-3': '#2a2f4f',
    'text-primary': '#eceefa',
    'text-secondary': '#c4c8e2',
    'text-muted': '#9fa4c4',
  },
  minOpacity: 0.55,
  // The shader bends this picture through its ribs. Held still, the picture
  // draws its own ribs, since no shader plays over it.
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">' +
        '<stop class="a" offset="0" stop-color="#a8c8ff"/><stop class="b" offset="1" stop-color="#ffc2d9"/></linearGradient>' +
        '<radialGradient id="warm"><stop class="c" offset="0" stop-color="#ffe2b8"/>' +
        '<stop class="c" offset="1" stop-color="#ffe2b8" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="cool"><stop class="d" offset="0" stop-color="#b9a8ff"/>' +
        '<stop class="d" offset="1" stop-color="#b9a8ff" stop-opacity="0"/></radialGradient>' +
        (motion === 'still'
          ? '<linearGradient id="rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>' +
            '<stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.14"/></linearGradient>' +
            `<pattern id="ribs" width="${RIB}" height="${H}" patternUnits="userSpaceOnUse"><rect width="${RIB}" height="${H}" fill="url(#rib)"/></pattern>`
          : ''),
      style:
        '@media (prefers-color-scheme: dark){.a{stop-color:#1d3a8a}.b{stop-color:#7a2456}.c{stop-color:#a8572a}.d{stop-color:#3b2a9a}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#wash)"/>` +
        '<circle cx="420" cy="760" r="520" fill="url(#warm)"/>' +
        '<circle cx="1180" cy="260" r="560" fill="url(#cool)"/>' +
        (motion === 'still' ? `<rect width="${W}" height="${H}" fill="url(#ribs)"/>` : ''),
    }),
}
