/* eslint-disable class-methods-use-this */

// import Vi from './vi';
import Vi from './Vi';
import ShellCommandResult from './shell-command-result';


/**
 * Object encapsulating information to be passed to a shell operation,
 * and the functions that execute those operations.
 * @class
 */
export default class ShellCommand {
  /**
   * @constructor
   * @param {string} input User-inputted statement from terminal
   * @param {Shell} shell Parent shell object
   */
  constructor(input, shell) {
    /**
     * @type {string}
     */
    this.originalInput = input;
    /**
     * @type string[]
     */
    this.args = [];
    /**
     * @type string[]
     */
    this.flags = [];
    /**
     * @type string
     */
    this.command = '';
    /**
     * @type Shell
     */
    this.shell = shell;

    this.parseInput();
  }

  /**
   * Parse input string into flags & args
   */
  parseInput() {
    const splitInput = this.originalInput.split(' ');
    this.command = splitInput[0];
    if (splitInput.length > 1) {
      splitInput.slice(1).forEach((word) => {
        if (word.length > 0 && word[0] === '-') {
          this.flags.push(word);
        } else if (word.length > 0 && word !== ' ') {
          this.args.push(word);
        }
      });
    }
  }

   /**
   * List of all valid commands, used for autocompletion and to validate input
   * before using eval
   * @return {string[]} List of valid commands that can be executed
   */
  static validCommands() {
    return [
      'clear',
      'pwd',
      'whoami',
      'cd',
      'ls',
      'cat',
      'touch',
      'mkdir',
      'echo',
      'vi',
      'help',
    ];
  }

  /**

  /**
   * Determine valid filetypes for command arguments
   * @param {string} cmdName Command name, eg, 'ls', 'cat', etc
   * @return {string[]} array of valid filetypes
   */
  static getValidTypes(cmdName) {
    const typeDict = {
      ls: ['dir'],
      cd: ['dir'],
      mkdir: ['dir'],
      cat: ['txt'],
      '>': ['txt'],
      vi: ['txt'],
      vim: ['txt'],
    };
    return typeDict[cmdName] || ['dir', 'txt'];
  }

  /**
   * List available commands
   * @return {ShellCommandResult}
   */
  help() {
    const data = ['Available commands:']
      .concat(ShellCommand.validCommands())
      .concat(['History navigation with &uarr;&darr;', 'tab autocompletion', 'redirection with >, >>']);
    const res = new ShellCommandResult(data);
    return res;
  }

  /**
   * Clear #terminal-output. Removes elemnts from DOM rather than just scrolling.
   * @return {ShellCommandResult}
   */
  clear() {
    this.shell.outputElement.innerHTML = '';
    return new ShellCommandResult();
  }

  /**
   * Get current directory
   * @return {ShellCommandResult}
   */
  pwd() {
    return new ShellCommandResult(this.shell.currentDir.fullPath);
  }

  /**
   * Get current user
   * @return {ShellCommandResult}
   */
  whoami() {
    return new ShellCommandResult(this.shell.user);
  }

  /**
   * Change directory
   * @return {ShellCommandResult}
   */
  cd() {
    const dir = this.args.length === 0 ? this.shell.fileStructure :
      this.shell.currentDir.findFile(this.args[0].split('/'), 'dir');
    if (dir) {
      this.shell.currentDir = dir;
      this.shell.PS1Element.innerHTML = this.shell.getPS1String();
      return new ShellCommandResult();
    }
    return new ShellCommandResult(null, `${this.args[0]}: directory not found`);
  }

  /**
   * List contents of directory/directories
   * @return {ShellCommandResult}
   */
  ls() {
    const res = new ShellCommandResult([]);
    if (this.args.length === 0) {
      res.stdOut.push(this.shell.currentDir.lsHelper());
    } else {
      this.args.forEach((arg) => {
        const dir = this.shell.currentDir.findFile(arg.split('/'), 'dir');
        if (!dir) {
          res.stdErr.push(`ls: cannot access ${arg}: no such file or directory`);
        } else {
          let str = '';
          if (this.args.length > 1) str += `${arg}:`;
          str += dir.lsHelper();
          res.stdOut.push(str);
        }
      });
    }
    return res;
  }


  /**
   * List contents of text file(s)
   * @return {ShellCommandResult}
   */
  cat() {
    const res = new ShellCommandResult();
    if (this.args.length === 0) return res;
    this.args.forEach((arg) => {
      const path = arg.split('/');
      const file = this.shell.currentDir.findFile(path);
      if (file && file.filetype === 'dir') {
        res.stdErr.push(`cat: ${file.name}: Is a directory`);
      } else if (file) {
        res.stdOut = res.stdOut.concat(file.contents);
      } else {
        res.stdErr.push(`cat: ${arg}: No such file or directory`);
      }
    });
    return res;
  }

  /**
   * Mark file or directory as modified. Create new file if one doesn't exist at path.
   * @return {ShellCommandResult}
   */
  touch() {
    const res = new ShellCommandResult();
    if (this.args.length === 0) return res;
    this.args.forEach((arg) => {
      const path = arg.split('/');
      const file = this.shell.currentDir.findFile(path, 'txt');
      if (file) file.lastModified = new Date();
      else {
        const newFileRes = this.shell.currentDir.createChild(path, 'txt');
        if (!newFileRes) res.stdErr.push(`touch: cannout touch ${path}: No such file or directory`);
      }
    });
    return res;
  }

  /**
   * Create new directory
   * @return {ShellCommandResult}
   */
  mkdir() {
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

  /**
   * Print text
   * @return {ShellCommandResult}
   */
  echo() {
    const output = this.args.join(' ');
    return new ShellCommandResult([output]);
  }

  /**
   * Start new vi session
   * @return {ShellCommandResult}
   */
  vi() {
    let fPath;
    let file;
    try {
      fPath = this.args[0].split('/');
      file = this.shell.currentDir.findFile(fPath, 'txt');
    } catch (TypeError) {
      fPath = null;
      file = null;
    }
    const vi = new Vi(this.shell, fPath, file);
    this.shell.childProcess = vi;
    vi.startSession();
    return new ShellCommandResult();
  }
}

