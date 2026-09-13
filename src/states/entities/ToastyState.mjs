/* @flow */

import { TILE_SIZE } from '../../constants.mjs'
import { Dimentions } from '../../engine.mjs'
import { EntityState } from './EntityState.mjs'

const scale = 4
const w = scale * 18
const h = scale * 2 * TILE_SIZE

export class ToastyState extends EntityState {
  constructor () {
    super([Dimentions.width + 0.5 * w + 1, Dimentions.height - 0.5 * h, w, h])
    this.frameID = 8
  }

  update (delta: number) {
    this.x = Dimentions.width + 1
  }
}
