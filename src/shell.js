/* eslint-env jquery */

import { getChar, print, printInline } from './io';
import { TxtFile, DirFile } from './fileobject';
import { ShellCommand, ShellCommandResult } from './shell-command';

export class Shell {
  constructor(fileStructure) {
    this.fileStructure = fileStructure;
    this.currentDir = fileStructure;
    this.user = 'guest';
    this.inputString = '';
    this.bashHistory = [];
    this.historyIndex = 0;
    this.tabPressed = false;
  }

  getPS1String() {
    return `<span class="user">${this.user}@www.carlegbert.com:</span>` +
      `<span class="path">${this.currentDir.fullPath}</span>$&nbsp;`;
  }

  parseKeystroke(event) {
    if (event.which === 13) { // enter
      this.tabPressed = false;
      event.preventDefault();
      this.handleEnter();
    } else if (event.which === 8) { // backspace
      this.tabPressed = false;
      event.preventDefault();
      this.inputString = this.inputString.slice(0, (this.inputString.length - 1));
      $('#input').html(this.inputString.replace(/ /g, '&nbsp;'));
    } else if (event.which === 38 && this.historyIndex > 0) { // up arrow
      this.tabPressed = false;
      event.preventDefault();
      this.historyIndex -= 1;
      this.inputString = this.bashHistory[this.historyIndex];
      $('#input').html(this.inputString);
    } else if (event.which === 40 && this.historyIndex < this.bashHistory.length) { // down
      this.tabPressed = false;
      event.preventDefault();
      this.historyIndex += 1;
      if (this.historyIndex === this.bashHistory.length) this.inputString = '';
      else this.inputString = this.bashHistory[this.historyIndex];
      $('#input').html(this.inputString);
    } else if (event.which === 9) { // tab
      event.preventDefault();
      this.handleTab();
    } else {
      this.tabPressed = false;
      const k = getChar(event);
      this.inputString += k;
      const kSpaceAdjusted = k === ' ' ? '&nbsp;' : k;
      $('#input').append(kSpaceAdjusted);
    }
  }

  handleEnter() {
    if (!this.inputString.match(/[^ ]/g)) { // regex for anything but space
      print(this.getPS1String());
    } else {
      print(this.getPS1String() + this.inputString.replace(' ', '&nbsp;'));
      this.bashHistory.push(this.inputString);
      const res = this.executeCommand(this.inputString);
      print(res.getDefaultOutput());
    }
    this.inputString = '';
    $('#input').html('');
    this.historyIndex = this.bashHistory.length;
  }

  executeCommand(inputString) {
    if (inputString.includes('>>')) return this.redirect(inputString, '>>');
    if (inputString.includes('>')) return this.redirect(inputString, '>');

    const shellCommand = new ShellCommand(inputString);
    if (!Shell.validCommands().includes(shellCommand.command)) {
      return new ShellCommandResult([], `${shellCommand.command}: command not found`);
    }
    const evalStr = `this.${shellCommand.command}(shellCommand)`;
    return eval(evalStr);
  }

  redirect(inputString, pattern) {
    const i = inputString.indexOf(pattern);
    const afterSymbol = inputString.slice(i + pattern.length).trim().split(' ');
    if (!afterSymbol || afterSymbol.length === 0) return new ShellCommandResult([], 'Syntax error');
    const otherArgs = afterSymbol.length === 1 ? [] : afterSymbol.slice(pattern.length);
    const newInput = inputString.slice(0, i) + otherArgs.join(' ');
    const res = this.executeCommand(newInput);
    const filepath = afterSymbol[0];
    const file = this.findFile(this.currentDir, [filepath], 'txt') || this.newFile([filepath], 'txt').data;
    if (!file) return new ShellCommandResult(null, `bash: ${filepath}: No such file or directory`);
    file.contents = pattern === '>' ? res.stdOut : file.contents.concat(res.stdOut);
    return new ShellCommandResult(null, res.stdErr);
  }

  handleTab() {
    const spaceAtEnd = (this.inputString[this.inputString.length - 1] === ' ');
    const cmd = new ShellCommand(this.inputString);
    if (!cmd.command) {
      this.printAutoCompleteOptions(Shell.validCommands());
    } else if (!spaceAtEnd && cmd.args.length === 0) {
      const options = Shell.parseAutoCompleteOptions(cmd.command, Shell.validCommands());
      this.printAutoCompleteOptions(options);
    }
  }

  static parseAutoCompleteOptions(partial, options) {
    const len = partial.length;
    const validOptions = [];
    options.forEach((opt) => {
      if (opt.length >= len && opt.slice(0, len) === partial) {
        validOptions.push(opt);
      }
    });
    return validOptions;
  }

  printAutoCompleteOptions(options) {
    if (this.tabPressed) {
      print(this.getPS1String() + this.inputString);
      printInline(options);
    } else {
      this.tabPressed = true;
    }
  }

  executeAutoComplete(partial, complete) {
    const completion = complete.slice(partial.length);
    this.inputString += completion;
    $('#input').append(completion);
  }

  findFile(dir, filepath, filetype) {
    if (filepath.length === 0 || filepath === '.') return dir;
    if (filepath[0] === '~') {
      return filepath.length === 1 ? this.fileStructure :
        this.findFile(this.fileStructure, filepath.slice(1), filetype);
    } else if (filepath[0] === '..') {
      return filepath.length === 1 ? dir.parentRef :
        this.findFile(dir.parentRef, filepath.slice(1), filetype);
    }

    let found = null;
    const typeToFind = filepath.length === 1 ? filetype : 'dir';
    dir.children.forEach((child) => {
      if ((filepath[0] === child.name) && (!typeToFind || typeToFind === child.filetype)) {
        found = child;
      }
    });
    return filepath.length === 1 ? found : this.findFile(found, filepath.slice(1), filetype);
  }

  newFile(filepath, filetype) {
    let dir;
    if (filepath.length === 1) dir = this.currentDir;
    else dir = this.findFile(this.currentDir, filepath.slice(0, -1), 'dir');
    if (!dir) return new ShellCommandResult(null, `${filepath.slice(0, -1).join('/')}: Directory not found`);
    const filename = filepath.slice(-1)[0];
    const pathStr = `${dir.fullPath}/${filename}`;
    let file;
    if (filetype === 'dir') file = new DirFile(filename, pathStr, filetype, dir);
    else file = new TxtFile(filename, pathStr, filetype, dir);
    dir.children.push(file);
    return new ShellCommandResult(null, null, file);
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
      'touch',
      'mkdir',
      'echo',
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
      $('#PS1').html(this.getPS1String());
      return new ShellCommandResult();
    }
    const dir = this.findFile(this.currentDir, shellCommand.args[0].split('/'), 'dir');
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
        const dir = this.findFile(this.currentDir, arg.split('/'), 'dir');
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
      res += `<li class="inline ${child.filetype}">${child.name}</li>`;
    });
    res += '</div>';
    return res;
  }

  cat(shellCommand) {
    const res = new ShellCommandResult();
    if (shellCommand.args.length === 0) return res;
    shellCommand.args.forEach((arg) => {
      const path = arg.split('/');
      const file = this.findFile(this.currentDir, path);
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

  touch(shellCommand) {
    const res = new ShellCommandResult();
    if (shellCommand.args.length === 0) return res;
    shellCommand.args.forEach((arg) => {
      const path = arg.split('/');
      const file = this.findFile(this.currentDir, path, 'txt');
      if (file) file.lastModified = new Date();
      else {
        const newFileRes = this.newFile(path, 'txt');
        res.combine(newFileRes);
      }
    });
    return res;
  }

  mkdir(shellCommand) {
    const res = new ShellCommandResult();
    if (shellCommand.args.length === 0) return res;
    shellCommand.args.forEach((arg) => {
      const path = arg.split('/');
      const file = this.findFile(this.currentDir, path, 'dir');
      if (!file) {
        const newFileRes = this.newFile(path, 'dir');
        res.combine(newFileRes);
      }
    });
    return res;
  }

  echo(shellCommand) {
    const output = shellCommand.args.join(' ');
    return new ShellCommandResult(output);
  }

}
