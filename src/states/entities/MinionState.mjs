/* @flow */

import {
  FRAMES,
  MINION_SPEED,
  O_MINION,
  TILE_SIZE,
  UNIT_VECTORS
} from '../../constants.mjs'
import { shuffle } from '../../libs/random.mjs'
import { range } from '../../libs/range.mjs'
import { DirectionStatus } from '../../statuses/DirectionStatus.mjs'
import { FrontShootingStatus } from '../../statuses/FrontShootingStatus.mjs'
import { CharacterState } from './archetypes/CharacterState.mjs'

export type MinionProps = Readonly<[x: number, y: number]>

export class MinionState extends CharacterState<> {
  directionIndex: number
  directions: Array<number>

  constructor (props: MinionProps) {
    super([props[0], props[1], TILE_SIZE, TILE_SIZE])

    this.animations = this.genAnimations(FRAMES.minion)
    this.currentAnimation = this.animations[0]

    this.directionIndex = -1
    this.directions = shuffle(range(4).concat(range(4)))
    this.switchDirection()

    this.hp = 1
    this.hpMax = 1

    this.statuses.push(
      new DirectionStatus(),
      new FrontShootingStatus([1, 0, 90, O_MINION])
    )
  }

  /* helpers */

  switchDirection () {
    this.directionIndex = (this.directionIndex + 1) % this.directions.length
    const vector = UNIT_VECTORS[this.directions[this.directionIndex]]
    this.dx = vector[0] * MINION_SPEED
    this.dy = vector[1] * MINION_SPEED
  }
}
