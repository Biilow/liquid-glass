import { H, W, pace, scatter, scene, sheen } from './svg'
import type { Preset } from './types'

// Our own pond at dusk, in fourteen paints: sky, far bank, water, lily pads,
// flowers. Each paint has a day color and a night one.
const PAINTS = [
  ['#bcd4f0', '#1a2648'], ['#d7e3f5', '#22305a'], ['#c9c4ea', '#2a2a5c'], ['#f6efe2', '#39406e'],
  ['#6f9a63', '#173528'], ['#8bb27a', '#1f4433'], ['#4f7d57', '#102a22'], ['#35604a', '#0a1d19'],
  ['#7fa8c9', '#16304e'], ['#9cc0d6', '#1d3c5c'], ['#6b93b8', '#11263f'],
  ['#5f9a5a', '#1f4a30'], ['#f2a7c0', '#b8648a'], ['#fff3d6', '#d9cfae'],
] as const

const COLS = 24
const ROWS = 15
// Lily pads: where each floats (0 to 1 across and down) and how wide.
const PADS = [
  [0.14, 0.7, 0.07], [0.3, 0.84, 0.09], [0.42, 0.66, 0.05], [0.58, 0.78, 0.08], [0.7, 0.9, 0.07],
  [0.82, 0.68, 0.06], [0.92, 0.82, 0.08], [0.22, 0.94, 0.06], [0.5, 0.93, 0.05],
] as const

// One dab of the brush: a short fat stroke at an angle.
const dab = (paint: number, x: number, y: number, long: number, fat: number, angle: number): string =>
  `<ellipse class="p${paint}" cx="${Math.round(x)}" cy="${Math.round(y)}" rx="${Math.round(long)}" ry="${Math.round(fat)}" ` +
  `transform="rotate(${Math.round(angle)} ${Math.round(x)} ${Math.round(y)})"/>`

const painting = (): string => {
  const next = scatter(1874)
  let dabs = ''

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = ((col + 0.5 + (next() - 0.5) * 0.7) / COLS) * W
      const down = (row + 0.5 + (next() - 0.5) * 0.7) / ROWS
      const pick = next()
      // The far bank rolls a little, so its top edge is not a ruled line.
      const bank = 0.38 + 0.04 * Math.sin((x / W) * 7)

      if (down < bank) {
        dabs += dab(pick < 0.12 ? 3 : Math.floor(pick * 3), x, down * H, 56, 21, (next() - 0.5) * 30)
      } else if (down < bank + 0.14) {
        dabs += dab(4 + Math.floor(pick * 4), x, down * H, 42, 20, 60 + next() * 60)
      } else {
        // Water: mostly its own blues, with the bank and the sky mirrored near the top of it.
        const mirrored = down < bank + 0.26 && pick < 0.35
        const paint = mirrored ? 5 + Math.floor(next() * 2) : pick > 0.9 ? 1 : 8 + Math.floor(next() * 3)

        dabs += dab(paint, x, down * H, 62, 16, (next() - 0.5) * 14)
      }
    }
  }
  for (const [px, py, wide] of PADS) {
    for (let leaf = 0; leaf < 5; leaf++) {
      dabs += dab(11, (px + (next() - 0.5) * wide) * W, (py + (next() - 0.5) * 0.03) * H, wide * W * 0.4, 14, (next() - 0.5) * 16)
    }
    dabs += dab(12 + Math.floor(next() * 2), px * W, (py - 0.012) * H, 16, 11, next() * 180)
  }

  return dabs
}

// Glints on the water, which come and go.
const GLINTS = [[260, 640], [560, 720], [820, 610], [1080, 760], [1320, 660], [1480, 840], [400, 880], [960, 900]] as const

export const impressionistPaintings: Preset = {
  id: 'impressionist-paintings',
  name: 'Impressionist paintings',
  kind: 'svg',
  roles: { accent: '#4f7fa8', danger: '#c2413a', success: '#4d8a55', warning: '#b5771a', pro: '#8a5cb0' },
  light: {
    'surface-0': '#e3e9ee',
    'surface-1': '#ebf0f4',
    'surface-2': '#f5f8fa',
    'text-primary': '#1a2530',
    'text-secondary': '#3f4d5a',
    'text-muted': '#566471',
  },
  dark: {
    'surface-0': '#101a26',
    'surface-1': '#15212f',
    'surface-2': '#1b2939',
    'surface-3': '#213143',
    'text-primary': '#e8eff6',
    'text-secondary': '#bfcbd8',
    'text-muted': '#99a8b8',
  },
  minOpacity: 0.65,
  svg: motion => {
    const light = sheen(motion, 0.14)

    return scene({
      motion,
      defs:
        // The brush drags each dab's edge: the whole canvas is nudged by soft noise, once.
        '<filter id="drag" x="0" y="0" width="100%" height="100%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="6"/>' +
        '<feDisplacementMap in="SourceGraphic" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter>' +
        light.defs,
      style:
        PAINTS.map(([day], i) => `.p${i}{fill:${day}}`).join('') +
        '.canvas{fill:#a9c0d6}.glint{fill:#ffffff;opacity:0.5}' +
        '@media (prefers-color-scheme: dark){.canvas{fill:#16263c}.glint{fill:#cfe0ff;opacity:0.28}' +
        PAINTS.map(([, night], i) => `.p${i}{fill:${night}}`).join('') +
        '}',
      animation:
        light.animation +
        '@keyframes glint{to{opacity:0.05}}' +
        GLINTS.map((_, i) => `.g${i}{animation:glint ${pace(motion, 7 + i * 1.3, 3.5 + i * 0.7)}s ease-in-out infinite alternate}`).join(''),
      body:
        `<rect class="canvas" width="${W}" height="${H}" fill="#a9c0d6"/>` +
        `<g filter="url(#drag)">${painting()}</g>` +
        GLINTS.map(([x, y], i) => `<ellipse class="glint g${i}" cx="${x}" cy="${y}" rx="34" ry="6"/>`).join('') +
        light.body,
    })
  },
}
