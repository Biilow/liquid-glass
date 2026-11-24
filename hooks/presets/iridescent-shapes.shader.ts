import { clamp, cos, exp, length, max, mix, picture, pointers, scene, shader, sin, size, time, values, vec2, vec3, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

const film = picture(p => {
  // The pointer stirs the film: its colors run on a little under it.
  const wide = vec2(size.x / max(size.y, 1), 1)
  let stir = 0

  for (const near of pointers) {
    const far = length(vec2((p.uv - near.where.xy) * wide)) / 0.2

    stir = stir + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1) * 0.3
  }

  // Three soft ribbons. Across each, the film's thickness changes, and with it the color it throws back.
  let colour = vec3(0)
  let cover = 0

  for (const band of [0, 1, 2]) {
    const middle = 0.28 + band * 0.22 + 0.12 * sin(p.uv.x * (2.2 + band * 0.9) + time * (0.05 + band * 0.02) + band * 2.1)
    const across = (p.uv.y - middle) / (0.07 + 0.03 * sin(p.uv.x * 3 + band + time * 0.04))
    const body = exp(-across * across)
    const depth = across * 0.35 + p.uv.x * 0.9 + band * 0.31 + time * 0.03 + stir

    colour = vec3(colour + (0.5 + 0.5 * cos(6.2832 * (depth + vec3(0, 0.33, 0.67)))) * body)
    cover = cover + body
  }

  // Pearly on a light sheet, deeper on a dark one.
  const sheet = scene.sample(p.uv)
  const bright = sheet.r * 0.3 + sheet.g * 0.59 + sheet.b * 0.11
  const thrown = vec3(colour / max(cover, 0.001))
  const seen = bright > 0.45 ? vec3(mix(thrown, vec3(1), 0.4)) : vec3(thrown * 0.8)

  return vec4(clamp(mix(sheet.rgb, seen, clamp(cover, 0, 1) * 0.85), 0, 1), 1)
})

export default shader({ fps: 30, passes: [film] })
