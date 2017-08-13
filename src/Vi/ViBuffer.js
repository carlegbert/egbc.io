/* eslint-env browser */
/* eslint-disable class-methods-use-this, no-param-reassign */

import BufferLine from './BufferLine';


/*
 * Object encapsulating a vi buffer. Performs tasks
 * such as writing to DOM, updating text, etc.
 */
export default class ViBuffer {
  /**
   * @constructor
   * @param {string[]} text
   */
  constructor(text) {
    /**
     * @type {string[]}
     */
    this.text = text;
    /**
     * @type {number}
     */
    this.cursorX = 0;
    /**
     * @type {number}
     */
    this.cursorY = 0;
    /**
     * @type {HTMLElement}
     */
    this.element = document.getElementById('editor-buffer');
    /**
     * @type {HTMLElement}
     */
    this.cursorElement = null;
    /**
     * @type {BufferLine[]}
     */
    this.bufferLines = [];
  }

  renderAllLines() {
    this.element.innerHTML = '';
    this.bufferLines = [];
    this.text.forEach((txtLine, y) => {
      const bufLine = new BufferLine(this, y);
      this.element.appendChild(bufLine.element);
      this.bufferLines.push(bufLine);
      bufLine.renderChars();
    });
    this.renderCursor();
  }

  renderCursor(insert = false) {
    if (this.cursorElement) this.cursorElement.classList.remove('cursor');
    this.cursorElement = this.bufferLines[this.cursorY].renderCursor(this.cursorX, insert);
  }

  moveCursorVertically(y) {
    const max = this.text.length - 1;
    this.cursorY += y;
    if (this.cursorY > max) this.cursorY = max;
    else if (this.cursorY < 0) this.cursorY = 0;
    this.renderCursor();
  }

  moveCursorHorizontally(x, insert = false) {
    let max = this.text[this.cursorY].length - 1;
    if (insert || this.text[this.cursorY].length === 0) max += 1;
    this.cursorX += x;
    if (this.cursorX > max) this.cursorX = max;
    else if (this.cursorX < 0) this.cursorX = 0;
    this.renderCursor(insert);
  }

  moveCursorToBOL() {
    this.cursorX = 0;
    this.renderCursor();
  }

  moveCursorToEOL() {
    const len = this.text[this.cursorY].length;
    this.cursorX = len;
    this.renderCursor();
  }

  addChar(c) {
    this.bufferLines[this.cursorY].addChar(this.cursorX, c);
  }

  removeChar(x = this.cursorX) {
    this.bufferLines[this.cursorY].removeChar(x);
    this.renderCursor();
  }

  removeLine(y) {
    this.element.removeChild(this.bufferLines[y].element);
    this.bufferLines.splice(y, 1);
    this.text.splice(y, 1);
    this.resetLineIndices();
  }

  concatLines() {
    this.moveCursorVertically(-1);
    this.moveCursorToEOL();
    this.text[this.cursorY] += this.text[this.cursorY + 1];
    this.removeLine(this.cursorY + 1);
    this.bufferLines[this.cursorY].renderChars();
    this.renderCursor();
  }

  resetLineIndices() {
    this.bufferLines.forEach((bufLine, i) => {
      bufLine.y = i;
    });
  }

}
