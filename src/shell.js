/* eslint-env jquery */

import { getChar, print } from './io';
import { ShellCommand } from './shell-command';

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
    return shellCommand;
  }
}
