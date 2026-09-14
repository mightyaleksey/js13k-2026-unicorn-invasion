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

const interval = 0.2
const windowSize = 10
const threshold = 5

export class ToastyState extends EntityState {
  slidingWindow: Array<number>
  scores: number
  total: number
  time: number

  isLocked: boolean

  constructor () {
    super([Dimentions.width + 0.5 * w + 1, Dimentions.height - 0.5 * h, w, h])
    this.frameID = 8

    this.slidingWindow = Array(windowSize).fill(0)
    this.scores = 0
    this.total = 0
    this.time = 0

    this.isLocked = false
  }

  update (delta: number) {
    this.isVisible = true
    super.update(delta)

    if (wasResized() && !this.isLocked) {
      this.x = Dimentions.width + 1
      this.y = Dimentions.height - h
    }

    this.time += delta
    if (this.time >= interval) {
      this.time -= interval

      const delta = progress.scores - this.scores
      this.scores = progress.scores
      // $FlowFixMe[unsafe-arithmetic]
      this.total += delta - this.slidingWindow.shift()
      this.slidingWindow.push(delta)

      if (this.total > threshold && !this.isLocked) {
        this.show()
      }
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
      })
    })
  }
}
