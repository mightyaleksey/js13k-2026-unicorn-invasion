/* @flow */

import {
  CAMERA_MX,
  DEBUG_BB,
  DEBUG_PANEL,
  FONT_HUGE,
  TILE_SIZE
} from '../../constants.mjs'
import {
  Dimentions,
  printf,
  setColor,
  setFont,
  translate
} from '../../engine.mjs'
import { gameState, progress } from '../../gameState.mjs'
import { inCubic, outCubic } from '../../libs/easing.mjs'
import { playMusic } from '../../sound.mjs'
import { Console } from '../../ui/Console.mjs'
import { BaseState } from '../BaseState.mjs'
import { CameraState } from '../elements/CameraState.mjs'
import { EntitiesState } from '../elements/EntitiesState.mjs'
import { GridState } from '../elements/GridState.mjs'
import { InterfaceState } from '../elements/InterfaceState.mjs'
import { LevelState } from '../elements/LevelState.mjs'
import { TransitionState } from '../elements/TransitionState.mjs'
import { PlayerState } from '../entities/PlayerState.mjs'
import { ToastyState } from '../entities/ToastyState.mjs'

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

export class GamePlayState extends TransitionState {
  camera: CameraState
  player: PlayerState

  entities: EntitiesState
  interface: InterfaceState
  level: LevelState
  toasty: ToastyState

  startY: number

  eLevelOpacity: number
  eLevelY: number

  console: Console
  grid: GridState

  enter () {
    // reset
    progress.level = 0
    progress.scores = 0

    this.camera = new CameraState()
    this.player = new PlayerState([0, -3 * TILE_SIZE])

    this.entities = new EntitiesState([this.camera])
    this.level = new LevelState([this.camera, this.entities])
    this.interface = new InterfaceState([this.player])
    this.toasty = new ToastyState()

    this.entities.append(this.player)
    this.startY = 0

    this.eLevelOpacity = 0
    this.eLevelY = -2 * TILE_SIZE

    // $FlowExpectedError[constant-condition]
    if (DEBUG_PANEL) {
      this.console = new Console({ x: 8, y: 16 })
    }
    // $FlowExpectedError[constant-condition]
    if (DEBUG_BB) {
      this.grid = new GridState()
    }

    this.level.enter()
    this.showLevel()

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

    if (this.eLevelY > 0) {
      setColor('#fff', this.eLevelOpacity)
      setFont(FONT_HUGE)
      printf(
        `Level ${progress.level + 1}`,
        0,
        this.eLevelY,
        Dimentions.width,
        'center'
      )
    }

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
    super.update(delta)
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
    this.showLevel()
  }

  showLevel (callback?: () => void) {
    this.eLevelOpacity = 0
    this.eLevelY = -2 * TILE_SIZE

    this.setTransition(0.2, {})
    this.setTransition(
      0.4,
      { eLevelOpacity: 1, eLevelY: 0.5 * Dimentions.height },
      outCubic
    )
    this.setTransition(0.2, {})
    this.setTransition(
      0.4,
      { eLevelOpacity: 0, eLevelY: Dimentions.height + 2 * TILE_SIZE },
      inCubic
    )
    this.setTransitionEnd(callback)
  }
}
