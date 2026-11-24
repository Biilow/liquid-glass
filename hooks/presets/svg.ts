import type { Motion } from './types'

/** The scene's viewBox, shared so every preset draws in the same space. */
export const W = 1600
export const H = 1000

/**
 * One scene: `style` always applies (colors by mode), `animation` only when
 * the scene moves, so a still scene is the markup at rest.
 */
export const scene = (parts: {
  motion: Motion
  defs?: string
  style?: string
  animation?: string
  body: string
}): string => {
  const css = (parts.style ?? '') + (parts.motion === 'still' ? '' : (parts.animation ?? ''))

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    (css === '' ? '' : `<style>${css}</style>`) +
    (parts.defs === undefined ? '' : `<defs>${parts.defs}</defs>`) +
    parts.body +
    '</svg>'
  )
}

/** Seconds for a loop: calm is the slow end, lively the quick end. */
export const pace = (motion: Motion, calm: number, lively: number): number => (motion === 'lively' ? lively : calm)

/**
 * A wide soft light that crosses a textured scene. It lies over the texture,
 * so the texture's filter is drawn once and only this circle moves.
 */
export const sheen = (motion: Motion, strength = 0.2): { defs: string; animation: string; body: string } => ({
  defs:
    `<radialGradient id="sheen"><stop offset="0" stop-color="#ffffff" stop-opacity="${strength}"/>` +
    '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>',
  animation:
    '@keyframes sheen{to{transform:translate(900px,320px)}}' +
    `.sheen{animation:sheen ${pace(motion, 80, 40)}s ease-in-out infinite alternate}`,
  body: '<circle class="sheen" cx="350" cy="320" r="720" fill="url(#sheen)"/>',
})

/** A repeatable stream of numbers from 0 up to 1, so a scattered scene is the same every draw. */
export const scatter = (seed: number): (() => number) => {
  let state = seed

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296

    return state / 4294967296
  }
}
