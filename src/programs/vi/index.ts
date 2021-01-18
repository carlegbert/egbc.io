import { Program } from 'programs/types'
import Vi from './Vi'

import ShellCommandResult from '../../Shell/ShellCommandResult'
import { FileKind } from '../../fs/constants'

const vi: Program = {
  name: 'vi',
  filekinds: [FileKind.Text],
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
