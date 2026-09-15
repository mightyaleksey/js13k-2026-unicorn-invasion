/* @flow */

import { CAMERA_SPEED } from '../constants.mjs'
import { BulletState } from '../states/entities/BulletState.mjs'
import type { EntityState } from '../states/entities/EntityState.mjs'
import { BaseStatus } from './BaseStatus.mjs'

export type FrontShootingProps = Readonly<
  [interval: number, duration: number, angle: number, origin: number]
>

export class FrontShootingStatus extends BaseStatus {
  angle: number
  origin: number

  constructor (props: FrontShootingProps) {
    super([props[0], props[1]])
    this.angle = props[2]
    this.origin = props[3]
  }

  onTick (target: EntityState<>) {
    const projectile = new BulletState([
      target.centerX(),
      target.centerY(),
      this.angle,
      this.origin,
      0.6 * target.height
    ])

    if (target.camera.isMoving) {
      projectile.dy += -CAMERA_SPEED
    }

    target.entities.append(projectile)
  }
}
