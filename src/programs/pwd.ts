import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'

const pwd: Program = {
  name: 'pwd',
  filetypes: [],
  run: cmd => new ShellCommandResult([cmd.shell.currentDir.fullPath]),
}

export default pwd
