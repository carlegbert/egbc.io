const ShellCommandResult = require('../Shell/CommandResult');
const { Directory } = require('../FileStructure');

const cd = {
  name: 'cd',
  filetypes: [Directory],
  /**
   * Change directory
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const shell = cmd.shell;
    const dir = cmd.args.length === 0 ? shell.fileStructure :
      shell.currentDir.findFile(cmd.args[0].split('/'), Directory);
    if (dir) {
      shell.currentDir = dir;
      shell.PS1Element.innerHTML = shell.getPS1String();
      return new ShellCommandResult();
    }
    return new ShellCommandResult(null, [`${cmd.args[0]}: directory not found`]);
  },
};

module.exports = cd;
