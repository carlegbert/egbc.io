import { Program } from './types'
import ShellCommand from 'Shell/ShellCommand'
import Directory from '../FileStructure/Directory'
import File from '../FileStructure/File'

import ShellCommandResult from '../Shell/ShellCommandResult'

const cat: Program = {
  name: 'cat',
  filetypes: [File],
  run: (cmd: ShellCommand) => {
    const res = new ShellCommandResult()
    cmd.args.slice(1).forEach(arg => {
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
