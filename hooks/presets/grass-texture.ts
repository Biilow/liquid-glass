import { H, W, pace, scatter, scene } from './svg'
import type { Preset } from './types'

// One square of lawn, repeated. A blade that leaves the square is drawn again
// on the far side, so the squares meet without an edge.
const lawn = (id: string, tile: number, blades: number, seed: number): string => {
  const next = scatter(seed)
  let drawn = ''

  for (let n = 0; n < blades; n++) {
    const x = next() * tile
    const y = next() * tile
    const tall = 26 + next() * 34
    const lean = (next() - 0.5) * 64
    const shade = Math.floor(next() * 4)
    const wide = (1.8 + next() * 1.6).toFixed(1)

    const side = x < 36 ? tile : x > tile - 36 ? -tile : 0
    const copies = side === 0 ? [[0, 0], [0, tile]] : [[0, 0], [0, tile], [side, 0], [side, tile]]

    for (const [ox, oy] of copies as [number, number][]) {
      const bx = Math.round(x + ox)
      const by = Math.round(y + oy)

      drawn +=
        `<path class="g${shade}" d="M${bx} ${by}q${Math.round(lean * 0.2)} ${Math.round(-tall * 0.6)} ${Math.round(lean)} ${Math.round(-tall)}" ` +
        `stroke-width="${wide}"/>`
    }
  }

  return (
    `<pattern id="${id}" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse">` +
    `<g fill="none" stroke-linecap="round">${drawn}</g></pattern>`
  )
}

const BLADES = { light: ['#6ea84f', '#84bb5f', '#a4d07e', '#5b9443'], dark: ['#1f4a27', '#285a30', '#33703b', '#183d20'] } as const

export const grassTexture: Preset = {
  id: 'grass-texture',
  name: 'Grass texture',
  kind: 'svg',
  roles: { accent: '#3f8a3a', danger: '#c2413a', success: '#2f7d6a', warning: '#b5771a', pro: '#7a5cc0' },
  light: {
    'surface-0': '#e2ecdc',
    'surface-1': '#eaf2e5',
    'surface-2': '#f4f9f1',
    'text-primary': '#1b2a17',
    'text-secondary': '#3d5137',
    'text-muted': '#54694d',
  },
  dark: {
    'surface-0': '#122015',
    'surface-1': '#18291b',
    'surface-2': '#1e3222',
    'surface-3': '#243a28',
    'text-primary': '#e8f3e6',
    'text-secondary': '#bfd4bc',
    'text-muted': '#99b395',
  },
  minOpacity: 0.65,
  svg: motion =>
    scene({
      motion,
      defs: lawn('back', 230, 96, 21) + lawn('front', 170, 70, 87),
      style:
        '.turf{fill:#8fbf6a}' +
        BLADES.light.map((c, i) => `.g${i}{stroke:${c}}`).join('') +
        '@media (prefers-color-scheme: dark){.turf{fill:#15301b}' +
        BLADES.dark.map((c, i) => `.g${i}{stroke:${c}}`).join('') +
        '}',
      // The two layers lean a little, out of step, as grass does in a light wind.
      animation:
        '@keyframes sway{from{transform:skewX(-2.5deg)}to{transform:skewX(2.5deg)}}' +
        `.back{transform-origin:50% 100%;animation:sway ${pace(motion, 16, 8)}s ease-in-out infinite alternate}` +
        `.front{transform-origin:50% 100%;animation:sway ${pace(motion, 11, 5.5)}s ease-in-out infinite alternate-reverse}`,
      body:
        `<rect class="turf" width="${W}" height="${H}" fill="#8fbf6a"/>` +
        `<rect class="back" x="-120" width="${W + 240}" height="${H}" fill="url(#back)"/>` +
        `<rect class="front" x="-120" width="${W + 240}" height="${H}" fill="url(#front)"/>`,
    }),
}
