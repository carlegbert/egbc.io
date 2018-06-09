const ShellCommandResult = require('../Shell/CommandResult');
const { Directory } = require('../FileStructure');

const ls = {
  name: 'ls',
  filetypes: [],
  /**
   * List contents of directory/directories
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const res = new ShellCommandResult([]);
    if (cmd.args.length === 0) {
      res.stdOut.push(cmd.shell.currentDir.lsHelper());
    } else {
      cmd.args.forEach((arg) => {
        const dir = cmd.shell.currentDir.findFile(arg.split('/'), Directory);
        if (!dir) {
          res.stdErr.push(`ls: cannot access ${arg}: no such file or directory`);
        } else {
          let str = '';
          if (cmd.args.length > 1) str += `${arg}:`;
          str += dir.lsHelper();
          res.stdOut.push(str);
        }
      });
    }
    return res;
  },
};

module.exports = ls;
