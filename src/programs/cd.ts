import { Program } from './types'
import { Directory, FSErrors } from '../fs'
import ShellCommandResult from '../Shell/ShellCommandResult'
import { errorIs } from '../util/errors'

const cd: Program = {
  name: 'cd',
  filetypes: [Directory],
  run: cmd => {
    const shell = cmd.shell
    if (cmd.args.length > 2)
      return new ShellCommandResult([], ['cd: too many arguments'])
    try {
      const dir =
        cmd.args.length === 1
          ? shell.fs.home
          : shell.fs.findDirectory(cmd.args[1])
      shell.currentDir = dir
      shell.PS1Element.innerHTML = shell.getPS1String()
      return new ShellCommandResult()
    } catch (e) {
      errorIs(e, FSErrors.DirectoryNotFound)
      return new ShellCommandResult(null, [
        `${cmd.args[1]}: directory not found`,
      ])
    }
  },
}

export default cd
