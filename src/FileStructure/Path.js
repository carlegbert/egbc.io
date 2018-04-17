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
  lowestDir() {
    return this.arr[0];
  }

  /**
   * @return {String} Name of file
   */
  basename() {
    return this.arr.slice(-1)[0];
  }

  /**
   * @return {Path} Path of the highest directory
   */
  highestDir() {
    if (this.length <= 1) return null;
    return new Path((this.arr.slice(0, -1)));
  }
}

module.exports = Path;
