const BaseFile = require('./BaseFile');

/**
 * @extends {BaseFile}
 */
class File extends BaseFile {
  /**
   * @constructor
   * @param {string} name
   * @param {BaseFile} parentRef
   */
  constructor(name, parentRef, contents) {
    super(name, parentRef);
    this.contents = contents || [''];
  }
}

module.exports = File;
