const ShellCommandResult = require('../Shell/CommandResult');
const { Directory } = require('../FileStructure');
const { FileExistsError, FileNotFoundError } = require('../Errors');

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
    try {
      const file = this.shell.currentDir.createChildNew(path, Directory);
      res.data.push(file);
    } catch (err) {
      if (err instanceof FileNotFoundError) {
        res.stdErr.push(`mkdir: cannot create directory ${arg}: No such file or directory`);
      } else if ((err instanceof FileExistsError) && (!(err.file instanceof Directory))) {
        res.stdErr.push(`mkdir: cannot create directory '${arg}': File exists`);
      }
    }
  });
  return res;
}

module.exports = mkdir;
