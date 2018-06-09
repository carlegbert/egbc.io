const ShellCommandResult = require('../Shell/ShellCommandResult');

const echo = {
  name: 'echo',
  filetypes: [],
  /**
   * Print text
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const output = cmd.args.join(' ');
    return new ShellCommandResult([output]);
  },
};

module.exports = echo;
