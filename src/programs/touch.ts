import { Program } from './types'
import Directory from '../FileStructure/Directory'
import File from '../FileStructure/File'

import ShellCommandResult from '../Shell/ShellCommandResult'

const touch: Program = {
  name: 'touch',
  filetypes: [Directory, File],
  run: cmd => {
    const res = new ShellCommandResult()
    if (cmd.args.length === 0) {
      res.stdErr.push('touch: missing file operand')
      return res
    }

    cmd.args.forEach(arg => {
      const path = arg.split('/')
      const fileAtLoc = cmd.shell.currentDir.findFile(path)
      if (!fileAtLoc) {
        const file = cmd.shell.currentDir.createChild(arg, File)
        if (!file)
          res.stdErr.push(
            `touch: cannout touch ${arg}: No such file or directory`,
          )
      } else {
        fileAtLoc.lastModified = new Date()
      }
    })
    return res
  },
}

export default touch
