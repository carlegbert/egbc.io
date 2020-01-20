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
  public command: string
  public shell: Shell

  constructor(input: string, shell: Shell) {
    this.shell = shell
    const args = ShellCommand.parseInput(input)
    this.args = args.slice(1)
    this.command = args[0]
  }

  /**
   * Parse input string into base command and args
   */
  private static parseInput(input: string): string[] {
    return removeExtraSpaces(input)
      .trim()
      .split(' ')
  }
}
