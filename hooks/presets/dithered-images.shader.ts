import { clamp, exp, floor, length, max, mod, picture, pointers, scene, shader, sin, size, table, time, values, vec2, vec3, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

/** A dither cell's side, in points, and the tones each color lane keeps. */
const CELL = 3
const TONES = 3
// The 4 by 4 ordered-dither pattern: which cells of a patch light first.
const ORDER = table([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5])

const dither = picture(p => {
  const cell = vec2(floor(p.point / CELL))
  const at = vec2(((cell.x + 0.5) * CELL) / max(size.x, 1), ((cell.y + 0.5) * CELL) / max(size.y, 1))

  // A lantern under the pointer.
  const wide = vec2(size.x / max(size.y, 1), 1)
  let lamp = 0

  for (const near of pointers) {
    const far = length(vec2((at - near.where.xy) * wide)) / 0.14

    lamp = lamp + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1) * 0.2
  }

  // The moon rises and sinks a hair, so the tones along its edge trade places slowly.
  const seen = scene.sample(vec2(at.x, at.y + sin(time * 0.11) * 0.012))
  const first = (ORDER.at(mod(cell.x, 4) + mod(cell.y, 4) * 4) + 0.5) / 16
  const flat = floor(vec3(seen.rgb + lamp) * TONES + first) / TONES

  return vec4(clamp(flat, 0, 1), 1)
})

export default shader({ fps: 30, passes: [dither] })
