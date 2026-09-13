/* @flow */

import { FRAMES, TILE_SIZE } from '../../constants.mjs'
import { Dimentions, Touch } from '../../engine.mjs'
import { gameState } from '../../gameState.mjs'
import { clamp } from '../../libs/clamp.mjs'
import { FrontShootingStatus } from '../../statuses/FrontShootingStatus.mjs'
import { GameOverState } from '../game/GameOverState.mjs'
import { StateMachine } from '../StateMachine.mjs'
import { CharacterState } from './archetypes/CharacterState.mjs'
import { PlayerIdleState } from './characters/PlayerIdleState.mjs'
import { PlayerWalkState } from './characters/PlayerWalkState.mjs'
import type { EntityProps } from './EntityState.mjs'

export class PlayerState extends CharacterState<'idle' | 'walk'> {
  scores: number
  musicStarted: boolean
  touchEnabled: boolean

  constructor (props: EntityProps) {
    super([props[0], props[1], 19, 32])

    this.animations = this.genAnimations(FRAMES.player)
    this.currentAnimation = this.animations[0]

    this.hp = 3
    this.hpMax = 3
    this.scores = 0

    this.state = new StateMachine({
      idle: () => new PlayerIdleState(this),
      walk: () => new PlayerWalkState(this)
    }).change('idle')

    this.statuses.push(new FrontShootingStatus([0.4, 0, -90]))
    this.musicStarted = false
    this.touchEnabled = false
  }

  update (delta: number) {
    super.update(delta)
    if (Touch.wasTouched()) this.touchEnabled = true

    // prevent player moving off screen
    this.y = clamp(
      this.y,
      this.camera.y + TILE_SIZE,
      this.camera.y + Dimentions.height - this.height
    )
  }

  /* helpers */

  getTouchOffset (): ?[number, number, number] {
    const touch = Touch.getPosition()
    if (touch == null) return null

    const dx = touch[0] - (this.centerX() - this.camera.offsetX - this.camera.x)
    const dy = touch[1] - (this.centerY() - this.camera.y)
    const m = Math.hypot(dx, dy)
    if (m == 0) return null
    if (m < TILE_SIZE) return null

    return [dx / m, dy / m, m]
  }

  onDeath () {
    gameState.push(new GameOverState())
  }
}
