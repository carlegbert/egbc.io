import { Program } from 'programs/types'
import Vi from './Vi'
import TextFile from '../../fs/TextFile'

import ShellCommandResult from '../../Shell/ShellCommandResult'

const vi: Program = {
  name: 'vi',
  filetypes: [TextFile],
  /**
   * Start new vi session
   * @return {ShellCommandResult}
   */
  run: cmd => {
    const shell = cmd.shell
    const viInstance = new Vi(cmd.shell, cmd.args[1])
    shell.childProcess = viInstance
    viInstance.startSession()
    return new ShellCommandResult()
  },
}

export default vi
