/* eslint-env browser */
/* eslint-disable class-methods-use-this, no-param-reassign */

const BufferLine = require('./BufferLine');
const { copyText } = require('../../util/io');

/*
 * Object encapsulating a vi buffer. Performs tasks
 * such as writing to DOM, updating text, etc.
 */
class ViBuffer {
  /**
   * @constructor
   * @param {string[]} text
   */
  constructor(text) {
    this.text = copyText(text);
    this.cursorX = 0;
    this.cursorY = 0;
    this.element = document.getElementById('editor-buffer');
    this.cursorElement = null;
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

  addLine(y, lineText = '') {
    this.text.splice(y, 0, lineText);
    const newBufferLine = new BufferLine(this, y);
    this.bufferLines.splice(y, 0, newBufferLine);
    if (y === this.text.length - 1) this.element.appendChild(newBufferLine.element);
    else this.element.insertBefore(newBufferLine.element, this.bufferLines[y + 1].element);
    newBufferLine.renderChars();
    this.resetLineIndices();
    return newBufferLine;
  }

  renderCursor(insert = false) {
    if (this.cursorElement) this.cursorElement.classList.remove('cursor');
    this.cursorElement = this.bufferLines[this.cursorY].renderCursor(this.cursorX, insert);
  }

  disableCursor() {
    // remove cursor class but retain reference to cursor element
    this.cursorElement.classList.remove('cursor');
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

  insertLineBreak(x = this.cursorX, y = this.cursorY) {
    const newBufLine = this.addLine(y + 1, this.text[y].slice(this.cursorX));
    this.text[y] = this.text[y].slice(0, this.cursorX);
    this.bufferLines[y].renderChars();
    this.element.insertBefore(this.bufferLines[y].element, newBufLine.element);
    this.renderCursor();
  }

}

module.exports = ViBuffer;
