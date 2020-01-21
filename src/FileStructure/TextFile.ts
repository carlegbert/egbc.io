import BaseFile from './BaseFile'
import Directory from './Directory'

export default class TextFile extends BaseFile {
  public contents: string[]
  constructor(name: string, parentRef: Directory, contents?: string[]) {
    super(name, parentRef)
    this.contents = contents || ['']
  }
}
