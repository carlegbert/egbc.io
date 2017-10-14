const BaseFile = require('./BaseFile');
const File = require('./File');
const FileChildren = require('./FileChildren');

/**
 * @extends {BaseFile}
 */
class Directory extends BaseFile {
  /**
   * @constructor
   * @param {string} name
   * @param {BaseFile} parentRef
   */
  constructor(name, parentRef) {
    super(name, parentRef);
    this.children = [];
    this.childrenObject = new FileChildren(this);
  }

  /**
   * @param {Class[]} types Types to filter by
   * @return {BaseFile[]} array of BaseFiles contained in directory
   */
  getChildrenByTypes(types) {
    return this.children.filter(child => types.some(type => child instanceof type));
  }

  /**
   * Returns HTML-formatted filename
   * @return {string}
   */
  getLsEntry() {
    return `<span class="inline dir" id="${this.fullPath}">${this.name}</span>`;
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
   * Recursively traverses up through parentRefs to find base directory
   * representing the entire file structure.
   * @return {Directory}
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
   * @return {BaseFile} Returns file object if found, null if not
   */
  findFile(filepath, filetype) {
    if (filepath.length > 1 && filepath[filepath.length - 1] === '') {
      filepath.splice(-1, 1);
    } else if (filepath.length === 0 && filetype === Directory) {
      return this;
    }

    let found = null;
    const pathArg = filepath[0];
    const typeToFind = filepath.length === 1 ? filetype : Directory;
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
          if (pathArg === child.name && (!typeToFind || child instanceof typeToFind)) {
            found = child;
          }
        });
    }

    if (filepath.length === 1 || !found) return found;
    return found.findFile(filepath.slice(1), filetype);
  }

  /**
   * // FIXME: All functions will be transitioned to using this method instead of findFile.
   * // Once that transition is complete, this will be replace the old findFile method.
   * Function to find file in a directory. Returns null if unsuccesful; it is the responsibility
   * of the calling function to otherwise deal with failure.
   * @param {string[]} filepath Path to file to be found
   * @param {string} filetype Type of file to find (optional)
   * @return {BaseFile} Returns file object if found, null if not
   */
  findFileNew(filepath, filetype) {
    if (filepath.length > 1 && filepath[filepath.length - 1] === '') {
      filepath.splice(-1, 1);
    } else if (filepath.length === 0 && filetype === Directory) {
      return this;
    }

    const filename = filepath[0];
    const typeToFind = filepath.length === 1 ? filetype : Directory;
    const found = this.childrenObject.findChild((c) => {
      if (typeToFind && !(c instanceof typeToFind)) return false;
      return (c.name === filename);
    });
    if (filepath.length === 1 || !found) return found;
    return found.findFileNew(filepath.slice(1), filetype);
  }

  /**
   * Attempt to find correct parent directory and create new file as its
   * child.
   * @param {string[]} filepath Path to file from working directory, including name of new file
   * @param {string} filetype Type of file (dir, txt)
   * @return {BaseFile} Newly created BaseFile, or null on failure
   */
  createChild(filepath, filetype) {
    if (filepath.length === 0) return null;
    const filename = filepath.slice(-1)[0];
    if (filepath.length > 1) {
      const dir = this.findFile(filepath.slice(0, -1), Directory);
      if (!dir) return null;
      return dir.createChild([filename], filetype);
    }
    let file;
    if (filetype === Directory) file = new Directory(filename, this);
    else file = new File(filename, this);
    try {
      this.childrenObject.addChild(file);
      this.children.push(file);
      return file;
    } catch (err) {
      throw err;
    }
  }

  /**
   * // FIXME: All functions will be transitioned to using this method instead of createChild.
   * // Once that transition is complete, this will be replace the old createChild method.
   * Attempt to find correct parent directory and create new file as its
   * child.
   * @param {string[]} filepath Path to file from working directory, including name of new file
   * @param {string} filetype Type of file (dir, txt)
   * @return {BaseFile} Newly created BaseFile, or null on failure
   */
  createChildNew(filepath, filetype) {
    if (filepath.length === 0) return null;
    const filename = filepath.slice(-1)[0];
    if (filepath.length > 1) {
      const dir = this.findFileNew(filepath.slice(0, -1), Directory);
      if (!dir) return null;
      return dir.createChildNew([filename], filetype);
    }
    let file;
    if (filetype === Directory) file = new Directory(filename, this);
    else file = new File(filename, this);
    try {
      // FIXME: try-catch and references to this.children array will be removed when
      // done refactoring to use FileChildren collection
      this.childrenObject.addChild(file);
      this.children.push(file);
      return file;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Directory;
