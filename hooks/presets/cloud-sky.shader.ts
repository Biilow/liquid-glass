import { clamp, exp, floor, fract, length, max, mix, picture, pointers, scene, shader, sin, size, smoothstep, time, values, vec2, vec3, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

// A steady random number for each whole-number corner.
const corner = (c: vec2): number => fract(sin(c.x * 127.1 + c.y * 311.7) * 43758.5453)

// Smooth noise: the four corners around a point, blended.
const noise = (q: vec2): number => {
  const i = vec2(floor(q))
  const f = vec2(fract(q))
  const u = vec2(f * f * (3 - 2 * f))

  return mix(
    mix(corner(i), corner(vec2(i.x + 1, i.y)), u.x),
    mix(corner(vec2(i.x, i.y + 1)), corner(vec2(i.x + 1, i.y + 1)), u.x),
    u.y,
  )
}

const sky = picture(p => {
  const wide = vec2(size.x / max(size.y, 1), 1)

  // Four sizes of noise laid over each other, drifting with a light wind.
  let at = vec2(p.uv * wide * 2.6 + vec2(time * 0.012, time * 0.003))
  let cover = 0
  let weight = 0.5

  for (let layer = 0; layer < 4; layer++) {
    cover = cover + weight * noise(at)
    at = vec2(at * 2.03 + 7.1)
    weight = weight * 0.5
  }

  // The clouds part around the pointer.
  let gap = 0

  for (const near of pointers) {
    const far = length(vec2((p.uv - near.where.xy) * wide)) / 0.18

    gap = gap + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1) * 0.25
  }
  const cloud = smoothstep(0.47, 0.76, cover - gap)

  // White by day; by night the sky's own blue, lifted.
  const air = scene.sample(p.uv)
  const bright = air.r * 0.3 + air.g * 0.59 + air.b * 0.11
  const lit = bright > 0.45 ? vec3(1) : vec3(air.rgb * 2 + 0.14)

  return vec4(clamp(mix(air.rgb, lit, cloud * 0.9), 0, 1), 1)
})

export default shader({ fps: 30, passes: [sky] })
