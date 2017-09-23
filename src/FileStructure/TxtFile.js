import FileObject from './FileObject';

/**
 * @extends {FileObject}
 */
export default class TxtFile extends FileObject {
  /**
   * @constructor
   * @param {string} name
   * @param {DirFile} parentRef
   * @param {string[]} contents
   */
  constructor(name, parentRef, contents) {
    super(name, 'txt', parentRef);
    /**
     * @type {string[]}
     */
    this.contents = contents || [''];
  }

}
