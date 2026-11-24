import { clamp, exp, floor, length, max, mix, picture, pointers, scene, shader, sin, size, smoothstep, time, values, vec2, vec3, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

/** The screen's pitch, in points, and its 45 degree turn. */
const CELL = 11
const TURN = 0.7071

const print = picture(p => {
  // The dot this pixel belongs to, on a screen turned 45 degrees.
  const turned = vec2((p.point.x + p.point.y) * TURN, (p.point.y - p.point.x) * TURN)
  const middle = vec2((floor(turned / CELL) + 0.5) * CELL)
  const centre = vec2((middle.x - middle.y) * TURN, (middle.x + middle.y) * TURN)
  const at = vec2(centre.x / max(size.x, 1), centre.y / max(size.y, 1))

  // How much ink the dot takes: two slow waves, and more under the pointer.
  let swell = 0

  for (const near of pointers) {
    const far = length(vec2(centre - near.at)) / 150

    swell = swell + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1) * 0.35
  }
  const tone = 0.5 + 0.28 * sin(at.x * 3.1 + time * 0.13) + 0.22 * sin(at.y * 2.3 - time * 0.1 + at.x * 1.7)
  const radius = clamp(tone + swell, 0.08, 1) * 0.6 * CELL
  const dot = smoothstep(radius + p.px, radius - p.px, length(vec2(turned - middle)))

  // The ink is the paper's own color, darker on a light paper and lighter on a dark one.
  const paper = scene.sample(p.uv)
  const bright = paper.r * 0.3 + paper.g * 0.59 + paper.b * 0.11
  const ink = bright > 0.45 ? vec3(paper.rgb * 0.66) : vec3(paper.rgb * 1.6 + 0.07)

  return vec4(clamp(mix(paper.rgb, ink, dot * 0.9), 0, 1), 1)
})

export default shader({ fps: 30, passes: [print] })
