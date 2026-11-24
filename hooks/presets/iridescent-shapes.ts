import { H, W, scene } from './svg'
import type { Preset } from './types'

// Held still, three ribbons of film cross the sheet: their paths.
const RIBBONS = [
  'M-100 300 C300 120 620 460 900 300 S1400 140 1700 320',
  'M-100 520 C260 700 600 360 920 540 S1380 720 1700 500',
  'M-100 760 C320 600 640 900 960 740 S1420 600 1700 780',
] as const

export const iridescentShapes: Preset = {
  id: 'iridescent-shapes',
  name: 'Iridescent shapes',
  kind: 'shader',
  roles: { accent: '#7a5fd0', danger: '#c2413a', success: '#2f8a7a', warning: '#b5771a', pro: '#b04f9a' },
  light: {
    'surface-0': '#e9e7f1',
    'surface-1': '#f0eef6',
    'surface-2': '#f8f7fb',
    'text-primary': '#211f30',
    'text-secondary': '#484560',
    'text-muted': '#605d79',
  },
  dark: {
    'surface-0': '#111019',
    'surface-1': '#171621',
    'surface-2': '#1e1c2a',
    'surface-3': '#252333',
    'text-primary': '#eeedf7',
    'text-secondary': '#c8c5dc',
    'text-muted': '#a3a0bb',
  },
  minOpacity: 0.6,
  svg: motion =>
    scene({
      motion,
      defs:
        '<linearGradient id="pearl" x1="0" y1="0" x2="1" y2="1"><stop class="a" offset="0" stop-color="#f6f4fb"/>' +
        '<stop class="b" offset="1" stop-color="#e6e9f6"/></linearGradient>' +
        (motion === 'still'
          ? '<linearGradient id="film" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9ecb"/><stop offset="0.25" stop-color="#ffd58a"/>' +
            '<stop offset="0.5" stop-color="#8ef0c9"/><stop offset="0.75" stop-color="#8ab8ff"/><stop offset="1" stop-color="#d59bff"/></linearGradient>' +
            '<filter id="soft" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>'
          : ''),
      style: '.film{opacity:0.75}@media (prefers-color-scheme: dark){.a{stop-color:#0c0b14}.b{stop-color:#16142a}.film{opacity:0.6}}',
      body:
        `<rect width="${W}" height="${H}" fill="url(#pearl)"/>` +
        (motion === 'still'
          ? '<g class="film" filter="url(#soft)" fill="none" stroke="url(#film)" stroke-width="120" stroke-linecap="round">' +
            RIBBONS.map(d => `<path d="${d}"/>`).join('') +
            '</g>'
          : ''),
    }),
}
