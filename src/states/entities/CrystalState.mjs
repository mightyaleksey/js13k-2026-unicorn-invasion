/* @flow */

import { TILE_SIZE } from '../../constants.mjs'
import { ObstacleState } from './archetypes/ObstacleState.mjs'

export type CrystalProps = Readonly<[x: number, y: number]>

export class CrystalState extends ObstacleState {
  constructor (props: CrystalProps) {
    super([props[0], props[1], TILE_SIZE, TILE_SIZE])
    this.frameID = 7
  }
}
