/* @flow */

type AchievementIDs =

    | 'bring-the-light'
    | 'crystal-returned'
    | 'first-spark'
    | 'gloom-town'
    | 'horn-guard'
    | 'pattern-reader'
    | 'through-the-arc'
    | 'toasty'

type WavedashConfig = {
  debug?: boolean,
  deferEvents?: boolean,
  p2p?: unknown,
  remoteStorageOrigin?: string
}

const achievements: ReadonlyArray<AchievementIDs> = [
  'bring-the-light', // 0
  'crystal-returned',
  'first-spark', // 2
  'gloom-town',
  'horn-guard', // 4
  'pattern-reader',
  'through-the-arc', // 6
  'toasty'
]
const achievementFlags = [0, 0, 0, 0, 0, 0, 0, 0]
const leaderboardName = 'high_scores'
let leaderboardID: ?number = null

export function loadProgress (value: number) {
  // value [0, 1]
  if (window.Wavedash == null) return
  window.Wavedash.updateLoadProgressZeroToOne(value)
}

export function initWavedash (config?: WavedashConfig) {
  if (window.Wavedash == null) return
  window.Wavedash.init(config)
}

export function setAchievement (achievementID: number, storeNow?: boolean) {
  if (achievementFlags[achievementID] === 1) return
  achievementFlags[achievementID] = 1

  if (window.Wavedash == null) return
  window.Wavedash.setAchievement(achievements[achievementID], storeNow)
}

export async function setScores (scores: number) {
  if (window.Wavedash == null) return

  if (leaderboardID == null) {
    const leaderboard = await window.Wavedash.getLeaderboard(leaderboardName)
    leaderboardID = leaderboard.success ? leaderboard.data.id : null
  }

  if (leaderboardID != null) {
    await window.Wavedash.uploadLeaderboardScore(leaderboardID, scores, true)
  }
}
