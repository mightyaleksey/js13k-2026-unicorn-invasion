/* @flow */

import {
  CAMERA_MX,
  DEBUG_BB,
  DEBUG_PANEL,
  TILE_SIZE
} from '../../constants.mjs'
import { Dimentions, translate } from '../../engine.mjs'
import { gameState } from '../../gameState.mjs'
import { playMusic } from '../../sound.mjs'
import { Console } from '../../ui/Console.mjs'
import { BaseState } from '../BaseState.mjs'
import { CameraState } from '../elements/CameraState.mjs'
import { EntitiesState } from '../elements/EntitiesState.mjs'
import { GridState } from '../elements/GridState.mjs'
import { InterfaceState } from '../elements/InterfaceState.mjs'
import { LevelState } from '../elements/LevelState.mjs'
import { PlayerState } from '../entities/PlayerState.mjs'
import { ToastyState } from '../entities/ToastyState.mjs'
import { GameStageState } from './GameStageState.mjs'

/**
 * Level & Camera logic
 *
 * |     |   Let's assume that player moves from bottom to top meaning terrain
 * |  ^  |   moves in the opposite direction. And bottom part of the level will
 * |     |   the start of the coordinate system. Thus starting values will be:
 * |  ^  |
 * |     |   - player { x: w/2, y: 0 }
 * |  p  |   - camera { x: 0, y: -h }
 */

export class GamePlayState extends BaseState {
  camera: CameraState
  player: PlayerState

  entities: EntitiesState
  interface: InterfaceState
  level: LevelState
  toasty: ToastyState

  startY: number

  console: Console
  grid: GridState

  enter () {
    this.camera = new CameraState()
    this.player = new PlayerState([0, -3 * TILE_SIZE])

    this.entities = new EntitiesState([this.camera])
    this.level = new LevelState([this.camera, this.entities])
    this.interface = new InterfaceState([this.player])
    this.toasty = new ToastyState()

    this.entities.append(this.player)
    this.startY = 0

    // $FlowExpectedError[constant-condition]
    if (DEBUG_PANEL) {
      this.console = new Console({ x: 8, y: 16 })
    }
    // $FlowExpectedError[constant-condition]
    if (DEBUG_BB) {
      this.grid = new GridState()
    }

    this.level.enter()

    gameState.push(new GameStageState(), [
      this.level.level,
      () => {
        gameState.pop()
      }
    ])

    // todo: fix
    playMusic()
  }

  render () {
    // emulate camera effect
    translate(-this.camera.x - this.camera.offsetX, -this.camera.y)
    // terrain & enemies
    this.level.render()
    this.entities.render()
    // restore camera
    translate(this.camera.x + this.camera.offsetX, this.camera.y)

    this.interface.render()
    this.toasty.render()

    // $FlowExpectedError[constant-condition]
    if (DEBUG_BB) {
      this.grid.render()
    }
    // $FlowExpectedError[constant-condition]
    if (DEBUG_PANEL) {
      this.console.render({
        vw: Dimentions.width,
        vh: Dimentions.height,
        camera: this.camera.y,
        entities: this.entities.list.length
      })
    }
  }

  update (delta: number) {
    this.camera.update(delta)
    this.camera.x = CAMERA_MX * (this.player.x + 0.5 * this.player.width)

    this.level.update(delta)
    this.entities.update(delta)
    this.toasty.update(delta)
  }

  /* helpers */

  nextLevel () {
    this.level.levelUp()
    this.camera.isMoving = true
  }
}
