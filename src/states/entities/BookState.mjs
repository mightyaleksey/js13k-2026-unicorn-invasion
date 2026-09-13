/* @flow */

import { FONT_MEDIUM, FONT_SMALL } from '../../constants.mjs'
import { printf, setFont, wasResized } from '../../engine.mjs'
import { formatLines } from '../../helpers/text.mjs'
import { nullthrows } from '../../libs/nullthrows.mjs'
import { ButtonState } from './ButtonState.mjs'
import { EntityState } from './EntityState.mjs'

export type BookProps = Readonly<
  [
    x: number,
    y: number,
    width: number,
    height: number,
    pages: ReadonlyArray<ReadonlyArray<string>>,
    onEnd?: ?() => void
  ]
>

export class BookState extends EntityState {
  x: number
  y: number
  width: number
  height: number

  source: ReadonlyArray<ReadonlyArray<string>>
  pages: ?ReadonlyArray<ReadonlyArray<string>>
  page: number

  onEnd: ?() => void
  button: ButtonState

  constructor (props: BookProps) {
    super([props[0], props[1], props[2], props[3]])

    this.source = props[4]
    this.pages = null
    this.page = 0

    this.onEnd = props[5]
    this.button = new ButtonState([
      props[0],
      props[1],
      props[2],
      props[3],
      () => {
        this.onClick()
      }
    ])
  }

  render () {
    if (this.pages == null) return
    const lines = this.pages[this.page]

    setFont(FONT_MEDIUM)
    for (let i = 0; i < lines.length; ++i) {
      printf(lines[i], this.x, this.y + 16 * i + 8, this.width)
    }

    setFont(FONT_SMALL)
    printf(
      `${this.page + 1}/${nullthrows(this.pages).length}`,
      this.x,
      this.y + this.height,
      this.width,
      'right'
    )
  }

  update (delta: number) {
    if (this.pages == null || wasResized()) {
      this.pages = this.genPages()
      this.button.x = this.x
      this.button.y = this.y
      this.button.width = this.width
      this.button.height = this.height
    }

    this.button.update(delta)
  }

  /* helpers */

  genPages (): ReadonlyArray<ReadonlyArray<string>> {
    const w = this.width
    const h = this.height

    setFont(FONT_MEDIUM)

    const maxLines = Math.floor(h / 16)
    const pages = []

    this.source.map((lines) => {
      const currentLines = formatLines(lines, w)

      let index = 0
      while (index < currentLines.length) {
        let target = index + maxLines
        if (currentLines[target] === ' ') target++
        pages.push(currentLines.slice(index, target))
        index = target
      }
    })

    return pages
  }

  onClick () {
    if (this.page >= nullthrows(this.pages).length - 1) {
      if (this.onEnd != null) this.onEnd()
      return
    }

    this.page++
  }
}
