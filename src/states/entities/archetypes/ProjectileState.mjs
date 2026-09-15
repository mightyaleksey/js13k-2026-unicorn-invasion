/* @flow */

import { O_PLAYER } from '../../../constants.mjs'
import { rect, setColor } from '../../../engine.mjs'
import { EntityState } from '../EntityState.mjs'

export type ProjectileProps = Readonly<
  [x: number, y: number, width: number, height: number, origin: number]
>

export class ProjectileState extends EntityState<> {
  origin: number

  constructor (props: ProjectileProps) {
    super([props[0], props[1], props[2], props[3]])
    this.origin = props[4]
  }

  render () {
    super.render()
    // setColor('#ade1ef')
    setColor(this.origin === O_PLAYER ? '#E6E6E6' : '#65D2F0')
    rect('fill', this.x, this.y, this.width, this.height)
  }
}
