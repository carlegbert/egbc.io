const ShellCommandResult = require('../Shell/CommandResult');
const { Directory } = require('../FileStructure');

const mkdir = {
  name: 'mkdir',
  filetypes: [Directory],
  /**
   * Create new directory
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const res = new ShellCommandResult();
    res.data = [];
    if (cmd.args.length === 0) {
      res.stdErr.push('mkdir: missing operand');
      return res;
    }
    cmd.args.forEach((arg) => {
      const path = arg.split('/');
      const fileAtLoc = cmd.shell.currentDir.findFile(path);
      let file;
      if (!fileAtLoc) {
        file = cmd.shell.currentDir.createChild(arg, Directory);
        if (!file) res.stdErr.push(`mkdir: cannot create directory ${arg}: No such file or directory`);
        else res.data.push(file);
      } else if (!(fileAtLoc instanceof Directory)) {
        res.stdErr.push(`mkdir: cannot create directory '${arg}': File exists`);
      }
    });
    return res;
  },
};

module.exports = mkdir;
