/* @flow */

import { TILE_SIZE } from './constants.mjs'
import { createEngine, genQuads, newImage, scaleQuad } from './engine.mjs'
import { gameState } from './gameState.mjs'
import { gameTiles } from './gameTiles.mjs'
import { initSoundBank } from './sound.mjs'
import { GamePlayState } from './states/game/GamePlayState.mjs'
import { GameTitleState } from './states/game/GameTitleState.mjs'
import { StateMachine } from './states/StateMachine.mjs'

async function initGame () {
  const asset = await newImage('./texture.png')

  const bgScale = 8
  const genericScale = 3
  const toastyScale = 12

  const atlas = await Promise.all([
    scaleQuad(asset, bgScale),
    scaleQuad(asset, genericScale),
    scaleQuad(asset, toastyScale)
  ])

  // $FlowExpectedError[prop-missing]
  gameTiles.push(
    ...genQuads(
      atlas[0],
      bgScale * TILE_SIZE,
      bgScale * TILE_SIZE,
      0,
      0,
      bgScale * 2 * TILE_SIZE,
      bgScale * 2 * TILE_SIZE
    ),
    // unicorn
    ...genQuads(
      atlas[1],
      genericScale * 19,
      genericScale * 2 * TILE_SIZE,
      genericScale * 2 * TILE_SIZE,
      0,
      genericScale * 89,
      genericScale * 2 * TILE_SIZE
    ),
    // boss tail
    ...genQuads(
      atlas[1],
      genericScale * 2 * TILE_SIZE,
      genericScale * 16,
      0,
      genericScale * 2 * TILE_SIZE,
      genericScale * 2 * TILE_SIZE,
      genericScale * 4 * TILE_SIZE
    ),
    // boss body
    ...genQuads(
      atlas[1],
      genericScale * 28,
      genericScale * 2 * TILE_SIZE,
      genericScale * 2 * TILE_SIZE,
      genericScale * 2 * TILE_SIZE,
      genericScale * 60,
      genericScale * 4 * TILE_SIZE
    ),
    // spitz
    ...genQuads(
      atlas[2],
      toastyScale * 18,
      toastyScale * 2 * TILE_SIZE,
      toastyScale * 71,
      toastyScale * 2 * TILE_SIZE,
      toastyScale * 89,
      toastyScale * 4 * TILE_SIZE
    )
  )

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
  gameState.stack[0]?.change('play')

  await initSoundBank()
}

function updateGame (delta: number) {
  gameState.update(delta)
}

function renderGame () {
  gameState.render()
}

createEngine(initGame, updateGame, renderGame)
