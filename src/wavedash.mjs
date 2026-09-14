/* @flow */

type WavedashConfig = {
  debug?: boolean,
  remoteStorageOrigin?: string,
  p2p?: unknown,
  deferEvents?: boolean
}

export function loadProgress (value: number) {
  // value [0, 1]
  if (window.Wavedash == null) return
  window.Wavedash.updateLoadProgressZeroToOne(value)
}

export function initWavedash (config?: WavedashConfig) {
  if (window.Wavedash == null) return
  window.Wavedash.init(config)
}

export function setAchievement (achievementID: string, storeNow?: boolean) {
  if (window.Wavedash == null) return
  window.Wavedash.setAchievement(achievementID, storeNow)
}
