const ShellCommandResult = require('../Shell/CommandResult');

/**
 * Print text
 * @return {ShellCommandResult}
 */
function echo() {
  const output = this.args.join(' ');
  return new ShellCommandResult([output]);
}

module.exports = echo;
