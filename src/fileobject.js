/**
 * Base File class
 * @class
 */
export class FileObject {
  /**
   * @constructor
   * @param {string} name
   * @param {string} fullPath
   * @param {FileObject} parentRef
   * @param {Date} lastModified
   */
  constructor(name, fullPath, filetype, parentRef, lastModified) {
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {string}
     */
    this.fullPath = fullPath;
    /**
     * @type {string}
     */
    this.filetype = filetype;
    /**
     * @type {DirFile}
     */
    this.parentRef = parentRef;
    /**
     * @type {Date}
     */
    this.lastModified = lastModified || new Date();
  }

  /**
   * @param {Object} json
   */
  static jsonToFile(json) {
    const newFile = new FileObject(json.name, json.fullPath, json.filetype,
        json.parentRef, json.lastModified);
    if (newFile.filetype === 'dir') {
      newFile.children = [];
      json.children.forEach((child) => {
        const childFile = this.jsonToFile(child);
        childFile.parentRef = newFile;
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
    return `<span class="dir ${this.filetype}" id="${this.fullPath}">${this.name}</span>`;
  }

}

/**
 * @extends {FileObject}
 */
export class DirFile extends FileObject {
  /**
   * @constructor
   * @param {string} name
   * @param {string} fullPath
   * @param {FileObject} parentRef
   * @param {Date} lastModified
   * @param {FileObject[]} children
   */
  constructor(name, fullPath, filetype, parentRef, lastModified, children) {
    super(name, fullPath, filetype, parentRef, lastModified);
    /**
     * @type {FileObject[]}
     */
    this.children = children || [];
  }

  /**
   * @param {string[]} types Types to filter by
   * @return {FileObject[]} array of FileObjects contained in directory
   */
  getContentsByTypes(types) {
    const files = [];
    this.children.forEach((child) => {
      if (types.includes(child.filetype)) {
        files.push(child);
      }
    });
    return files;
  }

  /**
   * @param {string[]} types Types to filter by
   * @return {string[]} array of names of FileObjects contained in directory
   */
  getContentNamesByType(types) {
    const filenames = [];
    this.children.forEach((child) => {
      if (types.includes(child.filetype)) {
        filenames.push(child.name);
      }
    });
    return filenames;
  }

  /**
   * Helper method for ls
   * @return {string}
   */
  lsHelper() {
    let res = '<div>';
    this.children.forEach((child) => {
      res += `<li class="inline ${child.filetype}">${child.name}</li>`;
    });
    res += '</div>';
    return res;
  }

}

/**
 * @extends {FileObject}
 */
export class TxtFile extends FileObject {
  /**
   * @constructor
   * @param {string} name
   * @param {string} fullPath
   * @param {FileObject} parentRef
   * @param {Date} lastModified
   * @param {string[]} contents
   */
  constructor(name, fullPath, filetype, parentRef, lastModified, contents) {
    super(name, fullPath, filetype, parentRef, lastModified);
    /**
     * @type {string[]}
     */
    this.contents = contents || [];
  }

}
