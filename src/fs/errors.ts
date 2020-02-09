export enum FSErrors {
  DirectoryNotFound = '__directory_not_found_',
  FileNotFound = '__file_not_found',
}

export class DirectoryNotFoundError extends Error {
  constructor(...args: any) {
    super(...args)
    this.name = FSErrors.DirectoryNotFound
  }
}

export class FileNotFoundError extends Error {
  constructor(...args: any) {
    super(...args)
    this.name = FSErrors.FileNotFound
  }
}
