/* eslint-env browser */
/* eslint-disable consistent-return */

import { copyText, getChar, textEquals } from '../util/io';
import ViBuffer from './ViBuffer';

/**
 * Class representing a single instance of Vi
 */
export default class Vi {
  /**
   * @constructor
   * @param {Object} shellRef Reference to parent Shell object
   * @param {string[]} filePath
   * @param {Object} file Reference to TxtFile to write to (optional)
   */
  constructor(shellRef, filePath, file = null) {
    this.shellRef = shellRef;
    this.filePath = filePath;
    this.file = file;
    this.mode = 'normal';
    this.heldNum = '';
    this.commandText = '';
    this.editorElement = document.getElementById('editor');
    this.editorConsoleElement = document.getElementById('editor-console');
    this.buffer = null;
  }

  createBuffer() {
    const bufferText = this.file !== null ? this.file.contents : [''];
    this.buffer = new ViBuffer(bufferText);
    this.buffer.renderAllLines();
  }

  startSession() {
    document.getElementById('terminal').style.display = 'none';
    this.editorElement.style.display = 'block';
    this.editorConsoleElement.innerHTML = '';
    this.createBuffer();
  }

  endSession() {
    document.getElementById('terminal').style.display = 'block';
    this.editorElement.style.display = 'none';
    this.shellRef.childProcess = null;
  }

  renderErrorMessage(errText) {
    this.editorConsoleElement.innerHTML = errText;
  }

  parseKeystroke(event) {
    if (this.mode === 'normal') this.normalKeystroke(event);
    else if (this.mode === 'insert') this.insertKeystroke(event);
    else if (this.mode === 'command') this.commandKeystroke(event);
  }

  normalKeystroke(event) {
    const c = getChar(event);

    switch (c) {
      case 'i':
        this.beginInsertMode();
        break;
      case 'I':
        this.buffer.moveCursorToBOL();
        this.beginInsertMode();
        break;
      case 'a':
        this.buffer.moveCursorHorizontally(1, true);
        this.beginInsertMode();
        break;
      case 'A':
        this.buffer.moveCursorToEOL();
        this.beginInsertMode();
        break;
      case 'o':
        this.buffer.addLine(this.buffer.cursorY + 1);
        this.buffer.moveCursorVertically(1);
        this.beginInsertMode();
        break;
      case 'O':
        this.buffer.moveCursorToBOL();
        if (this.buffer.cursorY !== 0) this.buffer.moveCursorVertically(-1);
        this.buffer.addLine(this.buffer.cursorY);
        this.beginInsertMode();
        break;
      case ':':
        this.beginCommandMode();
        break;
      case '$':
        this.buffer.moveCursorToEOL();
        break;
      case '0':
        if (this.heldNum === '') {
          this.buffer.moveCursorToBOL();
          break;
        } // else fall through to default
      default:
        if (!isNaN(parseInt(c, 10))) this.heldNum += c;
        else this.processRepeat(c);
    }
  }

  processRepeat(c) {
    const num = this.heldNum !== '' ? parseInt(this.heldNum, 10) : 1;
    if (num > 1) {
      for (let i = 0; i < num; i += 1) {
        this.repeatableNormalKeystroke(c, true);
      }
    } else {
      this.repeatableNormalKeystroke(c, false);
    }
    this.heldNum = '';
  }

  repeatableNormalKeystroke(c, repeated = false) {
    switch (c) {
      case 'l':
        this.buffer.moveCursorHorizontally(1);
        break;
      case 'h':
        this.buffer.moveCursorHorizontally(-1);
        break;
      case 'j':
        this.buffer.moveCursorVertically(1);
        break;
      case 'k':
        this.buffer.moveCursorVertically(-1);
        break;
      case 'x':
        this.buffer.removeChar();
        if (repeated) this.buffer.moveCursorHorizontally(1);
        break;
      default:
        break;
    }
  }

  insertKeystroke(event) {
    const c = getChar(event);
    if (event.which === 27) { // escape
      this.buffer.moveCursorHorizontally(-1);
      this.beginNormalMode();
    } else if (event.which === 13) { // enter
      this.buffer.insertLineBreak();
      this.buffer.moveCursorVertically(1);
      this.buffer.moveCursorToBOL();
    } else if (event.which === 8) { // backspace
      this.insertModeBackspace();
    } else if (c.length === 1) {
      this.buffer.addChar(c);
      this.buffer.moveCursorHorizontally(1, true);
    }
  }

  insertModeBackspace() {
    if ((this.buffer.cursorX === 0
        || this.buffer.text[this.buffer.cursorY].length === 0)
        && this.buffer.cursorY > 0) {
      this.buffer.concatLines();
    } else if (this.buffer.cursorX > 0) {
      this.buffer.moveCursorHorizontally(-1);
      this.buffer.removeChar(this.cursorX);
    }
  }

  beginInsertMode() {
    this.mode = 'insert';
    this.editorConsoleElement.innerHTML = '<strong>-- INSERT --</strong>';
  }

  beginNormalMode(message = '') {
    this.mode = 'normal';
    this.buffer.renderCursor();
    this.commandText = '';
    this.editorConsoleElement.innerHTML = message;
  }

  beginCommandMode() {
    this.mode = 'command';
    this.buffer.disableCursor();
    this.renderEmptyCommandElement();
  }

  renderEmptyCommandElement() {
    this.editorConsoleElement.innerHTML = '';
    const commandCursor = document.createElement('span');
    commandCursor.innerHTML = '&nbsp;';
    commandCursor.classList.add('cursor');
    const commandBegin = document.createElement('span');
    commandBegin.innerHTML = ':';
    this.commandTextElement = document.createElement('span');
    this.editorConsoleElement.appendChild(commandBegin);
    this.editorConsoleElement.appendChild(this.commandTextElement);
    this.editorConsoleElement.appendChild(commandCursor);
  }

  commandKeystroke(event) {
    const c = getChar(event);
    if (event.which === 27) { // escape
      this.commandText = '';
      this.beginNormalMode();
    } else if (event.which === 8) { // backspace
      this.commandText = this.commandText.slice(0, -1);
      this.commandTextElement.innerHTML = this.commandText;
    } else if (event.which === 13) { // enter
      const message = this.evaluateCommand();
      this.beginNormalMode(message);
    } else if (c.length === 1) {
      this.commandText += c;
      this.commandTextElement.innerHTML += c;
    }
  }

  evaluateCommand() {
    switch (this.commandText) {
      case 'w':
        return this.writeFile();
      case 'q':
        return this.quit();
      case 'q!':
        return this.quit(true);
      case 'wq':
        this.writeFile();
        return this.quit();
      default:
        return `${this.commandText} is not a valid command`;
    }
  }

  writeFile() {
    if (!this.file) this.file = this.shellRef.currentDir.createChild(this.filePath, 'txt');
    if (!this.file) return 'E212: Can\'t open file for writing: No such file or directory';
    this.file.contents = copyText(this.buffer.text);
    const msg = `"${this.file.fullPath}" written`;
    return msg;
  }

  quit(force = false) {
    if (!force &&
      (!this.file || !textEquals(this.buffer.text, this.file.contents))) return 'E37: No write since last change';
    this.endSession();
    return '';
  }

}
