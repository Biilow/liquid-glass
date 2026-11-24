import { clamp, exp, floor, fract, length, max, mix, picture, pointers, scene, shader, sin, size, smoothstep, time, values, vec2, vec3, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

/** The spacing of the dots, and a dot's radius, in points. */
const CELL = 7
const DOT = 1.6

// Three steady random numbers for a cell: where its dot sits, and how soon it shows.
const roll = (c: vec2, a: number, b: number): number => fract(sin(c.x * a + c.y * b) * 43758.5453)

const stipple = picture(p => {
  // More dots under the pointer.
  const wide = vec2(size.x / max(size.y, 1), 1)
  let swell = 0

  for (const near of pointers) {
    const far = length(vec2((p.uv - near.where.xy) * wide)) / 0.16

    swell = swell + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1) * 0.35
  }

  // Two grids of dots, one set half a step off the other, so no rows show.
  let ink = 0

  for (const shift of [0, 0.5]) {
    const grid = vec2(p.point / CELL + shift)
    const cell = vec2(floor(grid) + shift * 40)
    const spot = vec2(0.2 + 0.6 * roll(cell, 127.1, 311.7), 0.2 + 0.6 * roll(cell, 269.5, 183.3))
    const far = length(vec2(fract(grid) - spot)) * CELL
    const at = vec2((p.point.x) / max(size.x, 1), (p.point.y) / max(size.y, 1))

    // How thick the dots are here: two slow waves across the sheet.
    const thick = 0.5 + 0.3 * sin(at.x * 2.9 + time * 0.11) + 0.2 * sin(at.y * 2.1 - time * 0.09 + at.x * 1.5) + swell
    const rank = roll(cell, 419.2, 371.9)
    const shown = smoothstep(rank - 0.07, rank + 0.07, thick)

    ink = max(ink, shown * smoothstep(DOT + p.px, DOT - p.px, far))
  }

  const paper = scene.sample(p.uv)
  const bright = paper.r * 0.3 + paper.g * 0.59 + paper.b * 0.11
  const dot = bright > 0.45 ? vec3(paper.rgb * 0.34) : vec3(paper.rgb * 2.4 + 0.3)

  return vec4(clamp(mix(paper.rgb, dot, ink * 0.9), 0, 1), 1)
})

export default shader({ fps: 30, passes: [stipple] })
