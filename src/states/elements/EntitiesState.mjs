/* @flow */

import { progress } from '../../gameState.mjs'
import { collisionHandler } from '../../helpers/collisionHandler.mjs'
import { sortEntities } from '../../helpers/entities.mjs'
import { playarea } from '../../helpers/viewport.mjs'
import { collides } from '../../libs/collides.mjs'
import { setAchievement } from '../../wavedash.mjs'
import { BaseState } from '../BaseState.mjs'
import type { CameraState } from '../elements/CameraState.mjs'
import { ProjectileState } from '../entities/archetypes/ProjectileState.mjs'
import { BossState } from '../entities/BossState.mjs'
import type { EntityState } from '../entities/EntityState.mjs'
import { PlayerState } from '../entities/PlayerState.mjs'

export type EntitiesProps = Readonly<[camera: CameraState]>

export class EntitiesState extends BaseState {
  camera: CameraState
  list: Array<EntityState<>>
  shouldCheck: boolean
  shouldSort: boolean

  constructor (props: EntitiesProps) {
    super()
    this.camera = props[0]
    this.list = []
    this.shouldCheck = false
    this.shouldSort = false
  }

  enter () {}

  render () {
    this.list.forEach((entity) => entity.render())
  }

  update (delta: number) {
    // update entities
    this.list.forEach((entity) => entity.update(delta))

    // check for collisions (mainly those that are in the viewport)
    const entities = this.list.filter(
      (entity) => entity.isCollidable && collides(entity, playarea)
    )
    entities.forEach((left, i) => {
      for (let j = i + 1; j < entities.length; ++j) {
        const right = entities[j]
        if (!collides(left, right, 1)) continue

        left.onCollide(right, left, delta)
        right.onCollide(left, right, delta)
      }
    })

    // collect garbage, i.e. remove entities from the list that are out
    // of viewport, i.e. not in the camera range.
    for (let j = this.list.length - 1; j > -1; --j) {
      const entity = this.list[j]
      if (entity instanceof PlayerState) continue

      if (entity instanceof BossState || entity.isDestroyed) {
        this.shouldCheck = true
      }

      if (!collides(entity, playarea) || entity.isDestroyed) {
        this.list.splice(j, 1)
      }
    }

    if (this.shouldCheck) {
      const projectile = entities.find(
        (entity) => entity instanceof ProjectileState
      )

      if (projectile == null) {
        if (progress.arcSeen && progress.arcHit === 0) {
          setAchievement('through-the-arc')
        }

        if (progress.hits === 0) {
          setAchievement('pattern-reader')
        }
      }
    }

    if (this.shouldSort) {
      sortEntities(this.list)
      this.shouldSort = false
    }
  }

  /* helpers */

  append (entity: EntityState<any>) {
    // inject dependency
    entity.camera = this.camera
    entity.entities = this
    // $FlowExpectedError[cannot-write]
    entity.onCollide = collisionHandler
    this.list.push(entity)

    if (entity instanceof BossState) {
      this.shouldCheck = false
    }

    this.shouldSort = true
  }
}
