import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'

const help: Program = {
  name: 'help',
  filetypes: [],
  run: shellCommand => {
    const data = ['Available commands:']
      .concat(Object.keys(shellCommand.shell.programs))
      .concat([
        'History navigation with &uarr;&darr;',
        'tab autocompletion',
        'redirection with >, >>',
      ])
    return new ShellCommandResult(data)
  },
}

export default help
