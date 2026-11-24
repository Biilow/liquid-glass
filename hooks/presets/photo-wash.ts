import { blurredPhotos } from './blurred-photos'
import type { Preset } from './types'

// Blurred photos, drawn in six colours read from the person's own photo
// (`/glass-photo`); before a photo is read it shows Blurred photos' own.
export const photoWash: Preset = { ...blurredPhotos, id: 'photo-wash', name: 'Photo wash' }
