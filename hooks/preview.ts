import { glassOf, tintAnchors } from './look'
import type { Options } from './options'
import { H, W } from './presets/svg'
import type { Preset } from './presets/types'

// The little app the preview draws: a sidebar and a conversation, in the scene's own units.
const SIDE = { x: 60, y: 60, w: 400, h: H - 120 }
const MAIN = { x: 520, y: 60, w: W - 580, h: H - 120 }
const ROUND = 46

const panel = (id: string, at: typeof SIDE, picture: string, opacity: number): string =>
  `<g clip-path="url(#${id})"><g filter="url(#frost)">${picture}</g>` +
  `<rect class="pane" x="${at.x}" y="${at.y}" width="${at.w}" height="${at.h}" opacity="${opacity}"/></g>` +
  `<rect class="edge" x="${at.x}" y="${at.y}" width="${at.w}" height="${at.h}" rx="${ROUND}" fill="none" stroke-width="3"/>`

const line = (x: number, y: number, w: number, strength = 0.42): string =>
  `<rect class="pv-ink" x="${x}" y="${y}" width="${w}" height="22" rx="11" opacity="${strength}"/>`

/**
 * A picture of the app under these settings: the backdrop, and over it two
 * panels frosted, tinted and blurred as the real ones will be.
 */
export const glassPreview = (options: Options, preset: Preset, wash?: readonly string[]): string => {
  const picture = preset.svg('still', wash)
  const { blur, opacity } = glassOf(options, preset)
  const light = tintAnchors(preset.light, options.tint)
  const dark = tintAnchors(preset.dark, options.tint)
  const clip = (id: string, at: typeof SIDE): string =>
    `<clipPath id="${id}"><rect x="${at.x}" y="${at.y}" width="${at.w}" height="${at.h}" rx="${ROUND}"/></clipPath>`
  const bubble = options.glassMessages
    ? `<rect class="bubble" x="${MAIN.x + MAIN.w - 520}" y="${MAIN.y + 70}" width="460" height="120" rx="40"/>`
    : ''

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<style>.pane{fill:${light['surface-1'] ?? light['surface-0']}}.bubble{fill:${light['surface-2'] ?? light['surface-0']}}` +
    `.pv-ink{fill:${light['text-primary']}}.edge{stroke:#ffffff;opacity:0.5}` +
    `@media (prefers-color-scheme: dark){.pane{fill:${dark['surface-1'] ?? dark['surface-0']}}` +
    `.bubble{fill:${dark['surface-2'] ?? dark['surface-0']}}.pv-ink{fill:${dark['text-primary']}}.edge{opacity:0.16}}</style>` +
    // The blur is in the scene's units: a window about as wide as the scene, so nearly point for point.
    `<defs><filter id="frost" x="0" y="0" width="100%" height="100%"><feGaussianBlur stdDeviation="${Math.round(blur * 1.2)}"/></filter>` +
    clip('side', SIDE) +
    clip('main', MAIN) +
    '</defs>' +
    picture +
    panel('side', SIDE, picture, opacity) +
    panel('main', MAIN, picture, opacity) +
    [0, 1, 2, 3, 4].map(row => line(SIDE.x + 50, SIDE.y + 70 + row * 64, row % 2 === 0 ? 260 : 200, row === 1 ? 0.7 : 0.32)).join('') +
    bubble +
    line(MAIN.x + MAIN.w - 470, MAIN.y + 100, 360, 0.6) +
    line(MAIN.x + MAIN.w - 470, MAIN.y + 140, 240, 0.6) +
    [0, 1, 2, 3].map(row => line(MAIN.x + 70, MAIN.y + 290 + row * 52, [720, 640, 760, 420][row]!)).join('') +
    `<rect class="bubble" x="${MAIN.x + 60}" y="${MAIN.y + MAIN.h - 150}" width="${MAIN.w - 120}" height="90" rx="45"/>` +
    line(MAIN.x + 110, MAIN.y + MAIN.h - 116, 300, 0.3) +
    '</svg>'
  )
}
