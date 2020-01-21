import { Program } from './types'
import Directory from '../FileStructure/Directory'

import ShellCommandResult from '../Shell/ShellCommandResult'

const cd: Program = {
  name: 'cd',
  filetypes: [Directory],
  run: cmd => {
    const shell = cmd.shell
    if (cmd.args.length > 2)
      return new ShellCommandResult([], ['cd: too many arguments'])
    const dir =
      cmd.args.length === 1
        ? shell.fileStructure
        : shell.currentDir.findFile(cmd.args[1].split('/'), Directory)
    if (dir) {
      shell.currentDir = dir
      shell.PS1Element.innerHTML = shell.getPS1String()
      return new ShellCommandResult()
    }
    return new ShellCommandResult(null, [`${cmd.args[1]}: directory not found`])
  },
}

export default cd
