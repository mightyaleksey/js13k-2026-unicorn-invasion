/* @flow */

export const FONT_SMALL: string = '8px/1.3 Consolas, monaco, monospace'
export const FONT_MEDIUM: string = '12px/1.3 Courier, monospace'
export const FONT_HUGE: string = '24px/1.3 Courier, monospace'

export const TILE_SIZE: number = 16
export const PLAY_AREA: number = 10 // x tiles
export const FREE_AREA: number = 3 // x tiles

// extra multiplier to calculate horizontal camera offset
export const CAMERA_MX: number = (PLAY_AREA - 1) / PLAY_AREA
export const CAMERA_SPEED: number = 40

export const MINION_SPEED: number = 20
export const PLAYER_SPEED: number = 100

export const BULLET_SIZE: number = 4
export const BULLET_SPEED: number = 140

export const HIGHLIGHT_DURATION: number = 0.4
export const EXPLOSION_DURATION: number = 0.8
export const EXPLOSION_SIZE: number = 2 * TILE_SIZE

export const SPARK_DURATION: number = 2
export const SPARK_ROTATION: number = 30
export const SPARK_SIZE: number = 4
export const SPARK_SPEED: number = 6

export const S_ARC_DURATION: number = 1 // x5
export const S_ARC_INTERVAL: number = 0.2
export const S_AREA_INTERVAL: number = 0.4
export const S_CONE_DURATION: number = 3
export const S_CONE_INTERVAL: number = 0.5

export const TRANSITION_DURATION = 0.3

// array index reflects corresponding direction, i.e. top, right, bottom, left
export const MOVEMENT_KEYS: ReadonlyArray<string> = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
  'w',
  'd',
  's',
  'a',
  'ц',
  'в',
  'ы',
  'ф'
]
// array index reflects corresponding direction, i.e. top, right, bottom, left
export const UNIT_VECTORS: ReadonlyArray<ReadonlyArray<number>> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

export type CharType = Readonly<{
  frames: ReadonlyArray<ReadonlyArray<number>>,
  frameInterval: number
}>

export const FRAMES: Readonly<{ [string]: CharType }> = {
  boss: { frames: [[1], [0, 1, 0]], frameInterval: 0.3 },
  minion: { frames: [[6]], frameInterval: 0.2 },
  player: { frames: [[4], [5, 4, 3, 4]], frameInterval: 0.2 }
}

export const BUILDING_PALETTE: ReadonlyArray<string> = [
  '#2a4062',
  '#5a668c',
  '#a493a4',
  '#c8afb9'
]
export const RAINBOW_PALETTE: ReadonlyArray<string> = [
  '#e84036',
  '#fbaf3e',
  '#fbe731',
  '#36b54c',
  '#4cb8ec',
  '#1a74bc',
  '#652c93'
]

// adds 412 kb
export const DEBUG_BB: boolean = false
export const DEBUG_PANEL: boolean = false
export const DEBUG_BOSS_ONLY: boolean = false
export const NO_SOUND: boolean = false
