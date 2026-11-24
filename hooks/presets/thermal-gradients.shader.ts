import { clamp, cos, exp, length, max, mix, picture, pointers, scene, shader, sin, size, time, values, vec2, vec3, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

const heat = picture(p => {
  // Slow convection: the picture is read a little to one side, and the side turns.
  const flow = vec2(
    sin(p.uv.y * 5 + time * 0.21) + sin(p.uv.x * 3.3 - time * 0.13),
    cos(p.uv.x * 4.2 + time * 0.17) + sin(p.uv.y * 2.7 + time * 0.11),
  )
  const base = scene.sample(vec2(p.uv + flow * (0.035 + 0.02 * v.lively)))

  // A hand held near warms the spot under it, and the warmth fades as it leaves.
  const wide = vec2(size.x / max(size.y, 1), 1)
  let warmth = 0

  for (const near of pointers) {
    const far = length(vec2((p.uv - near.where.xy) * wide)) / 0.16

    warmth = warmth + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1)
  }

  return vec4(clamp(mix(base.rgb, vec3(1, 0.74, 0.3), clamp(warmth, 0, 1) * 0.4), 0, 1), 1)
})

export default shader({ fps: 30, passes: [heat] })
