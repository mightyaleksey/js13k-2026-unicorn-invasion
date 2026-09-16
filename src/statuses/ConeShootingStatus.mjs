/* @flow */

import { O_BOSS_CONE, S_CONE_DURATION, S_CONE_INTERVAL } from '../constants.mjs'
import { progress } from '../gameState.mjs'
import type { BossState } from '../states/entities/BossState.mjs'
import { BulletState } from '../states/entities/BulletState.mjs'
import { BaseStatus } from './BaseStatus.mjs'

export class ConeShootingStatus extends BaseStatus<BossState> {
  count: number

  constructor () {
    super([S_CONE_INTERVAL, S_CONE_DURATION])
    this.count = 5
  }

  onTick (target: BossState) {
    progress.bossSeen = 1

    const da = 90 / (this.count - 1)
    for (let angle = 45; angle <= 135; angle += da) {
      const projectile = new BulletState([
        target.centerX(),
        target.centerY(),
        angle,
        O_BOSS_CONE,
        0.6 * Math.max(target.width, target.height)
      ])

      target.entities.append(projectile)
    }
  }
}
