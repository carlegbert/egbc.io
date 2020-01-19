import { Program } from './types'

const ShellCommandResult = require('../Shell/ShellCommandResult')

const pwd: Program = {
  name: 'pwd',
  filetypes: [],
  run: cmd => new ShellCommandResult([cmd.shell.currentDir.fullPath]),
}

export default pwd
