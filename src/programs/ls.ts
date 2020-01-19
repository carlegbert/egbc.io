import { Program } from './types'

const ShellCommandResult = require('../Shell/ShellCommandResult')
const { Directory } = require('../FileStructure')

const ls: Program = {
  name: 'ls',
  filetypes: [],
  run: cmd => {
    const res = new ShellCommandResult([])
    if (cmd.args.length === 0) {
      res.stdOut.push(cmd.shell.currentDir.lsHelper())
    } else {
      cmd.args.forEach(arg => {
        const dir = cmd.shell.currentDir.findFile(arg.split('/'), Directory)
        if (!dir) {
          res.stdErr.push(`ls: cannot access ${arg}: no such file or directory`)
        } else {
          let str = ''
          if (cmd.args.length > 1) str += `${arg}:`
          str += dir.lsHelper()
          res.stdOut.push(str)
        }
      })
    }
    return res
  },
}

export default ls
