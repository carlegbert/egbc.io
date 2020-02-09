import { TextFile } from './'

export enum FileOpenMode {
  Write = 'w',
  Append = 'a',
}

export default class FileStream {
  private file: TextFile
  private mode: FileOpenMode

  constructor(file: TextFile, mode: FileOpenMode) {
    this.file = file
    this.mode = mode
  }

  public write(data: string[]): void {
    switch (this.mode) {
      case FileOpenMode.Write:
        return this._write(data)
      case FileOpenMode.Append:
        return this._append(data)
    }
  }

  private _write(data: string[]): void {
    this.file.contents = data
  }

  private _append(data: string[]): void {
    this.file.contents = [...this.file.contents, ...data]
  }
}
