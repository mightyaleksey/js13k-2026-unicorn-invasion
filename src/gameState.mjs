/* @flow */

import { StateStack } from './states/StateStack.mjs'

/**
 * Initialize global game state stack. Allows access to it from individual
 * states, so it will be easier to manage navigation between screens
 * and to control the user input.
 *
 * Bottom state is usually game play state. And the rest on top of it are
 * likely menu and UI states.
 *
 * Note: All states are rendered, however, only the top one is updated.
 */
export const gameState: StateStack = new StateStack()

/**
 * Helpers
 */

export function changeState (stateName: string) {
  // $FlowFixMe[prop-missing]
  gameState.stack[0].change(stateName)
}

export function getLevel (): number {
  // $FlowFixMe[prop-missing]
  return gameState.stack[0].current.level.level
}

export function nextlevel () {
  // $FlowFixMe[prop-missing]
  gameState.stack[0].current.nextLevel()
}
