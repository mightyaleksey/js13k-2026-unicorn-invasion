/* @flow */

export function getGloominess (level: number): number {
  return ((level / 6) * level) / 6
}
