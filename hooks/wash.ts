// Photo wash: six colours read from the person's own photo. The photo is
// shrunk on this Mac to 3 by 2 pixels; nothing of it is kept or sent anywhere.

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

const bytesOf = (base64: string): number[] => {
  const bytes: number[] = []
  let bits = 0
  let held = 0

  for (const letter of base64.replace(/=+$/, '')) {
    const value = BASE64.indexOf(letter)

    if (value < 0) {
      throw new Error('not a 3x2 BMP')
    }
    held = (held << 6) | value
    bits += 6
    if (bits >= 8) {
      bits -= 8
      bytes.push((held >> bits) & 0xff)
    }
  }

  return bytes
}

export const COLUMNS = 3
export const ROWS = 2

/** Reads a 3 by 2 BMP as sips writes it (24 or 32 bits a pixel): six `#rrggbb`, top-left to bottom-right. */
export const parseBmp = (base64: string): string[] => {
  const b = bytesOf(base64)
  const u32 = (at: number): number => (b[at]! | (b[at + 1]! << 8) | (b[at + 2]! << 16) | (b[at + 3]! << 24)) >>> 0
  const start = u32(10)
  const width = u32(18)
  const height = u32(22) | 0
  const depth = b[28]! | (b[29]! << 8)
  const stride = Math.ceil((width * depth) / 32) * 4

  if (
    b.length < 54 ||
    b[0] !== 0x42 ||
    b[1] !== 0x4d ||
    width !== COLUMNS ||
    Math.abs(height) !== ROWS ||
    (depth !== 24 && depth !== 32) ||
    // Plain pixels, or sips's 32-bit kind for a picture with transparency: masks naming the same blue, green, red order.
    !(u32(30) === 0 || (u32(30) === 3 && depth === 32 && u32(54) === 0x00ff0000 && u32(62) === 0x000000ff)) ||
    b.length < start + stride * ROWS
  ) {
    throw new Error('not a 3x2 BMP')
  }
  const hex = (value: number): string => value.toString(16).padStart(2, '0')
  const colours: string[] = []

  for (let row = 0; row < ROWS; row++) {
    // A positive height stores the bottom row first.
    const stored = height < 0 ? row : ROWS - 1 - row

    for (let column = 0; column < COLUMNS; column++) {
      const at = start + stored * stride + column * (depth / 8)

      colours.push(`#${hex(b[at + 2]!)}${hex(b[at + 1]!)}${hex(b[at]!)}`)
    }
  }

  return colours
}

/** Six colours as kept in the store, or undefined for anything else. */
export const parseWash = (stored: unknown): readonly string[] | undefined =>
  Array.isArray(stored) && stored.length === COLUMNS * ROWS && stored.every(one => typeof one === 'string' && /^#[0-9a-f]{6}$/.test(one))
    ? (stored as string[])
    : undefined

/** The path as typed or dropped in: quotes and the backslashes before spaces removed. */
export const cleanPath = (typed: string): string => {
  const path = typed.trim()
  const quoted = /^(['"])(.*)\1$/.exec(path)

  return quoted !== null ? quoted[2]! : path.replace(/\\(.)/g, '$1')
}
