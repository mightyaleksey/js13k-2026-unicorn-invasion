/* @flow */

import {
  BUILDING_PALETTE,
  PLAY_AREA,
  TILE_SIZE,
  TRANSITION_DURATION
} from '../../constants.mjs'
import { Dimentions, setColor, shape } from '../../engine.mjs'
import { desaturate } from '../../libs/color.mjs'
import type { CameraState } from '../elements/CameraState.mjs'
import { ObstacleState } from './archetypes/ObstacleState.mjs'

const tb = 1.2
const tw = 0.04
const buildingWidth = 7 * TILE_SIZE
const buildingHeight = 9 * TILE_SIZE

function v (x1: number, x2: number, t: number): number {
  return x1 + t * (x2 - x1)
}

type BuildingProps = Readonly<
  [camera: CameraState, side: number, level?: number]
>

export class BuildingState extends ObstacleState {
  camera: CameraState
  level: number
  gloominess: number
  palette: ReadonlyArray<string>

  isChanging: boolean

  constructor (props: BuildingProps) {
    super([
      props[1] === 0
        ? -0.5 * (PLAY_AREA * TILE_SIZE + buildingWidth)
        : 0.5 * (PLAY_AREA * TILE_SIZE + buildingWidth),
      props[0].y - buildingHeight,
      buildingWidth,
      buildingHeight
    ])

    this.camera = props[0]
    this.level = props[2] ?? 0
    this.gloominess = getGloominess(this.level)
    this.palette = this.genPalette()

    this.isChanging = false
  }

  render () {
    this.renderOne()
  }

  update (delta: number) {
    super.update(delta)

    if (this.isChanging) {
      this.palette = this.genPalette()
    }
  }

  renderOne () {
    const t1 = (tb - 1) * 1.4 + 1
    const ox = this.camera.x
    const oy = this.camera.y + 0.5 * Dimentions.height

    const bx0 = this.x
    const by0 = this.y
    const bx1 = this.x + this.width
    const by1 = this.y + this.height

    const tx0 = v(ox, bx0, tb)
    const ty0 = v(oy, by0, tb)
    const tx1 = v(ox, bx1, tb)
    const ty1 = v(oy, by1, tb)

    const tx2 = v(ox, bx0 + 0.5 * this.width, t1)
    const ty2 = v(oy, by0, t1)
    const ty3 = v(oy, by1, t1)

    setColor(this.palette[3])
    // top
    if (by0 < ty0) {
      shape('fill', tx2, ty2, tx1, ty0, bx1, by0, bx0, by0, tx0, ty0)
      this.renderFrontWindow(bx0 + 0.5 * this.width, by0, (tb - 1) * 0.4 + 1)
      this.renderFrontWindow(bx0 + 0.5 * this.width, by0, (tb - 1) * 0.9 + 1)
    }
    // bottom
    if (by1 > ty1) {
      shape('fill', tx2, ty3, tx1, ty1, bx1, by1, bx0, by1, tx0, ty1)
      this.renderFrontWindow(bx0 + 0.5 * this.width, by1, (tb - 1) * 0.4 + 1)
      this.renderFrontWindow(bx0 + 0.5 * this.width, by1, (tb - 1) * 0.9 + 1)
    }

    setColor(this.palette[2])
    // left side
    if (bx1 > tx1) shape('fill', tx1, ty0, bx1, by0, bx1, by1, tx1, ty1)
    // right side
    if (bx0 < tx0) shape('fill', tx0, ty0, bx0, by0, bx0, by1, tx0, ty1)

    // roof
    setColor(this.palette[0])
    shape('fill', tx2, ty2, tx1, ty0, tx1, ty1, tx2, ty3)
    setColor(this.palette[1])
    shape('fill', tx0, ty0, tx2, ty2, tx2, ty3, tx0, ty1)
  }

  renderFrontWindow (x: number, y: number, t: number) {
    const ox = this.camera.x
    const oy = this.camera.y + 0.5 * Dimentions.height
    const left = x - 0.5 * TILE_SIZE
    const right = x + 0.5 * TILE_SIZE

    const x0 = v(ox, left, t)
    const x1 = v(ox, right, t)
    const x2 = v(ox, right, t + tw)
    const x3 = v(ox, left, t + tw)
    const y0 = v(oy, y, t)
    const y2 = v(oy, y, t + tw)

    setColor(this.palette[0])
    shape('fill', x0, y0, x1, y0, x2, y2, x3, y2)
  }

  genPalette (): ReadonlyArray<string> {
    return BUILDING_PALETTE.map((color) => desaturate(color, this.gloominess))
  }

  setGloominess (level: number) {
    // level = [0, 6]
    this.isChanging = true
    this.setTransition(TRANSITION_DURATION, {
      gloominess: getGloominess(level)
    })
    this.setTransitionEnd(() => {
      this.isChanging = false
    })
  }
}

function getGloominess (level: number): number {
  return level / 6
}

function updateGlominess (target: BuildingState, value: number) {
  target.gloominess = value
  target.palette = target.genPalette()
}
