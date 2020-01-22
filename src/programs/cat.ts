import { Program } from './types'
import ShellCommand from 'Shell/ShellCommand'
import { Directory, TextFile } from '../fs'

import ShellCommandResult from '../Shell/ShellCommandResult'

const cat: Program = {
  name: 'cat',
  filetypes: [TextFile],
  run: (cmd: ShellCommand) => {
    const res = new ShellCommandResult()
    cmd.args.slice(1).forEach(arg => {
      const path = arg.split('/')
      const file = cmd.shell.currentDir.findFile(path)
      if (file && file instanceof Directory) {
        res.stdErr.push(`cat: ${file.name}: Is a directory`)
      } else if (file && file instanceof TextFile) {
        res.stdOut = res.stdOut.concat(file.contents)
      } else {
        res.stdErr.push(`cat: ${arg}: No such file or directory`)
      }
    })
    return res
  },
}

export default cat
