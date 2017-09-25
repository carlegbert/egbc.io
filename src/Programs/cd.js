const ShellCommandResult = require('../Shell/CommandResult');

/**
 * Change directory
 * @return {ShellCommandResult}
 */
function cd() {
  const dir = this.args.length === 0 ? this.shell.fileStructure :
    this.shell.currentDir.findFile(this.args[0].split('/'), 'dir');
  if (dir) {
    this.shell.currentDir = dir;
    this.shell.PS1Element.innerHTML = this.shell.getPS1String();
    return new ShellCommandResult();
  }
  return new ShellCommandResult(null, `${this.args[0]}: directory not found`);
}

module.exports = cd;
