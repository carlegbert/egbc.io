import { Program } from './types'
import { Directory } from '../fs'

import ShellCommandResult from '../Shell/ShellCommandResult'

const mkdir: Program = {
  name: 'mkdir',
  filetypes: [Directory],
  run: cmd => {
    const res = new ShellCommandResult<Directory[]>()
    const created: Directory[] = []
    if (cmd.args.length === 1) {
      res.stdErr.push('mkdir: missing operand')
      return res
    }
    cmd.args.slice(1).forEach(arg => {
      const path = arg.split('/')
      const fileAtLoc = cmd.shell.currentDir.findFile(path)
      let file
      if (!fileAtLoc) {
        file = cmd.shell.currentDir.createChild(arg, Directory) as Directory
        if (!file)
          res.stdErr.push(
            `mkdir: cannot create directory ${arg}: No such file or directory`,
          )
        else created.push(file)
      } else if (!(fileAtLoc instanceof Directory)) {
        res.stdErr.push(`mkdir: cannot create directory '${arg}': File exists`)
      }
    })
    res.data = created
    return res
  },
}

export default mkdir
