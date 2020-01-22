import { Directory } from './'
import { DirectoryNotFoundError } from './errors'

export default class FileStructure {
  public home: Directory

  constructor() {
    this.home = new Directory('~', null)
  }

  public findDirectory(path: string): Directory {
    const dir = this.home.findFile(path, Directory) as Directory | null
    if (!dir) throw new DirectoryNotFoundError(`Directory ${path} not found`)
    return dir
  }
}
