/* @flow */

import { clamp } from '../../libs/clamp.mjs'
import type { EasingType } from '../../libs/easing.mjs'
import { linear } from '../../libs/easing.mjs'
import { nullthrows } from '../../libs/nullthrows.mjs'
import { BaseState } from '../BaseState.mjs'

export class TransitionState extends BaseState {
  tEnd: ?() => void
  tProps: ?{ [string]: number }
  tQueue: Array<[number, { [string]: number }, EasingType]>
  tTime: number

  constructor () {
    super()
    this.tEnd = null
    this.tProps = null
    this.tQueue = []
    this.tTime = 0
  }

  update (delta: number) {
    const queue = this.tQueue
    if (queue.length === 0) return

    this.tTime += delta

    if (this.tProps == null) {
      // save current values
      this.tProps = this.genTValues()
    }

    this.setTValues()

    const duration = queue[0][0]

    if (this.tTime > duration) {
      // move to the next transition
      queue.shift()
      this.tTime -= duration

      if (queue.length > 0) {
        this.tProps = this.genTValues()
        this.setTValues()
      } else if (this.tEnd != null) {
        this.tEnd()
        this.tEnd = null
      }
    }
  }

  /* helpers */

  genTValues (): { [string]: number } {
    const props = {}

    Object.keys(this.tQueue[0][1]).forEach((key) => {
      // $FlowExpectedError[prop-missing]
      props[key] = this[key]
    })

    return props
  }

  setTValues () {
    const [duration, values, easing] = this.tQueue[0]

    Object.keys(values).forEach((key) => {
      const begin = nullthrows(this.tProps)[key]
      const change = values[key] - begin
      // $FlowExpectedError[prop-missing]
      this[key] = easing(
        clamp(this.tTime, 0, duration),
        begin,
        change,
        duration
      )
    })
  }

  resetTransition () {
    this.tEnd = null
    this.tProps = null
    this.tQueue = []
    this.tTime = 0
  }

  setTransition (
    duration: number,
    props: { [string]: number },
    easingFn?: EasingType
  ) {
    this.tQueue.push([duration, props, easingFn ?? linear])
  }

  setTransitionEnd (fn: ?() => void) {
    this.tEnd = fn
  }
}
