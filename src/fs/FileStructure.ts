import { Directory } from './'

export default class FileStructure {
  public home: Directory

  constructor() {
    this.home = new Directory('~', null)
  }

  public findDirectory(path: string): Directory {
    const dir = this.home.findFile(path, Directory) as Directory | null
    if (!dir) throw new Error(`Directory ${path} not found`)
    return dir
  }
}
