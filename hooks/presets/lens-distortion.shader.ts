import { clamp, cos, exp, length, max, picture, pointers, scene, shader, sin, size, smoothstep, time, values, vec2, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

const lens = picture(p => {
  const wide = vec2(size.x / max(size.y, 1), 1)
  // The lens wanders slowly around the middle.
  const centre = vec2(0.5 + 0.12 * sin(time * 0.07), 0.5 + 0.1 * cos(time * 0.09))
  const out = vec2(p.uv - centre)
  const far = length(vec2(out * wide))

  // A small second lens under the pointer.
  let nudge = vec2(0)

  for (const near of pointers) {
    const off = vec2(p.uv - near.where.xy)
    const reach = length(vec2(off * wide)) / 0.16

    nudge = vec2(nudge - off * exp(-reach * reach) * v.lively * clamp(1 - near.gone, 0, 1) * 0.35)
  }

  // A fisheye: the middle is seen larger, the rim is squeezed. Red bends a
  // hair less than blue, as in real glass.
  const bend = 0.58 + 0.5 * far * far
  const look = (by: number) => scene.sample(vec2(clamp(vec2(centre + out * bend * by + nudge), 0, 1)))
  const shade = 1 - 0.22 * smoothstep(0.55, 1.15, far)
  const warm = look(0.988)
  const cool = look(1.01)

  return vec4(clamp(vec2(warm.r, (warm.g + cool.g) * 0.5) * shade, 0, 1), clamp(cool.b * shade, 0, 1), 1)
})

export default shader({ fps: 30, passes: [lens] })
