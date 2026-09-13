/* @flow */

import { TILE_SIZE } from './constants.mjs'
import { createEngine, genQuads, newImage, scaleQuad } from './engine.mjs'
import { gameState } from './gameState.mjs'
import { gameTiles } from './gameTiles.mjs'
import { initSoundBank } from './sound.mjs'
import { GamePlayState } from './states/game/GamePlayState.mjs'
import { GameTitleState } from './states/game/GameTitleState.mjs'
import { StateMachine } from './states/StateMachine.mjs'

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
  [12, 0, 18, 31, 57, 33, 75, 64]
]

async function initGame () {
  await initSoundBank()

  const asset = await newImage('./texture.png')
  const atlas = await Promise.all([scaleQuad(asset, 3), scaleQuad(asset, 12)])

  tileMap.map(([scale, index, ...props]) => {
    // $FlowExpectedError[prop-missing]
    gameTiles.push(...genQuads(atlas[index], ...props.map((p) => p * scale)))
  })

  // reset global game state
  gameState.stack = []
  // sets all the screens
  gameState.push(
    new StateMachine({
      play: () => new GamePlayState(),
      title: () => new GameTitleState()
    })
  )
  // $FlowFixMe[prop-missing]
  gameState.stack[0]?.change('title')
}

function updateGame (delta: number) {
  gameState.update(delta)
}

function renderGame () {
  gameState.render()
}

createEngine(initGame, updateGame, renderGame)
