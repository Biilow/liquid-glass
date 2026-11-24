import { expect, test } from 'claude-code/testing'
import type { Engine, TestBody } from 'claude-code/testing'

type On = Parameters<TestBody>[1]

import { DEFAULTS } from './options'
import { PRESETS, PRESET_IDS } from './presets/index'

const GLASS = { blur: 24, opacity: 0.65 }

test('draws the chosen preset', async $ => {
  const ui = await $.ui.mount({
    plugin: 'liquid-glass',
    surface: 'desktop',
    component: 'Backdrop',
    props: { plugin: 'liquid-glass', scene: 'grainy-gradients', glass: GLASS },
  })
  const svg = await ui.find({ type: 'Svg' })

  expect(String(svg?.props.source).includes('xMidYMid slice')).toBe(true)
  expect(svg?.props.alt).toBe('Grainy gradients backdrop')
  await ui.unmount()
})

test("leaves another mod's scene alone", async $ => {
  const ui = await $.ui.mount({
    plugin: 'liquid-glass',
    surface: 'desktop',
    component: 'Backdrop',
    props: { plugin: 'other', scene: 'grainy-gradients', glass: GLASS },
  })

  expect(await ui.find({ type: 'Svg' })).toBeUndefined()
  await ui.unmount()
})

test('an unknown scene of ours draws nothing', async $ => {
  const ui = await $.ui.mount({
    plugin: 'liquid-glass',
    surface: 'desktop',
    component: 'Backdrop',
    props: { plugin: 'liquid-glass', scene: 'lava-lamp', glass: GLASS },
  })

  expect(await ui.find({ type: 'Svg' })).toBeUndefined()
  await ui.unmount()
})

const ripples = { plugin: 'liquid-glass', scene: 'water-ripples', glass: GLASS }
const mountRipples = ($: Engine) =>
  $.ui.mount({ plugin: 'liquid-glass', surface: 'desktop', component: 'Backdrop', props: ripples })

// Stands for the engine beneath the mod; `kept` is the mod's store, holding
// at first what an earlier session saved. Returns it, to read what was written.
const start = async ($: Engine, on: On, kept: Record<string, unknown>) => {
  on('store.get', (_, e) => ({ value: kept[e.key] }))
  on('store.set', (_, e) => {
    kept[e.key] = e.value

    return { value: undefined }
  })
  on('command.register', (_, e) => ({ value: { command: e.name } as never }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('theme.set', () => ({ value: { isDrawn: true } as never }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  return kept
}

test('stored still draws the bare svg for a shader preset', async ($, on) => {
  await start($, on, { options: { motion: 'still' } })
  const ui = await mountRipples($)

  expect(await ui.find({ type: 'Shader' })).toBeUndefined()
  expect((await ui.find({ type: 'Svg' }))?.props.alt).toBe('Water ripples backdrop')
  await ui.unmount()
})

test('calm, the default, wraps in a shader with lively 0', async ($, on) => {
  await start($, on, {})
  const ui = await mountRipples($)

  expect((await ui.find({ type: 'Shader' }))?.props.values).toEqual({ lively: 0 })
  expect(await ui.find({ type: 'Svg' })).toBeDefined()
  await ui.unmount()
})

test('/glass motion lively sets lively 1 and is kept', async ($, on) => {
  const kept = await start($, on, {})
  const ran = await $.command.run({ command: 'glass', args: 'motion lively' } as never)

  expect(ran.text).toBe('Motion set to lively.')
  expect(kept.options).toEqual({ ...DEFAULTS, motion: 'lively' })
  const ui = await mountRipples($)

  expect((await ui.find({ type: 'Shader' }))?.props.values).toEqual({ lively: 1 })
  await ui.unmount()
})

const PANEL = {
  plugin: 'liquid-glass',
  surface: 'desktop',
  component: 'Pane',
  requestId: 'liquid-glass-settings',
  props: {
    title: 'Liquid Glass',
    isFocused: false,
    bodyColumns: 40,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 20 },
    view: {},
  },
} as const

test('/glass alone opens the settings panel', async ($, on) => {
  await start($, on, {})

  expect((await $.command.run({ command: 'glass', args: '' } as never)).text).toBe('Liquid Glass settings opened.')
})

test('the panel previews every backdrop and a press on one is applied and kept', async ($, on) => {
  const kept = await start($, on, { options: { blur: 'deep' } })
  const ui = await $.ui.mount(PANEL)

  const alts = (await ui.findAll({ type: 'Svg' })).map(svg => svg.props.alt)

  expect(alts.includes('Your glass over Grainy gradients')).toBe(true)
  for (const id of PRESET_IDS) {
    expect(await ui.find({ type: 'Button', key: `backdrop:${id}` })).toBeDefined()
    expect(alts.includes(`${PRESETS[id]!.name} preview`)).toBe(true)
  }
  await ui.press({ key: 'backdrop:water-ripples' })
  expect(kept.options).toEqual({ ...DEFAULTS, blur: 'deep', backdrop: 'water-ripples' })
  await ui.unmount()
})

test('the panel sets glass, motion and tint with one press each', async ($, on) => {
  const kept = await start($, on, {})
  const ui = await $.ui.mount(PANEL)
  const now = () => kept.options as typeof DEFAULTS

  for (const key of ['strength:frosted', 'blur:deep', 'motion:lively', 'messages:off', 'tint:#7aa2ff']) {
    await ui.press({ key })
  }
  expect(now()).toEqual({ ...DEFAULTS, strength: 'frosted', blur: 'deep', motion: 'lively', glassMessages: false, tint: '#7aa2ff' })
  await ui.press({ key: 'tint:none' })
  expect(now().tint).toBe('')
  await $.ui.input({ plugin: 'liquid-glass', key: 'tint', text: '#A1B2C3' })
  expect(now().tint).toBe('#a1b2c3')
  await $.ui.input({ plugin: 'liquid-glass', key: 'tint', text: 'blue' })
  expect(now().tint).toBe('#a1b2c3')
  await ui.press({ key: 'reset' })
  expect(now()).toEqual(DEFAULTS)
  await ui.unmount()
})

test('the terminal, which draws no pictures, still gets every control', async ($, on) => {
  await start($, on, {})
  const ui = await $.ui.mount({ ...PANEL, surface: 'terminal' })

  expect(await ui.find({ type: 'Button', key: 'backdrop:halftone' })).toBeDefined()
  expect(await ui.find({ type: 'Button', key: 'motion:still' })).toBeDefined()
  await ui.unmount()
})

test('every shader preset plays its own shader when moving', async ($, on) => {
  await start($, on, {})
  for (const id of PRESET_IDS.filter(one => PRESETS[one]!.kind === 'shader')) {
    const ui = await $.ui.mount({
      plugin: 'liquid-glass',
      surface: 'desktop',
      component: 'Backdrop',
      props: { plugin: 'liquid-glass', scene: id, glass: GLASS },
    })

    expect((await ui.find({ type: 'Shader' }))?.props.module).toBe(`hooks/presets/${id}.shader.ts`)
    await ui.unmount()
  }
})

// What sips wrote for a blue picture shrunk to 3 by 2.
const SIPS = 'Qk1OAAAAAAAAADYAAAAoAAAAAwAAAP7///8BABgAAAAAABIAAAATCwAAEwsAAAAAAAAAAAAA8bl69LOB8757AAAA7Klh77Bw7q9xAAAA'

test('/glass-photo reads six colours, switches to Photo wash and draws them', async ($, on) => {
  const ran: string[][] = []

  on('fs.exists', () => ({ value: true }))
  on('process.run', (_, e) => {
    ran.push([...e.argv])

    return { value: { exitCode: 0, stdout: '/Users/me', stderr: '' } as never }
  })
  on('fs.write', () => ({ value: undefined }))
  on('fs.read', () => ({ value: { base64: SIPS } }))
  const kept = await start($, on, {})
  const answer = await $.command.run({ command: 'glass-photo', args: '~/Pictures/my\\ beach.jpg' } as never)

  expect(answer.text).toBe('Photo wash set from my beach.jpg.')
  expect(ran[1]?.[0]).toBe('/usr/bin/sips')
  expect(ran[1]?.includes('/Users/me/Pictures/my beach.jpg')).toBe(true)
  expect(kept.wash).toEqual(['#7ab9f1', '#81b3f4', '#7bbef3', '#61a9ec', '#70b0ef', '#71afee'])
  expect((kept.options as { backdrop: string }).backdrop).toBe('photo-wash')
  const ui = await $.ui.mount({
    plugin: 'liquid-glass',
    surface: 'desktop',
    component: 'Backdrop',
    props: { plugin: 'liquid-glass', scene: 'photo-wash', glass: GLASS },
  })
  const svg = await ui.find({ type: 'Svg' })

  expect(svg?.props.alt).toBe('Photo wash backdrop')
  expect(String(svg?.props.source).includes('#61a9ec')).toBe(true)
  await ui.unmount()
})

test('/glass-photo with no path, a missing file or a file sips refuses changes nothing', async ($, on) => {
  let isThere = false

  on('fs.exists', () => ({ value: isThere }))
  on('process.run', () => ({ value: { exitCode: 1, stdout: '', stderr: 'no' } as never }))
  on('fs.write', () => ({ value: undefined }))
  const kept = await start($, on, {})
  expect((await $.command.run({ command: 'glass-photo', args: ' ' } as never)).text?.includes('path')).toBe(true)
  expect((await $.command.run({ command: 'glass-photo', args: '/no/such.jpg' } as never)).text).toBe('No file at /no/such.jpg.')
  isThere = true
  expect((await $.command.run({ command: 'glass-photo', args: '/notes.txt' } as never)).text?.includes('could not be read')).toBe(true)
  expect(kept.wash).toBeUndefined()
  expect(kept.options).toBeUndefined()
})

test('/glass-photo on a folder, which sips skips without failing, keeps the earlier photo out', async ($, on) => {
  let written = SIPS

  on('fs.exists', () => ({ value: true }))
  on('fs.write', (_, e) => {
    written = e.text

    return { value: undefined }
  })
  // sips exits 0 and writes nothing.
  on('process.run', () => ({ value: { exitCode: 0, stdout: '', stderr: 'skipping' } as never }))
  on('fs.read', () => ({ value: { base64: written } }))
  const kept = await start($, on, {})
  const answer = await $.command.run({ command: 'glass-photo', args: '/Users/me/Pictures' } as never)

  expect(answer.text).toBe('That file could not be read as a picture: /Users/me/Pictures')
  expect(kept.wash).toBeUndefined()
})

test('two quick presses in the panel both stick', async ($, on) => {
  const kept = await start($, on, {})
  const ui = await $.ui.mount(PANEL)

  await Promise.all([ui.press({ key: 'blur:deep' }), ui.press({ key: 'strength:frosted' })])
  expect(kept.options).toEqual({ ...DEFAULTS, blur: 'deep', strength: 'frosted' })
  await ui.unmount()
})
