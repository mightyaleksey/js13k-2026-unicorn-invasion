/* @flow */

import { TILE_SIZE } from '../../constants.mjs'
import { Dimentions, setColor, wasResized } from '../../engine.mjs'
import { changeState } from '../../gameState.mjs'
import { TransitionState } from '../elements/TransitionState.mjs'
import { BookState } from '../entities/BookState.mjs'

// The fallen skies tell a story.
// The gates of Hell were thrown wide.
// From that black wound the demon hosts came pouring, and the world of men was drowned in fire.
// Armies were raised. The direst weapons were brought forth.
// None availed.
// City after city fell to ash.
// And the earth itself passed into the keeping of the Pit.

// Yet victory was never enough.
// The Rainbow was torn from the heavens and shattered into seven Crystals of Color.
// The seven lords of Hell claimed the shards.And the world of men faded to gray.
// When every banner had burned and every prayer gone unanswered, the last of men called upon the one creature that yet might restore what was stolen.
// The Unicorn.

// Arise now, ye last of light.
// Descend into Hell.
// Slay the seven who rule there.
// Wrest back the seven Crystals of Color.
// And see the Rainbow home.

const lines = [
  [
    'The fallen skies tell a story.',
    'The gates of Hell were thrown wide.',
    'From that black wound the demon hosts came pouring, and the world of men was drowned in fire.',
    'Armies were raised. The direst weapons were brought forth.',
    'None availed.',
    'City after city fell to ash.',
    'And the earth itself passed into the keeping of the Pit.'
  ],
  [
    'Yet victory was never enough.',
    'The Rainbow was torn from the heavens and shattered into seven Crystals of Color.',
    'The seven lords of Hell claimed the shards. And the world of men faded to gray.',
    'When every banner had burned and every prayer gone unanswered, the last of men called upon the one creature that yet might restore what was stolen.',
    'The Unicorn.'
  ],
  [
    'Arise now, ye last of light.',
    'Descend into Hell.',
    'Slay the seven who rule there.',
    'Wrest back the seven Crystals of Color.',
    'And see the Rainbow home.'
  ]
]

export class GameTitleState extends TransitionState {
  book: BookState

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
    this.updateProps()
  }

  render () {
    setColor('#fff')
    this.book.render()
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
