/* eslint-disable no-param-reassign */

import BaseFile from './BaseFile'
import TextFile from './TextFile'
import Path from './Path'
import { FixMe } from '../types'
import { FileKind } from './constants'

export default class Directory extends BaseFile {
  public children: BaseFile[]
  kind: FileKind.Directory = FileKind.Directory

  constructor(name: string, parentRef: Directory | null) {
    super(name, parentRef)
    this.children = []
  }

  getChildrenByTypes(types: FileKind[]): BaseFile[] {
    return this.children.filter(child =>
      types.some(type => child.isKind(type)),
    )
  }

  getLsEntry(): string {
    return `<span class="inline dir" id="${this.fullPath}">${this.name}</span>`
  }

  /**
   * Helper method for ls
   */
  lsHelper(): string {
    let res = '<div>'
    this.children.forEach(child => {
      res += child.getLsEntry()
    })
    res += '</div>'
    return res
  }

  /**
   * Recursively traverses up through parentRefs to find base directory
   * representing the entire file structure.
   */
  findTopParent(): Directory {
    if (!this.parentRef) return this
    return this.parentRef.findTopParent()
  }

  /**
   * Function to find file in a directory. Returns null if unsuccesful; it is the responsibility
   * of the calling function to otherwise deal with failure.
   * @param {Path|string|string[]} filepath Path to file to be found
   * @param {FileConstructor} filetype Type of file to find (optional)
   * @return {BaseFile} Returns file object if found, null if not
   */
  findFile(
    filepath: Path | string | string[] | null,
    filetype?: FixMe.Any,
  ): BaseFile | null {
    if (!filepath) return null

    if (!(filepath instanceof Path)) filepath = new Path(filepath)

    if (filepath.length === 0 && filetype === Directory) return this

    let found = null
    const pathArg = filepath.lowestDir()
    const typeToFind = filepath.length === 1 ? filetype : Directory

    switch (pathArg) {
      case '.':
        found = this
        break
      case '..':
        found = this.parentRef
        break
      case '~':
        found = this.findTopParent()
        break
      default:
        found = this.children.find(
          child =>
            pathArg === child.name &&
            (!typeToFind || child instanceof typeToFind),
        )
    }

    if (filepath.length === 1 || !found) return found as any
    return (found as Directory).findFile(filepath.next(), filetype)
  }

  /**
   * Attempt to find correct parent directory and create new file as its
   * child.
   * @param {Path|string|string[]} filepath Path to new file from working directory, including name
   * @param {string} filetype Type of file (dir, txt)
   * @return {BaseFile} Newly created BaseFile, or null on failure
   */
  createChild(
    filepath: Path | string | string[],
    filetype?: FixMe.Any,
  ): BaseFile | null {
    if (!(filepath instanceof Path)) filepath = new Path(filepath)
    if (filepath.length === 0) return null
    const filename = filepath.basename()
    if (filepath.length > 1) {
      const dir = this.findFile(filepath.highestDir(), Directory) as Directory
      if (!dir) return null
      return dir.createChild(new Path(filename), filetype)
    }
    const file =
      filetype === Directory
        ? new Directory(filename, this)
        : new TextFile(filename, this)
    this.children.push(file)
    return file
  }
}
