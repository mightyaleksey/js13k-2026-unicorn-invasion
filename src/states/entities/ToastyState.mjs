/* @flow */

import { TILE_SIZE } from '../../constants.mjs'
import { Dimentions, wasResized } from '../../engine.mjs'
import { progress } from '../../gameState.mjs'
import { inCubic, outCubic } from '../../libs/easing.mjs'
import { playSound } from '../../sound.mjs'
import { setAchievement } from '../../wavedash.mjs'
import { EntityState } from './EntityState.mjs'

const scale = 4
const w = scale * 18
const h = scale * 2 * TILE_SIZE

const interval = 0.2 // seconds
const windowSize = 4 // seconds
const threshold = 8

export class ToastyState extends EntityState {
  slidingWindow: Array<number>
  scores: number
  total: number
  time: number

  isLocked: boolean
  isWorking: boolean

  constructor () {
    super([Dimentions.width + 0.5 * w + 1, Dimentions.height - 0.5 * h, w, h])
    this.frameID = 8

    this.slidingWindow = Array(windowSize / interval).fill(0)
    this.scores = 0
    this.total = 0
    this.time = 0

    this.isLocked = false
    this.isWorking = true
  }

  render () {
    if (this.isLocked) {
      super.render()
    }
  }

  update (delta: number) {
    this.isVisible = true
    super.update(delta)

    if (wasResized() && !this.isLocked) {
      this.x = Dimentions.width + 1
      this.y = Dimentions.height - h
    }

    if (!this.isWorking) return

    this.time += delta
    if (this.time >= interval) {
      this.time -= interval

      const delta = progress.scores - this.scores
      this.scores = progress.scores
      // $FlowFixMe[unsafe-arithmetic]
      this.total += delta - this.slidingWindow.shift()
      this.slidingWindow.push(delta)

      if (this.total >= threshold && !this.isLocked) {
        this.show()
      }
    }
  }

  /* helpers */

  reset () {
    this.scores = progress.scores
    if (this.total === 0) return

    this.slidingWindow.fill(0)
    this.total = 0
  }

  show () {
    this.isLocked = true

    this.setTransition(0.2, { x: Dimentions.width - w }, outCubic)
    this.setTransition(0.2, {})
    this.setTransitionEnd(() => {
      playSound('powerup')

      this.setTransition(0.4, {})
      this.setTransition(0.2, { x: Dimentions.width + 1 }, inCubic)
      this.setTransition(0.5, { x: Dimentions.width + 1 }, inCubic)
      this.setTransitionEnd(() => {
        setAchievement(7)
        this.reset()
        this.isLocked = false
      })
    })
  }
}
