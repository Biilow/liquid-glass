import { abs, clamp, floor, fract, max, picture, scene, shader, sin, size, time, values, vec2, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

/** A rib's width, in points. */
const RIB = 44

// Each rib is a little lens: it shows the picture behind it flipped and
// widened sideways, and the picture slides slowly under the glass.
const glass = picture(p => {
  const across = p.point.x / RIB
  const rib = floor(across)
  const inside = fract(across) - 0.5
  const slide = (0.03 + 0.04 * v.lively) * sin(time * 0.12 + rib * 0.3)
  const bent = ((rib + 0.5 - inside * 2.4) * RIB) / max(size.x, 1) + slide
  const behind = scene.sample(vec2(clamp(bent, 0, 1), p.uv.y))
  const shade = 1.04 - 0.16 * abs(inside)

  return vec4(behind.rgb * shade, 1)
})

export default shader({ fps: 30, passes: [glass] })
