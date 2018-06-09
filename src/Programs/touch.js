const { Directory, File } = require('../FileStructure');
const ShellCommandResult = require('../Shell/CommandResult');

const touch = {
  name: 'touch',
  filetypes: [Directory, File],
  /**
   * Mark file or directory as modified. Create new file if one doesn't exist at path.
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const res = new ShellCommandResult();
    if (cmd.args.length === 0) {
      res.stdErr.push('touch: missing file operand');
      return res;
    }

    cmd.args.forEach((arg) => {
      const path = arg.split('/');
      const fileAtLoc = cmd.shell.currentDir.findFile(path);
      if (!fileAtLoc) {
        const file = cmd.shell.currentDir.createChild(arg, File);
        if (!file) res.stdErr.push(`touch: cannout touch ${arg}: No such file or directory`);
      } else {
        fileAtLoc.lastModified = new Date();
      }
    });
    return res;
  },
};

module.exports = touch;
