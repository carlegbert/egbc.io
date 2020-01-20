import { FixMe } from 'types'
import ShellCommand from 'Shell/ShellCommand'
import ShellCommandResult from 'Shell/ShellCommandResult'

export interface Program {
  name: string
  filetypes: FixMe.Any
  run: (cmd: ShellCommand) => ShellCommandResult
}
