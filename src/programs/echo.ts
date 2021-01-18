import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'

const echo: Program = {
  name: 'echo',
  filekinds: [],
  run: cmd => {
    const output = cmd.args.slice(1).join(' ')
    return new ShellCommandResult([output])
  },
}

export default echo
