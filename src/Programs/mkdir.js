const ShellCommandResult = require('../Shell/CommandResult');

/**
 * Create new directory
 * @return {ShellCommandResult}
 */
function mkdir() {
  const res = new ShellCommandResult();
  if (this.args.length === 0) return res;
  this.args.forEach((arg) => {
    const path = arg.split('/');
    const file = this.shell.currentDir.findFile(path, 'dir');
    if (!file) {
      const newFileRes = this.shell.currentDir.createChild(path, 'dir');
      if (!newFileRes) res.stdErr.push(`touch: cannout touch ${path}: No such file or directory`);
    }
  });
  return res;
}

module.exports = mkdir;
