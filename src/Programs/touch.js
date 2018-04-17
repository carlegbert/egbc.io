const { File, Path } = require('../FileStructure');
const ShellCommandResult = require('../Shell/CommandResult');

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
    const filepath = new Path(arg);
    const fileAtLoc = this.shell.currentDir.findFile(path);
    if (!fileAtLoc) {
      const file = this.shell.currentDir.createChild(filepath, File);
      if (!file) res.stdErr.push(`touch: cannout touch ${arg}: No such file or directory`);
    } else {
      fileAtLoc.lastModified = new Date();
    }
  });
  return res;
}

module.exports = touch;
