import { Program } from 'programs/types'
import Vi from './Vi'

const ShellCommandResult = require('../../Shell/ShellCommandResult')
const { File: _File } = require('../../FileStructure')

const vi: Program = {
  name: 'vi',
  filetypes: [_File],
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
      file = cmd.shell.currentDir.findFile(fPath, _File)
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
