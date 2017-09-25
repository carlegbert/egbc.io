const { Directory } = require('../FileStructure');
const ShellCommandResult = require('../Shell/CommandResult');

/**
 * List contents of text file(s)
 * @return {ShellCommandResult}
 */
function cat() {
  const res = new ShellCommandResult();
  if (this.args.length === 0) return res;
  this.args.forEach((arg) => {
    const path = arg.split('/');
    const file = this.shell.currentDir.findFile(path);
    if (file && file.filetype instanceof Directory) {
      res.stdErr.push(`cat: ${file.name}: Is a directory`);
    } else if (file) {
      res.stdOut = res.stdOut.concat(file.contents);
    } else {
      res.stdErr.push(`cat: ${arg}: No such file or directory`);
    }
  });
  return res;
}

module.exports = cat;
