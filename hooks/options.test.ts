import { expect, test } from 'claude-code/testing'

import { DEFAULTS, applyCommand, parseOptions } from './options'

const KNOWN = ['grainy-gradients', 'water-ripples', 'photo-wash']

test('empty input gives defaults', () => {
  expect(parseOptions({}, KNOWN)).toEqual({
    backdrop: 'grainy-gradients',
    tint: '',
    strength: 'medium',
    blur: 'regular',
    motion: 'calm',
    glassMessages: true,
  })
})

test('unknown backdrop from an older version falls to the default', () => {
  expect(parseOptions({ backdrop: 'lava-lamp' }, KNOWN).backdrop).toBe('grainy-gradients')
  expect(parseOptions({ backdrop: 'water-ripples' }, KNOWN).backdrop).toBe('water-ripples')
})

test('tint must be six-digit hex', () => {
  for (const bad of ['blue', '#fff', ' #12345g', 42, null]) {
    expect(parseOptions({ tint: bad }, KNOWN).tint).toBe('')
  }
  expect(parseOptions({ tint: ' #A1B2C3 ' }, KNOWN).tint).toBe('#a1b2c3')
})

test('bad picker values fall to defaults', () => {
  const o = parseOptions({ strength: 'x', blur: 3, motion: '', glassMessages: 'yes' }, KNOWN)

  expect([o.strength, o.blur, o.motion, o.glassMessages]).toEqual(['medium', 'regular', 'calm', true])
  expect(parseOptions({ glassMessages: false }, KNOWN).glassMessages).toBe(false)
})


test('/glass sets one setting and says so', () => {
  expect(applyCommand(DEFAULTS, 'motion lively', KNOWN).options.motion).toBe('lively')
  expect(applyCommand(DEFAULTS, 'backdrop Water Ripples', KNOWN).options.backdrop).toBe('water-ripples')
  expect(applyCommand(DEFAULTS, '  strength   frosted ', KNOWN).options.strength).toBe('frosted')
  expect(applyCommand(DEFAULTS, 'blur deep', KNOWN).text).toBe('Blur set to deep.')
  expect(applyCommand(DEFAULTS, 'messages off', KNOWN).options.glassMessages).toBe(false)
  expect(applyCommand(DEFAULTS, 'tint #A1B2C3', KNOWN).options.tint).toBe('#a1b2c3')
  expect(applyCommand({ ...DEFAULTS, tint: '#a1b2c3' }, 'tint none', KNOWN).options.tint).toBe('')
  expect(applyCommand({ ...DEFAULTS, blur: 'deep' }, 'reset', KNOWN).options).toEqual(DEFAULTS)
})

test('/glass refuses what it does not know and changes nothing', () => {
  for (const bad of ['', 'colour red', 'motion fast', 'backdrop lava-lamp', 'tint blue', 'messages maybe', 'blur']) {
    const { options, text } = applyCommand(DEFAULTS, bad, KNOWN)

    expect(options).toEqual(DEFAULTS)
    expect(text.length).toBeGreaterThan(20)
  }
  expect(applyCommand(DEFAULTS, 'motion fast', KNOWN).text.includes('still, calm, lively')).toBe(true)
})
