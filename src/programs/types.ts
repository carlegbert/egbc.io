import { FixMe } from 'types'
import ShellCommand from 'Shell/ShellCommand'

export interface Program {
  name: string
  filetypes: FixMe.FileConstructor[]
  run: (cmd: ShellCommand) => FixMe.ShellCommandResult
}
