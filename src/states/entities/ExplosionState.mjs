/* @flow */

import {
  EXPLOSION_DURATION,
  EXPLOSION_SIZE,
  O_BOSS_EXPLOSION
} from '../../constants.mjs'
import { DelayedDeathStatus } from '../../statuses/DelayedDeathStatus.mjs'
import { ProjectileState } from './archetypes/ProjectileState.mjs'

export type ExplosionProps = Readonly<[x: number, y: number]>

export class ExplosionState extends ProjectileState {
  constructor (props: ExplosionProps) {
    super([
      props[0],
      props[1],
      EXPLOSION_SIZE,
      EXPLOSION_SIZE,
      O_BOSS_EXPLOSION
    ])
    this.statuses.push(new DelayedDeathStatus([0, EXPLOSION_DURATION]))
  }
}
