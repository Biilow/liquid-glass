import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

const FINE = 16
const BOLD = 80

export const blueprintGrids: Preset = {
  id: 'blueprint-grids',
  name: 'Blueprint grids',
  kind: 'svg',
  roles: { accent: '#2f67c8', danger: '#c2413a', success: '#2f8a6a', warning: '#b5771a', pro: '#6a5cc8' },
  light: {
    'surface-0': '#dfe8f4',
    'surface-1': '#e8eff8',
    'surface-2': '#f3f7fc',
    'text-primary': '#14233d',
    'text-secondary': '#3a4a66',
    'text-muted': '#52627d',
  },
  dark: {
    'surface-0': '#0d1f44',
    'surface-1': '#12284f',
    'surface-2': '#18305b',
    'surface-3': '#1e3866',
    'text-primary': '#eaf1ff',
    'text-secondary': '#c1cfee',
    'text-muted': '#9dafd6',
  },
  minOpacity: 0.6,
  svg: motion => {
    let fine = ''

    for (let at = FINE; at < BOLD; at += FINE) {
      fine += `M${at} 0V${BOLD}M0 ${at}H${BOLD}`
    }

    return scene({
      motion,
      defs:
        `<pattern id="grid" width="${BOLD}" height="${BOLD}" patternUnits="userSpaceOnUse">` +
        `<path class="line" d="${fine}" fill="none" stroke="#3f6fb5" stroke-width="1" opacity="0.28"/>` +
        `<path class="line" d="M0 0H${BOLD}M0 0V${BOLD}" fill="none" stroke="#3f6fb5" stroke-width="2" opacity="0.55"/>` +
        '</pattern>' +
        '<radialGradient id="glow" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>' +
        '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>',
      style:
        '.ground{fill:#dce8f6}' +
        '@media (prefers-color-scheme: dark){.ground{fill:#0f3470}.line{stroke:#cfe0ff}}',
      // One bold square of travel, so the loop has no seam.
      animation:
        `@keyframes pan{to{transform:translate(${BOLD}px,${BOLD}px)}}` +
        `.sheet{animation:pan ${pace(motion, 90, 45)}s linear infinite}`,
      body:
        `<rect class="ground" width="${W}" height="${H}" fill="#dce8f6"/>` +
        `<rect class="sheet" x="${-BOLD}" y="${-BOLD}" width="${W + BOLD}" height="${H + BOLD}" fill="url(#grid)"/>` +
        `<rect width="${W}" height="${H}" fill="url(#glow)"/>`,
    })
  },
}
