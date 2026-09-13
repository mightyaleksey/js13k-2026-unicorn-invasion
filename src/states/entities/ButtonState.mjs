/* @flow */

import { TILE_SIZE } from '../../constants.mjs'
import { Touch } from '../../engine.mjs'
import { collides } from '../../libs/collides.mjs'
import { EntityState } from './EntityState.mjs'

export type ButtonProps = Readonly<
  [x: number, y: number, width: number, height: number, callback: () => void]
>

export class ButtonState extends EntityState {
  cb: () => void

  constructor (props: ButtonProps) {
    super([props[0], props[1], props[2], props[3]])
    this.cb = props[4]
  }

  update (delta: number) {
    if (!Touch.wasTouched()) return
    const coords = Touch.getPosition()
    if (coords == null) return

    const rect = {
      x: coords[0] - 0.5 * TILE_SIZE,
      y: coords[1] - 0.5 * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE
    }

    if (collides(this, rect)) {
      this.cb()
    }
  }
}
