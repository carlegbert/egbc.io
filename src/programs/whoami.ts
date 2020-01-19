import { Program } from './types'

const ShellCommandResult = require('../Shell/ShellCommandResult')

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
