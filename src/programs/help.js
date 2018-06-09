const programs = require('./index');
const ShellCommandResult = require('../Shell/CommandResult');

const help = {
  name: 'help',
  filetypes: [],
  /**
   * List available commands
   * @return {ShellCommandResult}
   */
  run: () => {
    const data = ['Available commands:']
      .concat(Object.keys(programs))
      .concat(['History navigation with &uarr;&darr;', 'tab autocompletion', 'redirection with >, >>']);
    const res = new ShellCommandResult(data);
    return res;
  },
};

module.exports = help;
