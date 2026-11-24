import { H, W, scene, sheen } from './svg'
import type { Preset } from './types'

export const feltTexture: Preset = {
  id: 'felt-texture',
  name: 'Felt texture',
  kind: 'svg',
  roles: { accent: '#3f8a5a', danger: '#c2413a', success: '#2f7d6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#e3ebe1',
    'surface-1': '#ebf1e9',
    'surface-2': '#f5f8f4',
    'text-primary': '#1c2a20',
    'text-secondary': '#3f5244',
    'text-muted': '#566a5b',
  },
  dark: {
    'surface-0': '#14211a',
    'surface-1': '#1a2a21',
    'surface-2': '#203228',
    'surface-3': '#263a2f',
    'text-primary': '#e8f2ea',
    'text-secondary': '#c0d3c4',
    'text-muted': '#9ab3a0',
  },
  minOpacity: 0.55,
  svg: motion => {
    const light = sheen(motion, 0.16)

    return scene({
      motion,
      defs:
        // Matted fibres: noise lit from one side, kept as the shadows alone.
        '<filter id="felt" x="0" y="0" width="100%" height="100%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.7 0.95" numOctaves="3" seed="11"/>' +
        '<feDiffuseLighting surfaceScale="1.7" diffuseConstant="1.1" lighting-color="#ffffff">' +
        '<feDistantLight azimuth="225" elevation="56"/></feDiffuseLighting>' +
        '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.5 0 0 0 1.3"/></filter>' +
        light.defs,
      style: '.cloth{fill:#a9c2a4}.nap{opacity:0.5}@media (prefers-color-scheme: dark){.cloth{fill:#1f3a2c}.nap{opacity:0.75}}',
      animation: light.animation,
      body:
        `<rect class="cloth" width="${W}" height="${H}" fill="#a9c2a4"/>` +
        `<rect class="nap" width="${W}" height="${H}" filter="url(#felt)" opacity="0.5"/>` +
        light.body,
    })
  },
}
