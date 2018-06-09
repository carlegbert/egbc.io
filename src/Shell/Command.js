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
    this.command = '';
    this.shell = shell;

    this.parseInput();
  }

  /**
   * Parse input string into base command and args
   */
  parseInput() {
    let normalizedInput = removeExtraSpaces(this.originalInput).trim();
    if (normalizedInput[0] === ' ') normalizedInput = normalizedInput.slice(1);
    const splitInput = normalizedInput.split(' ');
    this.command = splitInput[0];
    this.args = splitInput.slice(1);
  }
}

module.exports = ShellCommand;
