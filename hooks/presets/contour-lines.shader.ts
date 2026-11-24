import { abs, clamp, cos, exp, floor, fwidth, length, max, mix, picture, pointers, scene, shader, sin, size, smoothstep, time, values, vec2, vec3, vec4 } from 'claude-code/shader'

const v = values({ lively: [0, 1] })

/** Lines for each unit of height. */
const LINES = 6

const map = picture(p => {
  const wide = vec2(size.x / max(size.y, 1), 1)
  const q = vec2(p.uv * wide)

  // The pointer raises a hill under itself.
  let hill = 0

  for (const near of pointers) {
    const far = length(vec2((p.uv - near.where.xy) * wide)) / 0.2

    hill = hill + v.lively * exp(-far * far) * clamp(1 - near.gone, 0, 1) * 0.3
  }

  // The land: a few long swells, moving so slowly that a line takes minutes to cross a spot.
  const t = time * 0.03
  const height =
    sin(q.x * 3.1 + t) * cos(q.y * 2.7 - t * 0.7) +
    0.5 * sin(q.x * 5.3 - q.y * 4.1 + t * 1.3) +
    0.25 * cos(q.y * 9.7 + q.x * 2.2 - t) +
    hill
  const level = height * LINES
  const off = abs(level - floor(level + 0.5))
  const line = 1 - smoothstep(0, max(fwidth(level) * 1.5, 0.0001), off)

  // The line is the paper's own color, darker on a light map and lighter on a dark one.
  const paper = scene.sample(p.uv)
  const bright = paper.r * 0.3 + paper.g * 0.59 + paper.b * 0.11
  const ink = bright > 0.45 ? vec3(paper.rgb * 0.55) : vec3(paper.rgb * 2 + 0.12)

  return vec4(clamp(mix(paper.rgb, ink, line * 0.7), 0, 1), 1)
})

export default shader({ fps: 30, passes: [map] })
