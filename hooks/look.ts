import type { ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import type { Options } from './options'
import type { Anchors, Preset } from './presets/types'

const OPACITY = { clear: 0.35, light: 0.5, medium: 0.65, frosted: 0.8 } as const
const BLUR = { soft: 12, regular: 24, deep: 40 } as const
/** A tint colors the surfaces this strongly at most, so text keeps its contrast. */
const TINT_SATURATION = 0.35
const SURFACES = ['surface-0', 'surface-1', 'surface-2', 'surface-3'] as const

type Hsl = { h: number; s: number; l: number }

const toHsl = (hex: string): Hsl => {
  const [r, g, b] = [1, 3, 5].map(at => parseInt(hex.slice(at, at + 2), 16) / 255) as [number, number, number]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min

  if (d === 0) {
    return { h: 0, s: 0, l }
  }
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4

  return { h: h * 60, s, l }
}

const toHex = ({ h, s, l }: Hsl): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]

  return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')
}

/** How bright a color reads (WCAG relative luminance, 0 to 1): what contrast is measured from. */
export const luminanceOf = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map(at => {
    const v = parseInt(hex.slice(at, at + 2), 16) / 255

    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** This hue and saturation at the lightness that reads as bright as `like`. */
const matchLuminance = (h: number, s: number, like: string): string => {
  const target = luminanceOf(like)
  let low = 0
  let high = 1

  for (let step = 0; step < 16; step++) {
    const mid = (low + high) / 2

    if (luminanceOf(toHex({ h, s, l: mid })) < target) {
      low = mid
    } else {
      high = mid
    }
  }

  return toHex({ h, s, l: (low + high) / 2 })
}

/**
 * The surfaces take the tint's hue and stay as bright as they were, so text
 * over them keeps its contrast whatever the hue; text is untouched.
 */
export const tintAnchors = (anchors: Anchors, tint: string): Anchors => {
  if (tint === '') {
    return anchors
  }
  const { h, s } = toHsl(tint)
  const out: Anchors = { ...anchors }

  for (const key of SURFACES) {
    const surface = anchors[key]

    if (surface !== undefined) {
      out[key] = matchLuminance(h, Math.min(s, TINT_SATURATION), surface)
    }
  }

  return out
}

/** How strongly the panels frost over this preset: never clearer than the preset can stay readable at. */
export const glassOf = (options: Options, preset: Preset): { blur: number; opacity: number } => ({
  blur: BLUR[options.blur],
  opacity: Math.max(preset.minOpacity, OPACITY[options.strength]),
})

/** The whole look for these options over this preset, and what makeColors says of it. */
export const buildLook = (options: Options, preset: Preset): { look: ThemeSetArgs; problems: string[] } => {
  const { theme, problems } = makeColors({
    label: preset.name,
    roles: preset.roles,
    light: { gray: { anchors: tintAnchors(preset.light, options.tint) } },
    dark: { gray: { anchors: tintAnchors(preset.dark, options.tint) } },
  })
  const look: ThemeSetArgs = {
    colors: theme,
    backdrop: {
      scene: preset.id,
      glass: glassOf(options, preset),
    },
  }

  if (options.glassMessages) {
    look.style = {
      UserMessage: {
        backgroundColor: 'surface-2',
        borderColor: 'surface-3',
        borderWidth: 1,
        radius: 20,
        paddingX: 14,
        paddingY: 10,
        shadow: { y: 2, blur: 12, color: '#0000001f' },
      },
      ToolUse: { backgroundColor: 'surface-1', radius: 10, paddingX: 8 },
    }
  }

  return { look, problems }
}
