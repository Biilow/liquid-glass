import { expect, test } from 'claude-code/testing'

import { cleanPath, parseBmp, parseWash } from './wash'

// What sips wrote for a blue desktop picture shrunk to 3 by 2: top row first, pixels as blue, green, red.
const SIPS = 'Qk1OAAAAAAAAADYAAAAoAAAAAwAAAP7///8BABgAAAAAABIAAAATCwAAEwsAAAAAAAAAAAAA8bl69LOB8757AAAA7Klh77Bw7q9xAAAA'
const BLUES = ['#7ab9f1', '#81b3f4', '#7bbef3', '#61a9ec', '#70b0ef', '#71afee']

test('parseBmp reads six colours, top-left to bottom-right', () => {
  expect(parseBmp(SIPS)).toEqual(BLUES)
})

test('parseBmp refuses anything that is not a 3 by 2 BMP', () => {
  expect(() => parseBmp('AAAA')).toThrow('not a 3x2 BMP')
  expect(() => parseBmp('not base64!')).toThrow('not a 3x2 BMP')
})

test('parseWash keeps six colours and drops anything else', () => {
  expect(parseWash(BLUES)).toEqual(BLUES)
  expect(parseWash(BLUES.slice(1))).toBeUndefined()
  expect(parseWash([...BLUES.slice(1), '"/><script>'])).toBeUndefined()
  expect(parseWash('nope')).toBeUndefined()
})

test('cleanPath takes quotes and escaped spaces off a dropped path', () => {
  expect(cleanPath(' "/a b/c.jpg" ')).toBe('/a b/c.jpg')
  expect(cleanPath('/a\\ b/c.jpg')).toBe('/a b/c.jpg')
})

// What sips wrote for a PNG with transparency: 32 bits a pixel, with colour masks.
const ALPHA =
  'Qk2iAAAAAAAAAIoAAAB8AAAAAwAAAP7///8BACAAAwAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAD/AAD/AAAAAAAA/0JHUnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMmTJtzNmzf8yZMj/M2bN/zJkyP8yZMj/'

test('parseBmp reads the 32-bit picture sips writes for a transparent PNG', () => {
  expect(parseBmp(ALPHA)).toEqual(['#c96432', '#cd6633', '#c86432', '#cd6633', '#c86432', '#c86432'])
})
