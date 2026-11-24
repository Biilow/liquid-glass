import { clamp, cos, exp, floor, fract, length, max, min, picture, pointers, scene, shader, sin, size, smoothstep, time, values, vec2, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

/** A tile's side, in points. */
const TILE = 30

const wall = picture(p => {
  const tile = vec2(floor(p.point / TILE))
  const middle = vec2((tile + 0.5) * TILE)
  const at = vec2(middle.x / max(size.x, 1), middle.y / max(size.y, 1))

  // Each tile takes one color from the picture, which flows slowly under the wall.
  const flow = vec2(sin(at.y * 4 + time * 0.15), cos(at.x * 3.5 - time * 0.12))
  const glaze = scene.sample(vec2(at + flow * 0.03))

  // No two tiles are fired alike, and each catches the light at its own pace.
  const fired = fract(sin(tile.x * 127.1 + tile.y * 311.7) * 43758.5453)
  const shine = 0.9 + 0.12 * fired + 0.04 * sin(time * 0.4 + fired * 6.283)

  // Tiles near the pointer light up.
  let glow = 0

  for (const near of pointers) {
    const far = length(vec2(middle - near.at)) / 130

    glow = glow + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1) * 0.16
  }

  // A thin dark joint between tiles.
  const inside = vec2(fract(p.point / TILE))
  const joint = smoothstep(0, 0.07, min(min(inside.x, 1 - inside.x), min(inside.y, 1 - inside.y)))

  return vec4(clamp(glaze.rgb * shine * (0.86 + 0.14 * joint) + glow, 0, 1), 1)
})

export default shader({ fps: 30, passes: [wall] })
