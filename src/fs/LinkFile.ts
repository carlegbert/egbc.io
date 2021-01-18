import BaseFile from './BaseFile'
import { FileKind } from './constants'
import Directory from './Directory'

export default class LinkFile extends BaseFile {
  private url: string
  kind: FileKind.Link = FileKind.Link

  constructor(name: string, parentRef: Directory, url: string) {
    super(name, parentRef)
    this.url = url
  }

  getLsEntry(): string {
    return `<span class="inline link"><a href="${this.url}" target="_blank">${this.name}<a></span>`
  }
}
