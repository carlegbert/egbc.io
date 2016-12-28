export class FileObject {
  constructor(name, fullPath, filetype, parentRef, lastModified) {
    this.name = name;
    this.fullPath = fullPath;
    this.filetype = filetype;
    this.parentRef = parentRef;
    this.lastModified = lastModified || new Date();
  }

  static jsonToFile(json) {
    const newFile = new FileObject(json.name, json.fullPath, json.filetype, json.parentRef, json.lastModified);
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

  getLsEntry() {
    return `<span class="dir ${this.filetype}" id="${this.fullPath}">${this.name}</span>`;
  }

}

export class DirFile extends FileObject {
  constructor(name, fullPath, filetype, parentRef, lastModified, children) {
    super(name, fullPath, filetype, parentRef, lastModified);
    this.children = children || [];
  }

  /* returns list of files that match up with anything
   * in an string array passed to the function */
  getContentsByTypes(types) {
    const files = [];
    this.contents.forEach((child) => {
      if (types.includes(child.filetype)) {
        files.push(child);
      }
    });
  }

}

export class TxtFile extends FileObject {
  constructor(name, fullPath, filetype, parentRef, lastModified, contents) {
    super(name, fullPath, filetype, parentRef, lastModified);
    this.contents = contents || [];
  }

}
