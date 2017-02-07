/**
 * Object encapsulating information to be passed to a shell command
 * @class
 */
export class ShellCommand {
  /**
   * @constructor
   * @param {string} input User-inputted statement from terminal
   */
  constructor(input) {
    /**
     * @type {string}
     */
    this.originalInput = input;
    /**
     * @type string[]
     */
    this.args = [];
    /**
     * @type string[]
     */
    this.flags = [];
    /**
     * @type string
     */
    this.command = '';

    this.parseInput();
  }

  /**
   * Parse input string into flags & args
   */
  parseInput() {
    const splitInput = this.originalInput.split(' ');
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

/**
 * Object containing results of shell action
 * @class
 */
export class ShellCommandResult {
  /**
   * @constructor
   * @param {string[]} stdOut Results of succesful action
   * @param {string[]} stdErr Results of unsuccesful action
   * @param {*} data Wildcard data that the command may need to pass back (for example,
   * a newly created file)
   */
  constructor(stdOut, stdErr, data) {
    /**
     * @type {string[]}
     */
    this.stdOut = stdOut || [];
    /**
     * @type {string[]}
     */
    this.stdErr = stdErr || [];
    /**
     * @type {*}
     */
    this.data = data;
  }

  /**
   * return stdErr if it is not undefined, stdOut if it isn't,
   * and an empty array if neither are.
   * @return {string[]}
   */
  getDefaultOutput() {
    return this.stdOut.concat(this.stdErr);
  }

  /**
   * combine two shellCommandResults into one for use in
   * recursive or chained functions
   * @param {ShellCommandResult} otherResult
   * @return {ShellCommandResult}
   */
  combine(otherResult) {
    this.stdErr += otherResult.stdErr;
    this.stdOut += otherResult.stdOut;
    this.data += otherResult.data;
  }

}
