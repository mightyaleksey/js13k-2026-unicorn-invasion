/* @flow */

import { FRAMES, TILE_SIZE } from '../../constants.mjs'
import { draw, setColor } from '../../engine.mjs'
import { progress } from '../../gameState.mjs'
import { gameTiles } from '../../gameTiles.mjs'
import { viewport } from '../../helpers/viewport.mjs'
import { nullthrows } from '../../libs/nullthrows.mjs'
import { ArcShootingStatus } from '../../statuses/ArcShootingStatus.mjs'
import { ConeShootingStatus } from '../../statuses/ConeShootingStatus.mjs'
import { ExplosionShootingStatus } from '../../statuses/ExplosionShootingStatus.mjs'
import { CharacterState } from './archetypes/CharacterState.mjs'
import { CrystalState } from './CrystalState.mjs'

export type BossProps = Readonly<[x?: ?number, y?: ?number]>

export class BossState extends CharacterState<> {
  sequenceIndex: number
  sequence: Array<any>

  constructor (props: BossProps) {
    super([props[0], props[1], 60, 2 * TILE_SIZE])

    this.animations = this.genAnimations(FRAMES.boss)
    this.currentAnimation = this.animations[0]

    const hp = 10 + 2 * progress.level
    this.hp = hp
    this.hpMax = hp

    this.sequenceIndex = -1
    this.sequence = [
      ConeShootingStatus,
      ArcShootingStatus,
      ConeShootingStatus,
      ExplosionShootingStatus
    ]

    this.isCollidable = false
  }

  render () {
    setColor('#fff', this.isCollidable ? 1 : 0.8)
    draw(
      gameTiles[nullthrows(this.frameID)],
      this.x,
      this.y + TILE_SIZE,
      2 * TILE_SIZE,
      TILE_SIZE
    )
    draw(gameTiles[2], this.x + 2 * TILE_SIZE, this.y, 28, 2 * TILE_SIZE)
  }

  update (delta: number) {
    super.update(delta)
    this.switchAttacks()

    const targetY = viewport.y + 0.3 * viewport.height
    if (targetY < this.y) {
      this.camera.isMoving = false
      this.isCollidable = true
    }
  }

  /* helpers */

  switchAttacks () {
    if (!this.isCollidable) return
    if (this.statuses.length === 0) {
      this.sequenceIndex = (this.sequenceIndex + 1) % this.sequence.length
      const S = this.sequence[this.sequenceIndex]
      this.statuses.push(new S())
      this.currentAnimation = nullthrows(this.animations)[
        S === ConeShootingStatus ? 0 : 1
      ]
    }
  }

  onDeath () {
    super.onDeath()

    // todo: add animation
    const crystal = new CrystalState([this.centerX(), this.centerY()])
    this.entities.append(crystal)
  }
}
