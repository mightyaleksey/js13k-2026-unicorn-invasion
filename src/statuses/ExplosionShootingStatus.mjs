/* @flow */

import {
  EXPLOSION_SIZE,
  PLAY_AREA,
  S_AREA_INTERVAL,
  TILE_SIZE
} from '../constants.mjs'
import { Dimentions } from '../engine.mjs'
import { progress } from '../gameState.mjs'
import { viewport } from '../helpers/viewport.mjs'
import { nullthrows } from '../libs/nullthrows.mjs'
import { shuffle } from '../libs/random.mjs'
import type { BossState } from '../states/entities/BossState.mjs'
import { ExplosionState } from '../states/entities/ExplosionState.mjs'
import { HighlightState } from '../states/entities/HighlightState.mjs'
import { BaseStatus } from './BaseStatus.mjs'

const iterations = 4

export class ExplosionShootingStatus extends BaseStatus<BossState> {
  displayCount: number
  totalCount: number

  seqIndex: number
  sequence: ReadonlyArray<[number, number]>

  isShowing: boolean

  constructor () {
    super([S_AREA_INTERVAL, 0])

    const sequence = this.genSequence()
    this.displayCount = Math.floor(sequence.length / iterations)
    this.totalCount = this.displayCount * iterations

    this.seqIndex = 0
    this.sequence = sequence.slice(0, this.totalCount)

    this.isShowing = true
  }

  onTick (target: BossState) {
    progress.bossSeen = 1

    for (let j = 0; j < this.displayCount; ++j) {
      this.genEntity(target)
      this.seqIndex++
    }

    if (this.seqIndex >= this.sequence.length) {
      if (!this.isShowing) {
        this.isExpired = true
        return
      }

      this.seqIndex = 0
      this.isShowing = false
    }
  }

  /* helpers */

  genEntity (target: BossState) {
    const coords = nullthrows(this.sequence[this.seqIndex])
    const K = this.isShowing ? HighlightState : ExplosionState
    target.entities.append(new K(coords))
  }

  genSequence (): ReadonlyArray<[number, number]> {
    const coords = []

    const mx = Math.floor(((PLAY_AREA - 2) * TILE_SIZE) / EXPLOSION_SIZE)
    const my = Math.floor(
      Math.max(0.5 * Dimentions.height, 3 * TILE_SIZE) / EXPLOSION_SIZE
    )

    const offsetX = -0.5 * mx * EXPLOSION_SIZE
    const offsetY = viewport.y + viewport.height - my * EXPLOSION_SIZE

    for (let y = 0; y < my; ++y) {
      for (let x = 0; x < mx; ++x) {
        coords.push([
          x * EXPLOSION_SIZE + offsetX,
          y * EXPLOSION_SIZE + offsetY
        ])
      }
    }

    return shuffle(coords)
  }
}
