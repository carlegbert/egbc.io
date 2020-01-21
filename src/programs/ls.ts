import { Program } from './types'
import { Directory } from '../FileStructure'

import ShellCommandResult from '../Shell/ShellCommandResult'

const ls: Program = {
  name: 'ls',
  filetypes: [],
  run: cmd => {
    const res = new ShellCommandResult([])
    if (cmd.args.length === 1) {
      res.stdOut.push(cmd.shell.currentDir.lsHelper())
    } else {
      cmd.args.slice(1).forEach(arg => {
        const dir = cmd.shell.currentDir.findFile(
          arg.split('/'),
          Directory,
        ) as Directory
        if (!dir) {
          res.stdErr.push(`ls: cannot access ${arg}: no such file or directory`)
        } else {
          let str = ''
          if (cmd.args.length > 2) str += `${arg}:`
          str += dir.lsHelper()
          res.stdOut.push(str)
        }
      })
    }
    return res
  },
}

export default ls
