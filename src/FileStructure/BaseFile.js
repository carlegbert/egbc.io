/**
 * Base File class, to be inherited from but not used directly.
 * @class
 */
class BaseFile {
  /**
   * @constructor
   * @param {string} name
   * @param {string} filetype
   * @param {DirFile} parentRef
   */
  constructor(name, parentRef = null) {
    this.name = name;
    this.parentRef = parentRef;

    this.fullPath = this.getFullPath();
  }

  /**
   * Returns HTML-formatted filename
   * @return {string}
   */
  getLsEntry() {
    return `<span class="inline txt" id="${this.fullPath}">${this.name}</span>`;
  }

  getFullPath() {
    if (!this.parentRef) return this.name;
    return `${this.parentRef.getFullPath()}/${this.name}`;
  }

}

module.exports = BaseFile;
