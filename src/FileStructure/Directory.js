const BaseFile = require('./BaseFile');
const File = require('./File');
const Path = require('./Path');

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
        found = this.children.find(child =>
          (pathArg === child.name && (!typeToFind || child instanceof typeToFind)));
    }

    if (filepath.length === 1 || !found) return found;
    return found.findFile(filepath.slice(1), filetype);
  }

  /**
   * Attempt to find correct parent directory and create new file as its
   * child.
   * @param {Path} filepath Path to file from working directory, including name of new file
   * @param {string} filetype Type of file (dir, txt)
   * @return {BaseFile} Newly created BaseFile, or null on failure
   */
  createChild(filepath, filetype) {
    if (filepath.length === 0) return null;
    const filename = filepath.basename();
    if (filepath.length > 1) {
      const dir = this.findFile(filepath.highestDir().arr, Directory);
      if (!dir) return null;
      return dir.createChild(new Path(filename), filetype);
    }
    const file = filetype === Directory
      ? new Directory(filename, this)
      : new File(filename, this);
    this.children.push(file);
    return file;
  }
}

module.exports = Directory;
