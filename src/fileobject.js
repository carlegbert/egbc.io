/**
 * Base File class
 * @class
 */
export class FileObject {
  /**
   * @constructor
   * @param {string} name
   * @param {string} fullPath
   * @param {string} filetype
   * @param {DirFile} parentRef
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
   * @param {DirFile} parentRef - optional ParentRef argument
   */
  static jsonToFile(json, parentRef = null) {
    const newFile = new FileObject(json.name, json.fullPath, json.filetype,
        parentRef, json.lastModified);
    if (newFile.filetype === 'dir') {
      newFile.children = [];
      json.children.forEach((child) => {
        const childFile = this.jsonToFile(child, newFile);
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

}


/**
 * @extends {FileObject}
 */
export class TxtFile extends FileObject {
  /**
   * @constructor
   * @param {string} name
   * @param {string} fullPath
   * @param {DirFile} parentRef
   * @param {Date} lastModified
   * @param {string[]} contents
   */
  constructor(name, fullPath, parentRef, lastModified, contents) {
    super(name, fullPath, 'txt', parentRef, lastModified);
    /**
     * @type {string[]}
     */
    this.contents = contents || [];
  }

}

/**
 * @extends {TxtFile}
 */
export class LinkFile extends TxtFile {
  /**
   * @constructor
   * @param {string} name
   * @param {string} fullPath
   * @param {DirFile} parentRef
   * @param {Date} lastModified
   * @param {string} url
   */
  constructor(name, fullPath, parentRef, lastModified, url) {
    super(name, fullPath, 'txt', parentRef, lastModified);
    /**
     * @type {string}
     */
    this.url = url;
  }

  /**
   * Returns HTML-formatted filename
   * @return {string}
   */
  getLsEntry() {
    return `<span class="inline link"><a href="${this.url}" target="_blank">${this.name}<a></span>`;
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
  constructor(name, fullPath, parentRef, lastModified, children) {
    super(name, fullPath, 'dir', parentRef, lastModified);
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
      res += child.getLsEntry();
    });
    res += '</div>';
    return res;
  }

  /**
   * Recursively traverses up through parentRefs to find base DirFile
   * representing the entire file structure.
   * @return {DirFile}
   */
  findTopParent() {
    if (!this.parentRef) return this;
    return this.parentRef.findTopParent();
  }

  /**
   * Function to find file in a directory. Returns null if unsuccesful; it is the responsibility
   * of the calling function to otherwise deal with failure.
   * @param {string[]} filepath Path to file to be found
   * @param {string} filetype Type of file to find (optional)
   * @return {FileObject} Returns file object if found, null if not
   */
  findFile(filepath, filetype) {
    if (filepath.length > 1 && filepath[filepath.length - 1] === '' &&
        filetype === 'dir') filepath.splice(-1, 1);
    if (filepath.length === 0 && filetype === 'dir') return this;
    let found = null;
    const pathArg = filepath[0];
    const typeToFind = filepath.length === 1 ? filetype : 'dir';
    switch (pathArg) {
      case '.':
        found = this;
        break;
      case '..':
        found = this.parentRef;
        break;
      case '~':
        found = this.findTopParent();
        break;
      default:
        this.children.forEach((child) => {
          if (pathArg === child.name && (!typeToFind || typeToFind === child.filetype)) {
            found = child;
          }
        });
    }

    if (filepath.length === 1 || !found) return found;
    return found.findFile(filepath.slice(1), filetype);
  }

  /**
   * Attempt to find correct parent directory and create new file as its
   * child.
   * @param {string[]} filepath Path to file from working directory, including name of new file
   * @param {string} filetype Type of file (dir, txt)
   * @return {FileObject} Newly created FileObject, or null on failure
   */
  createChild(filepath, filetype) {
    if (filepath.length === 0) return null;
    const filename = filepath.slice(-1)[0];
    if (filepath.length > 1) {
      const dir = this.findFile(filepath.slice(0, -1), 'dir');
      if (!dir) return null;
      return dir.createChild([filename], filetype);
    }
    const pathStr = `${this.fullPath}/${filename}`;
    let file;
    if (filetype === 'dir') file = new DirFile(filename, pathStr, this);
    else file = new TxtFile(filename, pathStr, this);
    this.children.push(file);
    return file;
  }

}

