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
    let args = removeExtraSpaces(this.originalInput).trim();
    args = args.split(' ');
    this.command = args[0];
    this.args = args.slice(1);
  }
}

module.exports = ShellCommand;
