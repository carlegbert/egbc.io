import { Program } from './types'

const ShellCommandResult = require('../Shell/ShellCommandResult')

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
