import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'
import { TextFile } from '../fs'
import { FileKind } from '../fs/constants'

const touch: Program = {
  name: 'touch',
  filekinds: [FileKind.Directory, FileKind.Text],
  run: cmd => {
    const res = new ShellCommandResult()
    if (cmd.args.length === 1) {
      res.stdErr.push('touch: missing file operand')
      return res
    }

    cmd.args.slice(1).forEach(arg => {
      const path = arg.split('/')
      const fileAtLoc = cmd.shell.currentDir.findFile(path)
      if (!fileAtLoc) {
        const file = cmd.shell.currentDir.createChild(arg, TextFile)
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
