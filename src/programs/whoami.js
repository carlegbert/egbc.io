const ShellCommandResult = require('../Shell/CommandResult');

const whoami = {
  name: 'whoami',
  filetypes: [],
  /**
   * Get current user
   * @return {ShellCommandResult}
   */
  run: cmd => new ShellCommandResult([cmd.shell.user]),
};

module.exports = whoami;
