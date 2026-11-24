import { asciiAndPixels } from './ascii-and-pixels'
import { blueprintGrids } from './blueprint-grids'
import { blurredPhotos } from './blurred-photos'
import { cloudSky } from './cloud-sky'
import { contourLines } from './contour-lines'
import { ditheredImages } from './dithered-images'
import { feltTexture } from './felt-texture'
import { flutedGlass } from './fluted-glass'
import { grainyGradients } from './grainy-gradients'
import { grassTexture } from './grass-texture'
import { halftone } from './halftone'
import { impressionistPaintings } from './impressionist-paintings'
import { iridescentShapes } from './iridescent-shapes'
import { lensDistortion } from './lens-distortion'
import { paperTexture } from './paper-texture'
import { photoWash } from './photo-wash'
import { pixelMosaics } from './pixel-mosaics'
import { singleHueLandscapes } from './single-hue-landscapes'
import { speckledGraphite } from './speckled-graphite'
import { squareDotGrids } from './square-dot-grids'
import { stippledGradients } from './stippled-gradients'
import { thermalGradients } from './thermal-gradients'
import type { Preset, PresetId } from './types'
import { waterRipples } from './water-ripples'

// Every preset, in the reel's order, then the one made from the person's own photo.
export const PRESETS: Readonly<Record<PresetId, Preset>> = {
  'felt-texture': feltTexture,
  'fluted-glass': flutedGlass,
  'thermal-gradients': thermalGradients,
  'water-ripples': waterRipples,
  'speckled-graphite': speckledGraphite,
  'single-hue-landscapes': singleHueLandscapes,
  'blueprint-grids': blueprintGrids,
  'halftone': halftone,
  'grainy-gradients': grainyGradients,
  'grass-texture': grassTexture,
  'dithered-images': ditheredImages,
  'paper-texture': paperTexture,
  'contour-lines': contourLines,
  'cloud-sky': cloudSky,
  'pixel-mosaics': pixelMosaics,
  'lens-distortion': lensDistortion,
  'stippled-gradients': stippledGradients,
  'square-dot-grids': squareDotGrids,
  'blurred-photos': blurredPhotos,
  'iridescent-shapes': iridescentShapes,
  'impressionist-paintings': impressionistPaintings,
  'ascii-and-pixels': asciiAndPixels,
  'photo-wash': photoWash,
}

export const PRESET_IDS = Object.keys(PRESETS) as readonly PresetId[]
