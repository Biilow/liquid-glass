import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

const PITCH = 28
const DOT = 7

export const squareDotGrids: Preset = {
  id: 'square-dot-grids',
  name: 'Square-dot grids',
  kind: 'svg',
  roles: { accent: '#4a55d6', danger: '#c2413a', success: '#2f8a6a', warning: '#b5771a', pro: '#8a52c0' },
  light: {
    'surface-0': '#e6e7f3',
    'surface-1': '#edeef7',
    'surface-2': '#f6f6fb',
    'text-primary': '#1c1e36',
    'text-secondary': '#424566',
    'text-muted': '#5a5d7f',
  },
  dark: {
    'surface-0': '#11132a',
    'surface-1': '#171a33',
    'surface-2': '#1e213d',
    'surface-3': '#252847',
    'text-primary': '#ecedfb',
    'text-secondary': '#c3c6e4',
    'text-muted': '#9da1c6',
  },
  minOpacity: 0.55,
  svg: motion =>
    scene({
      motion,
      defs:
        `<pattern id="dots" width="${PITCH}" height="${PITCH}" patternUnits="userSpaceOnUse">` +
        `<rect class="dot" x="${(PITCH - DOT) / 2}" y="${(PITCH - DOT) / 2}" width="${DOT}" height="${DOT}" rx="1.5"/></pattern>` +
        // The dots thin out with height: full at the foot, almost gone at the top.
        '<linearGradient id="rise" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.06"/>' +
        '<stop offset="0.55" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="1" stop-color="#ffffff" stop-opacity="1"/></linearGradient>' +
        `<mask id="height"><rect width="${W}" height="${H}" fill="url(#rise)"/></mask>` +
        '<radialGradient id="glow" cx="0.5" cy="1" r="0.9"><stop class="lit" offset="0" stop-color="#8a93ff" stop-opacity="0.35"/>' +
        '<stop class="lit" offset="1" stop-color="#8a93ff" stop-opacity="0"/></radialGradient>',
      style:
        '.ground{fill:#eef0f8}.dot{fill:#4a55d6}' +
        '@media (prefers-color-scheme: dark){.ground{fill:#0e1020}.dot{fill:#9aa3ff}.lit{stop-color:#4a55d6}}',
      // One pitch of climb, so the loop has no seam.
      animation:
        `@keyframes climb{to{transform:translateY(${-PITCH}px)}}` +
        `.field{animation:climb ${pace(motion, 12, 5)}s linear infinite}`,
      body:
        `<rect class="ground" width="${W}" height="${H}" fill="#eef0f8"/>` +
        `<rect width="${W}" height="${H}" fill="url(#glow)"/>` +
        `<g mask="url(#height)"><rect class="field" width="${W}" height="${H + PITCH}" fill="url(#dots)"/></g>`,
    }),
}
