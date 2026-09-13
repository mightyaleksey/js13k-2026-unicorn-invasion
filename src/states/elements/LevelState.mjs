/* @flow */

import {
  DEBUG_BOSS_ONLY,
  FREE_AREA,
  PLAY_AREA,
  TILE_SIZE
} from '../../constants.mjs'
import { Dimentions } from '../../engine.mjs'
import { nullthrows } from '../../libs/nullthrows.mjs'
import { random, shuffle } from '../../libs/random.mjs'
import { range } from '../../libs/range.mjs'
import type { CameraState } from '../elements/CameraState.mjs'
import { BossState } from '../entities/BossState.mjs'
import { BuildingState } from '../entities/BuildingState.mjs'
import { MinionState } from '../entities/MinionState.mjs'
import type { EntitiesState } from './EntitiesState.mjs'
import { TransitionState } from './TransitionState.mjs'

export type LevelProps = Readonly<
  [camera: CameraState, entities: EntitiesState]
>

export class LevelState extends TransitionState {
  camera: CameraState
  entities: EntitiesState

  currentYs: [number, number, number]
  intervals: [number, number, number]

  positions: Array<number>
  stages: Array<[interval: number, count: number]>
  level: number

  constructor (props: LevelProps) {
    super()

    this.camera = props[0]
    this.entities = props[1]

    this.currentYs = [this.camera.y, this.camera.y, this.camera.y]
    this.intervals = [0, 0, 0]

    this.positions = [0]
    this.stages = this.genStages()
    this.level = 0
  }

  enter () {
    const sample = [0, 1]
    sample.forEach((pointer) => {
      sample.forEach((multiplier) => {
        const building = new BuildingState([this.camera, pointer, this.level])
        building.y +=
          (FREE_AREA * TILE_SIZE + building.height) * (multiplier + 1)
        this.entities.append(building)
      })
    })
  }

  update (delta: number) {
    this.currentYs.forEach((currentY, i) => {
      if (currentY - this.camera.y >= this.intervals[i]) {
        // $FlowFixMe[invalid-tuple-index]
        this.currentYs[i] -= this.intervals[i]
        this.onInterval(i)
      }
    })
  }

  /* helpers */

  genStages (): Array<[interval: number, count: number]> {
    const stages: Array<[interval: number, count: number]> = []

    if (DEBUG_BOSS_ONLY !== true) {
      stages.push([TILE_SIZE, 1])
      ;[2, 3, 4].forEach((t, minions) => {
        for (let k = 0; k < t; ++k) {
          stages.push([
            random(5 * TILE_SIZE, 8 * TILE_SIZE),
            random(1, minions + 1)
          ])
        }
      })
    }

    stages.push([Math.max(Dimentions.height, 8 * TILE_SIZE), 1])

    return stages
  }

  getPosition (): number {
    if (this.positions.length === 0) {
      const border = Math.ceil(0.5 * PLAY_AREA)
      this.positions = shuffle(range(1 - border, border))
    }

    return nullthrows(this.positions.shift())
  }

  levelUp () {
    this.level++
    this.entities.list.forEach((entity) => {
      if (entity instanceof BuildingState) {
        entity.setGloominess(this.level)
      }
    })

    this.stages = this.genStages()
  }

  onInterval (pointer: number) {
    if (pointer === 0 || pointer === 1) {
      const building = new BuildingState([this.camera, pointer, this.level])
      this.entities.append(building)
      this.intervals[pointer] = FREE_AREA * TILE_SIZE + building.height

      return
    }

    if (this.stages.length > 0) {
      const [distance, count] = nullthrows(this.stages.shift())
      const isLast = this.stages.length === 0
      for (let i = 0; i < count; ++i) {
        const K = isLast ? BossState : MinionState
        const coords = [
          isLast ? 0 : this.getPosition() * TILE_SIZE,
          this.camera.y - distance
        ]

        this.entities.append(new K(coords))
        this.intervals[2] = distance
      }
    }
  }
}
