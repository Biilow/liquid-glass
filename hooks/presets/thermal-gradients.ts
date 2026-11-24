import { H, W, scene } from './svg'
import type { Preset } from './types'

// Pools of heat, coolest first so the hot ones lie on top: where, how big, color by mode.
const POOLS = [
  { x: 1300, y: 800, r: 620, light: '#8f6fe0', dark: '#4b22a8' },
  { x: 260, y: 240, r: 600, light: '#ee6a9c', dark: '#b0246a' },
  { x: 980, y: 300, r: 520, light: '#ff9a4d', dark: '#d9481c' },
  { x: 520, y: 760, r: 460, light: '#ffd66b', dark: '#f2a81d' },
  { x: 1420, y: 160, r: 340, light: '#fff0b0', dark: '#ffd65a' },
] as const

export const thermalGradients: Preset = {
  id: 'thermal-gradients',
  name: 'Thermal gradients',
  kind: 'shader',
  roles: { accent: '#c2507a', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#f0e2ea',
    'surface-1': '#f5eaf0',
    'surface-2': '#fbf4f7',
    'text-primary': '#2b1c2a',
    'text-secondary': '#574256',
    'text-muted': '#6e586c',
  },
  dark: {
    'surface-0': '#1b1024',
    'surface-1': '#22162d',
    'surface-2': '#2a1c36',
    'surface-3': '#32223f',
    'text-primary': '#f3e8f4',
    'text-secondary': '#d2c0d5',
    'text-muted': '#ae9bb2',
  },
  minOpacity: 0.6,
  // The shader stirs this picture and warms it under the pointer.
  svg: motion =>
    scene({
      motion,
      defs: POOLS.map(
        (p, i) =>
          `<radialGradient id="h${i}"><stop class="h${i}" offset="0" stop-color="${p.light}"/>` +
          `<stop class="h${i}" offset="1" stop-color="${p.light}" stop-opacity="0"/></radialGradient>`,
      ).join(''),
      style:
        '.cold{fill:#d9c8f2}@media (prefers-color-scheme: dark){.cold{fill:#1a0b3a}' +
        POOLS.map((p, i) => `.h${i}{stop-color:${p.dark}}`).join('') +
        '}',
      body:
        `<rect class="cold" width="${W}" height="${H}" fill="#d9c8f2"/>` +
        POOLS.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="url(#h${i})"/>`).join(''),
    }),
}
