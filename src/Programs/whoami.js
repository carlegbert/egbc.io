const ShellCommandResult = require('../Shell/CommandResult');

/**
 * Get current user
 * @return {ShellCommandResult}
 */
function whoami() {
  return new ShellCommandResult(this.shell.user);
}

module.exports = whoami;
