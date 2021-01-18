import ShellCommand from 'Shell/ShellCommand'
import ShellCommandResult from 'Shell/ShellCommandResult'
import { FileKind } from '../fs/constants'

export interface Program {
  name: string
  run: (cmd: ShellCommand) => ShellCommandResult
  filekinds: FileKind[]
}

export interface Process {
  handleKeystroke?: (e: KeyboardEvent) => void
}
