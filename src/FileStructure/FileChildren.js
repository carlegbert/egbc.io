/* eslint-disable no-param-reassign */

// helper for filtering out special file references
const specialRefFilterCallback = filename => !['.', '..', '~'].includes(filename);

/**
 * Collection class for groups of files, to abstract iteration,
 * filtering, and mapping options. FileChildren object holds reference
 * to top directory in `~`, its parent Directory in `.`, and that directory's parent in
 * `..`
 */
class FileChildren {
  /**
   * @constructor
   * @param {Directory} parent Parent directory of children
   * @param {Object|Array} members Object or array containing child members
   */
  constructor(parent, members = {}) {
    this.parent = parent;

    this.members = {};
    if (members instanceof Array) {
      members.forEach((file) => { this.members[file.name] = file; });
    } else {
      Object.assign(this.members, members);
    }

    this.members['.'] = this.parent;
    this.members['..'] = this.parent.parentRef;
    this.members['~'] = this.parent.findTopParent();
  }

  /**
   * Iterate through all children. Ignores special file references.
   * @param {Function} cb Callback function that receives currentValue parameter
   */
  forEach(cb) {
    Object.keys(this.members)
      .filter(specialRefFilterCallback)
      .forEach(val => cb(this.members[val]));
  }

  /**
   * Filter children. Ignores special file references.
   * @param {Function} cb Filtering function that receives currentValue parameter and behaves
   *  like Array.filter callback
   * @return {Object} Object containing objects inheriting from BaseFile class
   */
  filter(cb) {
    return Object.keys(this.members)
      .filter(specialRefFilterCallback)
      .map(filename => this.members[filename])
      .filter(cb)
      .reduce((ret, file) => {
        ret[file.name] = file;
        return ret;
      }, {});
  }

  /**
   * Add file to collection
   * @param {BaseFile} file File to add
   */
  addChild(file) {
    const hasChild = (Object.keys(this.members)
      .filter(specialRefFilterCallback)
      .includes(file.name));
    if (hasChild) throw new Error(`FileChildren error: File ${file.name} exists`);
    else if (this.members[file.name]) throw new Error('FileChildren error: Invalid file name');
    this.members[file.name] = file;
  }

  /**
   * Remove reference to child
   * @param {string} filename
   */
  unlinkChild(filename) {
    if (!this.members[filename]) throw new Error(`FileChildren error: File ${filename} not found in directory ${this.parent.name}`);
    else if (filename === '.' || filename === '..') throw new Error(`FileChildren error: Cannot unlink ${filename}`);
    delete this.members[filename];
  }
}

module.exports = FileChildren;
