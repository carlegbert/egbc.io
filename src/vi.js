/* eslint-env jquery */
// TODO: reorganize functions in this file so that they are grouped together more logically
// TODO: consider creating new 'buffer' class
// TODO: refactor this class so that UI/data are more clearly delineated

import { getChar } from './io';

  /*
   * object encapsulating data, functions, and HTML elements for Vi session.
   * Each Vi session is tied to one filepath and zero or one files. TODO: change that
   * @class
   */
export default class Vi {
  /**
   * @constructor
   * @param {Object} shellRef reference to parent Shell object
   * @param {string[]} filePath
   * @param {Object} file reference to TxtFile to write to (optional)
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
    this.cursorX = 0;
    /**
     * @type {number}
     */
    this.cursorY = 0;
    /**
     * @type {string[]}
     */
    this.bufferText = this.file === null ? [''] : this.file.contents;
    /**
     * @type {HTMLElement}
     */
    this.editorElement = $('#editor');
    /**
     * @type {HTMLElement}
     */
    this.bufferElement = $('#editor-buffer');
    /**
     * @type {HTMLElement}
     */
    this.editorConsoleElement = $('#editor-console');
    /**
     * @type {HTMLElement}
     */
    this.termElement = $('#terminal');

    this.startSession();
  }

  /**
   * prepare HTML elements for vi session
   */
  startSession() {
    this.renderBuffer();
    this.editorConsoleElement.html('');
    this.termElement.toggle();
    this.editorElement.toggle();
  }

  /**
   * shortcut function to get line from buffer
   * defaults to value of cursorY
   * @param {number} y Y coordinate to retrieve
   * @return {string} Line from buffer
   */
  getBufferLine(y = this.cursorY) {
    return this.bufferText[y];
  }

  /**
   * get HTML element at specific y index. defaults to this.cursorY
   * @param {number} y Y index, 0-indexed
   * @return {Object} <ed-y> HTML element
   */
  getLineElement(y = this.cursorY) {
    return $(`#editor-buffer ed-y:nth-child(${y + 1})`);
  }

  /**
   * end vi session
   * @param {boolean} force Don't require buffer to be saved if force is true
   */
  endSession(force) {
    if (force || (this.file && (this.file.contents === this.bufferText))) {
      this.editorConsoleElement.html('');
      this.bufferElement.html('');
      this.editorElement.toggle();
      this.termElement.toggle();
      this.shellRef.killChildProcess();
    } else {
      this.errorMessage('E37: No write since last change (add ! to override)');
    }
  }

  /**
   * write error text to vi console
   * @param {string} errText
   */
  errorMessage(errText) {
    this.editorConsoleElement.html(errText);
  }

  /**
   * pass keystroke event to correct function depending on mode
   * @param {Object} event Keystroke event object
   */
  parseKeystroke(event) {
    if (this.mode === 'normal') this.normalKeystroke(event);
    else if (this.mode === 'insert') this.insertKeystroke(event);
    else if (this.mode === 'command') this.commandKeystroke(event);
  }

  /**
   * handle normal mode keystroke
   * @param {Object} event Keystroke event object
   */
  normalKeystroke(event) {
    if (event.which === 186 && event.shiftKey) { // :
      this.mode = 'command';
      this.editorConsoleElement.html(':');
    } else if (event.which === 73) { // i
      if (event.shiftKey) this.cursorX = 0;
      else if (this.getBufferLine().length === 0) this.cursorX += 1;
      this.setInsertMode();
    } else if (event.which === 65) { // a
      if (event.shiftKey) this.cursorX = this.getBufferLine().length + 1;
      else this.cursorX += 1;
      this.setInsertMode();
    } else if (event.which === 79) { // o
      if (!event.shiftKey) this.cursorY += 1;
      this.bufferText.splice(this.cursorY, 0, '');
      this.cursorX = 0;
      this.renderBuffer();
      this.setInsertMode();
    } else if (event.which === 52 && event.shiftKey) { // $
      this.cursorX = this.getBufferLine().length;
    } else if (event.which === 48 && !event.shiftKey) { // 0
      this.cursorX = 0;
    } else if (this.heldNum) {
      for (let i = 0; i < parseInt(this.heldNum, 10); i += 1) {
        this.repeatableNormalKeystroke(event);
      }
    } else {
      this.repeatableNormalKeystroke(event);
    }
    this.drawCursor();

    const c = getChar(event);
    if (parseInt(c, 10) && (c !== 0 || this.heldNum)) this.heldNum += c;
    else this.heldNum = '';
  }

  /**
   * enter insert mode
   */
  setInsertMode() {
    this.mode = 'insert';
    this.editorConsoleElement.html('<strong>-- INSERT --</strong>');
    if (this.getBufferLine().length === 0) {
      this.cursorX += 1;
    }
  }

  /**
   * repeatable normal-mode keystroke events
   * @param {Object} event Keystroke event object
   */
  repeatableNormalKeystroke(event) {
    if (event.which === 72) { // h
      this.cursorX -= 1;
    } else if (event.which === 76) { // l
      this.cursorX += 1;
    } else if (event.which === 74) { // j
      this.cursorY += 1;
    } else if (event.which === 75) { // k
      this.cursorY -= 1;
    } else if (event.which === 13) { // enter
      this.cursorY += 1;
      this.cursorX = 0;
    } else if (event.which === 88) { // x
      this.deleteChar(this.cursorX, this.cursorY);
    }
  }

  /**
   * handle insert mode keystroke
   * @param {Object} event Keystroke event object
   */
  insertKeystroke(event) {
    if (event.which === 27) { // escape
      this.mode = 'normal';
      this.cursorX -= 1;
      this.drawCursor();
      this.editorConsoleElement.html('');
    } else if (event.which === 13) { // enter
      this.cursorX = 0;
      this.cursorY += 1;
      this.bufferText.splice(this.cursorY, 0, '');
      this.renderBuffer();
    } else if (event.which === 8) { // backspace
      this.backspace(this.cursorX, this.cursorY);
    } else {
      this.writeChar(getChar(event), this.cursorX, this.cursorY);
      this.cursorX += 1;
      this.drawLine(this.getBufferLine(), this.currentLineElement);
      this.drawCursor();
    }
  }

  /** handle insert-mode backspace
   * @param {number} x X coord
   * @param {number} y Y coord
   */
  backspace(x, y) {
    const line = this.getBufferLine(y);
    if (x === 0 && y !== 0) {
      this.cursorX = this.bufferText[y - 1].length;
      this.cursorY -= 1;
      this.bufferText[y - 1] += line;
      this.bufferText.splice(y, 1);
      this.renderBuffer();
    } else {
      this.deleteChar(x - 1, y);
      this.cursorX -= 1;
    }
    this.drawCursor();
  }

  /** delete buffer char at x/y
   * @param {number} x X coord
   * @param {number} y Y coord
   */
  deleteChar(x, y) {
    const line = this.getBufferLine(y);
    this.bufferText[y] = line.slice(0, x) + line.slice(x + 1);
    this.drawLine(this.getBufferLine(y), this.currentLineElement);
    // TODO: consider calling drawLine elsewhere
  }

  /**
   * write char to buffer at specified x,y coords
   * @param {string} str String to write
   * @param {number} x X coord
   * @param {number} y Y coord
   */
  writeChar(str, x, y) {
    const buffStr = this.bufferText[y];
    this.bufferText[y] = buffStr.slice(0, x) + str + buffStr.slice(x);
    this.drawLine(buffStr, this.currentLineElement);
  }

  /**
   * handle command mode keystroke
   * @param {Object} event Keystroke event object
   */
  commandKeystroke(event) {
    if (event.which === 27) { // escape
      this.mode = 'normal';
      this.commandText = '';
      this.editorConsoleElement.html('');
    } else if (event.which === 13) { // enter
      this.executeCommand();
    } else if (event.which === 8) { // backspace
      this.commandText = this.commandText.slice(0, -1);
      this.editorConsoleElement.html(`:${this.commandText}`);
    } else {
      const c = getChar(event);
      this.commandText += c;
      this.editorConsoleElement.append(c);
    }
  }

  /**
   * execute command mode statement
   */
  executeCommand() {
    if (this.commandText === 'w') this.saveBuffer();
    else if (this.commandText === 'q') this.endSession(false);
    else if (this.commandText === 'q!') this.endSession(true);
    else if (this.commandText === 'wq') {
      const saveResult = this.saveBuffer();
      if (saveResult) this.endSession(false);
    } else this.errorMessage(`E492: Not an editor command: ${this.commandText}`);
    this.commandText = '';
    this.mode = 'normal';
  }

  /**
   * reset cursor indices to within bounds of buffer text;
   * redraw cursor. allow cursor to be after last char in line if in insert mode.
   */
  drawCursor() {
    const yMax = this.bufferText.length - 1;
    if (this.cursorY < 0) this.cursorY = 0;
    if (this.cursorY > yMax) this.cursorY = yMax;
    let xMax = this.getBufferLine().length - 1;
    if (this.mode === 'insert' || this.getBufferLine().length === 0) xMax += 1; // allow cursor at EOL in insert mode or if line is empty
    if (this.cursorX < 0) this.cursorX = 0;
    if (this.cursorX > xMax) this.cursorX = xMax;
    if (this.cursorElement) this.cursorElement.removeClass('cursor');
    const jqStr = `#editor-buffer ed-y:nth-child(${this.cursorY + 1}) ed-x:nth-child(${this.cursorX + 1})`;
    this.cursorElement = $(jqStr);
    this.cursorElement.addClass('cursor');
  }

  /**
   * save buffer text to FileObject. attempt to write new file if none exists.
   * @return {boolean} returns true on success, false on failure
   */
  saveBuffer() {
    if (!this.file) this.writeNewFile();
    if (!this.file) return false;
    this.file.contents = this.bufferText;
    this.editorConsoleElement.html(`${this.file.fullPath}: File written`);
    return true;
  }

  /**
   * create new FileObject and assign it to Vi session
   */
  writeNewFile() {
    this.file = this.shellRef.currentDir.createChild(this.filePath, 'txt');
    if (!this.file) return false;
    return true;
  }

  /**
   * rewrite string so that every character is enveloped by an <ed-x> tag,
   * so that we can traverse it with nth-child selector. space chars will
   * be replaced with '&nbsp;'
   * @param {string} str Original string
   * @return {string} New string
   */
  static edxString(str) {
    let fStr = '';
    for (let i = 0; i < str.length; i += 1) {
      const c = str[i] === ' ' ? '&nbsp;' : str[i];
      fStr += `<ed-x>${c}</ed-x>`;
    }
    fStr += '<ed-x>&nbsp;</ed-x>';
    return fStr;
  }

  /**
   * draw single line in editor buffer.
   * appended to end if no line element is provided.
   * @param {string} str String to print
   * @param {Object} lineElement HTML line element to print to (optional, appended at end of buffer
   * if not provided)
   */
  drawLine(str, lineElement) {
    const fStr = Vi.edxString(str);
    if (lineElement) $(`#editor-buffer ed-y:nth-child(${this.cursorY + 1})`).html(fStr);
    else this.bufferElement.append(`<ed-y>${fStr}</ed-y>`);
  }

  /**
   * render entire contents of buffer
   */
  renderBuffer() {
    this.bufferElement.html('');
    this.bufferText.forEach(str => this.drawLine(str));
    this.currentLineElement = this.getLineElement();
    this.drawCursor();
  }

}
