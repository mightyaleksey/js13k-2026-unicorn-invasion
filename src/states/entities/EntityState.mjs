/* @flow */

import type { CharType } from '../../constants.mjs'
import { DEBUG_BB } from '../../constants.mjs'
import { draw, rect, setColor } from '../../engine.mjs'
import { gameTiles } from '../../gameTiles.mjs'
import { viewport } from '../../helpers/viewport.mjs'
import { collides } from '../../libs/collides.mjs'
import { nullthrows } from '../../libs/nullthrows.mjs'
import { Animation } from '../Animation.mjs'
import type { CameraState } from '../elements/CameraState.mjs'
import type { EntitiesState } from '../elements/EntitiesState.mjs'
import { TransitionState } from '../elements/TransitionState.mjs'
import { StateMachine } from '../StateMachine.mjs'

const propNames = ['x', 'y', 'width', 'height', 'dx', 'dy']

// [ x, y, width, height, dx, dy ]
export type EntityProps = Readonly<
  [
    x?: ?number,
    y?: ?number,
    width?: ?number,
    height?: ?number,
    dx?: ?number,
    dy?: ?number
  ]
>

export class EntityState<T = unknown> extends TransitionState {
  x: number
  y: number
  width: number
  height: number

  dx: number
  dy: number

  animations: ?ReadonlyArray<Animation>
  currentAnimation: ?Animation
  frameID: ?number

  camera: CameraState
  entities: EntitiesState

  hp: number
  hpMax: number

  state: StateMachine<T>
  statuses: Array<any>

  isCollidable: boolean
  isDestroyed: boolean
  isVisible: boolean

  constructor (props: EntityProps) {
    super()

    this.x = Math.floor(
      (props[0] ?? 0) - (props[2] != null ? 0.5 * props[2] : 0)
    )
    this.y = Math.floor(
      (props[1] ?? 0) - (props[3] != null ? 0.5 * props[3] : 0)
    )
    this.width = props[2] ?? 0
    this.height = props[3] ?? 0

    this.dx = props[4] ?? 0
    this.dy = props[5] ?? 0

    this.animations = null
    this.currentAnimation = null
    this.frameID = null

    // dependency injection
    // note: make sure to use EntitiesState.append() to add it to the list,
    // so the dependency will provided
    // $FlowExpectedError[incompatible-type]
    this.camera = null
    // $FlowExpectedError[incompatible-type]
    this.entities = null

    /* behaviour logic */

    this.hp = 0
    this.hpMax = 0

    this.state = new StateMachine({})
    this.statuses = []

    this.isCollidable = true
    this.isDestroyed = false
    this.isVisible = true
  }

  enter () {}

  render () {
    if (DEBUG_BB) {
      setColor('#dedaf4')
      rect('line', this.x, this.y, this.width, this.height)
    }

    const frameID = this.frameID
    if (frameID != null) {
      setColor('#fff')
      draw(gameTiles[frameID], this.x, this.y, this.width, this.height)
    }
  }

  update (delta: number) {
    if (this.isVisible) super.update(delta)
    this.state.update(delta)

    if (this.statuses.length > 0) {
      for (let j = this.statuses.length - 1; j > -1; --j) {
        const status = this.statuses[j]
        status.update(this, delta)
        if (status.isExpired) this.statuses.splice(j, 1)
      }
    }

    if (this.currentAnimation != null) {
      this.currentAnimation.update(delta)
      this.frameID = this.currentAnimation?.getCurrentFrame()
    }

    this.x += this.dx * delta
    this.y += this.dy * delta

    this.isVisible = collides(this, viewport)
  }

  /* helpers */

  directByAngle (angle: number, speed: number): this {
    // set dx, dy based on angle
    // tg(a) = y/x
    const a = (angle * Math.PI) / 180
    this.dx = Math.floor(Math.cos(a) * speed)
    this.dy = Math.floor(Math.sin(a) * speed)
    return this
  }

  shiftByAngle (angle: number, distance: number): this {
    const a = (angle * Math.PI) / 180
    this.x += Math.floor(Math.cos(a) * distance)
    this.y += Math.floor(Math.sin(a) * distance)
    return this
  }

  centerX (): number {
    return Math.floor(this.x + 0.5 * this.width)
  }

  centerY (): number {
    return Math.floor(this.y + 0.5 * this.height)
  }

  changeState (stateName: T, input: unknown) {
    this.state.change(stateName, input)
  }

  changeAnimation (animationID: number) {
    this.currentAnimation = nullthrows(this.animations)[animationID]
  }

  genAnimations (def: CharType): ReadonlyArray<Animation> {
    return def.frames.map((frames) => new Animation(frames, def.frameInterval))
  }

  updateBox (props: EntityProps) {
    for (let i = 0; i < props.length; ++i) {
      // $FlowExpectedError[prop-missing]
      if (props[i] != null) this[propNames[i]] = props[i]
    }
  }

  onCollide (target: EntityState<>, self: EntityState<>, delta: number) {
    // abstract
  }

  onHit () {
    // abstract
  }

  onDeath () {
    // abstract
  }
}
