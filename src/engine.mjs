/* @flow */

import emptyFunction from './libs/emptyFunction.mjs'

const _frameRate = 240
const _minFrameTime = 1 / _frameRate
const _maxFrameTime = 1
const _scale = window.innerWidth <= 440 ? 1.6 : 3
const _state: { buffer: HTMLCanvasElement, context: CanvasRenderingContext2D } =
  // $FlowExpectedError[incompatible-type]
  { buffer: null, context: null }

const _input: {
  // keeps information about keys that were checked for the "pressed" state so
  // we can update its state on the next tick
  checked: { [string]: boolean },
  // keeps keyboard state
  holding: { [string]: boolean },
  pressed: { [string]: boolean },

  resized: boolean,
  touched: boolean,
  touches: { [string]: [number, number] }
} = {
  checked: {},
  holding: {},
  pressed: {},
  resized: false,
  touched: false,
  touches: {}
}

type AlignMode = 'center' | 'left' | 'right'

/**
 * Shared type for the mode argument to be used
 * for various shapes drawing
 */
type DrawMode = 'fill' | 'line'

/**
 * Helper to check available space.
 * Returns virtual resolution.
 */
export const Dimentions = { width: 0, height: 0 }

/**
 * Handles I/O
 */
export const Keys = {
  wasHolding (key: string): boolean {
    return _input.holding[key] === true
  },

  wasPressed (key: string): boolean {
    if (_input.pressed[key] === true) {
      _input.checked[key] = true
      return true
    }

    return false
  }
}

export const Touch = {
  getPosition (): ?[number, number] {
    // $FlowExpectedError[incompatible-type]: missing null check
    return _input.touches['_'] ?? null
  },

  wasTouched (): boolean {
    return _input.touched
  }
}

export function arc (
  mode: DrawMode,
  x: number,
  y: number,
  radius: number,
  a0: number,
  a1: number
) {
  const c = _state.context
  c.beginPath()
  c.arc(
    Math.round(x),
    Math.round(y),
    Math.round(radius),
    (a0 * Math.PI) / 180,
    (a1 * Math.PI) / 180
  )
  mode === 'fill' ? c.fill() : c.stroke()
}

export function clear () {
  const b = _state.buffer
  const c = _state.context
  c.clearRect(0, 0, b.width, b.height)
}

export function circle (mode: DrawMode, x: number, y: number, radius: number) {
  const c = _state.context
  c.beginPath()
  c.arc(Math.round(x), Math.round(y), Math.round(radius), 0, 2 * Math.PI)
  mode === 'fill' ? c.fill() : c.stroke()
}

export function draw (
  drawable: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const c = _state.context
  c.drawImage(
    drawable,
    0,
    0,
    drawable.width,
    drawable.height,
    Math.round(x),
    Math.round(y),
    Math.round(w),
    Math.round(h)
  )
}

export function ellipse (
  mode: DrawMode,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number
) {
  const c = _state.context
  c.beginPath()
  c.ellipse(
    Math.round(x),
    Math.round(y),
    Math.round(radiusX),
    Math.round(radiusY),
    (rotation * Math.PI) / 180,
    0,
    2 * Math.PI
  )
  mode === 'fill' ? c.fill() : c.stroke()
}

export function getTextWidth (text: string): number {
  const c = _state.context
  return c.measureText(text).width
}

export function line (x0: number, y0: number, x1: number, y1: number) {
  const c = _state.context
  c.beginPath()
  c.moveTo(Math.round(x0), Math.round(y0))
  c.lineTo(Math.round(x1), Math.round(y1))
  c.stroke()
}

export function printf (
  text: string,
  x: number,
  y: number,
  limit?: ?number,
  align?: AlignMode
) {
  const c = _state.context
  limit = limit ?? Dimentions.width - x

  const width = getTextWidth(text)
  const dx =
    align === 'right'
      ? limit - width
      : align === 'center'
        ? 0.5 * (limit - width)
        : 0

  c.fillText(text, Math.round(x + dx), Math.round(y), limit)
}

export function putImageData (data: ImageData, x: number, y: number) {
  const c = _state.context
  c.putImageData(data, x, y)
}

export function rect (
  mode: DrawMode,
  x: number,
  y: number,
  width: number,
  height: number,
  radius?: number
) {
  const c = _state.context
  c.beginPath()
  c.roundRect(
    Math.round(x),
    Math.round(y),
    Math.round(width),
    Math.round(height),
    Math.round(radius ?? 0)
  )
  mode === 'fill' ? c.fill() : c.stroke()
}

export function restore () {
  _state.context.restore()
}

export function rotate (degree: number) {
  const c = _state.context
  c.rotate((degree * Math.PI) / 180)
}

export function save () {
  _state.context.save()
}

export function setColor (color: string, opacity?: number) {
  const c = _state.context
  c.fillStyle = color
  c.strokeStyle = color
  c.globalAlpha = opacity ?? 1
}

export function setFont (font: number | string) {
  const c = _state.context
  c.font = typeof font === 'number' ? c.font.replace(/\d+/, String(font)) : font
}

export function setLine (width: number) {
  const c = _state.context
  c.lineWidth = width
}

export function shape (mode: DrawMode, ...coords: ReadonlyArray<number>) {
  const c = _state.context
  c.beginPath()
  c.moveTo(Math.round(coords[0]), Math.round(coords[1]))
  for (let i = 2; i < coords.length; i += 2) {
    c.lineTo(Math.round(coords[i]), Math.round(coords[i + 1]))
  }
  c.closePath()
  mode === 'fill' ? c.fill() : c.stroke()
}

export function translate (dx: number, dy: number) {
  const c = _state.context
  c.translate(Math.round(dx), Math.round(dy))
}

export function wasResized (): boolean {
  return _input.resized
}

export async function createEngine (
  initGame?: ?() => Promise<void>,
  updateGame?: ?(delta: number) => void,
  renderGame?: ?() => void
) {
  _updateDimentions()
  if (initGame != null) await initGame()

  // normalize input
  const render = renderGame ?? emptyFunction
  const update: (number) => void = updateGame ?? emptyFunction

  const c = createCanvas()
  _state.buffer = c[0]
  _state.context = c[1]

  document.body?.appendChild(_state.buffer)
  ;(function gameLoop (previousFrame: number) {
    const currentFrame = _getTime()
    const delta = currentFrame - previousFrame

    if (delta >= _maxFrameTime) {
      // skip update if too much time passed
      previousFrame = currentFrame
    } else if (delta >= _minFrameTime) {
      previousFrame = currentFrame

      // update game state
      update(delta)
      _normalizeCanvas()
      _updateDimentions()

      clear()
      // save and restore helps to reset "translate" changes
      _state.context.save()
      render()
      _state.context.restore()

      // reset I/O
      Object.keys(_input.checked).forEach((key) => {
        delete _input.checked[key]
        delete _input.pressed[key]
      })

      _input.resized = false
      _input.touched = false
    }

    window.requestAnimationFrame(() => {
      gameLoop(previousFrame)
    })
  })(_getTime())

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)
  document.addEventListener('pointerdown', onPointer)
  document.addEventListener('pointercancel', onPointerEnd)
  document.addEventListener('pointerup', onPointerEnd)
  window.addEventListener('resize', onReisze)

  function onKeydown (event: KeyboardEvent) {
    _preventDefault(event)

    const key = event.key
    _input.holding[key] = true
    _input.pressed[key] = true
  }

  function onKeyup (event: KeyboardEvent) {
    _preventDefault(event)

    const key = event.key
    delete _input.holding[key]
    delete _input.pressed[key]
  }

  function onPointer (event: PointerEvent) {
    if (!event.isPrimary) return

    onPointerMove(event)
    document.addEventListener('pointermove', onPointerMove)
  }

  function onPointerMove (event: PointerEvent) {
    if (!event.isPrimary) return

    _preventDefault(event)
    _input.touched = true
    _input.touches['_'] = [event.pageX / _scale, event.pageY / _scale]
  }

  function onPointerEnd (event: PointerEvent) {
    if (!event.isPrimary) return

    _preventDefault(event)
    delete _input.touches['_']
    document.removeEventListener('pointermove', onPointerMove)
  }

  function onReisze () {
    _input.resized = true
  }

  function _preventDefault (event: UIEvent) {
    event.preventDefault()
  }
}

export function genQuads (
  atlas: HTMLImageElement,
  width: number,
  height: number,
  x0?: number,
  y0?: number,
  mw?: number,
  mh?: number
): ReadonlyArray<HTMLImageElement> {
  x0 = x0 ?? 0
  y0 = y0 ?? 0
  mw = mw ?? atlas.width
  mh = mh ?? atlas.height

  const quads = []
  const [canvas, canvasContext] = createCanvas(width, height)

  for (let y = y0; y < mh; y += height) {
    for (let x = x0; x < mw; x += width) {
      canvasContext.clearRect(0, 0, width, height)
      canvasContext.drawImage(atlas, -x, -y)

      const image = new window.Image()
      image.src = canvas.toDataURL('image/png')

      quads.push(image)
    }
  }

  return quads
}

export function newImage (url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: '${url}'`))
    image.src = url
  })
}

export async function scaleQuad (
  img: HTMLImageElement,
  scale: number
): Promise<HTMLImageElement> {
  const w = img.width * scale
  const h = img.height * scale
  const [, t] = createCanvas(w, h)
  t.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h)
  return window.createImageBitmap(t.getImageData(0, 0, w, h))
}

/**
 * Helpers
 */

export function createCanvas (
  width?: number,
  height?: number
): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  if (width != null && height != null) {
    canvas.width = width
    canvas.height = height
  }

  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = false
  context.font = '8px Consolas, monaco, monospace'
  context.textBaseline = 'top'

  return [canvas, context]
}

function _normalizeCanvas () {
  _state.buffer.width = window.innerWidth
  _state.buffer.height = window.innerHeight
  _state.context.scale(_scale, _scale)
}

function _getTime (): number {
  return 0.001 * Date.now()
}

function _updateDimentions () {
  Dimentions.width = Math.ceil(window.innerWidth / _scale)
  Dimentions.height = Math.ceil(window.innerHeight / _scale)
}
