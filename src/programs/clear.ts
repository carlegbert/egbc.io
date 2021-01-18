import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'

const clear: Program = {
  name: 'clear',
  filekinds: [],
  run: cmd => {
    const shell = cmd.shell
    shell.outputElement.innerHTML = ''
    return new ShellCommandResult()
  },
}

export default clear
