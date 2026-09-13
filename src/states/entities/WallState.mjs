/* @flow */

import { FREE_AREA, PLAY_AREA, TILE_SIZE } from '../../constants.mjs'
import type { CameraState } from '../elements/CameraState.mjs'
import { ObstacleState } from './archetypes/ObstacleState.mjs'

export type WallProps = Readonly<[camera: CameraState, side: number]>

export class WallState extends ObstacleState {
  constructor (props: WallProps) {
    super([
      (props[1] === 0 ? -0.5 : 0.5) * (PLAY_AREA + 5) * TILE_SIZE,
      props[0].y - FREE_AREA * TILE_SIZE,
      TILE_SIZE,
      FREE_AREA * TILE_SIZE
    ])
  }
}
