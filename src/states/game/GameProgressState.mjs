/* @flow */

import { FONT_MEDIUM } from '../../constants.mjs'
import { Dimentions, printf, rect, setColor, setFont } from '../../engine.mjs'
import { gameState, nextlevel, progress } from '../../gameState.mjs'
import { RainbowState } from '../elements/RainbowState.mjs'
import { TransitionState } from '../elements/TransitionState.mjs'

const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet']

export class GameProgressState extends TransitionState {
  level: number
  x: number
  y: number

  bgOpacity: number
  rainbowOpacity: number
  textOpacity: number

  rainbow: RainbowState

  enter (input: unknown) {
    this.x = 200
    this.y = 100
    this.level = progress.level

    this.bgOpacity = 0
    this.rainbowOpacity = 0
    this.textOpacity = 0

    this.rainbow = new RainbowState([this.level])

    this.setTransition(0.3, { bgOpacity: 0.5 })
    this.setTransition(1, { rainbowOpacity: 1 })
    this.setTransition(1, { level: this.level + 1 })
    this.setTransition(1, { textOpacity: 1 })
    this.setTransition(1, {}) // artificial delay
    this.setTransition(0.3, { bgOpacity: 0 })
    this.setTransition(0.3, {})
    this.setTransitionEnd(() => {
      gameState.pop()
      nextlevel()
    })
  }

  render () {
    super.render()

    if (this.bgOpacity > 0) {
      setColor('#000', this.bgOpacity)
      rect('fill', 0, 0, Dimentions.width + 1, Dimentions.height + 1)
    }

    if (this.rainbowOpacity > 0) {
      this.rainbow.render()
    }

    if (this.textOpacity > 0) {
      setColor('#fff', this.textOpacity)
      setFont(FONT_MEDIUM)
      printf(
        `${colors[(this.level - 1) >> 0]} crystal returned.`,
        0,
        0.5 * Dimentions.height,
        Dimentions.width,
        'center'
      )
    }
  }

  update (delta: number) {
    super.update(delta)
    this.rainbow.level = this.level
    this.rainbow.opacity = this.rainbowOpacity
  }
}
