/* @flow */

import { FONT_HUGE } from '../../constants.mjs'
import { Dimentions, printf, rect, setColor, setFont } from '../../engine.mjs'
import { gameState, restart } from '../../gameState.mjs'
import { wasAction } from '../../helpers/controls.mjs'
import { TransitionState } from '../elements/TransitionState.mjs'

export class GameOverState extends TransitionState {
  bgOpacity: number
  textOpacity: number
  isLocked: boolean

  enter () {
    this.bgOpacity = 0
    this.textOpacity = 0
    this.isLocked = true

    this.setTransition(0.5, { bgOpacity: 0.5, textOpacity: 1 })
    this.setTransitionEnd(() => {
      this.isLocked = false
    })
  }

  render () {
    setFont(FONT_HUGE)
    setColor('#000', this.bgOpacity)
    rect('fill', 0, 0, Dimentions.width + 1, Dimentions.height + 1)
    setColor('#75201B', this.textOpacity)
    printf(
      'Unicorn died',
      0,
      0.5 * Dimentions.height,
      Dimentions.width,
      'center'
    )
  }

  update (delta: number) {
    super.update(delta)
    if (this.isLocked) return
    if (wasAction()) {
      gameState.pop()
      restart()
    }
  }
}
