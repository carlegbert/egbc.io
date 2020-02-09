import { Directory, TextFile, BaseFile } from './'
import { DirectoryNotFoundError, FileNotFoundError } from './errors'
import FileStream, { FileOpenMode } from './FileStream'

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

  public openFileStream(path: string, mode: FileOpenMode): FileStream {
    const file = this.findOrCreateFile(path)
    return new FileStream(file, mode)
  }

  public findOrCreateFile(path: string): TextFile {
    let file = this.home.findFile(path, TextFile) as TextFile | null
    if (!file) {
      file = this.home.createChild(path, TextFile) as TextFile | null
    }
    if (!file) {
      throw new DirectoryNotFoundError()
    }

    return file
  }

  public findFile(path: string): TextFile {
    const file = this.home.findFile(path, TextFile) as TextFile | null
    if (!file) throw new FileNotFoundError(`File ${path} not found`)
    return file
  }

  public findFileOrDirectory(path: string): BaseFile {
    const file = this.home.findFile(path) as BaseFile | null
    if (!file) throw new FileNotFoundError(`File ${path} not found`)
    return file
  }
}
