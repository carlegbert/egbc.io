/* eslint-env browser */
// Each BufferLine object will exist in memory until it is deleted
// or the instance of Vi ends
// It will have a reference to its parent buffer, and via that parent line it will
// be able to delete its own HTML element.
// Each character will be represented by a child BufferChar.

export default class BufferLine {
  constructor(parentBuf, y) {
    this.parentBuf = parentBuf;
    this.y = y;
    this.element = document.createElement('bl');
    this.chars = null; // HTML elements
  }

  getText() {
    return this.parentBuf.text[this.y];
  }

  setText(newText) {
    this.parentBuf.text[this.y] = newText;
  }

  renderChars() {
    this.chars = [];
    for (let i = 0; i < this.getText().length; i += 1) {
      const ch = document.createElement('bc');
      ch.innerHTML = this.getText()[i];
      this.element.appendChild(ch);
      this.chars.push(ch);
    }
    const eol = document.createElement('bc');
    eol.innerHTML = '&nbsp;';
    this.element.appendChild(eol);
    this.chars.push(eol);
  }

  addChar(x, ch) {
    let txt = this.getText();
    txt = txt.slice(0, x) + ch + txt.slice(x);
    this.setText(txt);
    const newChar = document.createElement('bc');
    newChar.innerHTML = ch;
    this.element.insertBefore(newChar, this.chars[x]);
    this.chars.splice(x, 0, newChar);
  }

  removeChar(x) {
    let txt = this.getText();
    this.element.removeChild(this.chars[x]);
    this.chars.splice(x, 1);
    txt = txt.slice(0, x) + txt.slice(x + 1);
    this.setText(txt);
  }

  reset() {
    this.chars = [];
    this.innerHTML = '';
    this.renderChildren();
  }

  renderCursor(x, insertMode = false) {
    let adjustedX;
    const max = insertMode ? this.chars.length - 1 : this.chars.length - 2;
    if (this.chars.length === 1) adjustedX = 0;
    else if (x > max) adjustedX = max;
    else adjustedX = x;
    const newCursor = this.chars[adjustedX];
    newCursor.classList.add('cursor');
    return newCursor;
  }
}

