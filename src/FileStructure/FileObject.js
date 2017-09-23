/**
 * Base File class
 * @class
 */
class FileObject {
  /**
   * @constructor
   * @param {string} name
   * @param {string} filetype
   * @param {DirFile} parentRef
   */
  constructor(name, filetype, parentRef = null) {
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {string}
     */
    this.filetype = filetype;
    /**
     * @type {DirFile}
     */
    this.parentRef = parentRef;

    this.fullPath = this.getFullPath();
  }

  /**
   * Returns HTML-formatted filename
   * @return {string}
   */
  getLsEntry() {
    const filetype = this.filetype || 'txt';
    return `<span class="inline ${filetype}" id="${this.fullPath}">${this.name}</span>`;
  }

  getFullPath() {
    if (!this.parentRef) return this.name;
    return `${this.parentRef.getFullPath()}/${this.name}`;
  }

}

module.exports = FileObject;
