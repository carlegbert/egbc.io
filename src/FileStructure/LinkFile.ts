import BaseFile from './BaseFile'
import Directory from './Directory'

export default class LinkFile extends BaseFile {
  private url: string

  constructor(name: string, parentRef: Directory, url: string) {
    super(name, parentRef)
    this.url = url
  }

  getLsEntry(): string {
    return `<span class="inline link"><a href="${this.url}" target="_blank">${this.name}<a></span>`
  }
}
