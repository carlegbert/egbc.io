import Shell from './'

import { removeExtraSpaces } from '../util/io'

/**
 * Object encapsulating information to be passed to a shell operation,
 * and the functions that execute those operations.
 * @class
 */
export default class ShellCommand {
  /**
   * @constructor
   * @param {string} input User-inputted statement from terminal
   * @param {Shell} shell Parent shell object
   */

  public args: string[]
  public shell: Shell

  constructor(input: string, shell: Shell) {
    this.shell = shell
    const args = ShellCommand.parseArgs(input)
    this.args = args.slice(0)
  }

  /**
   * Parse input string into base command and args
   */
  private static parseArgs(input: string): string[] {
    return removeExtraSpaces(input)
      .trim()
      .split(' ')
  }
}
