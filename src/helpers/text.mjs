/* @flow */

import { getTextWidth } from '../engine.mjs'

export function formatLines (
  inputLines: ReadonlyArray<string>,
  width: number
): ReadonlyArray<string> {
  const lines = []

  for (const paragraph of inputLines) {
    const words = paragraph.split(' ')

    let current = words[0]
    for (let i = 1; i < words.length; ++i) {
      const test = current + ' ' + words[i]
      if (getTextWidth(test) <= width) {
        current = test
      } else {
        lines.push(test)
        current = words[i]
      }
    }

    lines.push(current)
    lines.push('')
  }

  lines.pop()

  return lines
}
