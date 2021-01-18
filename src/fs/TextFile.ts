import BaseFile from './BaseFile'
import { FileKind } from './constants'
import Directory from './Directory'

export default class TextFile extends BaseFile {
  kind: FileKind.Text = FileKind.Text
  public contents: string[]

  constructor(name: string, parentRef: Directory, contents?: string[]) {
    super(name, parentRef)
    this.contents = contents || []
  }
}
