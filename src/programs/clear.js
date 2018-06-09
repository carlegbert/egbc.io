const ShellCommandResult = require('../Shell/ShellCommandResult');

const clear = {
  name: 'clear',
  filetypes: [],
  /**
   * Clear #terminal-output. Removes elements from DOM rather than just scrolling.
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const shell = cmd.shell;
    shell.outputElement.innerHTML = '';
    return new ShellCommandResult();
  },
};

module.exports = clear;
