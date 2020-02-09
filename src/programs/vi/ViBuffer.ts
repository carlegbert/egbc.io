import BufferLine from './BufferLine'
import { FileStructure, FSErrors } from '../../fs'
import { errorIs } from '../../util/errors'
import { FileOpenMode } from '../../fs/FileStream'

interface ViBufferOptions {
  filepath: string
  fs: FileStructure
  isNewFile?: boolean
  text?: string[]
}

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
  public cursorX = 0
  public cursorY = 0
  public dirty = false
  private element = document.getElementById('editor-buffer') as HTMLElement
  private filepath: string
  private fs: FileStructure
  private cursorElement: HTMLElement | null = null
  private lines: BufferLine[] = []

  private constructor({ filepath, fs, text = [''] }: ViBufferOptions) {
    this.text = text.slice()
    this.filepath = filepath
    this.fs = fs
  }

  public static createBuffer(filepath: string, fs: FileStructure): ViBuffer {
    try {
      const file = fs.findFile(filepath)
      return new ViBuffer({ filepath, fs, text: file.contents.slice() })
    } catch (e) {
      errorIs(e, FSErrors.FileNotFound)
      // If the file doesn't exist, we'll initialize the buffer with no text
      return new ViBuffer({
        filepath,
        fs,
      })
    }
  }

  /**
   * Flush the buffer contents to the file.
   *
   * If there is no filepath specified, the filesystem will throw a
   * FileNotFound error. If the path to the file doesn't exist, the
   * filesystem will throw a DirectoryNotFound error.
   */
  public flush(): string {
    const filestream = this.fs.openFileStream(this.filepath, FileOpenMode.Write)
    filestream.write(this.text.slice())

    this.markClean()
    return this.filepath
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
    this.markDirty()
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
    this.markDirty()
  }

  public removeChar(x = this.cursorX): void {
    this.lines[this.cursorY].removeChar(x)
    this.renderCursor()
    this.markDirty()
  }

  public removeLine(y: number): void {
    this.element.removeChild(this.lines[y].element)
    this.lines.splice(y, 1)
    this.text.splice(y, 1)
    this.resetLineIndices()
    this.markDirty()
  }

  public concatLines(): void {
    this.moveCursorVertically(-1)
    this.moveCursorToEOL()
    this.text[this.cursorY] += this.text[this.cursorY + 1]
    this.removeLine(this.cursorY + 1)
    this.lines[this.cursorY].renderChars()
    this.renderCursor()
    this.markDirty()
  }

  public insertLineBreak(y = this.cursorY): void {
    const newBufLine = this.addLine(y + 1, this.text[y].slice(this.cursorX))
    this.text[y] = this.text[y].slice(0, this.cursorX)
    this.lines[y].renderChars()
    this.element.insertBefore(this.lines[y].element, newBufLine.element)
    this.renderCursor()
    this.markDirty()
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

  private markDirty(): void {
    this.dirty = true
  }

  private markClean(): void {
    this.dirty = false
  }
}
