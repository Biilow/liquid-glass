import { H, W, scene, sheen } from './svg'
import type { Preset } from './types'

export const paperTexture: Preset = {
  id: 'paper-texture',
  name: 'Paper texture',
  kind: 'svg',
  roles: { accent: '#a8642a', danger: '#c2413a', success: '#4e7d3a', warning: '#a86f14', pro: '#6d4f94' },
  light: {
    'surface-0': '#efe6d3',
    'surface-1': '#f4ecdc',
    'surface-2': '#faf5e9',
    'text-primary': '#2a241d',
    'text-secondary': '#544a3d',
    'text-muted': '#6a5f50',
  },
  dark: {
    'surface-0': '#1f1a15',
    'surface-1': '#28221b',
    'surface-2': '#312a22',
    'surface-3': '#3a3229',
    'text-primary': '#f0e7d7',
    'text-secondary': '#cfc4b2',
    'text-muted': '#aca08d',
  },
  minOpacity: 0.5,
  svg: motion => {
    const light = sheen(motion, 0.14)

    return scene({
      motion,
      defs:
        // The sheet's tooth: fine noise lit low from one side, kept as its shadows.
        '<filter id="tooth" x="0" y="0" width="100%" height="100%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/>' +
        '<feDiffuseLighting surfaceScale="0.9" diffuseConstant="1.1" lighting-color="#ffffff">' +
        '<feDistantLight azimuth="210" elevation="62"/></feDiffuseLighting>' +
        '<feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.1  -1.6 0 0 0 1.42"/></filter>' +
        // Long fibres pressed into it: noise stretched one way, only its peaks kept.
        '<filter id="fibre" x="0" y="0" width="100%" height="100%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.011 0.42" numOctaves="2" seed="19"/>' +
        '<feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.26  0 0 0 0 0.16  9 0 0 0 -5.5"/></filter>' +
        light.defs,
      style:
        '.sheet{fill:#f1e8d6}.tooth{opacity:0.55}.fibre{opacity:0.3}' +
        '@media (prefers-color-scheme: dark){.sheet{fill:#2a241d}.tooth{opacity:0.8}.fibre{opacity:0.5}}',
      animation: light.animation,
      body:
        `<rect class="sheet" width="${W}" height="${H}" fill="#f1e8d6"/>` +
        `<rect class="fibre" width="${W}" height="${H}" filter="url(#fibre)" opacity="0.3"/>` +
        `<rect class="tooth" width="${W}" height="${H}" filter="url(#tooth)" opacity="0.55"/>` +
        light.body,
    })
  },
}
