/**
 * Object containing results of shell action
 * @class
 */
class ShellCommandResult {
  /**
   * @constructor
   * @param {string[]} stdOut Results of succesful action
   * @param {string[]} stdErr Results of unsuccesful action
   * @param {*} data Wildcard data that the command may need to pass back (for example,
   * a newly created file)
   */
  constructor(stdOut, stdErr, data) {
    this.stdOut = stdOut || [];
    this.stdErr = stdErr || [];
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

module.exports = ShellCommandResult;
