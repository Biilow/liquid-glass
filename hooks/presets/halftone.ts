import { H, W, scene } from './svg'
import type { Preset } from './types'

export const halftone: Preset = {
  id: 'halftone',
  name: 'Halftone',
  kind: 'shader',
  roles: { accent: '#c2572f', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#efe6dc',
    'surface-1': '#f4ede5',
    'surface-2': '#faf6f1',
    'text-primary': '#2a2019',
    'text-secondary': '#54463a',
    'text-muted': '#6b5c4f',
  },
  dark: {
    'surface-0': '#1c1613',
    'surface-1': '#241d19',
    'surface-2': '#2c241f',
    'surface-3': '#342b25',
    'text-primary': '#f3ebe4',
    'text-secondary': '#d3c6ba',
    'text-muted': '#b0a194',
  },
  minOpacity: 0.6,
  // The shader prints its dots over this wash. Held still, the picture prints
  // its own, since no shader plays over it.
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="wash" x1="0" y1="0" x2="1" y2="1"><stop class="a" offset="0" stop-color="#ffd9b8"/>' +
        '<stop class="b" offset="0.55" stop-color="#ff9d7a"/><stop class="c" offset="1" stop-color="#f06a6a"/></linearGradient>' +
        (motion === 'still'
          ? '<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
            '<circle class="ink" cx="11" cy="11" r="7.5"/></pattern>' +
            '<linearGradient id="fade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.05"/>' +
            '<stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>' +
            `<mask id="more"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>`
          : ''),
      style:
        '.ink{fill:#b8442f;opacity:0.5}' +
        '@media (prefers-color-scheme: dark){.a{stop-color:#3a1c22}.b{stop-color:#5a2420}.c{stop-color:#7a3418}.ink{fill:#ffb089;opacity:0.4}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#wash)"/>` +
        (motion === 'still' ? `<rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#more)"/>` : ''),
    }),
}
