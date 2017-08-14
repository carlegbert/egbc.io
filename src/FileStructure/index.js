/**
 * Base File class
 * @class
 */
export class FileObject {
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

  getFullPath() {
    if (!this.parentRef) return this.name;
    return `${this.parentRef.getFullPath()}/${this.name}`;
  }

}


/**
 * @extends {FileObject}
 */
export class TxtFile extends FileObject {
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

/**
 * @extends {TxtFile}
 */
export class LinkFile extends TxtFile {
  /**
   * @constructor
   * @param {string} name
   * @param {DirFile} parentRef
   * @param {string} url
   */
  constructor(name, parentRef, url) {
    super(name, parentRef);
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
   * @param {FileObject} parentRef
   * @param {FileObject[]} children
   */
  constructor(name, parentRef, children) {
    super(name, 'dir', parentRef);
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
    if (filepath.length > 1 && filepath[filepath.length - 1] === '') {
      filepath.splice(-1, 1);
    } else if (filepath.length === 0 && filetype === 'dir') {
      return this;
    }

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
    let file;
    if (filetype === 'dir') file = new DirFile(filename, this);
    else file = new TxtFile(filename, this);
    this.children.push(file);
    return file;
  }

}

