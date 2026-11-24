import { H, W, scene } from './svg'
import type { Preset } from './types'

export const ditheredImages: Preset = {
  id: 'dithered-images',
  name: 'Dithered images',
  kind: 'shader',
  roles: { accent: '#6a5fd0', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#a04fb0' },
  light: {
    'surface-0': '#e6e3f1',
    'surface-1': '#edebf6',
    'surface-2': '#f6f5fb',
    'text-primary': '#201d33',
    'text-secondary': '#474361',
    'text-muted': '#5f5b7a',
  },
  dark: {
    'surface-0': '#12101f',
    'surface-1': '#181628',
    'surface-2': '#1f1c32',
    'surface-3': '#26223c',
    'text-primary': '#edebf9',
    'text-secondary': '#c6c2de',
    'text-muted': '#a09cbd',
  },
  minOpacity: 0.6,
  // A moon over a horizon. The shader breaks it into a few flat tones with a
  // dither; held still, a fine check stands in for that.
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop class="hi" offset="0" stop-color="#b9b4ea"/>' +
        '<stop class="mid" offset="0.62" stop-color="#f0c9d8"/><stop class="lo" offset="1" stop-color="#ffe6c4"/></linearGradient>' +
        '<radialGradient id="halo"><stop class="orb" offset="0" stop-color="#ffffff"/><stop class="orb" offset="0.33" stop-color="#ffffff"/>' +
        '<stop class="orb" offset="0.36" stop-color="#ffffff" stop-opacity="0.35"/><stop class="orb" offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>' +
        (motion === 'still'
          ? '<pattern id="check" width="6" height="6" patternUnits="userSpaceOnUse"><rect class="ink" width="3" height="3"/>' +
            '<rect class="ink" x="3" y="3" width="3" height="3"/></pattern>'
          : ''),
      style:
        '.land{fill:#7d74c2}.far{fill:#a199da}.ink{fill:#2a2350;opacity:0.14}' +
        '@media (prefers-color-scheme: dark){.hi{stop-color:#0a0818}.mid{stop-color:#241a4a}.lo{stop-color:#4a2a66}' +
        '.orb{stop-color:#f1e9ff}.land{fill:#0d0a1e}.far{fill:#1a1436}.ink{fill:#ffffff;opacity:0.08}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#dusk)"/>` +
        '<circle cx="1080" cy="360" r="420" fill="url(#halo)"/>' +
        `<path class="far" d="M0 760 Q260 640 520 720 T1040 700 T1600 740 V${H} H0Z"/>` +
        `<path class="land" d="M0 860 Q300 760 620 840 T1200 820 T1600 870 V${H} H0Z"/>` +
        (motion === 'still' ? `<rect width="${W}" height="${H}" fill="url(#check)"/>` : ''),
    }),
}
