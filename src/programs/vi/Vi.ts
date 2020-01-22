import { getChar, textEquals } from '../../util/io'
import Shell from 'Shell'
import { FixMe } from 'types'
import { ViMode } from './types'
import { TextFile } from '../../fs'
import ViBuffer from './ViBuffer'
import { Process } from 'programs/types'

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
  private file: TextFile | null
  private mode: ViMode
  private heldNum: string
  private commandText: string
  private editorElement: HTMLElement
  private editorConsoleElement: HTMLElement
  private commandTextElement: HTMLElement | null
  private buffer: FixMe.Any
  private filePath: FixMe.Any

  constructor(
    shellRef: Shell,
    filePath: FixMe.Any,
    file: TextFile | null = null,
  ) {
    this.shellRef = shellRef
    this.file = file
    this.mode = ViMode.Normal
    this.heldNum = ''
    this.commandText = ''
    this.editorElement = document.getElementById('editor') as HTMLElement
    this.editorConsoleElement = document.getElementById(
      'editor-console',
    ) as HTMLElement
    this.buffer = null
    this.filePath = filePath
    this.commandTextElement = null
  }

  createBuffer() {
    const bufferText = this.file !== null ? this.file.contents : ['']
    this.buffer = new ViBuffer(bufferText)
    this.buffer.renderAllLines()
  }

  startSession() {
    Vi.getTerminalElement().style.display = 'none'
    this.editorElement.style.display = 'block'
    this.editorConsoleElement.innerHTML = ''
    this.createBuffer()
  }

  endSession() {
    Vi.getTerminalElement().style.display = 'block'
    this.editorElement.style.display = 'none'
    this.shellRef.childProcess = null
  }

  renderErrorMessage(errText: string) {
    this.editorConsoleElement.innerHTML = errText
  }

  handleKeystroke(event: KeyboardEvent) {
    if (this.mode === ViMode.Normal) this.normalKeystroke(event)
    else if (this.mode === ViMode.Insert) this.insertKeystroke(event)
    else if (this.mode === ViMode.Command) this.commandKeystroke(event)
  }

  normalKeystroke(event: KeyboardEvent) {
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

  processRepeat(c: string) {
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

  repeatableNormalKeystroke(c: string, repeated = false) {
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

  insertKeystroke(event: KeyboardEvent) {
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

  insertModeBackspace() {
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

  beginInsertMode() {
    this.mode = ViMode.Insert
    this.editorConsoleElement.innerHTML = '<strong>-- INSERT --</strong>'
  }

  beginNormalMode(message = '') {
    this.mode = ViMode.Normal
    this.buffer.renderCursor()
    this.commandText = ''
    this.editorConsoleElement.innerHTML = message
  }

  beginCommandMode() {
    this.mode = ViMode.Command
    this.buffer.disableCursor()
    this.renderEmptyCommandElement()
  }

  renderEmptyCommandElement() {
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

  commandKeystroke(event: KeyboardEvent) {
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

  evaluateCommand() {
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

  writeFile() {
    if (!this.file)
      this.file = this.shellRef.currentDir.createChild(
        this.filePath,
        TextFile,
      ) as TextFile
    if (!this.file)
      return "E212: Can't open file for writing: No such file or directory"
    this.file.contents = this.buffer.text.slice()
    const msg = `"${this.file.fullPath}" written`
    return msg
  }

  quit(force = false) {
    if (
      !force &&
      (!this.file || !textEquals(this.buffer.text, this.file.contents))
    )
      return 'E37: No write since last change'
    this.endSession()
    return ''
  }

  private static getTerminalElement(): HTMLElement {
    return document.getElementById('terminal') as HTMLElement
  }
}
