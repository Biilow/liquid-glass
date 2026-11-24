import type { Hook } from 'claude-code'

import { BLURS, DEFAULTS, MOTIONS, STRENGTHS, parseTint } from './options'
import type { Options } from './options'
import { PRESETS, PRESET_IDS } from './presets/index'
import type { PresetId } from './presets/types'
import { glassPreview } from './preview'
import { change, current, currentWash, washFrom } from './state'

type Render = Parameters<Hook<'ui.render'>>

// Tints to press; any other colour goes in the field beneath them.
const TINTS = [
  ['#7aa2ff', 'Blue'],
  ['#ff8fb1', 'Rose'],
  ['#7fd6b0', 'Mint'],
  ['#ffc46b', 'Amber'],
  ['#b79cff', 'Violet'],
  ['#9aa3ad', 'Graphite'],
] as const

const THUMB = { width: 148, height: 92 }
const HERO = { width: 312, height: 195 }

const title = (word: string): string => word[0]!.toUpperCase() + word.slice(1)

const dot = (colour: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="${colour}" stroke="#00000033"/></svg>`

/** The settings panel: a picture of the app as set, then every setting one press away. */
export function drawPanel($: Render[0], e: Render[1]) {
  const table = $.ui.resolve(e)
  const { Box, Button, Input, Text } = table
  // The terminal draws no pictures; it gets the same controls without them.
  const Svg = 'Svg' in table ? table.Svg : undefined
  const options = current()
  const wash = currentWash()
  const preset = PRESETS[options.backdrop as PresetId]
  const set = (changed: Partial<Options>) => change($, { ...current(), ...changed })

  // One row of choices for one setting, the one in use marked.
  const row = <T extends string>(name: string, values: readonly T[], inUse: T, pick: (value: T) => Partial<Options>) => (
    <Box flexDirection="row" flexWrap="wrap" gap="xs">
      {values.map(value => (
        <Button key={`${name}:${value}`} variant={value === inUse ? 'primary' : 'secondary'} onPress={() => set(pick(value))}>
          {title(value)}
        </Button>
      ))}
    </Box>
  )
  const heading = (words: string) => (
    <Text size="footnote" weight="semibold" dimColor>
      {words}
    </Text>
  )

  return (
    <Box flexDirection="column" gap="md" padding="sm">
      {Svg !== undefined && preset !== undefined && (
        <Box borderStyle="round" borderColor="border" overflow="hidden" alignSelf="center">
          <Svg source={glassPreview(options, preset, wash)} alt={`Your glass over ${preset.name}`} width={HERO.width} height={HERO.height} />
        </Box>
      )}

      <Box flexDirection="column" gap="xs">
        {heading('Backdrop')}
        <Box flexDirection="row" flexWrap="wrap" gap="sm">
          {PRESET_IDS.map(id => {
            const one = PRESETS[id]!
            const isInUse = id === options.backdrop

            return (
              <Box
                key={`card:${id}`}
                flexDirection="column"
                gap="xs"
                width={THUMB.width + 2}
                borderStyle="round"
                borderColor={isInUse ? 'border-accent' : 'border'}
                hover={{ borderColor: 'border-strong' }}
                overflow="hidden"
              >
                {Svg !== undefined && (
                  <Svg source={one.svg('still', wash)} alt={`${one.name} preview`} width={THUMB.width} height={THUMB.height} />
                )}
                <Button key={`backdrop:${id}`} plain variant={isInUse ? 'primary' : 'secondary'} dimColor={!isInUse} onPress={() => set({ backdrop: id })}>
                  {isInUse ? `● ${one.name}` : one.name}
                </Button>
              </Box>
            )
          })}
        </Box>
        <Input
          key="photo"
          label="Photo wash from your own photo"
          placeholder="~/Pictures/beach.jpg"
          submitLabel="use photo"
          onSubmit={async typed => {
            $.ui.toast(await washFrom($, typed))
          }}
        />
      </Box>

      <Box flexDirection="column" gap="xs">
        {heading('Tint')}
        <Box flexDirection="row" flexWrap="wrap" gap="sm" alignItems="center">
          <Button key="tint:none" variant={options.tint === '' ? 'primary' : 'secondary'} onPress={() => set({ tint: '' })}>
            None
          </Button>
          {TINTS.map(([colour, name]) => (
            <Box key={`swatch:${colour}`} flexDirection="row" gap="xs" alignItems="center">
              {Svg !== undefined && <Svg source={dot(colour)} alt="" width={14} height={14} />}
              <Button key={`tint:${colour}`} variant={options.tint === colour ? 'primary' : 'secondary'} onPress={() => set({ tint: colour })}>
                {name}
              </Button>
            </Box>
          ))}
        </Box>
        <Input
          key="tint"
          label="Custom"
          placeholder="#7aa2ff"
          value={options.tint}
          submitLabel="apply"
          onSubmit={typed => {
            const tint = parseTint(typed)

            // Empty clears the tint; anything else must be a colour.
            return typed.trim() === '' || tint !== '' ? set({ tint }) : undefined
          }}
        />
      </Box>

      <Box flexDirection="column" gap="xs">
        {heading('Glass strength')}
        {row('strength', STRENGTHS, options.strength, strength => ({ strength }))}
      </Box>
      <Box flexDirection="column" gap="xs">
        {heading('Blur')}
        {row('blur', BLURS, options.blur, blur => ({ blur }))}
      </Box>
      <Box flexDirection="column" gap="xs">
        {heading('Motion')}
        {row('motion', MOTIONS, options.motion, motion => ({ motion }))}
      </Box>
      <Box flexDirection="column" gap="xs">
        {heading('Glass messages')}
        {row('messages', ['on', 'off'] as const, options.glassMessages ? 'on' : 'off', picked => ({ glassMessages: picked === 'on' }))}
      </Box>

      <Box flexDirection="row" gap="sm" alignItems="center">
        <Button key="reset" onPress={() => change($, DEFAULTS)}>
          Reset to defaults
        </Button>
        <Text size="caption" dimColor>
          Changes apply at once and are kept.
        </Text>
      </Box>
    </Box>
  )
}
