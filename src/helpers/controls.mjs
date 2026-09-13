/* @flow */

import { Keys, Touch } from '../engine.mjs'

export function wasAction (): boolean {
  return Keys.wasPressed('Enter') || Touch.wasTouched()
}
