import { H, W, scene } from './svg'
import type { Preset } from './types'

export const stippledGradients: Preset = {
  id: 'stippled-gradients',
  name: 'Stippled gradients',
  kind: 'shader',
  roles: { accent: '#3d6fb8', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#e9e7e1',
    'surface-1': '#f0eee9',
    'surface-2': '#f8f7f3',
    'text-primary': '#22211d',
    'text-secondary': '#4a4841',
    'text-muted': '#615f57',
  },
  dark: {
    'surface-0': '#15161a',
    'surface-1': '#1b1d22',
    'surface-2': '#22242a',
    'surface-3': '#292b32',
    'text-primary': '#eeeef0',
    'text-secondary': '#c7c8cd',
    'text-muted': '#a2a4ab',
  },
  minOpacity: 0.55,
  // The shader pricks its dots over this wash. Held still, a grain cut to
  // its peaks stands in, thick at one corner and thin at the other.
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="wash" x1="0" y1="0" x2="1" y2="1"><stop class="a" offset="0" stop-color="#f4f1e8"/>' +
        '<stop class="b" offset="1" stop-color="#d9e2ee"/></linearGradient>' +
        (motion === 'still'
          ? '<filter id="prick" x="0" y="0" width="100%" height="100%">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="1" seed="12"/>' +
            '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -7.6" result="peaks"/>' +
            '<feFlood class="dot" flood-color="#26241f"/><feComposite in2="peaks" operator="in"/></filter>' +
            '<linearGradient id="fade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.05"/>' +
            '<stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>' +
            `<mask id="more"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>`
          : ''),
      style:
        '.ink{opacity:0.8}' +
        '@media (prefers-color-scheme: dark){.a{stop-color:#14161c}.b{stop-color:#1f2a3c}.ink{opacity:0.7}.dot{flood-color:#e9ecf2}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#wash)"/>` +
        (motion === 'still' ? `<g class="ink" mask="url(#more)"><rect width="${W}" height="${H}" filter="url(#prick)"/></g>` : ''),
    }),
}
