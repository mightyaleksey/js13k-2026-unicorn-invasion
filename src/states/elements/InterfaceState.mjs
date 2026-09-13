/* @flow */

import { FONT_SMALL, TILE_SIZE } from '../../constants.mjs'
import { Dimentions, printf, rect, setColor, setFont } from '../../engine.mjs'
import { progress } from '../../gameState.mjs'
import { BaseState } from '../BaseState.mjs'
import type { PlayerState } from '../entities/PlayerState.mjs'

export type InterfaceProps = Readonly<[player: PlayerState]>

export class InterfaceState extends BaseState {
  player: PlayerState

  constructor (props: InterfaceProps) {
    super()
    this.player = props[0]
  }

  render () {
    const { hp, hpMax } = this.player
    const barSize = 0.1 * Dimentions.width

    setColor('#262d38')
    rect('fill', -1, -1, Dimentions.width + 2, TILE_SIZE)

    const barX = TILE_SIZE
    const barY = 6
    setColor('#8d1c2c')
    rect('line', barX, barY, barSize, 4)
    rect('fill', barX, barY, Math.max((barSize * hp) / hpMax, 1), 4)

    setColor('#fff')
    setFont(FONT_SMALL)
    printf(
      String(progress.scores).padStart(6, '0'),
      0.5 * Dimentions.width,
      TILE_SIZE - 6,
      0.5 * Dimentions.width - TILE_SIZE,
      'right'
    )
  }
}
