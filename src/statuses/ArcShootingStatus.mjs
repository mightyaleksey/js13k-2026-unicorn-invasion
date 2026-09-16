/* @flow */

import { O_BOSS_ARC, S_ARC_DURATION, S_ARC_INTERVAL } from '../constants.mjs'
import { progress } from '../gameState.mjs'
import type { BossState } from '../states/entities/BossState.mjs'
import { BulletState } from '../states/entities/BulletState.mjs'
import { BaseStatus } from './BaseStatus.mjs'

const count = 4
const step = Math.ceil(180 / (5 * count))
const finalAngle = 0.5 * (180 - (5 * count - 1) * step)
const startAngle = 180 - finalAngle

export class ArcShootingStatus extends BaseStatus<BossState> {
  angle: number

  constructor () {
    super([S_ARC_INTERVAL, S_ARC_DURATION])
    this.angle = startAngle
  }

  onTick (target: BossState) {
    progress.arcSeen = 1
    progress.bossSeen = 1

    const interval = step * count
    for (let angle = this.angle; angle > this.angle - interval; angle -= step) {
      const projectile = new BulletState([
        target.centerX(),
        target.centerY(),
        angle,
        O_BOSS_ARC,
        Math.max(target.width, target.height)
      ])

      target.entities.append(projectile)
    }

    this.angle -= interval
    if (this.angle === finalAngle) this.angle = startAngle
  }
}
