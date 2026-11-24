import type { Register } from 'claude-code'

import { applyCommand } from './options'
import { drawPanel } from './panel'
import { PRESETS, PRESET_IDS } from './presets/index'
import type { PresetId } from './presets/types'
import { change, current, currentWash, load, washFrom } from './state'

const NAME = 'liquid-glass'
const COMMAND = 'glass'
const PHOTO = 'glass-photo'
const PANEL = 'liquid-glass-settings'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: COMMAND,
      description: 'Open the Liquid Glass settings panel: backdrop, tint, strength, blur, motion',
    })
    await $.command.register({
      name: PHOTO,
      description: 'Make the backdrop a soft wash of colour from a photo of yours: /glass-photo <path>',
    })
    await load($)

    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    if (e.args.trim() === '') {
      await $.ui.open({ id: PANEL, title: 'Liquid Glass' })

      return { text: 'Liquid Glass settings opened.' }
    }
    const applied = applyCommand(current(), e.args, PRESET_IDS)

    await change($, applied.options)

    return { text: applied.text }
  })

  on('command.run', { command: PHOTO }, async ($, e) => ({ text: await washFrom($, e.args) }))

  on('ui.render', { component: 'Pane', requestId: PANEL }, ($, e) => drawPanel($, e))

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.plugin !== NAME) {
      return next(e)
    }
    const preset = PRESETS[e.props.scene as PresetId]

    if (preset === undefined) {
      return next(e)
    }
    const { Shader, Svg } = $.ui.resolve(e)
    const { motion } = current()
    const picture = <Svg source={preset.svg(motion, currentWash())} alt={`${preset.name} backdrop`} isInteractive />

    if (preset.kind === 'svg' || motion === 'still') {
      return picture
    }
    const values = { lively: motion === 'lively' ? 1 : 0 }

    // One element a shader: the engine reads each `module` path off the source.
    switch (preset.id) {
      case 'fluted-glass':
        return (
          <Shader module="./presets/fluted-glass.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'water-ripples':
        return (
          <Shader module="./presets/water-ripples.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'thermal-gradients':
        return (
          <Shader module="./presets/thermal-gradients.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'halftone':
        return (
          <Shader module="./presets/halftone.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'dithered-images':
        return (
          <Shader module="./presets/dithered-images.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'contour-lines':
        return (
          <Shader module="./presets/contour-lines.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'cloud-sky':
        return (
          <Shader module="./presets/cloud-sky.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'pixel-mosaics':
        return (
          <Shader module="./presets/pixel-mosaics.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'lens-distortion':
        return (
          <Shader module="./presets/lens-distortion.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'stippled-gradients':
        return (
          <Shader module="./presets/stippled-gradients.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      case 'iridescent-shapes':
        return (
          <Shader module="./presets/iridescent-shapes.shader.ts" values={values}>
            {picture}
          </Shader>
        )
      default:
        return picture
    }
  })
}
