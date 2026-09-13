/* @flow */

import { TILE_SIZE } from '../../constants.mjs'
import { Dimentions, wasResized } from '../../engine.mjs'
import { progress } from '../../gameState.mjs'
import { inCubic, outCubic } from '../../libs/easing.mjs'
import { playSound } from '../../sound.mjs'
import { EntityState } from './EntityState.mjs'

const scale = 4
const w = scale * 18
const h = scale * 2 * TILE_SIZE

const interval = 2
const threshold = 5

export class ToastyState extends EntityState {
  lastScores: number
  wTime: number
  isLocked: boolean

  constructor () {
    super([Dimentions.width + 0.5 * w + 1, Dimentions.height - 0.5 * h, w, h])
    this.frameID = 8

    this.lastScores = 0
    this.wTime = 0
    this.isLocked = false
    this.t = true
  }

  update (delta: number) {
    this.isVisible = true
    super.update(delta)
    this.wTime += delta

    if (wasResized() && !this.isLocked) {
      this.x = Dimentions.width + 1
      this.y = Dimentions.height - h
    }

    if (this.isLocked) return
    if (this.wTime > interval) {
      this.wTime -= interval

      const delta = progress.scores - this.lastScores
      if (delta > threshold) {
        this.show()
      }

      this.lastScores = progress.scores + delta / interval
    }
  }

  show () {
    this.isLocked = true
    this.setTransition(0.2, { x: Dimentions.width - w }, outCubic)
    this.setTransition(0.1, {})
    this.setTransitionEnd(() => {
      playSound('powerup')
      this.setTransition(0.1, {})
      this.setTransition(0.2, { x: Dimentions.width + 1 }, inCubic)
      this.setTransitionEnd(() => {
        this.isLocked = false
        this.lastScores = progress.scores
        this.wTime = 0
      })
    })
  }
}
