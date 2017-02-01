/* eslint-env jquery */

import { getChar, print } from './io';


export default class Vi {
  constructor(shellRef, filePath, file) {
    this.shellRef = shellRef;
    this.filePath = filePath;
    this.file = file;
    this.bufferText = this.file !== null ? this.file.contents : [''];
    this.editorElement = $('#editor');
    this.bufferElement = $('#editor-buffer');
    this.editorConsoleElement = $('#editor-console');
    this.termElement = $('#terminal');
    this.mode = 'normal';
    this.commandText = '';
    this.cursorX = 0;
    this.cursorY = 0;
    this.startSession();
  }

  /**
   * prepare HTML elements for vi session
   */
  startSession() {
    this.termElement.toggle();
    this.editorElement.toggle();
    print(this.bufferText, this.bufferElement);
    this.editorConsoleElement.html('');
  }

  /**
   * end vi session
   * @param {boolean} force Don't require buffer to be saved if force is true
   */
  endSession(force) {
    if (force || (this.file && (this.file.contents === this.bufferText))) {
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
      this.mode = 'insert';
      this.editorConsoleElement.html('<strong>-- INSERT --</strong>');
    } else if (event.which === 72) { // h
      this.cursorX -= 1;
    } else if (event.which === 76) { // l
      this.cursorX += 1;
    } else if (event.which === 74) { // j
      this.cursorY += 1;
    } else if (event.which === 75) { // k
      this.cursorY -= 1;
    }
    this.normalizeCursor();
  }

  /**
   * handle insert mode keystroke
   * @param {event} event Keystroke event
   */
  insertKeystroke(event) {
    if (event.which === 27) {
      this.mode = 'normal';
      this.editorConsoleElement.html('');
    }
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
   * reset cursor to within bounds of buffer text
   */
  normalizeCursor() {
    const xMax = this.bufferText[this.cursorY].length - 1;
    const yMax = this.bufferText.length - 1;
    if (this.cursorX < 0) this.cursorX = 0;
    if (this.cursorY < 0) this.cursorY = 0;
    if (this.cursorX > xMax) this.cursorX = xMax;
    if (this.cursorY > yMax) this.cursorY = yMax;
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


}
