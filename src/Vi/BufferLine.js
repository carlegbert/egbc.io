/* eslint-env browser */
// Each BufferLine object will exist in memory until it is deleted
// or the instance of Vi ends
// It will have a reference to its parent buffer, and via that parent line it will
// be able to delete its own HTML element.
// Each character will be represented by a child BufferChar.

export default class BufferLine {
  constructor(txt) {
    this.txt = txt;
    this.element = document.createElement('bl');
    this.chars = []; // HTML elements
  }

  renderChars() {
    for (let i = 0; i < this.txt.length; i += 1) {
      const ch = document.createElement('bc');
      ch.innerHTML = this.txt[i];
      this.element.appendChild(ch);
      this.chars.push(ch);
    }
  }

  addChar(x, ch) {
    this.txt = this.txt.slice(0, x) + ch + this.txt.slice(x);
    this.chars.splice(x, 0, ch);
    this.element.insertBefore(this.chars[x + 1]);
  }

  removeChar(x) {
    this.element.removeChild(this.chars[x]);
    this.chars.splice(x, 1);
    this.txt = this.txt.slice(0, x) + this.txt.slice(x + 1);
  }

  reset() {
    this.chars = [];
    this.innerHTML = '';
    this.renderChildren();
  }
}

