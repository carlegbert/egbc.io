const { isArrayOfStrings } = require('../util/io');

/**
 * Class representing a path to a file
 */
class Path {
  /**
   * @param {String | String[]} path
   */
  constructor(patharg) {
    if (typeof patharg === 'string') {
      this.str = patharg;
      this.arr = patharg.split('/');
    } else if (isArrayOfStrings(patharg, String)) {
      this.str = patharg.join('/');
      this.arr = patharg.slice(0);
    }
    // don't let arr or str be empty
    if (!this.str || this.arr.length === 0) {
      this.str = '.';
      this.arr = ['.'];
    }

    this.length = this.arr.length;
  }

  /**
   * Helper for traversing Path object
   * @return {Path} New shortened Path object
   */
  next() {
    return new Path(this.arr.slice(1));
  }

  /**
   * @return {String} First element of this.arr
   */
  base() {
    return this.arr[0];
  }
}

module.exports = Path;
