/* eslint-env jquery */

import { getChar } from './io';


export default class Vi {
  constructor(shellRef, filePath, file) {
    this.shellRef = shellRef;
    this.filePath = filePath;
    this.file = file;
    this.mode = 'normal';
    this.commandText = '';
    this.cursorX = 0;
    this.cursorY = 0;
    this.bufferText = this.file !== null ? this.file.contents : [''];
    this.editorElement = $('#editor');
    this.bufferElement = $('#editor-buffer');
    this.editorConsoleElement = $('#editor-console');
    this.termElement = $('#terminal');
    this.renderBuffer();
    this.currentLineElement = Vi.getLineElement(0);
    this.cursorElement = $('#editor-buffer ed-y:nth-child(1) ed-x:nth-child(1)');
    this.cursorElement.addClass('cursor');
    this.startSession();
    this.heldNum = '';
  }

  /**
   * prepare HTML elements for vi session
   */
  startSession() {
    this.termElement.toggle();
    this.editorElement.toggle();
    this.editorConsoleElement.html('');
  }

  /**
   * shortcut function to get line from buffer
   * defaults to value of cursorY
   * @param {int} y Y coordinate to retrieve
   * @return {string} Line from buffer
   */
  getBufferLine(y = this.cursorY) {
    return this.bufferText[y];
  }

  /**
   * get HTML element at specific y index
   * @param {int} y Y index, 0-indexed
   * @return {HTMLElement} <ed-y> HTML element
   */
  static getLineElement(y) {
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
   * @param {event} event Keystroke event
   */
  parseKeystroke(event) {
    if (this.mode === 'normal') this.normalKeystroke(event);
    else if (this.mode === 'insert') this.insertKeystroke(event);
    else if (this.mode === 'command') this.commandKeystroke(event);
  }

  /**
   * handle normal mode keystroke
   * @param {event} event Keystroke event
   */
  normalKeystroke(event) {
    if (event.which === 186 && event.shiftKey) { // :
      this.mode = 'command';
      this.editorConsoleElement.html(':');
    } else if (event.which === 73) { // i
      if (event.shiftKey) this.cursorX = 0;
      else if (this.getBufferLine().length === 0) this.cursorX += 1;
      this.mode = 'insert';
      this.editorConsoleElement.html('<strong>-- INSERT --</strong>');
    } else if (event.which === 65) { // a
      if (event.shiftKey) this.cursorX = this.getBufferLine() + 1;
      else this.cursorX += 1;
      this.mode = 'insert';
      this.editorConsoleElement.html('<strong>-- INSERT --</strong>');
    } else if (event.which === 79) { // o
      if (!event.shiftKey) this.cursorY += 1;
      this.bufferText.splice(this.cursorY, 0, '');
      this.cursorX = 0;
      this.renderBuffer();
      this.currentLineElement = Vi.getLineElement(this.cursorY);
      this.mode = 'insert';
      this.editorConsoleElement.html('<strong>-- INSERT --</strong>');
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
   * repeatable normal-mode keystroke events
   * @param {event} event Keystroke event
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
    }
  }

  /**
   * handle insert mode keystroke
   * @param {event} event Keystroke event
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
      this.currentLineElement = Vi.getLineElement(this.cursorY);
      this.drawCursor();
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
   * @param {int} x X coord
   * @param {int} y Y coord
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
      this.bufferText[y] = line.slice(0, x - 1) + line.slice(x);
      this.drawLine(this.getBufferLine(), this.currentLineElement);
      this.cursorX -= 1;
    }
    this.drawCursor();
  }

  /**
   * write char to buffer at specified x,y coords
   * @param {string} str String to write
   * @param {int} x X coord
   * @param {int} y Y coord
   */
  writeChar(str, x, y) {
    const buffStr = this.bufferText[y];
    this.bufferText[y] = buffStr.slice(0, x) + str + buffStr.slice(x);
    this.drawLine(buffStr, this.currentLineElement);
  }

  /**
   * handle command mode keystroke
   * @param {event} event Keystroke event
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
    this.cursorElement.removeClass('cursor');
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
    const newFileResult = this.shellRef.newFile(this.filePath, 'txt');
    if (!newFileResult.data) return false;
    this.file = newFileResult.data;
    return true;
  }

  /**
   * rewrite string so that every character is enveloped by an <ed-x> tag,
   * so that we can traverse it with nth-child selector
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
   * @param {HTMLElement} lineElement line element to print to (optional)
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
  }

}
