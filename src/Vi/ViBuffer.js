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
    this.text.forEach((txtLine) => {
      const bufLine = new BufferLine(txtLine);
      this.element.appendChild(bufLine.element);
      console.log(bufLine);
      this.bufferLines.push(bufLine);
      bufLine.renderChars();
    });
  }


}
