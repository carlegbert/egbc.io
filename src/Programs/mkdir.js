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
    let file = this.shell.currentDir.findFile(path);
    if (!file) {
      file = this.shell.currentDir.createChild(path, 'dir');
      if (!file) res.stdErr.push(`mkdir: cannot create directory ${arg}: No such file or directory`);
      else res.data.push(file);
    } else if (!(file instanceof Directory)) {
      res.stdErr.push(`mkdir: cannot create directory '${arg}': File exists`);
    } // do nothing if file exists and is a directory
  });
  return res;
}

module.exports = mkdir;
