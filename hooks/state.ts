import type { Hook } from 'claude-code'

import { buildLook } from './look'
import { DEFAULTS, parseOptions } from './options'
import type { Options } from './options'
import { PRESETS, PRESET_IDS } from './presets/index'
import type { PresetId } from './presets/types'
import { ROWS, COLUMNS, cleanPath, parseBmp, parseWash } from './wash'

export type Dollar = Parameters<Hook<'session.start'>>[0]

/** The `$.store` key the settings are kept under, between sessions. */
const STORED = 'options'

// The settings in use: read from the store at session.start, which a reload runs again.
let options: Options = DEFAULTS

export const current = (): Options => options

/** The `$.store` key the photo's six colours are kept under. */
const WASH = 'wash'

// Photo wash's colours; undefined until a photo has been read.
let wash: readonly string[] | undefined

export const currentWash = (): readonly string[] | undefined => wash

/** Sets the whole look for the settings in use and has everything drawn again. */
async function show($: Dollar): Promise<void> {
  const preset = PRESETS[options.backdrop as PresetId]

  if (preset === undefined) {
    return
  }
  const { look, problems } = buildLook(options, preset)
  const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

  if (unpainted !== undefined) {
    $.ui.toast(unpainted)
  }
  const set = await $.theme.set(look)

  if (!set.isDrawn) {
    $.ui.status(set.reason)
  }
  $.ui.invalidate('ui.render')
}

/** Reads what an earlier session kept, and shows it. */
export async function load($: Dollar): Promise<void> {
  const stored = await $.store.get(STORED)

  wash = parseWash(await $.store.get(WASH))
  options = parseOptions(typeof stored === 'object' && stored !== null ? (stored as Record<string, unknown>) : {}, PRESET_IDS)
  await show($)
}

/** Every change, typed or pressed, goes through here: kept, then shown. */
export async function change($: Dollar, changed: Options): Promise<void> {
  if (changed === options) {
    return
  }
  options = changed
  await $.store.set(STORED, options)
  await show($)
}

/**
 * Reads six colours from the photo at `typed` and switches to Photo wash.
 * Answers what happened, in words for the person; a failure changes nothing.
 */
export async function washFrom($: Dollar, typed: string): Promise<string> {
  let path = cleanPath(typed)

  if (path === '') {
    return 'Give the path of a photo: /glass-photo ~/Pictures/beach.jpg'
  }
  const shrunk = `${$.plugin.root}/.wash.bmp`
  let read: string[]

  try {
    if (path === '~' || path.startsWith('~/')) {
      // No user text reaches this shell line.
      const home = await $.process.run(['/bin/sh', '-c', 'printf %s "$HOME"'])

      path = home.stdout + path.slice(1)
    }
    if (!(await $.fs.exists(path))) {
      return `No file at ${path}.`
    }
    // Argument list, no shell; `--` is not sips's, so a leading dash is fenced with `./`.
    // sips skips a folder without failing; emptied first, an earlier photo cannot be read in its place.
    await $.fs.write(shrunk, '')
    const source = path.startsWith('-') ? `./${path}` : path
    const ran = await $.process.run(['/usr/bin/sips', '-s', 'format', 'bmp', '-z', String(ROWS), String(COLUMNS), source, '--out', shrunk])

    if (ran.exitCode !== 0) {
      return `That file could not be read as a picture: ${path}`
    }
    const { base64 } = await $.fs.read(shrunk, { as: 'bytes' })

    if (base64 === '') {
      return `That file could not be read as a picture: ${path}`
    }
    read = parseBmp(base64)
  } catch (error) {
    return `Photo wash could not read the photo (${error instanceof Error ? error.message : String(error)}).`
  }
  const washed: Options = { ...options, backdrop: 'photo-wash' }

  await $.store.set(WASH, read)
  await $.store.set(STORED, washed)
  wash = read
  options = washed
  await show($)

  return `Photo wash set from ${path.slice(path.lastIndexOf('/') + 1)}.`
}
