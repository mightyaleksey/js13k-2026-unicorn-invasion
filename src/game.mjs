/* @flow */

import { TILE_SIZE } from './constants.mjs'
import {
  createEngine,
  createPattern,
  genQuads,
  newImage,
  scaleQuad
} from './engine.mjs'
import { gameState } from './gameState.mjs'
import { gamePatterns, gameTiles } from './gameTiles.mjs'
import { random } from './libs/random.mjs'
import { initSoundBank } from './sound.mjs'
import { GameFinalState } from './states/game/GameFinalState.mjs'
import { GamePlayState } from './states/game/GamePlayState.mjs'
import { GameTitleState } from './states/game/GameTitleState.mjs'
import { StateMachine } from './states/StateMachine.mjs'
import { initWavedash, loadProgress } from './wavedash.mjs'

const t2 = 2 * TILE_SIZE
const tileMap = [
  // boss tail (2)
  [3, 0, t2, TILE_SIZE, 0, 0, t2, t2],
  // boss body (1)
  [3, 0, 28, t2, t2, 0, 60, t2],
  // unicorn (3)
  [3, 0, 19, t2, 0, t2, 57, 4 * TILE_SIZE],
  // tiles (2)
  [3, 0, TILE_SIZE, TILE_SIZE, 60, 0, 76, t2],
  // toasty (1)
  [12, 1, 18, 31, 57, 33, 75, 64]
]

async function initGame () {
  loadProgress(0.0)
  await initSoundBank()

  const asset = await newImage('./texture.png')
  const atlas = await Promise.all([scaleQuad(asset, 3), scaleQuad(asset, 12)])
  loadProgress(0.3)

  tileMap.map(([scale, index, ...props]) => {
    gameTiles.push(...genQuads(atlas[index], ...props.map((p) => p * scale)))
  })
  loadProgress(0.6)

  gamePatterns.push(
    createPattern(
      (c) => {
        c.fillStyle = '#28303C'
        for (let i = 0; i < 40; ++i) {
          c.rect(random(36), random(36), 4, 4)
        }
        c.fill()
      },
      40,
      40
    )
  )
  gamePatterns.push(
    createPattern(
      (c) => {
        c.strokeStyle = '#f49595'
        c.lineWidth = 0.5
        for (let i = 0; i <= 2 * TILE_SIZE + 2; i += 8) {
          c.moveTo(-1, i)
          c.lineTo(i, -1)
          c.stroke()
        }
      },
      TILE_SIZE,
      TILE_SIZE
    )
  )
  loadProgress(0.8)

  // reset global game state
  gameState.stack = []
  // sets all the screens
  gameState.push(
    new StateMachine({
      final: () => new GameFinalState(),
      play: () => new GamePlayState(),
      title: () => new GameTitleState()
    })
  )
  loadProgress(1.0)

  // $FlowFixMe[prop-missing]
  gameState.stack[0]?.change('play')
  initWavedash()
}

function updateGame (delta: number) {
  gameState.update(delta)
}

function renderGame () {
  gameState.render()
}

createEngine(initGame, updateGame, renderGame)
