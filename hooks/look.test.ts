import { expect, test } from 'claude-code/testing'

import { buildLook, luminanceOf, tintAnchors } from './look'
import { DEFAULTS } from './options'
import { PRESETS, PRESET_IDS } from './presets/index'
import { glassPreview } from './preview'

const P = PRESETS['grainy-gradients']!
const TINTS = ['', '#000000', '#ffffff', '#ff0000', '#00ff88', '#ffee00', '#0033ff']

test('glass maps strength and blur', () => {
  const { look } = buildLook({ ...DEFAULTS, strength: 'frosted', blur: 'deep' }, P)

  expect(look.backdrop).toEqual({ scene: 'grainy-gradients', glass: { blur: 40, opacity: 0.8 } })
})

test('clear never goes below the preset floor', () => {
  const { look } = buildLook({ ...DEFAULTS, strength: 'clear' }, { ...P, minOpacity: 0.5 })

  expect(look.backdrop).toEqual({ scene: 'grainy-gradients', glass: { blur: 24, opacity: 0.5 } })
})

test('glass messages off sends no style', () => {
  expect('style' in buildLook({ ...DEFAULTS, glassMessages: false }, P).look).toBe(false)
  expect(buildLook(DEFAULTS, P).look.style?.UserMessage).toBeDefined()
})

test('every preset paints, untinted and with extreme tints', () => {
  for (const id of PRESET_IDS) {
    for (const tint of TINTS) {
      const { problems } = buildLook({ ...DEFAULTS, tint }, PRESETS[id]!)

      const unpainted = problems.filter(line => line.startsWith("Desktop won't paint"))

      expect(unpainted.map(line => `${id} ${tint}: ${line}`)).toEqual([])
    }
  }
})

test('tintAnchors keeps brightness and text', () => {
  const out = tintAnchors(P.dark, '#ff0000')

  expect(out['text-primary']).toBe(P.dark['text-primary'])
  expect(out['surface-0']).not.toBe(P.dark['surface-0'])
  expect(Math.abs(luminanceOf(out['surface-0']) - luminanceOf(P.dark['surface-0']))).toBeLessThan(0.002)
  expect(tintAnchors(P.dark, '')).toEqual(P.dark)
})

test('every scene fits the limit, is pure vector, and rests without motion', () => {
  for (const id of PRESET_IDS) {
    const preset = PRESETS[id]!

    for (const motion of ['still', 'calm', 'lively'] as const) {
      const svg = preset.svg(motion)

      expect(svg.length).toBeLessThan(131072)
      expect(svg.length).toBeGreaterThan(200)
      expect(svg.includes('viewBox')).toBe(true)
      expect(svg.includes('preserveAspectRatio="xMidYMid slice"')).toBe(true)
      expect(/<image|feImage|href|CDATA|foreignObject|data:|\\/.test(svg)).toBe(false)
    }
    expect(preset.svg('still').includes('animation')).toBe(false)
    if (preset.kind === 'svg') {
      expect(preset.svg('calm').includes('animation')).toBe(true)
    }
  }
})

test('blurred photos draws a wash in place of its own colours', () => {
  const blurred = PRESETS['blurred-photos']!
  const wash = ['#010203', '#040506', '#070809', '#0a0b0c', '#0d0e0f', '#101112']
  const own = blurred.svg('still')
  const washed = blurred.svg('still', wash)

  for (const colour of wash) {
    expect(washed.includes(colour)).toBe(true)
    expect(own.includes(colour)).toBe(false)
  }
  expect(washed.includes('#e8a87c')).toBe(false)
  expect(own.includes('#e8a87c')).toBe(true)
})

test('the first batch of Phase 2 is drawn', () => {
  for (const id of ['felt-texture', 'thermal-gradients', 'speckled-graphite', 'single-hue-landscapes', 'halftone', 'grass-texture']) {
    expect(PRESET_IDS.includes(id as never)).toBe(true)
  }
  expect(PRESETS['thermal-gradients']!.kind).toBe('shader')
  expect(PRESETS['halftone']!.kind).toBe('shader')
})

test('the glass preview fits the limit for every backdrop, tint and strength', () => {
  for (const id of PRESET_IDS) {
    for (const tint of ['', '#00ff88']) {
      const svg = glassPreview({ ...DEFAULTS, tint, strength: 'frosted', blur: 'deep' }, PRESETS[id]!)

      expect(svg.length).toBeLessThan(131072)
      expect(svg.includes('feGaussianBlur')).toBe(true)
      expect(/<image|feImage|href|CDATA|foreignObject|data:|\\/.test(svg)).toBe(false)
    }
  }
})

test('the second batch of Phase 2 is drawn', () => {
  for (const id of ['paper-texture', 'square-dot-grids']) {
    expect(PRESETS[id as 'paper-texture']?.kind).toBe('svg')
  }
  for (const id of ['dithered-images', 'contour-lines', 'cloud-sky', 'pixel-mosaics']) {
    expect(PRESETS[id as 'cloud-sky']?.kind).toBe('shader')
  }
})

test('all 22 presets and Photo wash are drawn, the last batch among them', () => {
  expect(PRESET_IDS.length).toBe(23)
  expect(PRESETS['photo-wash'].name).toBe('Photo wash')
  for (const id of ['impressionist-paintings', 'ascii-and-pixels']) {
    expect(PRESETS[id as 'ascii-and-pixels']?.kind).toBe('svg')
  }
  for (const id of ['lens-distortion', 'stippled-gradients', 'iridescent-shapes']) {
    expect(PRESETS[id as 'lens-distortion']?.kind).toBe('shader')
  }
})
