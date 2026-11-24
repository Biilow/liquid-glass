import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

// Five soft blobs: where each rests, how big, its color by mode, how far it drifts.
const BLOBS = [
  { x: 280, y: 220, r: 620, light: '#ffb38a', dark: '#b4502e', dx: 160, dy: 90 },
  { x: 1320, y: 180, r: 560, light: '#f58fb4', dark: '#8e2f63', dx: -140, dy: 120 },
  { x: 820, y: 620, r: 680, light: '#c9a4f5', dark: '#4b2c8f', dx: 110, dy: -130 },
  { x: 1380, y: 860, r: 540, light: '#ffd9a0', dark: '#7a4a1c', dx: -170, dy: -80 },
  { x: 180, y: 900, r: 520, light: '#9db8ff', dark: '#253a86', dx: 150, dy: -110 },
] as const

export const grainyGradients: Preset = {
  id: 'grainy-gradients',
  name: 'Grainy gradients',
  kind: 'svg',
  roles: { accent: '#b0528f', danger: '#c2413a', success: '#4d8a55', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#efe2e8',
    'surface-1': '#f5eaef',
    'surface-2': '#fbf4f7',
    'text-primary': '#2a1f2b',
    'text-secondary': '#554557',
    'text-muted': '#6b5a6d',
  },
  dark: {
    'surface-0': '#1c1620',
    'surface-1': '#241d29',
    'surface-2': '#2c2432',
    'surface-3': '#332a3a',
    'text-primary': '#f1e8f2',
    'text-secondary': '#cfc2d2',
    'text-muted': '#ab9dae',
  },
  minOpacity: 0.5,
  svg: motion => {
    const gradients = BLOBS.map(
      (b, i) =>
        `<radialGradient id="g${i}"><stop class="s${i}" offset="0" stop-color="${b.light}"/>` +
        `<stop class="s${i}" offset="1" stop-color="${b.light}" stop-opacity="0"/></radialGradient>`,
    ).join('')
    const grain =
      '<filter id="grain" x="0" y="0" width="100%" height="100%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>' +
      '<feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0"/></filter>'
    const dark = BLOBS.map((b, i) => `.s${i}{stop-color:${b.dark}}`).join('')
    const drift = BLOBS.map((b, i) => {
      const seconds = pace(motion, 60 + i * 7, 30 + i * 4)
      const reach = motion === 'lively' ? 1.5 : 1

      return (
        `@keyframes d${i}{to{transform:translate(${Math.round(b.dx * reach)}px,${Math.round(b.dy * reach)}px)}}` +
        `.b${i}{animation:d${i} ${seconds}s ease-in-out infinite alternate}`
      )
    }).join('')

    return scene({
      motion,
      defs: gradients + grain,
      style: `.base{fill:#f6e6e4}@media (prefers-color-scheme: dark){.base{fill:#17111c}${dark}}`,
      animation: drift,
      body:
        `<rect class="base" width="${W}" height="${H}" fill="#f6e6e4"/>` +
        BLOBS.map((b, i) => `<circle class="b${i}" cx="${b.x}" cy="${b.y}" r="${b.r}" fill="url(#g${i})"/>`).join('') +
        `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.14"/>`,
    })
  },
}
