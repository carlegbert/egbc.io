const { File } = require('../FileStructure');
const ShellCommandResult = require('../Shell/CommandResult');
const { FileExistsError, FileNotFoundError } = require('../Errors');

/**
 * Mark file or directory as modified. Create new file if one doesn't exist at path.
 * @return {ShellCommandResult}
 */
function touch() {
  const res = new ShellCommandResult();
  if (this.args.length === 0) {
    res.stdErr.push('touch: missing file operand');
    return res;
  }

  this.args.forEach((arg) => {
    const path = arg.split('/');
    try {
      this.shell.currentDir.createChildNew(path, File);
    } catch (err) {
      if (err instanceof FileExistsError) {
        err.file.lastModified = new Date();
      } else if (err instanceof FileNotFoundError) {
        res.stdErr.push(`touch: cannout touch ${arg}: No such file or directory`);
      }
    }
  });
  return res;
}

module.exports = touch;
