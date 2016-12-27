/* eslint-env jquery */

import { getChar, print } from './io';
import { ShellCommand, ShellCommandResult } from './shell-command';

export class Shell {
  constructor(fileStructure) {
    this.fileStructure = fileStructure;
    this.currentDir = fileStructure;
    this.user = 'guest';
    this.inputString = '';
    this.bashHistory = [];
    this.historyIndex = 0;
  }

  getPS1String() {
    return `<span class="user">${this.user}@www.carlegbert.com</span>
      <span class="path">${this.currentDir.fullPath}</span>$&nbsp;`;
  }

  parseKeystroke(event) {
    if (event.which === 13) { // enter
      event.preventDefault();
      this.handleEnter(this.inputString);
    } else if (event.which === 8) { // backspace
      event.preventDefault();
      this.inputString = this.inputString.slice(0, (this.inputString.length - 1));
      $('#input').html(this.inputString);
    } else if (event.which === 38 && this.historyIndex > 0) { // up arrow
      event.preventDefault();
      this.historyIndex -= 1;
      this.inputString = this.bashHistory[this.historyIndex];
      $('#input').html(this.inputString);
    } else if (event.which === 40 && this.historyIndex < this.bashHistory.length) { // down
      event.preventDefault();
      this.historyIndex += 1;
      if (this.historyIndex === this.bashHistory.length) this.inputString = '';
      else this.inputString = this.bashHistory[this.historyIndex];
      $('#input').html(this.inputString);
    } else {
      const k = getChar(event);
      this.inputString += k;
      $('#input').append(k);
    }
  }

  handleEnter() {
    const shellCommand = new ShellCommand(this.inputString);
    if (shellCommand.command) this.bashHistory.push(this.inputString);
    print(this.getPS1String() + this.inputString);
    this.inputString = '';
    $('#input').html('');
    this.historyIndex = this.bashHistory.length;
    print(this.executeCommand(shellCommand));
  }

  executeCommand(shellCommand) {
    if (!Shell.validCommands().includes(shellCommand.command)) {
      return `${shellCommand.command}: command not found`;
    }
    const evalStr = `this.${shellCommand.command}(shellCommand)`;
    return eval(evalStr).getDefaultOutput();
  }

  findInDir(dir, filepath, filetype) {
    if (filepath.length === 0 || filepath === '.') return dir;
    if (filepath[0] === '~') return this.fileStructure;
    if (filepath[0] === '..') return dir.parentRef;

    let found = null;
    const typeToFind = filepath.length === 1 ? filetype : 'dir';
    dir.children.forEach((child) => {
      if ((filepath[0] === child.name) && (!typeToFind || typeToFind === child.filetype)) {
        found = child;
      }
    });
    return filepath.length === 1 ? found : this.findInDir(found, filepath.slice(1), filetype);
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *                   shell commands                        *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  /* return list of valid commands that can be executed */
  static validCommands() {
    return [
      'clear',
      'pwd',
      'whoami',
      'cd',
      'ls',
      'cat',
    ];
  }

  clear() {
    $('#terminal-output').html('');
    return new ShellCommandResult();
  }

  pwd() {
    return new ShellCommandResult(this.currentDir.fullPath);
  }

  whoami() {
    return new ShellCommandResult(this.user);
  }

  cd(shellCommand) {
    if (shellCommand.args.length === 0) {
      this.currentDir = this.fileStructure;
      return new ShellCommandResult();
    }
    const dir = this.findInDir(this.currentDir, shellCommand.args[0].split('/'), 'dir');
    if (dir) {
      this.currentDir = dir;
      $('#PS1').html(this.getPS1String());
      return new ShellCommandResult();
    }
    return new ShellCommandResult(null, `${shellCommand.args[0]}: directory not found`);
  }

  ls(shellCommand) {
    const res = new ShellCommandResult([]);
    if (shellCommand.args.length === 0) {
      res.stdOut.push(Shell.lsHelper(this.currentDir));
    } else {
      shellCommand.args.forEach((arg) => {
        const dir = this.findInDir(this.currentDir, [arg], 'dir');
        if (!dir) {
          res.stdErr.push(`ls: cannot access ${arg}: no such file or directory`);
        } else {
          let str = '';
          if (shellCommand.args.length > 1) str += `${arg}:`;
          str += Shell.lsHelper(dir);
          res.stdOut.push(str);
        }
      });
    }
    return res;
  }

  static lsHelper(dir) {
    let res = '<div>';
    dir.children.forEach((child) => {
      res += `<li class="ls ${child.filetype}">${child.name}</li>`;
    });
    res += '</div>';
    return res;
  }

  cat(shellCommand) {
    const res = new ShellCommandResult();
    if (shellCommand.args.length === 0) {
      return res;
    }
    shellCommand.args.forEach((arg) => {
      const path = arg.split('/');
      const file = this.findInDir(this.currentDir, path);
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

}
