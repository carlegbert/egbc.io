import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'
import { errorIs } from '../util/errors'
import { FSErrors } from '../fs'

const ls: Program = {
  name: 'ls',
  filetypes: [],
  run: cmd => {
    const res = new ShellCommandResult([])
    if (cmd.args.length === 1) {
      res.stdOut.push(cmd.shell.currentDir.lsHelper())
    } else {
      cmd.args.slice(1).forEach(arg => {
        try {
          const dir = cmd.shell.fs.findDirectory(arg)
          let str = ''
          if (cmd.args.length > 2) str += `${arg}:`
          str += dir.lsHelper()
          res.stdOut.push(str)
        } catch (e) {
          errorIs(e, FSErrors.DirectoryNotFound)
          res.stdErr.push(`ls: cannot access ${arg}: no such file or directory`)
        }
      })
    }
    return res
  },
}

export default ls
