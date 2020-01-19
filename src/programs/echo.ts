import { Program } from './types'

const ShellCommandResult = require('../Shell/ShellCommandResult')

const echo: Program = {
  name: 'echo',
  filetypes: [],
  run: cmd => {
    const output = cmd.args.join(' ')
    return new ShellCommandResult([output])
  },
}

export default echo
