import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'

const clear: Program = {
  name: 'clear',
  filetypes: [],
  run: cmd => {
    const shell = cmd.shell
    shell.outputElement.innerHTML = ''
    return new ShellCommandResult()
  },
}

export default clear
