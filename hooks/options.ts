import type { Motion, PresetId } from './presets/types'

export type Options = {
  backdrop: PresetId
  /** '' or a lowercase '#rrggbb'. */
  tint: string
  strength: 'clear' | 'light' | 'medium' | 'frosted'
  blur: 'soft' | 'regular' | 'deep'
  motion: Motion
  glassMessages: boolean
}

export const DEFAULTS: Options = {
  backdrop: 'grainy-gradients',
  tint: '',
  strength: 'medium',
  blur: 'regular',
  motion: 'calm',
  glassMessages: true,
}

export const STRENGTHS = ['clear', 'light', 'medium', 'frosted'] as const
export const BLURS = ['soft', 'regular', 'deep'] as const
export const MOTIONS = ['still', 'calm', 'lively'] as const

const pick = <T extends string>(value: unknown, allowed: readonly T[], otherwise: T): T =>
  allowed.includes(value as T) ? (value as T) : otherwise

export const parseTint = (value: unknown): string => {
  if (typeof value !== 'string') {
    return ''
  }
  const trimmed = value.trim().toLowerCase()

  return /^#[0-9a-f]{6}$/.test(trimmed) ? trimmed : ''
}

/** Stored values as an Options, anything unusable replaced by its default. */
export const parseOptions = (raw: Readonly<Record<string, unknown>>, known: readonly string[]): Options => ({
  backdrop: pick(raw.backdrop, known, DEFAULTS.backdrop) as Options['backdrop'],
  tint: parseTint(raw.tint),
  strength: pick(raw.strength, STRENGTHS, DEFAULTS.strength),
  blur: pick(raw.blur, BLURS, DEFAULTS.blur),
  motion: pick(raw.motion, MOTIONS, DEFAULTS.motion),
  glassMessages: typeof raw.glassMessages === 'boolean' ? raw.glassMessages : DEFAULTS.glassMessages,
})

const say = (label: string, value: string): { text: string } => ({ text: `${label} set to ${value}.` })

/**
 * What `/glass <args>` does to these options, and the line it answers with.
 * Anything it does not know changes nothing and says what it would take.
 */
export const applyCommand = (
  options: Options,
  args: string,
  known: readonly string[],
): { options: Options; text: string } => {
  const [key = '', ...rest] = args.trim().toLowerCase().split(/\s+/)
  const value = rest.join('-')
  const choice = <T extends string>(label: string, allowed: readonly T[], set: (picked: T) => Options) =>
    allowed.includes(value as T)
      ? { options: set(value as T), ...say(label, value) }
      : { options, text: `"${rest.join(' ')}" is not a choice for ${key}. Choices: ${allowed.join(', ')}.` }

  switch (key) {
    case 'reset':
      return { options: DEFAULTS, text: 'Liquid Glass settings are back to their defaults.' }
    case 'backdrop':
      return choice('Backdrop', known, picked => ({ ...options, backdrop: picked as Options['backdrop'] }))
    case 'strength':
      return choice('Strength', STRENGTHS, strength => ({ ...options, strength }))
    case 'blur':
      return choice('Blur', BLURS, blur => ({ ...options, blur }))
    case 'motion':
      return choice('Motion', MOTIONS, motion => ({ ...options, motion }))
    case 'messages':
      return choice('Glass messages', ['on', 'off'] as const, picked => ({ ...options, glassMessages: picked === 'on' }))
    case 'tint': {
      const tint = parseTint(value)

      if (value !== 'none' && tint === '') {
        return { options, text: `"${rest.join(' ')}" is not a colour for tint. Use six-digit hex like #7aa2ff, or none.` }
      }

      return { options: { ...options, tint }, ...say('Tint', tint === '' ? 'none' : tint) }
    }
    default:
      return {
        options,
        text: `No setting called "${key}". Settings: backdrop, tint, strength, blur, motion, messages. Type /glass alone for the settings panel.`,
      }
  }
}
