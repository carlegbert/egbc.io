const ShellCommandResult = require('../Shell/CommandResult');

/**
 * Get current directory
 * @return {ShellCommandResult}
 */
function pwd() {
  return new ShellCommandResult(this.shell.currentDir.fullPath);
}

module.exports = pwd;
