/* @flow */

import { BULLET_SIZE, BULLET_SPEED } from '../../constants.mjs'
import { ProjectileState } from './archetypes/ProjectileState.mjs'

export type BulletProps = Readonly<
  [x: number, y: number, angle: number, origin: number, offset?: number]
>

export class BulletState extends ProjectileState {
  constructor (props: BulletProps) {
    super([props[0], props[1], BULLET_SIZE, BULLET_SIZE, props[3]])
    this.directByAngle(props[2], BULLET_SPEED)
    if (props[4] != null) {
      this.shiftByAngle(props[2], props[4] + BULLET_SIZE)
    }
  }
}
