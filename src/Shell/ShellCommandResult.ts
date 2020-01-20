/**
 * Object containing results of shell action
 * @class
 */
export default class ShellCommandResult<T = unknown> {
  /**
   * @constructor
   * @param {string[]} stdOut Results of succesful action
   * @param {string[]} stdErr Results of unsuccesful action
   * @param {*} data Wildcard data that the command may need to pass back (for example,
   * a newly created file)
   */
  public stdOut: string[]
  public stdErr: string[]
  public data: T | undefined
  constructor(stdOut?: string[] | null, stdErr?: string[] | null, data?: T) {
    this.stdOut = stdOut || []
    this.stdErr = stdErr || []
    this.data = data
  }

  /**
   * return stdErr if it is not undefined, stdOut if it isn't,
   * and an empty array if neither are.
   */
  getDefaultOutput(): string[] {
    return this.stdOut.concat(this.stdErr)
  }

  /**
   * combine two shellCommandResults into one for use in
   * recursive or chained functions
   * @param {ShellCommandResult} otherResult
   * @return {ShellCommandResult}
   */
  combine(otherResult: ShellCommandResult): void {
    this.stdErr.concat(otherResult.stdErr)
    this.stdOut.concat(otherResult.stdOut)
  }
}
