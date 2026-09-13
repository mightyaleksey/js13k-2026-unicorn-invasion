/* @flow */

import { TILE_SIZE } from '../../constants.mjs'
import { Dimentions, printf, setColor, wasResized } from '../../engine.mjs'
import { changeState, progress } from '../../gameState.mjs'
import { RainbowState } from '../elements/RainbowState.mjs'
import { TransitionState } from '../elements/TransitionState.mjs'
import { BookState } from '../entities/BookState.mjs'

const lines = [
  [
    'You slayed the seven who ruled there.',
    'And wrested back the seven Crystals of Color.',
    'The time has come to return to the rainbow home.'
  ]
]

export class GameFinalState extends TransitionState {
  book: BookState
  rainbow: RainbowState

  enter () {
    this.book = new BookState([
      0,
      0,
      0,
      0,
      lines,
      () => {
        changeState('play')
      }
    ])
    this.rainbow = new RainbowState([7, true])
    this.updateProps()
  }

  render () {
    setColor('#fff')
    this.book.render()
    this.rainbow.render()

    setColor('#fff')
    printf(
      `Scores: ${String(progress.scores).padStart(6, '0')}`,
      0,
      0.85 * Dimentions.height,
      Dimentions.width,
      'center'
    )
  }

  update (delta: number) {
    if (wasResized()) this.updateProps()
    this.book.update(delta)
  }

  /* helpers */

  genProps (): [number, number, number, number] {
    const w = Math.min(Dimentions.width - 2 * TILE_SIZE, 20 * TILE_SIZE)
    const h = Math.min(0.8 * Dimentions.height, 8 * TILE_SIZE)
    return [0.5 * (Dimentions.width - w), 0.5 * (Dimentions.height - h), w, h]
  }

  updateProps () {
    const props = this.genProps()
    this.book.updateBox(props)
  }
}
