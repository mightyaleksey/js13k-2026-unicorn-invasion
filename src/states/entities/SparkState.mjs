/* @flow */

import { SPARK_DURATION, SPARK_SIZE } from '../../constants.mjs'
import {
  circle,
  line,
  rect,
  restore,
  rotate,
  save,
  setColor,
  translate
} from '../../engine.mjs'
import { progress } from '../../gameState.mjs'
import { getGloominess } from '../../helpers/gloominess.mjs'
import { desaturate } from '../../libs/color.mjs'
import { DelayedDeathStatus } from '../../statuses/DelayedDeathStatus.mjs'
import { RotationStatus } from '../../statuses/RotationStatus.mjs'
import { ParticleState } from './archetypes/ParticleState.mjs'

export type SparkProps = Readonly<[x: number, y: number, form: number]>

export class SparkState extends ParticleState {
  accent: string
  angle: number
  form: number

  constructor (props: SparkProps) {
    super([props[0], props[1], SPARK_SIZE, SPARK_SIZE])

    this.accent = desaturate('#A0B5EF', getGloominess(progress.level))
    this.angle = 0
    this.form = props[2]

    this.statuses.push(
      new DelayedDeathStatus([0, SPARK_DURATION]),
      new RotationStatus([0.1, 0])
    )
  }

  render () {
    super.render()

    const ox = this.centerX()
    const oy = this.centerY()

    save()
    translate(ox, oy)
    rotate(this.angle)
    translate(-ox, -oy)

    setColor(this.accent)
    switch (this.form) {
      case 0:
        // cross
        line(ox, this.y, ox, this.y + this.height)
        line(this.x, oy, this.x + this.width, oy)
        break

      case 1:
        // circle
        circle('line', ox, oy, 0.5 * this.width)
        break

      case 2:
        // square
        rect('line', this.x, this.y, this.width, this.height)
        break
    }

    restore()
  }
}
