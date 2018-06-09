const ShellCommandResult = require('../../Shell/ShellCommandResult');
const Vi = require('./Vi');
const { File } = require('../../FileStructure');

const vi = {
  name: 'vi',
  filetypes: [File],
  /**
   * Start new vi session
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const shell = cmd.shell;
    let fPath;
    let file;
    try {
      fPath = cmd.args[0].split('/');
      file = cmd.shell.currentDir.findFile(fPath, File);
    } catch (TypeError) {
      fPath = null;
      file = null;
    }
    const viInstance = new Vi(cmd.shell, fPath, file);
    shell.childProcess = viInstance;
    viInstance.startSession();
    return new ShellCommandResult();
  },
};

module.exports = vi;
