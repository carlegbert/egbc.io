/* eslint-disable no-param-reassign */
/* eslint-env browser */

export interface PrintableElement {
  innerHTML: string
}

/**
 * function for parsing keycode from keystroke event into a
 * single character. necessary because of poor keystroke event
 * support in Safari.
 * @param {Event} event Keystroke event
 * @return {string} single-char string or null, or empty string
 *  on failure.
 */
export function getChar(event: KeyboardEvent): string {
  const code = event.keyCode;
  if (code === 32) return ' '; // spacebar
  if (event.shiftKey) { // if shift key depressed
    if (code <= 91 && code >= 65) { // capital letters
      return String.fromCharCode(code);
    }

    switch (code) {
      case 49: return '!';
      case 50: return '@';
      case 51: return '#';
      case 52: return '$';
      case 53: return '%';
      case 54: return '^';
      case 55: return '&';
      case 56: return '*';
      case 57: return '(';
      case 58: return ')';
      case 189: return '_';
      case 187: return '+';
      case 219: return '{';
      case 221: return '}';
      case 220: return '|';
      case 186: return ':';
      case 222: return '"';
      case 191: return '?';
      case 190: return '>';
      case 188: return '<';
      case 192: return '~';
      default:
        break;
    }
    // shift key not depressed
  } else if ((code <= 91 && code >= 65) || (code <= 57 && code >= 48)) {
    return String.fromCharCode(code).toLowerCase(); // lowercase & nums
  } else {
    switch (code) {
      case 189: return '-';
      case 187: return '=';
      case 219: return '[';
      case 221: return ']';
      case 220: return '\\';
      case 186: return ';';
      case 222: return "'";
      case 191: return '/';
      case 190: return '.';
      case 188: return ',';
      case 192: return '`';
      default:
        break;
    }
  }
  return '';
}

export function print(output: string | string[], target: PrintableElement): void {
  if (typeof output === 'string') {
    target.innerHTML += `<li>${output}</li>`;
    return;
  }
  output.forEach(line => print(line, target));
}

export function printInline(output: string[], target: PrintableElement): void {
  output.forEach((line) => {
    target.innerHTML += `<li class='inline'>${line}</li>`;
  });
}

export function removeExtraSpaces(str: string): string {
  return str.split(' ')
    .filter(word => word !== ' ' && word !== '')
    .join(' ');
}

/**
 * Evaluates equality of two arrays of strings
 */
export function textEquals(textA: string[], textB: string[]): boolean {
  if (textA.length !== textB.length) return false;
  for (let i = 0; i < textA.length; i += 1) {
    if (textA[i] !== textB[i]) return false;
  }
  return true;
}

export function isArrayOfStrings(item?: unknown): item is string[] {
  if (!(item instanceof Array)) return false;
  for (let i = 0; i < item.length; i += 1) {
    if (typeof item[i] !== 'string') return false;
  }
  return true;
}