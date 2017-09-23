/**
 * Base File class
 * @class
 */
export default class FileObject {
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
   * @param {Object} json
   * @param {DirFile} parentRef - optional ParentRef argument
   */
  static jsonToFile(json, parentRef = null) {
    const newFile = new FileObject(json.name, json.filetype,
        parentRef);
    if (newFile.filetype === 'dir') {
      newFile.children = [];
      json.children.forEach((child) => {
        const childFile = FileObject.jsonToFile(child, newFile);
        newFile.children.push(childFile);
      });
    }
    return newFile;
  }

  /**
   * Returns HTML-formatted filename
   * @return {string}
   */
  getLsEntry() {
    return `<span class="inline ${this.filetype}" id="${this.fullPath}">${this.name}</span>`;
  }

  getFullPath() {
    if (!this.parentRef) return this.name;
    return `${this.parentRef.getFullPath()}/${this.name}`;
  }

}
