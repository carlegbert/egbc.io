import { Program } from './types'

const programs = require('./index')
import ShellCommandResult from '../Shell/ShellCommandResult'

const help: Program = {
  name: 'help',
  filetypes: [],
  run: () => {
    const data = ['Available commands:']
      .concat(Object.keys(programs))
      .concat([
        'History navigation with &uarr;&darr;',
        'tab autocompletion',
        'redirection with >, >>',
      ])
    return new ShellCommandResult(data)
  },
}

module.exports = help
