import { clamp, cos, exp, length, max, picture, pointers, scene, shader, sin, size, time, values, vec2, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

const water = picture(p => {
  const wide = vec2(size.x / max(size.y, 1), 1)
  let push = vec2(0)
  let glint = 0

  // One ring a press: it starts under the press and is gone within a second.
  for (const press of pointers) {
    const away = vec2((p.uv - press.where.xy) * wide)
    const far = length(away)
    const gap = far - press.age * 0.5
    const band = exp((-gap * gap) / 0.0005) * v.lively * press.down * clamp(1 - press.age, 0, 1)

    push = vec2(push + (away / max(far, 0.001)) * band)
    glint = glint + band
  }

  // The slow sway of the surface, and the light it gathers on the floor.
  const sway = vec2(sin(p.uv.y * 14 + time * 0.35), cos(p.uv.x * 12 + time * 0.3))
  const floor = scene.sample(vec2(p.uv + sway * 0.006 + push * 0.02))
  const net =
    sin(p.uv.x * 22 + time * 0.4 + sin(p.uv.y * 9 + time * 0.2) * 2) *
    sin(p.uv.y * 19 - time * 0.3 + sin(p.uv.x * 7) * 2)
  const lit = max(net, 0)

  return vec4(clamp(floor.rgb + lit * lit * lit * 0.07 + glint * 0.12, 0, 1), 1)
})

export default shader({ fps: 30, passes: [water] })
