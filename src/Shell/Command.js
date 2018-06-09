const { removeExtraSpaces } = require('../util/io');

/**
 * Object encapsulating information to be passed to a shell operation,
 * and the functions that execute those operations.
 * @class
 */
class ShellCommand {
  /**
   * @constructor
   * @param {string} input User-inputted statement from terminal
   * @param {Shell} shell Parent shell object
   */
  constructor(input, shell) {
    this.originalInput = input;
    this.args = [];
    this.flags = [];
    this.command = '';
    this.shell = shell;

    this.parseInput();
  }

  /**
   * Parse input string into flags & args
   */
  parseInput() {
    let normalizedInput = removeExtraSpaces(this.originalInput);
    if (normalizedInput[0] === ' ') normalizedInput = normalizedInput.slice(1);
    const splitInput = normalizedInput.split(' ');
    this.command = splitInput[0];
    if (splitInput.length > 1) {
      splitInput.slice(1).forEach((word) => {
        if (word.length > 0 && word[0] === '-') {
          this.flags.push(word);
        } else if (word.length > 0 && word !== ' ') {
          this.args.push(word);
        }
      });
    }
  }
}

module.exports = ShellCommand;
