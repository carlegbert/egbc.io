import { Program } from './types'
import ShellCommand from 'Shell/ShellCommand'

const { Directory, File: _File } = require('../FileStructure')
const ShellCommandResult = require('../Shell/ShellCommandResult')

const cat: Program = {
  name: 'cat',
  filetypes: [_File],
  run: (cmd: ShellCommand) => {
    const res = new ShellCommandResult()
    if (cmd.args.length === 0) return res
    cmd.args.forEach(arg => {
      const path = arg.split('/')
      const file = cmd.shell.currentDir.findFile(path)
      if (file && file instanceof Directory) {
        res.stdErr.push(`cat: ${file.name}: Is a directory`)
      } else if (file) {
        res.stdOut = res.stdOut.concat(file.contents)
      } else {
        res.stdErr.push(`cat: ${arg}: No such file or directory`)
      }
    })
    return res
  },
}

export default cat
