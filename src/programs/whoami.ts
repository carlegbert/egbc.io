import { Program } from './types'

import ShellCommandResult from '../Shell/ShellCommandResult'

const whoami: Program = {
  name: 'whoami',
  filetypes: [],
  /**
   * Get current user
   * @return {ShellCommandResult}
   */
  run: cmd => new ShellCommandResult([cmd.shell.user]),
}

export default whoami
