import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

const CELL = 25
// A lit ball above rolling ground, drawn in characters.
const BALL = { x: 1040, y: 430, r: 300 }

// The marks a cell can hold, lightest first, as boxes inside the cell: . : + # and a full block.
const MARKS: readonly (readonly (readonly [number, number, number, number])[])[] = [
  [[10, 16, 4, 4]],
  [[10, 6, 4, 4], [10, 16, 4, 4]],
  [[4, 10, 16, 4], [10, 4, 4, 16]],
  [[3, 7, 18, 3], [3, 14, 18, 3], [7, 3, 3, 18], [14, 3, 3, 18]],
  [[2, 2, 20, 20]],
]

// How bright the scene is at a cell, 0 to 1.
const brightness = (x: number, y: number): number => {
  const dx = (x - BALL.x) / BALL.r
  const dy = (y - BALL.y) / BALL.r
  const inside = 1 - dx * dx - dy * dy

  if (inside > 0) {
    // A sphere lit from the upper left.
    return Math.max(0.12, (-dx * 0.55 - dy * 0.6 + Math.sqrt(inside) * 0.58) * 0.95 + 0.08)
  }
  const ground = 760 + 40 * Math.sin(x * 0.006) + 22 * Math.sin(x * 0.017 + 1)

  return y > ground ? 0.16 + 0.3 * (0.5 + 0.5 * Math.sin(x * 0.012 + (y - ground) * 0.03)) * Math.min(1, (y - ground) / 120 + 0.3) : 0
}

const marks = (): string => {
  const paths = MARKS.map(() => '')

  for (let y = 0; y < H; y += CELL) {
    for (let x = 0; x < W; x += CELL) {
      const lit = brightness(x + CELL / 2, y + CELL / 2)

      if (lit > 0.1) {
        const level = Math.min(MARKS.length - 1, Math.floor(lit * MARKS.length))

        for (const [ox, oy, w, h] of MARKS[level]!) {
          paths[level] += `M${x + ox} ${y + oy}h${w}v${h}h${-w}z`
        }
      }
    }
  }

  return paths.map((d, level) => `<path class="ch k${level}" d="${d}"/>`).join('')
}

export const asciiAndPixels: Preset = {
  id: 'ascii-and-pixels',
  name: 'ASCII and pixels',
  kind: 'svg',
  roles: { accent: '#2f8a5f', danger: '#c2413a', success: '#3f8a3f', warning: '#b5771a', pro: '#6a6cc8' },
  light: {
    'surface-0': '#e6e9e4',
    'surface-1': '#edf0ec',
    'surface-2': '#f6f8f5',
    'text-primary': '#182119',
    'text-secondary': '#3d4a3f',
    'text-muted': '#556257',
  },
  dark: {
    'surface-0': '#0d1410',
    'surface-1': '#121b16',
    'surface-2': '#18231c',
    'surface-3': '#1e2b23',
    'text-primary': '#e4f3e8',
    'text-secondary': '#b9d2c0',
    'text-muted': '#93b09b',
  },
  minOpacity: 0.6,
  svg: motion =>
    scene({
      motion,
      defs:
        `<pattern id="blank" width="${CELL}" height="${CELL}" patternUnits="userSpaceOnUse"><rect class="ch" x="11" y="17" width="3" height="3" opacity="0.22"/></pattern>` +
        '<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop class="scan" offset="0" stop-color="#2f8a5f" stop-opacity="0"/>' +
        '<stop class="scan" offset="0.5" stop-color="#2f8a5f" stop-opacity="0.16"/><stop class="scan" offset="1" stop-color="#2f8a5f" stop-opacity="0"/></linearGradient>',
      style:
        '.screen{fill:#eef1ec}.ch{fill:#1f5a40}.k0{opacity:0.45}.k1{opacity:0.55}.k2{opacity:0.68}.k3{opacity:0.8}.k4{opacity:0.9}' +
        '@media (prefers-color-scheme: dark){.screen{fill:#0a100d}.ch{fill:#7dffb0}.scan{stop-color:#7dffb0}}',
      // A scan line that passes down the screen and starts again above it.
      animation:
        `@keyframes scan{from{transform:translateY(-260px)}to{transform:translateY(${H}px)}}` +
        `.beam{animation:scan ${pace(motion, 14, 7)}s linear infinite}`,
      body:
        `<rect class="screen" width="${W}" height="${H}" fill="#eef1ec"/>` +
        `<rect width="${W}" height="${H}" fill="url(#blank)"/>` +
        marks() +
        (motion === 'still' ? '' : `<rect class="beam" width="${W}" height="260" fill="url(#beam)"/>`),
    }),
}
