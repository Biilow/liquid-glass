import { H, W, scene } from './svg'
import type { Preset } from './types'

const PITCH = 64

export const lensDistortion: Preset = {
  id: 'lens-distortion',
  name: 'Lens distortion',
  kind: 'shader',
  roles: { accent: '#c2507a', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#ece3ee',
    'surface-1': '#f2ebf3',
    'surface-2': '#f9f5fa',
    'text-primary': '#271d2c',
    'text-secondary': '#4f4257',
    'text-muted': '#67596f',
  },
  dark: {
    'surface-0': '#17111f',
    'surface-1': '#1e1727',
    'surface-2': '#251d30',
    'surface-3': '#2c2339',
    'text-primary': '#f0e9f6',
    'text-secondary': '#cdc1d8',
    'text-muted': '#a99cb5',
  },
  minOpacity: 0.6,
  // A ruled sheet over a wash. The shader looks at it through a slow fisheye;
  // held still, the sheet lies flat.
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="wash" x1="0" y1="0" x2="1" y2="1"><stop class="a" offset="0" stop-color="#ffc9dd"/>' +
        '<stop class="b" offset="0.5" stop-color="#d8c4ff"/><stop class="c" offset="1" stop-color="#b4e0ff"/></linearGradient>' +
        `<pattern id="rule" width="${PITCH}" height="${PITCH}" patternUnits="userSpaceOnUse">` +
        `<path class="line" d="M0 0H${PITCH}M0 0V${PITCH}" fill="none" stroke-width="3"/></pattern>`,
      style:
        '.line{stroke:#ffffff;opacity:0.7}' +
        '@media (prefers-color-scheme: dark){.a{stop-color:#5a1f4a}.b{stop-color:#2e2270}.c{stop-color:#0f3a66}.line{stroke:#e6dcff;opacity:0.4}}',
      body: `<rect width="${W}" height="${H}" fill="url(#wash)"/><rect width="${W}" height="${H}" fill="url(#rule)"/>`,
    }),
}
