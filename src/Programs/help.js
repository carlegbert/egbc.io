const ShellCommand = require('../Shell/Command');
const ShellCommandResult = require('../Shell/CommandResult');

/**
 * List available commands
 * @return {ShellCommandResult}
 */
function help() {
  const data = ['Available commands:']
    .concat(ShellCommand.validCommands())
    .concat(['History navigation with &uarr;&darr;', 'tab autocompletion', 'redirection with >, >>']);
  const res = new ShellCommandResult(data);
  return res;
}

module.exports = help;
