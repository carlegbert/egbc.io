const ShellCommandResult = require('../Shell/CommandResult');

const pwd = {
  name: 'pwd',
  filetypes: [],
  /**
   * Get current directory
   * @return {ShellCommandResult}
   */
  run: cmd => new ShellCommandResult([cmd.shell.currentDir.fullPath]),
};

module.exports = pwd;
