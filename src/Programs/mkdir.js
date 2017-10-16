const ShellCommandResult = require('../Shell/CommandResult');
const { Directory } = require('../FileStructure');

/**
 * Create new directory
 * @return {ShellCommandResult}
 */
function mkdir() {
  const res = new ShellCommandResult();
  res.data = [];
  if (this.args.length === 0) {
    res.stdErr.push('mkdir: missing operand');
    return res;
  }
  this.args.forEach((arg) => {
    const path = arg.split('/');
    const fileAtLoc = this.shell.currentDir.findFile(path);
    let file;
    if (!fileAtLoc) {
      file = this.shell.currentDir.createChild(path, Directory);
      if (!file) res.stdErr.push(`mkdir: cannot create directory ${arg}: No such file or directory`);
      else res.data.push(file);
    } else if (!(fileAtLoc instanceof Directory)) {
      res.stdErr.push(`mkdir: cannot create directory '${arg}': File exists`);
    }
  });
  return res;
}

module.exports = mkdir;
