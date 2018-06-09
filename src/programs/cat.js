const { Directory, File } = require('../FileStructure');
const ShellCommandResult = require('../Shell/CommandResult');

const cat = {
  name: 'cat',
  filetypes: [File],
  /**
   * List contents of text file(s)
   * @return {ShellCommandResult}
   */
  run: (cmd) => {
    const res = new ShellCommandResult();
    if (cmd.args.length === 0) return res;
    cmd.args.forEach((arg) => {
      const path = arg.split('/');
      const file = cmd.shell.currentDir.findFile(path);
      if (file && file instanceof Directory) {
        res.stdErr.push(`cat: ${file.name}: Is a directory`);
      } else if (file) {
        res.stdOut = res.stdOut.concat(file.contents);
      } else {
        res.stdErr.push(`cat: ${arg}: No such file or directory`);
      }
    });
    return res;
  },
};

module.exports = cat;
