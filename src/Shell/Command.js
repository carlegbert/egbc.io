/* eslint-disable class-methods-use-this */

const { removeExtraSpaces } = require('../util/io');
const { Directory, File } = require('../FileStructure');

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

  /**
   * List of all valid commands, used for autocompletion
   * @return {string[]} List of valid commands that can be executed
   */
  static validCommands() {
    return [
      'clear',
      'pwd',
      'whoami',
      'cd',
      'ls',
      'cat',
      'touch',
      'mkdir',
      'echo',
      'vi',
      'help',
    ];
  }

  /**
  /**
   * Determine valid filetypes for command arguments
   * @param {string} cmdName Command name, eg, 'ls', 'cat', etc
   * @return {string[]} array of valid filetypes
   */
  static getValidTypes(cmdName) {
    const typeDict = {
      ls: [Directory],
      cd: [Directory],
      mkdir: [Directory],
      cat: [File],
      '>': [File],
      vi: [File],
    };
    return typeDict[cmdName] || [Directory, File];
  }
}

module.exports = ShellCommand;
