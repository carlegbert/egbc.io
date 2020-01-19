import BaseFile from './BaseFile'
import Directory from './Directory'

export default class File extends BaseFile {
  public contents: string[]
  constructor(name: string, parentRef: Directory, contents?: string[]) {
    super(name, parentRef)
    this.contents = contents || ['']
  }
}

module.exports = File
