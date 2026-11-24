import { H, W, scene, sheen } from './svg'
import type { Preset } from './types'

// Specks: noise cut off high, so only its peaks show, in the color given.
const specks = (id: string, tone: number, frequency: number, seed: number, cut: number): string =>
  `<filter id="${id}" x="0" y="0" width="100%" height="100%">` +
  `<feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="2" seed="${seed}"/>` +
  `<feColorMatrix values="0 0 0 0 ${tone}  0 0 0 0 ${tone}  0 0 0 0 ${tone}  10 0 0 0 ${cut}"/></filter>`

export const speckledGraphite: Preset = {
  id: 'speckled-graphite',
  name: 'Speckled graphite',
  kind: 'svg',
  roles: { accent: '#5a6f96', danger: '#c2413a', success: '#3f8a6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#e4e5e7',
    'surface-1': '#ecedef',
    'surface-2': '#f6f6f7',
    'text-primary': '#1e2024',
    'text-secondary': '#44474e',
    'text-muted': '#5c5f67',
  },
  dark: {
    'surface-0': '#17181b',
    'surface-1': '#1e1f23',
    'surface-2': '#25272b',
    'surface-3': '#2c2e33',
    'text-primary': '#eeeff1',
    'text-secondary': '#c6c8cd',
    'text-muted': '#a1a4ab',
  },
  minOpacity: 0.5,
  svg: motion => {
    const light = sheen(motion, 0.12)

    return scene({
      motion,
      defs: specks('pale', 1, 0.6, 3, -6.3) + specks('dark', 0, 0.75, 8, -6.2) + specks('dust', 0.5, 1.4, 5, -5.4) + light.defs,
      style:
        '.slab{fill:#d3d4d7}.pale{opacity:0.7}.dark{opacity:0.45}' +
        '@media (prefers-color-scheme: dark){.slab{fill:#1d1e21}.pale{opacity:0.4}.dark{opacity:0.7}}',
      animation: light.animation,
      body:
        `<rect class="slab" width="${W}" height="${H}" fill="#d3d4d7"/>` +
        `<rect width="${W}" height="${H}" filter="url(#dust)" opacity="0.3"/>` +
        `<rect class="dark" width="${W}" height="${H}" filter="url(#dark)" opacity="0.45"/>` +
        `<rect class="pale" width="${W}" height="${H}" filter="url(#pale)" opacity="0.7"/>` +
        light.body,
    })
  },
}
