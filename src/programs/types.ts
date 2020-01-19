import { FixMe } from 'types'
import ShellCommand from 'Shell/ShellCommand'

export interface Program {
  name: string
  filetypes: FixMe.Any
  run: (cmd: ShellCommand) => FixMe.ShellCommandResult
}
