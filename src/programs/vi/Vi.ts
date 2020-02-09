import { getChar, textEquals } from '../../util/io'
import Shell from '../../Shell'
import { ViMode } from './types'
import { FSErrors } from '../../fs'
import { FileOpenMode } from '../../fs/FileStream'
import ViBuffer from './ViBuffer'
import { Process } from '../types'
import { errorIs } from '../../util/errors'

/**
 * Class representing a single instance of Vi
 */
export default class Vi implements Process {
  /**
   * @constructor
   * @param {Object} shellRef Reference to parent Shell object
   * @param {Path} filePath
   * @param {Object} file Reference to TxtFile to write to (optional)
   */
  private shellRef: Shell
  private mode: ViMode
  private heldNum = ''
  private commandText = ''
  private editorElement: HTMLElement = document.getElementById(
    'editor',
  ) as HTMLElement
  private editorConsoleElement: HTMLElement = document.getElementById(
    'editor-console',
  ) as HTMLElement
  private commandTextElement: HTMLElement | null = null
  private buffer: ViBuffer
  private filepath: string | undefined

  constructor(shellRef: Shell, filepath: string | undefined) {
    this.shellRef = shellRef
    this.mode = ViMode.Normal
    this.filepath = filepath
    this.buffer = new ViBuffer([])
  }

  private static getTerminalElement(): HTMLElement {
    return document.getElementById('terminal') as HTMLElement
  }

  public startSession(): void {
    Vi.getTerminalElement().style.display = 'none'
    this.editorElement.style.display = 'block'
    this.editorConsoleElement.innerHTML = ''
    try {
      this.buffer.text = this.shellRef.fs.findFile(this.filepath || '').contents
    } catch (e) {
      errorIs(e, FSErrors.FileNotFound)
      this.buffer.text = ['']
    }
    this.buffer.renderAllLines()
  }

  public handleKeystroke(event: KeyboardEvent): void {
    if (this.mode === ViMode.Normal) this.normalKeystroke(event)
    else if (this.mode === ViMode.Insert) this.insertKeystroke(event)
    else if (this.mode === ViMode.Command) this.commandKeystroke(event)
  }

  private endSession(): void {
    Vi.getTerminalElement().style.display = 'block'
    this.editorElement.style.display = 'none'
    this.shellRef.childProcess = null
  }

  private normalKeystroke(event: KeyboardEvent): void {
    const c = getChar(event)

    switch (c) {
      case 'i':
        this.beginInsertMode()
        break
      case 'I':
        this.buffer.moveCursorToBOL()
        this.beginInsertMode()
        break
      case 'a':
        this.buffer.moveCursorHorizontally(1, true)
        this.beginInsertMode()
        break
      case 'A':
        this.buffer.moveCursorToEOL()
        this.beginInsertMode()
        break
      case 'o':
        this.buffer.addLine(this.buffer.cursorY + 1)
        this.buffer.moveCursorVertically(1)
        this.buffer.moveCursorToBOL()
        this.beginInsertMode()
        break
      case 'O':
        this.buffer.moveCursorToBOL()
        if (this.buffer.cursorY !== 0) this.buffer.moveCursorVertically(-1)
        this.buffer.addLine(this.buffer.cursorY)
        this.beginInsertMode()
        break
      case ':':
        this.beginCommandMode()
        break
      case '$':
        this.buffer.moveCursorToEOL()
        break
      case '0':
        if (this.heldNum === '') {
          this.buffer.moveCursorToBOL()
          break
        } // else fall through to default
      default:
        if (!isNaN(parseInt(c, 10))) this.heldNum += c
        else this.processRepeat(c)
    }
  }

  private processRepeat(c: string): void {
    const num = this.heldNum !== '' ? parseInt(this.heldNum, 10) : 1
    if (num > 1) {
      for (let i = 0; i < num; i += 1) {
        this.repeatableNormalKeystroke(c, true)
      }
    } else {
      this.repeatableNormalKeystroke(c, false)
    }
    this.heldNum = ''
  }

  private repeatableNormalKeystroke(c: string, repeated = false): void {
    switch (c) {
      case 'l':
        this.buffer.moveCursorHorizontally(1)
        break
      case 'h':
        this.buffer.moveCursorHorizontally(-1)
        break
      case 'j':
        this.buffer.moveCursorVertically(1)
        break
      case 'k':
        this.buffer.moveCursorVertically(-1)
        break
      case 'x':
        this.buffer.removeChar()
        if (repeated) this.buffer.moveCursorHorizontally(1)
        break
      default:
        break
    }
  }

  private insertKeystroke(event: KeyboardEvent): void {
    const c = getChar(event)
    if (event.which === 27) {
      // escape
      this.buffer.moveCursorHorizontally(-1)
      this.beginNormalMode()
    } else if (event.which === 13) {
      // enter
      this.buffer.insertLineBreak()
      this.buffer.moveCursorVertically(1)
      this.buffer.moveCursorToBOL()
    } else if (event.which === 8) {
      // backspace
      this.insertModeBackspace()
    } else if (c.length === 1) {
      this.buffer.addChar(c)
      this.buffer.moveCursorHorizontally(1, true)
    }
  }

  private insertModeBackspace(): void {
    if (
      (this.buffer.cursorX === 0 ||
        this.buffer.text[this.buffer.cursorY].length === 0) &&
      this.buffer.cursorY > 0
    ) {
      this.buffer.concatLines()
    } else if (this.buffer.cursorX > 0) {
      this.buffer.moveCursorHorizontally(-1)
      this.buffer.removeChar(this.buffer.cursorX)
    }
  }

  private beginInsertMode(): void {
    this.mode = ViMode.Insert
    this.editorConsoleElement.innerHTML = '<strong>-- INSERT --</strong>'
  }

  private beginNormalMode(message = ''): void {
    this.mode = ViMode.Normal
    this.buffer.renderCursor()
    this.commandText = ''
    this.editorConsoleElement.innerHTML = message
  }

  private beginCommandMode(): void {
    this.mode = ViMode.Command
    this.buffer.disableCursor()
    this.renderEmptyCommandElement()
  }

  private renderEmptyCommandElement(): void {
    this.editorConsoleElement.innerHTML = ''
    const commandCursor = document.createElement('span')
    commandCursor.innerHTML = '&nbsp;'
    commandCursor.classList.add('cursor')
    const commandBegin = document.createElement('span')
    commandBegin.innerHTML = ':'
    this.commandTextElement = document.createElement('span')
    this.editorConsoleElement.appendChild(commandBegin)
    this.editorConsoleElement.appendChild(this.commandTextElement)
    this.editorConsoleElement.appendChild(commandCursor)
  }

  private commandKeystroke(event: KeyboardEvent): void {
    const element = this.commandTextElement as HTMLElement
    const c = getChar(event)
    if (event.which === 27) {
      // escape
      this.commandText = ''
      this.beginNormalMode()
    } else if (event.which === 8) {
      // backspace
      this.commandText = this.commandText.slice(0, -1)
      element.innerHTML = this.commandText
    } else if (event.which === 13) {
      // enter
      const message = this.evaluateCommand()
      this.beginNormalMode(message)
    } else if (c.length === 1) {
      this.commandText += c
      element.innerHTML += c
    }
  }

  private evaluateCommand(): string {
    switch (this.commandText) {
      case 'w':
        return this.writeFile()
      case 'q':
        return this.quit()
      case 'q!':
        return this.quit(true)
      case 'wq':
        this.writeFile()
        return this.quit()
      default:
        return `${this.commandText} is not a valid command`
    }
  }

  private writeFile(): string {
    if (!this.filepath) {
      return 'E32: No file name'
    }

    try {
      const stream = this.shellRef.fs.openFileStream(
        this.filepath,
        FileOpenMode.Write,
      )
      stream.write(this.buffer.text.slice())
    } catch (e) {
      errorIs(e, FSErrors.FileNotFound)
      return "E212: Can't open file for writing: No such file or directory"
    }
    return `"${this.filepath}" written`
  }

  private quit(force = false): string {
    // TODO: Buffer itself should reference the filepath and handle
    // writing to the file
    // TODO: Buffer should mark itself as dirty/clean rather than comparing
    // file contents to buffer contents on close
    if (force) {
      return ''
    }

    try {
      const file = this.shellRef.fs.findFile(this.filepath || '')
      if (!textEquals(this.buffer.text, file.contents)) {
        return 'E37: No write since last change'
      }
    } catch (e) {
      errorIs(e, FSErrors.FileNotFound)
      if (!this.buffer.isEmpty()) {
        return 'E37: No write since last change'
      }
      this.endSession()
      return ''
    }

    this.endSession()
    return ''
  }
}
