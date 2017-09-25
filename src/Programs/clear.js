const ShellCommandResult = require('../Shell/CommandResult');

/**
 * Clear #terminal-output. Removes elemnts from DOM rather than just scrolling.
 * @return {ShellCommandResult}
 */
function clear() {
  this.shell.outputElement.innerHTML = '';
  return new ShellCommandResult();
}

module.exports = clear;
