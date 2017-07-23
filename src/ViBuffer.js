/* eslint-env browser */
/* eslint-disable class-methods-use-this, no-param-reassign */


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
  }

  /**
   * Re-render single line element. Each char in the line will
   * have its own <ed-x> element.
   */
  renderLine(yCoord = this.cursorY) {
    const lineElement = this.element.childNodes[yCoord];
    const textLine = this.text[yCoord];
    let str = '';
    for (let xCoord = 0; xCoord < textLine.length; xCoord += 1) {
      const ch = textLine[xCoord];
      str += `<ed-x>${ch}</ed-x>`;
    }
    str += '<ed-x>&nbsp;</ed-x>'; // invisible 'newline' character
    lineElement.innerHTML = str;
  }

  /**
   * Re-render all line elements in buffer.
   */
  renderAllLines() {
    this.element.innerHTML = '';
    this.text.forEach((str, i) => {
      this.element.innerHTML += '<ed-y></ed-y>';
      this.renderLine(i);
    });
    this.renderCursor();
  }

  getLineElement(yCoord) {
    return this.element.childNodes[yCoord];
  }

  addLine(yCoord) {
    this.text.splice(yCoord, 0, '');
    this.renderAllLines();
  }

  moveCursor(x = 0, y = 0, allowAtEOL = false) {
    const yMax = this.text.length - 1;
    this.cursorY += y;
    if (this.cursorY < 0) this.cursorY = 0;
    if (this.cursorY > yMax) this.cursorY = yMax;

    let xMax = this.text[this.cursorY].length - 1;
    if (allowAtEOL || xMax < 0) xMax += 1;
    this.cursorX += x;
    if (this.cursorX < 0) this.cursorX = 0;
    if (this.cursorX > xMax) this.cursorX = xMax;
    this.renderCursor();
  }

  moveCursorToEOL(allowAtEOL = false) {
    let xMax = this.text[this.cursorY].length - 1;
    if (allowAtEOL || xMax < 0) xMax += 1;
    this.cursorX = xMax;
    this.renderCursor();
  }

  moveCursorToBOL() {
    this.cursorX = 0;
    this.renderCursor();
  }

  moveCursorToBOF() {
    this.cursorY = 0;
    this.renderCursor();
  }

  moveCursorToEOF() {
    this.cursorY = 0;
    this.renderCursor();
  }

  renderCursor() {
    if (this.cursorElement) this.cursorElement.className = '';
    const currentLine = this.getLineElement(this.cursorY);
    this.cursorElement = currentLine.childNodes[this.cursorX];
    this.cursorElement.className = 'cursor';
  }

  addChar(ch, xCoord, yCoord) {
    const textLine = this.text[yCoord];
    const newTextLine = textLine.slice(0, xCoord) + ch + textLine.slice(xCoord);
    this.text[yCoord] = newTextLine;
  }

  addLineBreak(xCoord, yCoord) {
    const currentLine = this.text[yCoord];
    const beforeLineBreak = currentLine.slice(0, xCoord);
    const afterLineBreak = currentLine.slice(xCoord);
    this.text.splice(yCoord, 1, beforeLineBreak, afterLineBreak);
  }

  removeLineBreak(yCoord) {
    const currentLine = this.text[yCoord];
    this.text[yCoord - 1] += currentLine;
    this.text.splice(yCoord, 1);
  }

  removeChar(x, y) {
    const xCoord = x + this.cursorX;
    const yCoord = y + this.cursorY;
    const textLine = this.text[yCoord];
    const newTextLine = textLine.slice(0, xCoord) + textLine.slice(xCoord + 1);
    this.text[yCoord] = newTextLine;
  }

}
