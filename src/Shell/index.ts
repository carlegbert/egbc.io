import { getChar, print, printInline, PrintableElement } from '../util/io'
import { getElementById } from '../util/selectors'
import { errorIs } from '../util/errors'
import * as ac from './autocomplete'
import ShellCommand from './ShellCommand'
import ShellCommandResult from './ShellCommandResult'
import programs from '../programs'
import { Program, Process } from '../programs/types'
import { Directory, FileSystem, FSErrors } from '../fs'
import { FileOpenMode } from '../fs/FileStream'
import { FileKind } from '../fs/constants'

const getValidTypesForProgram = (name: string) => {
  const program = programs[name]
  return program ? program.filekinds : [FileKind.Directory, FileKind.Text]
}

enum RedirectPattern {
  Write = '>',
  Append = '>>',
}

const mapRedirectPatternToWritingMode = (pattern: RedirectPattern) =>
  pattern === RedirectPattern.Write ? FileOpenMode.Write : FileOpenMode.Append

/**
 * Object encapsulating shell session
 * @class
 */
export default class Shell {
  /**
   * Represents shell session. to be instantiated once upon browser load.
   * @constructor
   * @param {Directory} fileStructure base dir tied to shell session
   */
  public deprecatedFileSystem: Directory
  public PS1Element: PrintableElement
  public outputElement: PrintableElement
  public currentDir: Directory
  public user: string
  public childProcess: Process | null
  public programs: { [programName: string]: Program }
  public fs: FileSystem

  private inputString: string
  private bashHistory: string[]
  private historyIndex: number
  private prevKeyWasTab: boolean
  private inputPromptElement: PrintableElement

  constructor() {
    this.fs = new FileSystem()
    this.deprecatedFileSystem = this.fs.home
    this.currentDir = this.deprecatedFileSystem
    this.user = 'guest'
    this.inputString = ''
    this.bashHistory = []
    this.historyIndex = 0
    this.prevKeyWasTab = false
    this.inputPromptElement = getElementById('input')
    this.PS1Element = getElementById('PS1')
    this.outputElement = getElementById('terminal-output')
    this.childProcess = null
    this.programs = programs
  }

  /**
   * @return {string} PS1 string
   */
  getPS1String(): string {
    return (
      `<span class="user">${this.user}@egbc.io:</span>` +
      `<span class="path">${this.currentDir.fullPath}</span>$&nbsp;`
    )
  }

  /**
   * Direct keystroke to shell's keystroke handler or to child process
   * if there is one active
   * @param {Object} event Keystroke event
   */
  directKeystroke(event: KeyboardEvent): void {
    if (!this.childProcess) {
      this.handleKeystroke(event)
    } else if (this.childProcess.handleKeystroke) {
      this.childProcess.handleKeystroke(event)
    }
  }

  handleKeystroke(event: KeyboardEvent): void {
    if (event.which === 13) {
      // enter
      event.preventDefault()
      this.handleEnter()
    } else if (event.which === 8) {
      // backspace
      event.preventDefault()
      this.inputString = this.inputString.slice(0, this.inputString.length - 1)
      this.inputPromptElement.innerHTML = this.inputString.replace(
        / /g,
        '&nbsp;',
      )
    } else if (event.which === 38 && this.historyIndex > 0) {
      // up arrow
      event.preventDefault()
      this.historyIndex -= 1
      this.inputString = this.bashHistory[this.historyIndex]
      this.inputPromptElement.innerHTML = this.inputString
    } else if (
      event.which === 40 &&
      this.historyIndex < this.bashHistory.length
    ) {
      // down
      event.preventDefault()
      this.historyIndex += 1
      if (this.historyIndex === this.bashHistory.length) this.inputString = ''
      else this.inputString = this.bashHistory[this.historyIndex]
      this.inputPromptElement.innerHTML = this.inputString
    } else if (event.which === 9) {
      // tab
      event.preventDefault()
      this.handleTab()
      this.prevKeyWasTab = true
    } else {
      const k = getChar(event)
      this.inputString += k
      const kSpaceAdjusted = k === ' ' ? '&nbsp;' : k
      this.inputPromptElement.innerHTML += kSpaceAdjusted
    }

    if (event.which !== 9) this.prevKeyWasTab = false
    this.inputPromptElement.scrollIntoView(false)
  }

  /**
   * process Enter keystroke
   */
  handleEnter(): void {
    if (!this.inputString.match(/[^ ]/g)) {
      print(this.getPS1String(), this.outputElement)
    } else {
      print(
        this.getPS1String() + this.inputString.replace(' ', '&nbsp;'),
        this.outputElement,
      )
      this.bashHistory.push(this.inputString)
      const res = this.executeCommand(this.inputString)
      print(res.getDefaultOutput(), this.outputElement)
    }
    this.inputString = ''
    this.inputPromptElement.innerHTML = ''
    this.historyIndex = this.bashHistory.length
  }

  /**
   * attempt to process inputstring into shell command
   * @param {string} inputString String to process
   * @return {Object} Result of eval(evalStr), which should always
   * be a ShellCommandResult object
   */
  executeCommand(inputString: string): ShellCommandResult {
    if (inputString.includes(RedirectPattern.Append))
      return this.redirect(inputString, RedirectPattern.Append)
    if (inputString.includes(RedirectPattern.Write))
      return this.redirect(inputString, RedirectPattern.Write)

    const shellCommand = new ShellCommand(inputString, this)
    const program = programs[shellCommand.args[0]]
    if (!program)
      return new ShellCommandResult(
        [],
        [`${shellCommand.args[0]}: command not found`],
      )
    return program.run(shellCommand)
  }

  /**
   * redirect with >, >> operators
   * @param {string} inputString Input string containing redirect operator
   * @param {string} pattern Redirect operator (either > or >>)
   * @return {Object} ShellCommandResult containing stderr to print to screen if necessary
   */
  redirect(inputString: string, pattern: RedirectPattern): ShellCommandResult {
    const i = inputString.indexOf(pattern)
    const afterSymbol = inputString
      .slice(i + pattern.length)
      .trim()
      .split(' ')
    if (!afterSymbol || afterSymbol.length === 0)
      return new ShellCommandResult([], ['Syntax error'])
    const filepath = afterSymbol[0]
    const otherArgs =
      afterSymbol.length === 1 ? [] : afterSymbol.slice(pattern.length)
    const newInput = inputString.slice(0, i) + otherArgs.join(' ')
    const res = this.executeCommand(newInput)
    try {
      const fileStream = this.fs.openFileStream(
        filepath,
        mapRedirectPatternToWritingMode(pattern),
      )
      fileStream.write(res.stdOut)
    } catch (e) {
      errorIs(e, FSErrors.FileNotFound)
      return new ShellCommandResult(null, [
        `bash: ${filepath}: No such file or directory`,
      ])
    }
    return new ShellCommandResult(null, res.stdErr)
  }

  handleTab() {
    const spaceAtEnd = this.inputString[this.inputString.length - 1] === ' '
    const cmd = new ShellCommand(this.inputString, this)
    const programNames = Object.keys(this.programs)
    let options: string[]
    let partial
    if (!cmd.args[0]) {
      partial = ''
      options = programNames
    } else if (!spaceAtEnd && cmd.args.length === 1) {
      partial = cmd.args[0]
      options = ac.filterOptions(partial, programNames)
    } else {
      partial = cmd.args.slice(1)[cmd.args.length - 2] || ''
      const typedPath = partial.split('/')
      const partialName = typedPath.pop() || ''
      const dir = this.currentDir.findFile(
        typedPath,
        Directory,
      ) as Directory | null
      if (!dir) {
        options = []
      } else {
        options = ac.getFiles(
          partialName,
          getValidTypesForProgram(cmd.args[0]),
          dir,
        )
        if (options.length === 0)
          options = ac.getFiles(partialName, [FileKind.Directory], dir)
      }
    }

    const longestCommonBeginning = ac.findLongestCommonBeginning(
      partial,
      options,
    )
    if (longestCommonBeginning !== partial)
      this.completeWord(partial, longestCommonBeginning)
    else if (options.length === 1) this.completeWord(partial, options[0])
    else if (options.length > 1 && this.prevKeyWasTab) {
      print(this.getPS1String() + this.inputString, this.outputElement)
      printInline(options, this.outputElement)
    }
  }

  /**
   * executes autocomplete for a single word.
   * @param {string} partial Word to be completed
   * @param {string} complete Word to be autocompleted to
   */
  completeWord(partial: string, complete: string): void {
    const splitPartial = partial.split('/')
    const wordPartial = splitPartial[splitPartial.length - 1]
    const completion = complete.slice(wordPartial.length)
    this.inputString += completion
    this.inputPromptElement.append(completion)
  }

  killChildProcess(): void {
    this.childProcess = null
  }
}
