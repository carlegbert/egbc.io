const ShellCommandResult = require('../../Shell/CommandResult');
const Vi = require('./Vi');
const { File } = require('../../FileStructure');

/**
 * Start new vi session
 * @return {ShellCommandResult}
 */
function vi() {
  let fPath;
  let file;
  try {
    fPath = this.args[0].split('/');
    file = this.shell.currentDir.findFile(fPath, File);
  } catch (TypeError) {
    fPath = null;
    file = null;
  }
  const viInstance = new Vi(this.shell, fPath, file);
  this.shell.childProcess = viInstance;
  viInstance.startSession();
  return new ShellCommandResult();
}

module.exports = vi;
