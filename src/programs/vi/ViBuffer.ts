/* eslint-env browser */
/* eslint-disable class-methods-use-this, no-param-reassign */

import BufferLine from './BufferLine'

/*
 * Object encapsulating a vi buffer. Performs tasks
 * such as writing to DOM, updating text, etc.
 */
export default class ViBuffer {
  /**
   * @constructor
   * @param {string[]} text
   */
  public text: string[]
  public cursorX: number
  public cursorY: number
  private element: HTMLElement
  private cursorElement: HTMLElement | null
  private lines: BufferLine[]

  constructor(text: string[]) {
    this.text = text.slice()
    this.cursorX = 0
    this.cursorY = 0
    this.element = document.getElementById('editor-buffer') as HTMLElement
    this.cursorElement = null
    this.lines = []
  }

  public isEmpty(): boolean {
    return this.text.length >= 1 && !this.text[0]
  }

  public renderAllLines(): void {
    this.element.innerHTML = ''
    this.lines = []
    this.text.forEach((_, y) => {
      const bufLine = new BufferLine(this, y)
      this.element.appendChild(bufLine.element)
      this.lines.push(bufLine)
      bufLine.renderChars()
    })
    this.renderCursor()
  }

  public addLine(y: number, lineText = ''): BufferLine {
    this.text.splice(y, 0, lineText)
    const newBufferLine = new BufferLine(this, y)
    this.lines.splice(y, 0, newBufferLine)
    if (y === this.text.length - 1)
      this.element.appendChild(newBufferLine.element)
    else
      this.element.insertBefore(
        newBufferLine.element,
        this.lines[y + 1].element,
      )
    newBufferLine.renderChars()
    this.resetLineIndices()
    return newBufferLine
  }

  public disableCursor(): void {
    // remove cursor class but retain reference to cursor element
    if (!this.cursorElement) return
    this.cursorElement.classList.remove('cursor')
  }

  public moveCursorVertically(y: number): void {
    const max = this.text.length - 1
    this.cursorY += y
    if (this.cursorY > max) this.cursorY = max
    else if (this.cursorY < 0) this.cursorY = 0
    this.renderCursor()
  }

  public moveCursorHorizontally(x: number, insert = false): void {
    let max = this.text[this.cursorY].length - 1
    if (insert || this.text[this.cursorY].length === 0) max += 1
    this.cursorX += x
    if (this.cursorX > max) this.cursorX = max
    else if (this.cursorX < 0) this.cursorX = 0
    this.renderCursor(insert)
  }

  public moveCursorToBOL(): void {
    this.cursorX = 0
    this.renderCursor()
  }

  public moveCursorToEOL(): void {
    const len = this.text[this.cursorY].length
    this.cursorX = len
    this.renderCursor()
  }

  public addChar(c: string): void {
    this.lines[this.cursorY].addChar(this.cursorX, c)
  }

  public removeChar(x = this.cursorX): void {
    this.lines[this.cursorY].removeChar(x)
    this.renderCursor()
  }

  public removeLine(y: number): void {
    this.element.removeChild(this.lines[y].element)
    this.lines.splice(y, 1)
    this.text.splice(y, 1)
    this.resetLineIndices()
  }

  public concatLines(): void {
    this.moveCursorVertically(-1)
    this.moveCursorToEOL()
    this.text[this.cursorY] += this.text[this.cursorY + 1]
    this.removeLine(this.cursorY + 1)
    this.lines[this.cursorY].renderChars()
    this.renderCursor()
  }

  public insertLineBreak(y = this.cursorY): void {
    const newBufLine = this.addLine(y + 1, this.text[y].slice(this.cursorX))
    this.text[y] = this.text[y].slice(0, this.cursorX)
    this.lines[y].renderChars()
    this.element.insertBefore(this.lines[y].element, newBufLine.element)
    this.renderCursor()
  }

  public renderCursor(insert = false): void {
    if (this.cursorElement) this.cursorElement.classList.remove('cursor')
    this.cursorElement = this.lines[this.cursorY].renderCursor(
      this.cursorX,
      insert,
    )
  }

  private resetLineIndices(): void {
    this.lines.forEach((bufLine, i) => {
      bufLine.y = i
    })
  }
}
