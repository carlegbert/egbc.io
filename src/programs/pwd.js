const ShellCommandResult = require('../Shell/ShellCommandResult');

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
