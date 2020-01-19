import { Program } from 'programs/types'
import Vi from './Vi'
import File from '../../FileStructure/File'

const ShellCommandResult = require('../../Shell/ShellCommandResult')

const vi: Program = {
  name: 'vi',
  filetypes: [File],
  /**
   * Start new vi session
   * @return {ShellCommandResult}
   */
  run: cmd => {
    const shell = cmd.shell
    let fPath
    let file
    try {
      fPath = cmd.args[0].split('/')
      file = cmd.shell.currentDir.findFile(fPath, File)
    } catch (TypeError) {
      fPath = null
      file = null
    }
    const viInstance = new Vi(cmd.shell, fPath, file)
    shell.childProcess = viInstance
    viInstance.startSession()
    return new ShellCommandResult()
  },
}

export default vi
