/* eslint-env browser */

import { getChar } from './io';
import ViBuffer from './ViBuffer';

/**
 * Class representing a single instance of Vi
 */
export default class Vim {
  /**
   * @constructor
   * @param {Object} shellRef Reference to parent Shell object
   * @param {string[]} filePath
   * @param {Object} file Reference to TxtFile to write to (optional)
   */
  constructor(shellRef, filePath, file = null) {
    /**
     * @type {Shell}
     */
    this.shellRef = shellRef;
    /**
     * @type {string[]}
     */
    this.filePath = filePath;
    /**
     * @type {TxtFile}
     */
    this.file = file;
    /**
     * @type {string}
     */
    this.mode = 'normal';
    /**
     * @type {string}
     */
    this.heldNum = '';
    /**
     * @type {string}
     */
    this.commandText = '';
    /**
     * @type {number}
     */
    this.editorElement = document.getElementById('editor');
    /**
     * @type {HTMLElement}
     */
    this.editorConsoleElement = document.getElementById('editor-console');
    /**
     * @type {ViBuffer}
     */
    this.buffer = null;
  }

  createBuffer() {
    const bufferText = this.file !== null ? this.file.contents : [''];
    this.buffer = new ViBuffer(bufferText);
  }

  startSession() {
    document.getElementById('terminal').style.display = 'none';
    this.editorElement.style.display = 'block';
    this.editorConsoleElement.innerHTML = '';
    this.createBuffer();
    this.buffer.renderAllLines();
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
        this.buffer.moveCursor(1, 0);
        this.beginInsertMode();
        break;
      case 'A':
        this.buffer.moveCursorToEOL();
        this.beginInsertMode();
        break;
      case 'o':
        this.buffer.addLine(this.buffer.cursorY + 1);
        this.buffer.moveCursor(0, 1);
        this.beginInsertMode();
        break;
      case 'O':
        this.buffer.moveCursorToBOL();
        if (this.buffer.cursorY !== 0) this.buffer.moveCursor(0, -1);
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
        this.buffer.moveCursor(1, 0);
        break;
      case 'h':
        this.buffer.moveCursor(-1, 0);
        break;
      case 'j':
        this.buffer.moveCursor(0, 1);
        break;
      case 'k':
        this.buffer.moveCursor(0, -1);
        break;
      case 'x':
        this.buffer.removeChar();
        if (repeated) this.buffer.moveCursor(1, 0);
        break;
      default:
        break;
    }
  }

  insertKeystroke(event) {
    const c = getChar(event);
    if (event.which === 27) { // escape
      this.buffer.moveCursor(-1, 0);
      this.beginNormalMode();
    } else if (event.which === 13) { // enter
      this.buffer.addLineBreak(this.cursorX, this.cursorY);
      this.buffer.moveCursor(0, 1);
      this.buffer.moveCursorToBOL();
      this.buffer.renderAllLines();
    } else if (event.which === 8) { // backspace
      this.insertModeBackspace();
    } else if (c.length === 1) {
      this.buffer.addChar(c);
      this.buffer.moveCursor(1, 0);
      this.buffer.renderLine();
      this.buffer.renderCursor();
    }
  }

  insertModeBackspace() {
    if (this.buffer.cursorX === 0 && this.buffer.cursorY > 0) {
      this.buffer.removeLineBreak(this.cursorY);
      this.buffer.moveCursorToBOL();
      this.buffer.moveCursor(0, -1);
      this.buffer.renderAllLines();
    } else if (this.cursorX > 0) {
      this.buffer.moveCursor(-1, 0);
      this.buffer.removeChar(this.cursorX, this.cursorY);
      this.buffer.renderLine(this.cursorY);
    }
  }

  beginInsertMode() {
    this.mode = 'insert';
    this.editorConsoleElement.innerHTML = '<strong>-- INSERT --</strong>';
    this.buffer.renderLine();
    this.buffer.moveCursor(0, 0, true);
    this.buffer.renderCursor();
  }

  beginNormalMode() {
    this.mode = 'normal';
    this.buffer.renderCursor();
    this.editorConsoleElement.innerHTML = '';
  }

  beginCommandMode() {
    this.mode = 'command';
    this.editorConsoleElement.innerHTML = '';
  }

}
