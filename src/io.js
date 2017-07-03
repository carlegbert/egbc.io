/* eslint-disable no-param-reassign */

/**
 * function for parsing keycode from keystroke event into a
 * single character. necessary because of poor keystroke event
 * support in Safari.
 * @param {Event} event Keystroke event
 * @return {string} single-char string or null, or empty string
 *  on failure.
 */
export function getChar(event) {
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

/**
 * print output to screen. format if necessary
 * TODO: consider refactoring into seperate functions for
 * single string and array.
 * @param {string|string[]} output String or array of strings to print
 * @param {HTMLElement} target HTML element to print to
 */
export function print(output, target) {
  if (typeof output === 'string') {
    target.innerHTML += `<li>${output}</li>`;
  } else if (typeof output === 'object') {
    output.forEach(line => print(line, target));
  }
}

/**
 * print output to screen without linebreaks
 * @param {string[]} output Array of strings to print
 * @param {HTMLElement} target HTML element to print to
 */
export function printInline(output, target) {
  output.forEach((line) => {
    target.innerHTML += `<li class='inline'>${line}</li>`;
  });
}
