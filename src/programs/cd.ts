import { Program } from './types'
import Directory from '../FileStructure/Directory'

import ShellCommandResult from '../Shell/ShellCommandResult'

const cd: Program = {
  name: 'cd',
  filetypes: [Directory],
  run: cmd => {
    const shell = cmd.shell
    const dir =
      cmd.args.length === 0
        ? shell.fileStructure
        : shell.currentDir.findFile(cmd.args[0].split('/'), Directory)
    if (dir) {
      shell.currentDir = dir
      shell.PS1Element.innerHTML = shell.getPS1String()
      return new ShellCommandResult()
    }
    return new ShellCommandResult(null, [`${cmd.args[0]}: directory not found`])
  },
}

export default cd
