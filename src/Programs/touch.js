const { File } = require('../FileStructure');
const ShellCommandResult = require('../Shell/CommandResult');

/**
 * Mark file or directory as modified. Create new file if one doesn't exist at path.
 * @return {ShellCommandResult}
 */
function touch() {
  const res = new ShellCommandResult();
  if (this.args.length === 0) return res;
  this.args.forEach((arg) => {
    const path = arg.split('/');
    const file = this.shell.currentDir.findFile(path);
    if (file) file.lastModified = new Date();
    else {
      const newFileRes = this.shell.currentDir.createChild(path, File);
      if (!newFileRes) res.stdErr.push(`touch: cannout touch ${arg}: No such file or directory`);
    }
  });
  return res;
}

module.exports = touch;
