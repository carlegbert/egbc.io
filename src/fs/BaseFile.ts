import { FixMe } from 'types'

type Directory = FixMe.Any

/**
 * Base File class, to be inherited from but not used directly.
 * @class
 */

export default class BaseFile {
  /**
   * @constructor
   * @param {string} name
   * @param {string} filetype
   * @param {DirFile} parentRef
   */

  public name: string
  public parentRef: Directory | null
  public fullPath: string
  public lastModified: Date

  constructor(name: string, parentRef: Directory | null = null) {
    this.name = name
    this.parentRef = parentRef
    this.lastModified = new Date()
    this.fullPath = this.getFullPath()
  }

  /**
   * Returns HTML-formatted filename
   * @return {string}
   */
  getLsEntry() {
    return `<span class="inline txt" id="${this.fullPath}">${this.name}</span>`
  }

  getFullPath() {
    if (!this.parentRef) return this.name
    return `${this.parentRef.getFullPath()}/${this.name}`
  }
}
