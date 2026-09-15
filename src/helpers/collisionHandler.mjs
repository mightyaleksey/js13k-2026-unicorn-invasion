/* @flow */

import { O_BOSS_ARC, O_PLAYER } from '../constants.mjs'
import { gameState, progress } from '../gameState.mjs'
import { playSound } from '../sound.mjs'
import { CharacterState } from '../states/entities/archetypes/CharacterState.mjs'
import { ProjectileState } from '../states/entities/archetypes/ProjectileState.mjs'
import { BossState } from '../states/entities/BossState.mjs'
import { CrystalState } from '../states/entities/CrystalState.mjs'
import type { EntityState } from '../states/entities/EntityState.mjs'
import { MinionState } from '../states/entities/MinionState.mjs'
import { PlayerState } from '../states/entities/PlayerState.mjs'
import { GameProgressState } from '../states/game/GameProgressState.mjs'
import { setAchievement } from '../wavedash.mjs'

/**
 * Generic collision logic for the all entitites.
 * The global one helps to avoid dependency cycles and to avoid repetition.
 */

export function collisionHandler (
  target: EntityState<>,
  self: EntityState<>,
  delta: number
) {
  if (self instanceof CharacterState) {
    if (target instanceof CrystalState) {
      playSound('pickup')
      progress.scores += 20

      if (progress.level === 0) {
        setAchievement('crystal-returned')
      }

      gameState.push(new GameProgressState())
      // display progress, move to next level
      target.isDestroyed = true
    } else if (target instanceof ProjectileState && self.isVisible) {
      // take hit
      self.hp -= 1

      if (self instanceof PlayerState) {
        if (target.origin === O_BOSS_ARC) {
          progress.arcHit = 1
        }

        progress.hits++
      }

      if (self.hp <= 0) {
        if (self instanceof MinionState) {
          if (target.origin === O_PLAYER) {
            // todo: check movement
            setAchievement('first-spark')
          }

          progress.scores += 3
        }

        if (self instanceof BossState) {
          progress.scores += 12
        }

        self.isDestroyed = true
      } else {
        self.onHit()
      }

      if (self.isDestroyed) {
        playSound('death')
        self.onDeath()
      }
    } else {
      self.x -= self.dx * delta
      self.y -= self.dy * delta
      if (self instanceof MinionState) self.switchDirection()
    }
  }

  if (target instanceof ProjectileState) {
    playSound('hit')

    if (self instanceof ProjectileState) {
      if (
        (self.origin === O_PLAYER && target.origin !== O_PLAYER) ||
        (self.origin !== O_PLAYER && target.origin === O_PLAYER)
      ) {
        setAchievement('horn-guard')
      }
    }

    target.isDestroyed = true
  }
}
