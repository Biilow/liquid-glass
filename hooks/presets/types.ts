export type Motion = 'still' | 'calm' | 'lively'

export type PresetId =
  | 'felt-texture'
  | 'fluted-glass'
  | 'thermal-gradients'
  | 'water-ripples'
  | 'speckled-graphite'
  | 'single-hue-landscapes'
  | 'blueprint-grids'
  | 'halftone'
  | 'grainy-gradients'
  | 'grass-texture'
  | 'dithered-images'
  | 'paper-texture'
  | 'contour-lines'
  | 'cloud-sky'
  | 'pixel-mosaics'
  | 'lens-distortion'
  | 'stippled-gradients'
  | 'square-dot-grids'
  | 'blurred-photos'
  | 'iridescent-shapes'
  | 'impressionist-paintings'
  | 'ascii-and-pixels'
  | 'photo-wash'

export type Anchors = {
  'surface-0': string
  'surface-1'?: string
  'surface-2'?: string
  'surface-3'?: string
  'text-primary': string
  'text-secondary'?: string
  'text-muted'?: string
}

export type Preset = {
  id: PresetId
  name: string
  kind: 'svg' | 'shader'
  roles: { accent: string; danger: string; success: string; warning: string; pro: string }
  light: Anchors
  dark: Anchors
  /** Lowest glass opacity at which panels stay readable over this scene. */
  minOpacity: number
  svg: (motion: Motion, wash?: readonly string[]) => string
}
